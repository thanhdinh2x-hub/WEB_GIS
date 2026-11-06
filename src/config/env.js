// Central place to read server configuration.
require('dotenv').config();

const port = Number.parseInt(process.env.PORT || '8765', 10);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be a number between 1 and 65535');
}

module.exports = {
  port,
  host: '127.0.0.1', // Only accessible on this computer.
  oneHousingApiUrl:
    'https://api.onehousing.vn/onehousing-channel/v1/digital-map/properties/location',
  oneHousingToken: (process.env.ONEHOUSING_BEARER_TOKEN || '')
    .trim()
    .replace(/^Bearer\s+/i, ''),
};