const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/parcel.routes');
const config = require('./config/env');

const app = express();
app.disable('x-powered-by');

// Static files: public/index.html, public/css, public/js.
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/health', (_req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ ok: true, authentication_configured: Boolean(config.oneHousingToken) });
});
app.use('/api', apiRoutes);
app.use('/api', (_req, res) => {
  res.status(404).json({ ok: false, error: 'Endpoint not found' });
});

module.exports = app;