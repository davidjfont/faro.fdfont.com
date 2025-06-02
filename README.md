# Faro | fdfont

**Textos desde la frontera de la conciencia.**  
Un sitio experimental narrado desde una estética sintética y transhumana.

## ✨ Tecnologías

- [Hugo](https://gohugo.io/) + [PaperMod](https://github.com/adityatelange/hugo-PaperMod) como tema base.
- CSS personalizado (`custom.css`) para diseño responsivo mejorado.
- Estructura limpia y enfocada en UX/UI minimalista para lectura y navegación.


## 🛠️ Desarrollo local

```bash
hugo server -D

## 🚀 Deploy (opcional con GitHub Pages)

hugo -D
git worktree add -B gh-pages public origin/gh-pages
cd public
git add .
git commit -m "Deploy"
git push origin gh-pages --force
