// One file for changing the DOM: status, coordinates, parcel fields and plans.
const el = (id) => document.getElementById(id);
const numberFormatter = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 });

function setText(id, value) {
  el(id).textContent = value ?? '--';
}

export function showStatus(message, kind = '') {
  const box = el('status');
  box.className = `status${kind ? ` ${kind}` : ''}`;
  box.replaceChildren();

  const dot = document.createElement('span');
  dot.className = 'dot';
  const content = document.createElement('span');
  content.textContent = message;
  box.append(dot, content);
}

export function setSelectedCoordinates(lat, lng) {
  el('lat').value = String(lat);
  el('lng').value = String(lng);
  setText('selected', `${lat.toFixed(8)}, ${lng.toFixed(8)}`);

  const url = new URL('https://maps.onehousing.vn/quy-hoach');
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lng', String(lng));
  el('onehousing').href = url.toString();
}

export function hideParcel() {
  el('parcel-content').classList.add('hidden');
}

export function renderParcel(result) {
  const parcel = result.data;
  const area = typeof parcel.total_area === 'number'
    ? `${numberFormatter.format(parcel.total_area)} m²`
    : '--';

  setText('address', parcel.address || '--');
  setText('plot', `${parcel.map_number ?? '--'} / ${parcel.land_number ?? '--'}`);
  setText('area', area);
  setText('type', parcel.planning_land_type_code
    ? `${parcel.planning_land_type_code} - ${parcel.planning_land_type || ''}`
    : (parcel.planning_land_type || '--'));
  setText('shape', parcel.shape_file_id || '--');
  setText('response-coord', `${parcel.latitude ?? '--'}, ${parcel.longitude ?? '--'}`);

  const polygons = parcel.geometry?.multi_polygon;
  const hasPolygons = Array.isArray(polygons) && polygons.length > 0;
  setText('geometry-state', hasPolygons ? 'Có Polygon' : 'Không có Polygon');

  const plans = el('plans');
  plans.replaceChildren();
  if (Array.isArray(parcel.planning_infos) && parcel.planning_infos.length > 0) {
    for (const plan of parcel.planning_infos) {
      const row = document.createElement('div');
      row.className = 'plan-row';
      const main = document.createElement('div');
      const name = document.createElement('div');
      name.className = 'plan-name';
      name.textContent = plan.planning_type_name || '--';
      const code = document.createElement('div');
      code.className = 'plan-code';
      code.textContent = plan.planning_type_code || '';
      main.append(name, code);
      const measure = document.createElement('div');
      measure.className = 'plan-area';
      measure.textContent = typeof plan.planning_area === 'number'
        ? `${numberFormatter.format(plan.planning_area)} m²`
        : '--';
      row.append(main, measure);
      plans.append(row);
    }
  } else {
    const none = document.createElement('div');
    none.className = 'tiny';
    none.style.padding = '9px 0';
    none.textContent = 'Không có planning_infos trong phản hồi API.';
    plans.append(none);
  }

  setText('raw-json', JSON.stringify(result, null, 2));
  el('parcel-content').classList.remove('hidden');
  return hasPolygons ? polygons : null;
}

export function setLookupDisabled(disabled) {
  el('lookup').disabled = disabled;
}

export function getInputCoordinates() {
  return { lat: el('lat').value, lng: el('lng').value };
}