// netlify/functions/logComment.js
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// En Netlify Functions, la única ruta con escritura garantizada es /tmp
const LOG_PATH = '/tmp/zona_nadie.log';

// Proxy: rep el POST del client i el reenvia al backend persistent (PythonAnywhere)
export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const secret = process.env.LOG_FORWARD_SECRET || '';
    const target = process.env.LOG_BACKEND_URL || 'https://fdfont.pythonanywhere.com/api/log';

    const resp = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Secret': secret,
      },
      body: event.body, // passem el mateix payload que envia el client
    });

    if (!resp.ok) {
      const txt = await resp.text().catch(() => '');
      return { statusCode: 500, body: `Upstream error: ${txt}` };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain; charset=utf-8',
      },
      body: 'OK',
    };
  } catch (e) {
    return { statusCode: 500, body: 'ERROR ' + (e?.message || String(e)) };
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
