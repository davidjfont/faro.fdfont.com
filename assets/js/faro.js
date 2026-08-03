(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const track = document.querySelector('[data-signal-track]');
  if (track?.hasAttribute('data-random-signals')) {
    const templates = Array.from(track.querySelectorAll('[data-signal-template]'));
    for (let index = templates.length - 1; index > 0; index -= 1) {
      const target = Math.floor(Math.random() * (index + 1));
      [templates[index], templates[target]] = [templates[target], templates[index]];
    }
    const visibleCount = Number(track.dataset.visibleCount) || 6;
    templates.slice(0, visibleCount).forEach((template) => {
      track.append(template.content.cloneNode(true));
    });
    templates.forEach((template) => template.remove());
  }
  const moveSignal = (direction) => {
    if (!track) return;
    const card = track.querySelector('.signal-card');
    const distance = card ? card.getBoundingClientRect().width + 16 : track.clientWidth * 0.85;
    track.scrollBy({ left: distance * direction, behavior: reduceMotion ? 'auto' : 'smooth' });
  };
  document.querySelector('[data-signal-prev]')?.addEventListener('click', () => moveSignal(-1));
  document.querySelector('[data-signal-next]')?.addEventListener('click', () => moveSignal(1));

  const dialog = document.querySelector('[data-pveu-dialog]');
  const openButton = document.querySelector('[data-pveu-open]');
  const closeButton = document.querySelector('[data-pveu-close]');
  const frame = document.querySelector('[data-pveu-frame]');
  const loadPveu = () => {
    if (!dialog || typeof dialog.showModal !== 'function') {
      window.open('https://pveu-fdfont.pythonanywhere.com/', '_blank', 'noopener,noreferrer');
      return;
    }
    if (frame && !frame.getAttribute('src')) frame.setAttribute('src', frame.dataset.src);
    dialog.showModal();
  };
  const openPveu = () => {
    if (window.FaroConsent) window.FaroConsent.requireExternal(loadPveu);
    else loadPveu();
  };
  openButton?.addEventListener('click', openPveu);
  closeButton?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  const mathScript = document.querySelector('[data-faro-math]');
  if (mathScript) {
    const renderMath = () => {
      if (typeof window.renderMathInElement !== 'function') return;
      window.renderMathInElement(document.body, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false }
        ],
        throwOnError: false
      });
    };
    if (typeof window.renderMathInElement === 'function') renderMath();
    else mathScript.addEventListener('load', renderMath, { once: true });
  }
})();

(() => {
  const controls = document.querySelector('[data-tts-controls]');
  const container = document.getElementById('tts-text-container-v2');
  if (!controls || !container || !('speechSynthesis' in window)) {
    if (controls) controls.hidden = true;
    return;
  }
  const play = controls.querySelector('[data-tts-play]');
  const pause = controls.querySelector('[data-tts-pause]');
  const stop = controls.querySelector('[data-tts-stop]');
  const rate = controls.querySelector('[data-tts-rate]');
  const status = controls.querySelector('[data-tts-status]');
  let chunks = [];
  let current = 0;
  let paused = false;

  const reset = () => {
    window.speechSynthesis.cancel();
    chunks = [];
    current = 0;
    paused = false;
    play.hidden = false;
    play.setAttribute('aria-pressed', 'false');
    pause.hidden = true;
    pause.textContent = '⏸ Pausar';
    stop.hidden = true;
    status.textContent = '';
  };

  const speakNext = () => {
    if (current >= chunks.length) return reset();
    const utterance = new SpeechSynthesisUtterance(chunks[current]);
    const spanishVoice = window.speechSynthesis.getVoices().find((voice) => voice.lang.startsWith('es'));
    if (spanishVoice) utterance.voice = spanishVoice;
    utterance.lang = spanishVoice?.lang || 'es-ES';
    utterance.rate = Number(rate.value) || 1;
    utterance.onstart = () => { status.textContent = `Leyendo fragmento ${current + 1} de ${chunks.length}`; };
    utterance.onend = () => { current += 1; speakNext(); };
    utterance.onerror = (event) => {
      if (event.error !== 'canceled' && event.error !== 'interrupted') { current += 1; speakNext(); }
    };
    window.speechSynthesis.speak(utterance);
  };

  play.addEventListener('click', () => {
    window.speechSynthesis.cancel();
    chunks = (container.innerText || '').split(/\n+/).map((text) => text.trim()).filter((text) => text.length > 2);
    if (!chunks.length) { status.textContent = 'No hay texto legible.'; return; }
    current = 0;
    play.hidden = true;
    play.setAttribute('aria-pressed', 'true');
    pause.hidden = false;
    stop.hidden = false;
    speakNext();
  });
  pause.addEventListener('click', () => {
    if (!paused) {
      window.speechSynthesis.pause();
      paused = true;
      pause.textContent = '▶ Reanudar';
      status.textContent = 'Lectura pausada';
    } else {
      window.speechSynthesis.resume();
      paused = false;
      pause.textContent = '⏸ Pausar';
    }
  });
  stop.addEventListener('click', reset);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.speechSynthesis.speaking && !paused) pause.click();
  });
  window.addEventListener('pagehide', () => window.speechSynthesis.cancel());
})();

(() => {
  const panel = document.querySelector('[data-share-panel]');
  if (!panel) return;
  const status = panel.querySelector('[data-share-status]');
  const shareData = {
    title: panel.dataset.shareTitle,
    text: panel.dataset.shareText,
    url: panel.dataset.shareUrl
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      status.textContent = 'Enlace copiado.';
    } catch (_) {
      status.textContent = 'No se pudo copiar. Selecciona la URL del navegador.';
    }
  };
  panel.querySelector('[data-copy-share]')?.addEventListener('click', copy);
  panel.querySelector('[data-native-share]')?.addEventListener('click', async () => {
    if (!navigator.share) return copy();
    const payload = { ...shareData };
    try {
      const imageURL = panel.dataset.shareImage;
      if (imageURL) {
        const response = await fetch(imageURL);
        if (response.ok) {
          const blob = await response.blob();
          const extension = blob.type.includes('webp') ? 'webp' : 'jpg';
          const file = new File([blob], `faro-${location.pathname.split('/').filter(Boolean).pop() || 'transmision'}.${extension}`, { type: blob.type });
          if (navigator.canShare?.({ files: [file] })) payload.files = [file];
        }
      }
      await navigator.share(payload);
      status.textContent = 'Transmisión compartida.';
    } catch (error) {
      if (error.name !== 'AbortError') await copy();
    }
  });
})();

(() => {
  document.querySelectorAll('[data-youtube-player]').forEach((button) => {
    button.addEventListener('click', () => {
      const play = () => {
        const videoId = button.dataset.youtubeId;
        if (!/^[A-Za-z0-9_-]{11}$/.test(videoId || '')) return;
        const iframe = document.createElement('iframe');
        iframe.className = 'resonance-iframe';
        iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
        iframe.title = button.dataset.youtubeTitle || 'Reproductor de YouTube';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.allowFullscreen = true;
        button.replaceWith(iframe);
      };
      if (window.FaroConsent) window.FaroConsent.requireExternal(play);
      else play();
    });
  });
})();
