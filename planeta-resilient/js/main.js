// Inicialitza Cesium
Cesium.Ion.defaultAccessToken = 'token_anònim_per_desenvolupament';

const viewer = new Cesium.Viewer("globe", {
  animation: false,
  timeline: false,
  baseLayerPicker: false,
});

// Carrega els projectes ficticis
fetch('data/projects.json')
  .then(response => response.json())
  .then(projectes => {
    mostrarProjectes(projectes);
    posarMarcadors(projectes);
  });

function mostrarProjectes(projectes) {
  const llista = document.getElementById('projects-list');
  llista.innerHTML = '';

  projectes.forEach(proj => {
    const card = document.createElement('div');
    card.classList.add('project-card');
    card.innerHTML = `
      <img src="img/${proj.imatge}" alt="${proj.nom}" />
      <h3>${proj.nom}</h3>
      <p>${proj.pais}</p>
      <p>${proj.descripcio}</p>
      <small>${proj.diners_recollits} € / ${proj.objectiu} €</small>
    `;
    card.addEventListener('click', () => {
      viewer.flyTo(proj.cesiumEntity);
    });
    llista.appendChild(card);
  });
}

function posarMarcadors(projectes) {
  projectes.forEach(proj => {
    proj.cesiumEntity = viewer.entities.add({
      name: proj.nom,
      position: Cesium.Cartesian3.fromDegrees(proj.lng, proj.lat),
      point: {
        pixelSize: 10,
        color: Cesium.Color.ORANGE
      },
      description: proj.descripcio
    });
  });
}
