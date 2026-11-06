// GeoJSON coordinates use [longitude, latitude], NOT [latitude, longitude].
export function pointInRing(lng, lat, ring) {
  if (!Array.isArray(ring) || ring.length < 4) return false;
  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (
      (yi > lat) !== (yj > lat) &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
    ) {
      inside = !inside;
    }
  }
  return inside;
}

export function pointInMultiPolygon(lng, lat, polygons) {
  return polygons.some((polygon) =>
    polygon.length > 0 &&
    pointInRing(lng, lat, polygon[0]) &&
    !polygon.slice(1).some((hole) => pointInRing(lng, lat, hole))
  );
}