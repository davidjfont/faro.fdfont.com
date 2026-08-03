# Resonancia: sincronización con YouTube

La sección `/resonancia/` se actualiza desde el feed público de INCONSISTENCIA RECORDS antes de cada build.

Solo se incorporan elementos presentes en la pestaña **Vídeos** del canal. Los contenidos publicados como Shorts quedan excluidos automáticamente.

## Actualización normal

`npm run build` ejecuta primero `npm run resonancia:sync`. Por tanto, cada push que provoque un deploy de Netlify incorpora los vídeos más recientes.

## Actualización semanal y manual

El workflow `.github/workflows/resonancia-weekly.yml` solicita un build los lunes a las 05:00 en la zona `Europe/Madrid`. También admite ejecución manual desde GitHub Actions.

Configuración necesaria una sola vez:

1. En Netlify, abrir **Site configuration → Build & deploy → Build hooks**.
2. Crear un hook llamado `Resonancia semanal` para la rama `master`.
3. En GitHub, abrir **Settings → Secrets and variables → Actions**.
4. Crear el secreto `NETLIFY_BUILD_HOOK_URL` con la URL completa del hook.

## Ejecución local

```sh
npm run resonancia:sync
npm run check
```

Si YouTube no responde, el sincronizador conserva `data/resonancia.json` y el build continúa con la última caché válida.
