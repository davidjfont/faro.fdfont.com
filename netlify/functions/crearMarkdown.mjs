import { fetch } from 'undici';
import { Octokit } from '@octokit/rest';

export async function handler(event) {
  try {
      const params = new URLSearchParams(event.body);
      const name = params.get('user'); // adaptado
      const email = 'sin@email.com'; // valor fijo o puedes crear un campo oculto opcional
      const message = params.get('text'); // adaptado
      const title = params.get('title') || 'Sin título';


    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Faltan campos obligatorios.' }),
      };
    }

    const content = `---
    title: "${title}"
    date: "${new Date().toISOString()}"
    name: "${name}"
    email: "${email}"
    ---

    ${message}
    `;

    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    const filePath = `zona-nadie-comentarios/${Date.now()}.md`;

    await octokit.repos.createOrUpdateFileContents({
      owner: 'TU_USUARIO',
      repo: 'TU_REPO',
      path: filePath,
      message: `Nuevo comentario de ${name}`,
      content: Buffer.from(content).toString('base64'),
      committer: {
        name: 'Netlify Bot',
        email: 'bot@netlify.com',
      },
      author: {
        name,
        email,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Comentario guardado correctamente.' }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
