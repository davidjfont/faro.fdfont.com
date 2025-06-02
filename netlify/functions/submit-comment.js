const { Octokit } = require("@octokit/rest");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método no permitido" };
  }

  const data = JSON.parse(event.body);
  const { title, text, user } = data;

  if (!text || !user) {
    return { statusCode: 400, body: "Faltan campos requeridos" };
  }

  const fileName = `${Date.now()}-${user.replace(/\s+/g, "_")}.md`;
  const content = `
---
user: "@${user}"
title: "${title || 'Sin título'}"
date: "${new Date().toISOString()}"
---

${text}
`;

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  try {
    const repo = process.env.GITHUB_REPO;
    const owner = process.env.GITHUB_USER;
    const branch = process.env.GITHUB_BRANCH || "main";
    const path = `content/comentarios/${fileName}`;

    // Verifica el SHA del último commit en la rama
    const { data: latestCommit } = await octokit.repos.getBranch({
      owner,
      repo,
      branch,
    });

    const baseTree = latestCommit.commit.sha;

    const blob = await octokit.git.createBlob({
      owner,
      repo,
      content: content.trim(),
      encoding: "utf-8",
    });

    const tree = await octokit.git.createTree({
      owner,
      repo,
      base_tree: baseTree,
      tree: [
        {
          path,
          mode: "100644",
          type: "blob",
          sha: blob.data.sha,
        },
      ],
    });

    const commit = await octokit.git.createCommit({
      owner,
      repo,
      message: `Comentario de @${user}`,
      tree: tree.data.sha,
      parents: [baseTree],
    });

    await octokit.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: commit.data.sha,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Comentario guardado exitosamente." }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
