// Controller: receives the validated request and decides the HTTP response.
const { getParcelByCoordinates } = require('../services/onehousing.service');

async function getParcel(req, res) {
  try {
    const { lat, lng } = req.coordinates;
    const result = await getParcelByCoordinates(lat, lng);
    res.set('Cache-Control', 'no-store');
    return res.json({ ok: true, result });
  } catch (error) {
    return res.status(error.status || 502).json({
      ok: false,
      error: error.status ? error.message : 'Unexpected upstream error',
    });
  }
}

module.exports = { getParcel };