---
title: "Parlamento Virtual Español Universal: un escaño para cada ciudadano"
date: 2025-09-21
author: "David J. Font"
tags: ["democracia", "innovación cívica", "participación", "gobierno abierto", "España"]
image: "/img/logo-parlamento-virtual-español-universal.png"
description: "El primer parlamento online donde cada español, con su DNI, puede proponer, debatir y votar. Democracia real, directa y transparente."
draft: false
---
![Imagen 1: PVEU-Palamento-virtual-espanyol-universal](/img/logo-parlamento-virtual-español-universal.png)
<div id="tts-controls">
  <button id="tts-play" onclick="ttsPlay()">🔊 Escuchar</button>
  <button id="tts-pause" onclick="ttsPause()" style="display:none;">⏸ Pausar</button>
  <button id="tts-stop" onclick="ttsStop()" style="display:none;">⏹ Detener</button>
</div>
<P></P>
<div></div>

**Un escaño para cada ciudadano.**  
Cada español, con su DNI o NIE, participa como diputado **una vez al año** durante 24 horas. Ese día puede **proponer**, **debatir** y **votar** junto a millones de personas el futuro del país.

---

##  Beneficios clave

- **Sufragio universal, continuo y verificable.**  
  Un mismo espacio online donde toda la ciudadanía puede decidir directamente sobre las propuestas.

- **Propuestas ciudadanas reales.**  
  Cualquier ciudadano puede **redactar sus iniciativas**, abrir el debate y someterlas a votación.

- **Transparencia total.**  
  Cada acción queda registrada en un **ledger encadenado** (tipo blockchain) para auditoría pública.

- **Acceso sencillo.**  
  Identificación digital y panel intuitivo con información clara para votar con criterio.

---

##  Capacidades de la plataforma

- **Identidad y sesión anual:** asignación de un **día de sesión** (24 h) para cada ciudadano; ese día puede publicar sus propuestas.  
- **Módulos integrados:** registro/login, creación de propuestas, hilos de debate y sistema de votos (**sí / no / abstención**).  
- **Auditoría reforzada:**  
  - **Ledger NDJSON** con hashes encadenados para **integridad e inmutabilidad**.  
  - **Auditorías de voto** con marca temporal y (opcional) coordenadas aproximadas para análisis agregado.  
- **Datos abiertos:** exportaciones **CSV** y **NDJSON** para periodistas, investigadores y observatorios cívicos.  
- **Escalabilidad por diseño:** arquitectura preparada para crecer hasta **decenas de millones** de usuarios.

> En su versión actual, el PVEU sirve la **web (index)** y una **API pública** unificadas en un solo servicio, para facilitar despliegue y adopción.

---

##  ¿Cómo participo?

1. **Regístrate** con tu DNI (se guarda el **hash**, nunca el DNI en claro).  
2. **Inicia sesión** y comprueba si **hoy es tu día de sesión**.  
3. **Crea tu propuesta** (si no es tu día, se guarda como **borrador**).  
4. **Cuando sea tu día:** publica tu borrador, **debate** y **vota**.

---

## 🔐 Seguridad y privacidad

- **Hash de identidad:** el DNI no se almacena directamente sinó en hash.  
- **Token HMAC** para sesión segura de 24 h.  
- **Rate limiting** y medidas antifraude de base.  
- **Ledger público** (lectura) + **tablas de auditoría** para trazabilidad sin exponer datos sensibles.


---

## ❓ Preguntas frecuentes

**¿Puedo proponer si no es mi día?**  
Sí. Se guarda como **borrador** y podrás publicarlo el día de tu sesión.

**¿Puedo votar cualquier día?**  
Sí. Puedes votar a diario las nuevas propuestas creadas por ciudadanos de tu país.

**¿Hay moderación?**  
Sí. Filtrado básico (IA + reglas) contra spam/abusos y un registro público auditable.

---

## ✅ Llamada a la acción

- 👉 **[Regístrate ahora](/)**

**Democracia real, directa y transparente.** Empieza hoy.


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