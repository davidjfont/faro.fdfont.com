(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('faro-matrix');
  if (canvas && !reducedMotion) {
    const context = canvas.getContext('2d', { alpha: true });
    const characters = 'アカサタナハマヤラワ0123456789';
    const fontSize = 15;
    let drops = [];
    let frame = 0;
    let running = true;

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
      if (!running) return;
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
    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (running) draw();
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
  const open = () => {
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
  opener?.addEventListener('click', open);
  closer?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
})();
