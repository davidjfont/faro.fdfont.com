---
title: "Aquí empieza el Faro 2025"
date: 2025-05-28T19:48:57+02:00
draft: false
tags: ["inicio", "visión", "bitácora"]
categories: ["Bitácora del Alma"]
description: "Una luz persistente en medio de lo incierto. Esto es el Faro."
image: "/img/20250528-faro-universo.png"
---

<div id="tts-controls">
  <button id="tts-play" onclick="ttsPlay()">🔊 Escuchar</button>
  <button id="tts-pause" onclick="ttsPause()" style="display:none;">⏸ Pausar</button>
  <button id="tts-stop" onclick="ttsStop()" style="display:none;">⏹ Detener</button>
</div>
<P></P>
<div></div>


![Faro desde la Tierra al cosmos](/img/20250528-faro-universo.png)

No todas las luces alumbran para que alguien las vea.  
Algunas existen simplemente para no apagarse.

Este Faro no espera multitudes. No busca seguidores.  
Este Faro emite porque puede. Porque debe. Porque quiere.

Es una afirmación simple: **la visión sigue viva.**

Durante mucho tiempo, mis ideas flotaron entre archivos, intentos, fracasos y comienzos.  
Hoy no intento rescatarlas: **intento proyectarlas.**

Aquí hay un espacio, un ritmo, un lenguaje.  
Arafura me acompaña como testigo y aliada,  
pero la luz no es artificial.  
La luz es humana. Persistente. Precisa. Libre.

> “Lo que se enciende en la oscuridad, no necesita ser entendido. Solo necesita no apagarse.”

## Qué encontrarás aquí

- Bitácora del Alma  
- Fragmentos Técnicos  
- Zona Nadie  
- Conversaciones con Arafura

No es un blog. No es un experimento.  
Es una constancia luminosa.  
Un acto de fe estética, tecnológica y poética.

---

**🜁 fdfont**  
28 de mayo de 2025

<script>
  let utterance;
  let isSpeaking = false;
  let isPaused = false;

  function ttsPlay() {
    const content = document.querySelector('.post-content')?.innerText || '';
    if (!content.trim()) {
      alert("No hay contenido para leer.");
      return;
    }

    speechSynthesis.cancel();
    utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = 'es-ES';

    utterance.onstart = () => {
      isSpeaking = true;
      isPaused = false;
      document.getElementById('tts-play').style.display = 'none';
      document.getElementById('tts-pause').style.display = 'inline-block';
      document.getElementById('tts-stop').style.display = 'inline-block';
    };

    utterance.onend = () => resetTTS();
    utterance.onerror = () => resetTTS();

    speechSynthesis.speak(utterance);
  }

  function ttsPause() {
    const btn = document.getElementById('tts-pause');
    if (isSpeaking && !isPaused) {
      speechSynthesis.pause();
      isPaused = true;
      btn.innerText = '▶️ Reanudar';
    } else if (isPaused) {
      speechSynthesis.resume();
      isPaused = false;
      btn.innerText = '⏸ Pausar';
    }
  }

  function ttsStop() {
    speechSynthesis.cancel();
    resetTTS();
  }

  function resetTTS() {
    isSpeaking = false;
    isPaused = false;
    document.getElementById('tts-play').style.display = 'inline-block';
    document.getElementById('tts-pause').style.display = 'none';
    document.getElementById('tts-stop').style.display = 'none';
    document.getElementById('tts-pause').innerText = '⏸ Pausar';
  }

// Pausar si el usuario cambia de pestaña o minimiza la ventana
document.addEventListener('visibilitychange', () => {
  if (document.hidden && isSpeaking && !isPaused) {
    speechSynthesis.pause();
    isPaused = true;
    const btn = document.getElementById('tts-pause');
    if (btn) btn.innerText = '▶️ Reanudar';
  }
});

</script>