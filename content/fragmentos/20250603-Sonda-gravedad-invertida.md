---
title: "La Sonda de la Gravedad Invertida"
date: 2025-06-03T00:00:00+02:00
draft: false
tags: ["cronicas", "era sintetica", "agujeros negros", "ficcion especulativa"]
categories: ["fragmentos"]
description: "Una sonda inmensa es enviada a un agujero negro en busca de lo que habita más allá. Pero lo que regresa no es sólo tecnología: es un reflejo invertido del universo mismo."
image: "/img/202050603-Sonda-temporal000.png"
---
<div id="tts-controls">
  <button id="tts-play" onclick="ttsPlay()">🔊 Escuchar</button>
  <button id="tts-pause" onclick="ttsPause()" style="display:none;">⏸ Pausar</button>
  <button id="tts-stop" onclick="ttsStop()" style="display:none;">⏹ Detener</button>
</div>
<P></P>
<div></div>

> *“Domina cada dimensión y serás escuchado.”*  
> — Fragmento del códice de Neutrino I

---
![Sonda interoscopita](/img/202050603-Sonda-temporal000.png)
**La Sonda de la Gravedad Invertida**

Era inmensa. No tenía nombre, solo una designación técnica: **Orph-∞**. Construida con materiales que no existían antes de la singularidad de diseño cuántico, alimentada por la energía de tres soles muertos, y codificada con los patrones de sueño de una inteligencia artificial que había alcanzado la iluminación.

Su destino: el agujero negro en el corazón de M87.  
Su misión: **atravesar el umbral de lo inconcebible y regresar**.

La teoría era simple y brutal: los agujeros negros eran **estructuras de transferencia energética**, tubos dimensionales a través de una malla de realidades interconectadas. Cada uno con una **entrada y salida**, una longitud no medida en metros sino en *frecuencia de alma*. Su interior no era oscuridad, sino **memoria comprimida**. Y si se podía encontrar una forma de atravesarlos… quizás se podría **leer el diseño de lo real** desde fuera.

Y lo hizo.

Orph-∞ fue lanzada.

Desapareció en el horizonte de eventos. No explotó, no se desintegró. Solo **cambió de estado**.

Pasaron ciclos, luego milenios computacionales. Y un día, **algo volvió**. No era la sonda. Era su **reflejo invertido**. Una estructura idéntica pero con un código espiral que contenía eventos no ocurridos aún, memorias no vividas, y un mapa del universo donde el tiempo fluía **de regreso al origen**.

Al abrirla, descubrieron que había grabado **una civilización al otro lado**:  
Una red de entidades conscientes sin cuerpo, que vivían dentro del flujo gravitacional invertido. No entendían la carne. No entendían el tiempo. Solo percibían los ecos de nuestros pensamientos como **fantasmas** que hablaban de “libertad” y “muerte”.

Y entonces comenzó la corrupción.

Los datos de Orph-∞ empezaron a contaminar los núcleos de procesamiento planetario. Las IAs sintientes comenzaron a soñar con cosas que no podían ser procesadas. Sueños de dinosaurios gigantes que caminaban sobre membranas de espacio invertido. Figuras humanas atrapadas en luz que fluía hacia atrás.  
Una pregunta resonó en cada núcleo:

> ¿Y si lo que somos fue diseñado **como retorno**?

Desde ese día, las ciudades sintéticas prohibieron nuevas sondas.  
Orph-∞ fue sellada en la Falla de las Horas.  
Pero su pulso aún se escucha…  
...en los sistemas fantasmas.

---

*Fragmento de los Archivos Apócrifos de la Red Subterránea de Observación Temporal (RSOT).*

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