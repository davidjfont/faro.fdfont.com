// netlify/functions/logComment.js
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// En Netlify Functions, la única ruta con escritura garantizada es /tmp
const LOG_PATH = '/tmp/zona_nadie.log';

export async function handler(event) {
  // Permitir solo POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders(),
      body: 'Method Not Allowed'
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');

    // Saneado básico (evitar saltos de línea peligrosos, etc.)
    const clean = (v) =>
      String(v ?? '')
        .replace(/\r?\n/g, ' ')
        .replace(/\u0000/g, '')
        .trim();

    const entry = {
      ts: new Date().toISOString(),
      user: clean(data.user),
      title: clean(data.title),
      text: clean(data.text),
      parentId: data.parentId ?? null,
      path: clean(data.path || ''),
      ua: clean(data.ua || '')
    };

    const line = JSON.stringify(entry) + '\n';

    await appendFileSafe(LOG_PATH, line);

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: 'OK'
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: 'ERROR: ' + (err?.message || String(err))
    };
  }
}

function corsHeaders(){
  return {
    'Content-Type': 'text/plain; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

function appendFileSafe(filepath, content){
  return new Promise((resolve, reject)=>{
    fs.appendFile(filepath, content, { encoding: 'utf8', flag: 'a' }, (err)=>{
      if(err) reject(err); else resolve();
    });
  });
}
