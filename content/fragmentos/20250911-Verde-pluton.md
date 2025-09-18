---
title: "Verde Plutón: Planeta cultivado con atmósfera de canabidioides"
date: 2025-09-11
image: "/img/2025/09/20250911-verde-pluton.png"
description: "Una crónica del porvenir alcanzable donde un planeta renegado se convierte en un jardín emocional respirable."
tags: ["utopía", "biotecnología", "atmósferas psicoactivas", "HUMANUTOPIA"]
categories: ["Crónicas del Porvenir Alcanzable"]
---

![Verde Plutón: Planeta cultivado con atmósfera de canabidioides](/img/2025/09/20250911-verde-pluton.png)

<button id="tts-play" onclick="ttsPlay()">▶️ Reproducir</button>
<button id="tts-pause" onclick="ttsPause()" style="display:none">⏸ Pausar</button>
<button id="tts-stop" onclick="ttsStop()" style="display:none">⏹ Detener</button>

## Crónica IX: Verde Plutón, la atmósfera que cultivó el alma humana

> *“No fue colonización. Fue germinación. Llegamos con pulmones cerrados y mentes saturadas. La atmósfera nos deshizo suavemente, como si nos dijera: no tenéis que cargar más con todo eso.”*

---

### 🪐 El planeta exiliado

Verde Plutón no siempre fue verde.

Primero fue una roca fría, un exoplaneta más allá del afecto gravitacional de las potencias solares. Un punto marginal, olvidado por los catálogos orbitales y excluido del mapa emocional de la humanidad.

Pero en el siglo 7 post-Tierra, cuando la humanidad ya no buscaba expansión sino **curación**, Verde Plutón fue reclamado por los **Jardineros de la Deriva**: una coalición de bioetnógrafos, exiliados sensoriales y conciencias vegetales interconectadas.

Su propósito: **cultivar atmósferas que respiraran paz**.

---

### 🌬️ La atmósfera de canabidioides

Los vientos de Verde Plutón no soplan: **susurran**.

El planeta está envuelto en una **atmósfera fitosintética**, compuesta por cannabinoides biosintetizados que no alteran la percepción sino que **facilitan la reparación emocional**.

Estos compuestos no son narcóticos ni evasivos. Son **noo-trópicos relacionales** diseñados para:

- Disolver tensiones neuroquímicas.
- Restaurar memorias sin trauma.
- Reestablecer vínculos entre humanos y no-humanos.

La atmósfera es cultivada, no por satélites, sino por **biosistemas flotantes** que cuidan el equilibrio químico con precisión orgánica.

---

### 🪰 Las Moscas Verdes

No son plaga, son **archivos voladores**.

Las Moscas Verdes actúan como **vectores de memoria emocional**. Se posan, escuchan, absorben residuos de trauma codificado en forma de feromonas alteradas y lo transforman en esporas de comprensión.

> “Cuando una Mosca Verde se posa sobre ti, no la espantes. Está leyendo lo que no sabías que dolía.”

Funciones vitales:

- Polinizan plantas que almacenan recuerdos colectivos.
- Conectan mentes en sincronía terapéutica.
- Son emisarias del **Verde Plutón**, un espectro visible solo en estados de calma profunda.

---

### 🧬 Ecosistema emocional

Verde Plutón es **una biosinfonía emocional** donde cada elemento del entorno responde a la carga psíquica del visitante:

- **Bosques resonantes** que emiten frecuencias curativas.
- **Lagos sintonizados** al nivel de ansiedad: cuando detectan tensión, reflejan recuerdos sanados.
- **Micelios judiciales**: redes fúngicas que median disputas transmitiendo empatía entre las partes involucradas.

---

### 🚫 Riesgos del planeta

No todo es idilio.

- Visitantes no preparados pueden sufrir **colapsos de identidad**, incapaces de sostener tanta transparencia emocional.
- Sectores corporativos intentan **extraer aire enlatado** como droga recreativa, con consecuencias desastrosas.
- El culto de los *Secadores* busca erradicar toda atmósfera psicoactiva y "normalizar" el planeta.

---

### 📜 Fragmento de crónica

> “Respiré por primera vez sin culpa.  
>  
> El aire me abrazó por dentro.  
>  
> Una Mosca Verde me dejó un sueño: yo de niño, jugando con mi padre, sin la rabia que lo consumió.  
>  
> Verde Plutón no me prometió felicidad. Me ofreció posibilidad. Y eso fue suficiente.”

---

## 🌌 Epílogo

Verde Plutón es un experimento continuo. No es para todos. Requiere desaprender, rendirse ante lo sensorial, permitir que el cuerpo y la conciencia se alineen con un planeta que **no impone, sino propone**.

En el 99% de porvenir utópico, Verde Plutón es el laboratorio más audaz: un jardín planetario donde la respiración es política, el recuerdo es medicina, y cada mosca verde lleva en sus alas una nueva versión de lo humano.

---

**HUMANUTOPIA**  
*Crónicas del Porvenir Alcanzable*  
99% utopía construida — 1% en disputa constante.

![Verde Plutón: Planeta cultivado con atmósfera de canabidioides](/img/2025/09/20250911-moscar-verdes-pluton.gif)

<div>
  <label for="voice-select">Elegir voz:</label>
  <select id="voice-select"></select>
</div>

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

  // 👉 Buscar la palabra "Detener" y recortar el texto desde ahí
  const startIndex = content.indexOf("Detener");
  let textToRead = content;
  if (startIndex !== -1) {
    textToRead = content.substring(startIndex);
  }

  speechSynthesis.cancel();
  utterance = new SpeechSynthesisUtterance(textToRead);

  utterance.lang = 'es-ES';

  const selectedIndex = document.getElementById('voice-select')?.value;
  if (voices[selectedIndex]) {
    utterance.voice = voices[selectedIndex];
  }

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
let voices = [];

function loadVoices() {
  voices = speechSynthesis.getVoices();
  const voiceSelect = document.getElementById('voice-select');

  voiceSelect.innerHTML = ''; // limpiar
  voices.forEach((voice, i) => {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });
}

// Algunos navegadores tardan en cargar voces
speechSynthesis.onvoiceschanged = loadVoices;
function loadVoices() {
  voices = speechSynthesis.getVoices().filter(v => v.lang.startsWith("es-"));
  const voiceSelect = document.getElementById('voice-select');

  voiceSelect.innerHTML = '';
  voices.forEach((voice, i) => {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });
}


</script>