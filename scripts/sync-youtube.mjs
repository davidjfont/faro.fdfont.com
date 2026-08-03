import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const channel = {
  id: 'UC7wqeuS_YN5LmLIpWU6Ls8g',
  title: 'INCONSISTENCIA RECORDS',
  url: 'https://www.youtube.com/@inconsistencia.records',
  videosUrl: 'https://www.youtube.com/@inconsistencia.records/videos'
};
const featured = {
  id: 'nOBp-qrLONk',
  type: 'Audiolibro',
  title: 'VERAQUOS: Viaje del universo a una nueva dimensión',
  author: 'De Da SLYER',
  url: 'https://www.youtube.com/watch?v=nOBp-qrLONk',
  thumbnail: '/optimized/resonancia/nOBp-qrLONk.jpg'
};
const outputPath = resolve('data/resonancia.json');
const thumbnailDir = resolve('static/optimized/resonancia');
const feedUrl = process.env.RESONANCIA_FEED_URL || `https://www.youtube.com/feeds/videos.xml?channel_id=${channel.id}`;
const videosPageUrl = process.env.RESONANCIA_VIDEOS_URL || channel.videosUrl;
const requestHeaders = { 'user-agent': 'Faro Resonancia/1.0 (+https://faro.fdfont.com/resonancia/)' };

function decodeXml(value = '') {
  const entities = {
    amp: '&', apos: "'", gt: '>', lt: '<', quot: '"'
  };
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#(x?[0-9a-f]+);/gi, (_, code) => String.fromCodePoint(
      code.toLowerCase().startsWith('x') ? Number.parseInt(code.slice(1), 16) : Number.parseInt(code, 10)
    ))
    .replace(/&([a-z]+);/gi, (match, name) => entities[name] ?? match)
    .replace(/\s+/g, ' ')
    .trim();
}

async function cacheThumbnail(id) {
  const response = await fetch(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`, {
    headers: requestHeaders,
    signal: AbortSignal.timeout(10000)
  });
  if (!response.ok) throw new Error(`La miniatura de ${id} respondió ${response.status}`);
  await mkdir(thumbnailDir, { recursive: true });
  await writeFile(resolve(thumbnailDir, `${id}.jpg`), Buffer.from(await response.arrayBuffer()));
}

function formatDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const seconds = totalSeconds % 60;
  return hours
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function tag(entry, name) {
  return decodeXml(entry.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`))?.[1] || '');
}

async function existingData() {
  try {
    return JSON.parse(await readFile(outputPath, 'utf8'));
  } catch {
    return { featured, channel, videos: [] };
  }
}

try {
  const [feedResponse, videosPageResponse] = await Promise.all([
    fetch(feedUrl, { headers: requestHeaders, signal: AbortSignal.timeout(15000) }),
    fetch(videosPageUrl, { headers: requestHeaders, signal: AbortSignal.timeout(15000) })
  ]);
  if (!feedResponse.ok) throw new Error(`El feed de YouTube respondió ${feedResponse.status}`);
  if (!videosPageResponse.ok) throw new Error(`La pestaña Vídeos respondió ${videosPageResponse.status}`);

  const [xml, videosPage] = await Promise.all([feedResponse.text(), videosPageResponse.text()]);
  const regularVideoIds = new Set(
    [...videosPage.matchAll(/"videoId":"([A-Za-z0-9_-]{11})"/g)].map((match) => match[1])
  );
  if (!regularVideoIds.size) throw new Error('No se pudieron verificar los vídeos normales del canal');

  const feedVideos = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((match) => {
    const entry = match[1];
    const id = tag(entry, 'yt:videoId');
    return {
      id,
      title: tag(entry, 'title'),
      published: tag(entry, 'published'),
      url: `https://www.youtube.com/watch?v=${id}`,
      thumbnail: `/optimized/resonancia/${id}.jpg`
    };
  }).filter((video) => video.id && video.title);
  let videos = feedVideos.filter((video) => regularVideoIds.has(video.id));
  const cached = await existingData();
  videos = await Promise.all(videos.map(async (video) => {
    const previous = cached.videos?.find((item) => item.id === video.id);
    try {
      const response = await fetch(video.url, {
        headers: requestHeaders,
        signal: AbortSignal.timeout(10000)
      });
      if (!response.ok) throw new Error(`YouTube respondió ${response.status}`);
      const html = await response.text();
      const durationSeconds = Number(html.match(/"lengthSeconds":"([0-9]+)"/)?.[1]);
      if (!durationSeconds) throw new Error("Duración no disponible");
      return { ...video, durationSeconds, duration: formatDuration(durationSeconds) };
    } catch {
      return previous?.duration
        ? { ...video, durationSeconds: previous.durationSeconds, duration: previous.duration }
        : video;
    }
  }));
  if (!videos.length) throw new Error('El cruce con la pestaña Vídeos no produjo resultados válidos');

  await Promise.all([featured.id, ...videos.map((video) => video.id)].map(cacheThumbnail));

  const payload = {
    updatedAt: new Date().toISOString(),
    source: feedUrl,
    featured,
    channel,
    videos
  };
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  const excluded = feedVideos.length - videos.length;
  const excludedLabel = excluded === 1 ? "Short excluido" : "Shorts excluidos";
  console.log(`Resonancia sincronizada: ${videos.length} vídeos de ${channel.title}; ${excluded} ${excludedLabel}.`);
} catch (error) {
  const cached = await existingData();
  if (!cached.videos?.length) {
    console.error(`No se pudo sincronizar Resonancia y no existe caché: ${error.message}`);
    process.exit(1);
  }
  console.warn(`YouTube no está disponible; se conserva la caché de ${cached.videos.length} vídeos. ${error.message}`);
}
