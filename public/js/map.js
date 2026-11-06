// Leaflet is loaded globally from the CDN in index.html.
export function createMap(startCoordinates) {
  const map = L.map('map', { zoomControl: false, maxZoom: 22 })
    .setView(startCoordinates, 19);

  const satellite = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
      attribution: 'Tiles &copy; Esri; imagery: Esri, Maxar, Earthstar Geographics, GIS User Community',
      maxZoom: 22,
      maxNativeZoom: 19,
    }
  );
  const streets = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 22,
    maxNativeZoom: 19,
  });

  satellite.addTo(map);
  L.control.layers(
    { 'Vệ tinh (Esri)': satellite, 'Đường phố (OSM)': streets },
    {},
    { position: 'topright' }
  ).addTo(map);
  L.control.zoom({ position: 'bottomleft' }).addTo(map);
  L.control.scale({ imperial: false }).addTo(map);
  return map;
}

export function drawMarker(map, lat, lng) {
  return L.circleMarker([lat, lng], {
    radius: 6,
    color: '#ffffff',
    weight: 2,
    fillColor: '#176bd2',
    fillOpacity: 1,
  })
    .addTo(map)
    .bindTooltip('Tọa độ đã chọn', { direction: 'top', offset: [0, -7] });
}

export function drawPolygon(map, polygons) {
  return L.geoJSON(
    {
      type: 'Feature',
      properties: {},
      geometry: { type: 'MultiPolygon', coordinates: polygons },
    },
    {
      style: {
        color: '#ff8f0d',
        weight: 3,
        opacity: 1,
        fillColor: '#f6a42d',
        fillOpacity: 0.15,
      },
    }
  ).addTo(map);
}

export function removeLayer(map, layer) {
  if (layer) map.removeLayer(layer);
}