import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

const root = resolve(process.argv[2] || 'public-check');
const failures = [];
let htmlCount = 0;

function walk(directory) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) walk(path);
    else if (extname(path) === '.html') checkHtml(path);
  }
}

function checkHtml(path) {
  htmlCount += 1;
  const html = readFileSync(path, 'utf8');
  const relative = path.slice(root.length) || '/index.html';
  const doctypes = html.match(/<!doctype html/gi) || [];
  const documents = html.match(/<html\b/gi) || [];
  if (doctypes.length !== 1 || documents.length !== 1) failures.push(`${relative}: estructura de documento duplicada o ausente`);
  if (!/<html\b[^>]*\blang=(?:"es"|'es'|es\b)/i.test(html)) failures.push(`${relative}: idioma HTML no es español`);

  const visibleHtml = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ');
  const ids = [...visibleHtml.matchAll(/\bid=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/gi)].map((match) => match[1] || match[2] || match[3]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) failures.push(`${relative}: ID duplicado (${[...new Set(duplicateIds)].join(', ')})`);

  for (const match of html.matchAll(/\b(?:src|href)=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/gi)) {
    const reference = match[1] || match[2] || match[3];
    if (!reference || /^(?:https?:|mailto:|tel:|data:|#|javascript:)/i.test(reference)) continue;
    let pathname;
    try { pathname = decodeURIComponent(reference.split(/[?#]/)[0]); } catch { pathname = reference.split(/[?#]/)[0]; }
    if (!pathname.startsWith('/')) continue;
    const target = pathname.endsWith('/') ? join(root, pathname, 'index.html') : join(root, pathname);
    if (!existsSync(target)) failures.push(`${relative}: referencia inexistente ${pathname}`);
  }
}

if (!existsSync(root)) {
  console.error(`No existe el directorio compilado: ${root}`);
  process.exit(1);
}
walk(root);

if (failures.length) {
  console.error(`Validación fallida (${failures.length} problemas):`);
  failures.slice(0, 100).forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Validación correcta: ${htmlCount} documentos HTML, estructura, idioma, IDs y referencias locales.`);
