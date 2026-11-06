function validateCoordinates(req, res, next) {
  const { lat: rawLat, lng: rawLng } = req.query;

  if (
    typeof rawLat !== 'string' || !rawLat.trim() ||
    typeof rawLng !== 'string' || !rawLng.trim()
  ) {
    return res.status(400).json({ ok: false, error: 'Invalid latitude or longitude' });
  }

  const lat = Number(rawLat);
  const lng = Number(rawLng);

  if (
    !Number.isFinite(lat) || !Number.isFinite(lng) ||
    Math.abs(lat) > 90 || Math.abs(lng) > 180
  ) {
    return res.status(400).json({ ok: false, error: 'Invalid latitude or longitude' });
  }

  req.coordinates = { lat, lng };
  return next();
}

module.exports = { validateCoordinates };