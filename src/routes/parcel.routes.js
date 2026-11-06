const router = require('express').Router();
const { validateCoordinates } = require('../middleware/validate-coordinates');
const { getParcel } = require('../controllers/parcel.controller');

// GET /api/parcel?lat=21.120084&lng=105.7886
router.get('/parcel', validateCoordinates, getParcel);

module.exports = router;