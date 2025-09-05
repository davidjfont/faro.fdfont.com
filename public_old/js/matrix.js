<script>
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const letters = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789";
  const fontSize = 14;
  const columns = canvas.width / fontSize;

  const drops = Array.from({ length: columns }).fill(1);

  function drawMatrix() {
    ctx.fillStyle = "rgba(10, 20, 30, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#6dd3ff";
    ctx.font = `${fontSize}px monospace`;

    drops.forEach((y, i) => {
      const text = letters.charAt(Math.floor(Math.random() * letters.length));
      const x = i * fontSize;
      ctx.fillText(text, x, y * fontSize);

      drops[i] = (y * fontSize > canvas.height || Math.random() > 0.975) ? 0 : y + 1;
    });

    requestAnimationFrame(drawMatrix);
  }

  drawMatrix();

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
</script>
