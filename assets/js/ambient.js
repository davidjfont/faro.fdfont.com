(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('faro-matrix');
  const readingPost = document.querySelector("[data-immersive-reading]");
  const readingContent = readingPost?.querySelector("#tts-text-container-v2");
  if (canvas && !reducedMotion) {
    const context = canvas.getContext('2d', { alpha: true });
    const characters = 'アカサタナハマヤラワ0123456789';
    const fontSize = 15;
    let drops = [];
    let frame = 0;
    let running = true;
    const characterCount = (readingContent?.textContent || "").replace(/\s+/g, " ").trim().length;
    const minimumCharacters = Number(readingPost?.dataset.matrixMinCharacters) || 10000;
    const readingFadeEnabled = Boolean(readingPost && readingContent && characterCount >= minimumCharacters);
    const fadeStartMinutes = Number(readingPost?.dataset.matrixFadeStartMinutes) || 5;
    const fadeEndMinutes = Number(readingPost?.dataset.matrixFadeEndMinutes) || 8;
    const fadeStartProgress = Number(readingPost?.dataset.matrixFadeStartProgress) || 0.35;
    const fadeEndProgress = Number(readingPost?.dataset.matrixFadeEndProgress) || 0.72;
    let activeReadingMilliseconds = 0;
    let lastReadingTick = performance.now();
    let readingTimer = 0;
    let matrixFaded = false;
    let maximumReadingFade = 0;

    const clamp = (value) => Math.min(1, Math.max(0, value));
    const smoothstep = (value, start, end) => {
      const progress = clamp((value - start) / Math.max(end - start, 0.001));
      return progress * progress * (3 - 2 * progress);
    };
    const updateReadingFade = () => {
      if (!readingFadeEnabled || matrixFaded) return;
      const now = performance.now();
      if (!document.hidden) activeReadingMilliseconds += now - lastReadingTick;
      lastReadingTick = now;
      const contentTop = readingContent.getBoundingClientRect().top + window.scrollY;
      const readingLine = window.scrollY + window.innerHeight * 0.72;
      const readingProgress = clamp((readingLine - contentTop) / Math.max(readingContent.scrollHeight, 1));
      const timeProgress = activeReadingMilliseconds / 60000;
      const scrollFade = smoothstep(readingProgress, fadeStartProgress, fadeEndProgress);
      const timeFade = smoothstep(timeProgress, fadeStartMinutes, fadeEndMinutes);
      maximumReadingFade = Math.max(maximumReadingFade, scrollFade, timeFade);
      const fade = maximumReadingFade;
      const baseOpacity = document.body.classList.contains("dark") ? 0.2 : 0.06;
      canvas.style.opacity = String(baseOpacity * (1 - fade));
      if (fade >= 0.999) {
        matrixFaded = true;
        canvas.style.opacity = "0";
        window.clearTimeout(frame);
        window.clearInterval(readingTimer);
      }
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      drops = Array(Math.ceil(window.innerWidth / fontSize)).fill(1);
    };
    const draw = () => {
      if (!running || matrixFaded) return;
      context.fillStyle = 'rgba(0, 8, 18, 0.075)';
      context.fillRect(0, 0, window.innerWidth, window.innerHeight);
      context.fillStyle = '#38bdf8';
      context.font = `${fontSize}px ui-monospace, monospace`;
      drops.forEach((drop, index) => {
        const character = characters[Math.floor(Math.random() * characters.length)];
        context.fillText(character, index * fontSize, drop * fontSize);
        drops[index] = drop * fontSize > window.innerHeight && Math.random() > 0.975 ? 0 : drop + 1;
      });
      frame = window.setTimeout(draw, 42);
    };
    resize();
    draw();
    window.addEventListener('resize', resize, { passive: true });
    if (readingFadeEnabled) {
      canvas.style.transition = "opacity 1.6s ease-out";
      updateReadingFade();
      if (!matrixFaded) window.addEventListener("scroll", updateReadingFade, { passive: true });
      if (!matrixFaded) readingTimer = window.setInterval(updateReadingFade, 2000);
    }
    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (running && !matrixFaded) draw();
      else window.clearTimeout(frame);
    });
  }

  if (reducedMotion) {
    document.querySelectorAll('[data-motion-thumbnail]').forEach((video) => {
      video.pause();
      video.removeAttribute('autoplay');
    });
  }

  const dialog = document.querySelector('[data-jaestava-dialog]');
  const opener = document.querySelector('[data-jaestava-open]');
  const closer = document.querySelector('[data-jaestava-close]');
  const frameWrap = dialog?.querySelector('.jaestava-frame');
  const loader = dialog?.querySelector('[data-jaestava-loader]');
  let loaded = false;
  const loadJaestava = () => {
    if (!dialog || typeof dialog.showModal !== 'function') {
      window.open('https://fdfont.pythonanywhere.com/', '_blank', 'noopener,noreferrer');
      return;
    }
    if (!loaded && frameWrap) {
      const iframe = document.createElement('iframe');
      iframe.title = 'Sistema operativo JAESTAVA ØS';
      iframe.className = 'jaestava-iframe';
      iframe.allow = 'clipboard-read; clipboard-write; fullscreen';
      iframe.referrerPolicy = 'no-referrer';
      iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox');
      iframe.addEventListener('load', () => { if (loader) loader.hidden = true; });
      iframe.src = 'https://fdfont.pythonanywhere.com/';
      frameWrap.append(iframe);
      loaded = true;
    }
    dialog.showModal();
  };
  const open = () => {
    if (window.FaroConsent) window.FaroConsent.requireExternal(loadJaestava);
    else loadJaestava();
  };
  opener?.addEventListener('click', open);
  closer?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
})();
