// Application entry point.
const app = require('./app');
const { host, port } = require('./config/env');

app.listen(port, host, () => {
  console.log(`WebGIS ready: http://${host}:${port}`);
  console.log('Press Ctrl+C to stop. Only accessible from your own computer.');
});