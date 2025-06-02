const { fetch } = require('undici');
const { Octokit } = require('@octokit/rest');

exports.handler = async (event) => {
  const payload = JSON.parse(event.body);
  const { name, email, message } = payload;

  const content = `---
title: "Comentario de ${name}"
date: "${new Date().toISOString()}"
email: "${email}"
---

${message}
`;

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN, // debes crear un token personal
  });

  const filePath = `zona-nadie-comentarios/${Date.now()}.md`;

  try {
    await octokit.repos.createOrUpdateFileContents({
      owner: 'davidjfont',
      repo: 'faro.fdfont.com',
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
};
