// The only frontend entry point: wires map events -> API -> UI.
import { fetchParcel } from './api.js';
import { pointInMultiPolygon } from './geometry.js';
import { createMap, drawMarker, drawPolygon, removeLayer } from './map.js';
import {
  getInputCoordinates,
  hideParcel,
  renderParcel,
  setLookupDisabled,
  setSelectedCoordinates,
  showStatus,
} from './ui.js';

const start = [21.120084, 105.7886];

if (!window.L) {
  showStatus('Không tải được Leaflet. Kiểm tra Internet hoặc CDN.', 'err');
} else {
  const map = createMap(start);
  let marker = null;
  let parcelLayer = null;
  let lastClick = start;
  let requestIndex = 0;
  let currentRequest = null;

  async function lookup(lat, lng) {
    // Cancel previous browser request and ignore outdated results.
    currentRequest?.abort();
    const controller = new AbortController();
    currentRequest = controller;
    const currentIndex = ++requestIndex;

    showStatus('Đang tra cứu OneHousing API...');
    setLookupDisabled(true);

    try {
      const result = await fetchParcel(lat, lng, controller.signal);
      if (currentIndex !== requestIndex) return;

      if (!result.data || typeof result.data !== 'object') {
        showStatus('API không tìm thấy thửa đất tại vị trí đã chọn.', 'warn');
        return;
      }

      const polygons = renderParcel(result);
      if (!polygons) {
        showStatus('Đã nhận thông tin cơ bản. API không trả về geometry.', 'warn');
        return;
      }

      try {
        parcelLayer = drawPolygon(map, polygons);
        parcelLayer.bringToFront();
        marker?.bringToFront();

        const contained = pointInMultiPolygon(lng, lat, polygons);
        showStatus(
          contained
            ? 'Tìm thấy thửa đất và ranh giới Polygon (nguồn OneHousing).'
            : 'API trả về Polygon nhưng điểm click nằm ngoài đa giác. Cần kiểm tra vị trí!',
          contained ? 'ok' : 'warn'
        );
      } catch (error) {
        showStatus(`API có geometry nhưng không vẽ được: ${error.message}`, 'warn');
      }
    } catch (error) {
      if (currentIndex !== requestIndex || error.name === 'AbortError') return;
      showStatus(`Lỗi tra cứu: ${error.message}`, 'err');
    } finally {
      if (currentIndex === requestIndex) {
        setLookupDisabled(false);
        currentRequest = null;
      }
    }
  }

  function selectPoint(rawLat, rawLng, pan = false) {
    if (String(rawLat).trim() === '' || String(rawLng).trim() === '') {
      showStatus('Vui lòng nhập đủ vĩ độ và kinh độ.', 'err');
      return;
    }
    const lat = Number(rawLat);
    const lng = Number(rawLng);
    if (
      !Number.isFinite(lat) || !Number.isFinite(lng) ||
      Math.abs(lat) > 90 || Math.abs(lng) > 180
    ) {
      showStatus('Tọa độ không hợp lệ. Lat: -90..90; lng: -180..180.', 'err');
      return;
    }

    lastClick = [lat, lng];
    setSelectedCoordinates(lat, lng);
    removeLayer(map, marker);
    removeLayer(map, parcelLayer);
    parcelLayer = null;
    marker = drawMarker(map, lat, lng);
    hideParcel();
    if (pan) map.panTo([lat, lng]);
    void lookup(lat, lng);
  }

  map.on('click', (event) => selectPoint(event.latlng.lat, event.latlng.lng));
  document.getElementById('lookup').addEventListener('click', () => {
    const { lat, lng } = getInputCoordinates();
    selectPoint(lat, lng, true);
  });

  for (const id of ['lat', 'lng']) {
    document.getElementById(id).addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const { lat, lng } = getInputCoordinates();
        selectPoint(lat, lng, true);
      }
    });
  }

  document.getElementById('copy').addEventListener('click', async () => {
    const coordinates = lastClick.map((value) => value.toFixed(8)).join(', ');
    try {
      await navigator.clipboard.writeText(coordinates);
      showStatus(`Đã sao chép tọa độ: ${coordinates}`, 'ok');
    } catch {
      showStatus(`Không thể sao chép tự động. Tọa độ: ${coordinates}`, 'warn');
    }
  });

  // Same behavior as the original program: automatically look up the start point.
  selectPoint(start[0], start[1]);
}