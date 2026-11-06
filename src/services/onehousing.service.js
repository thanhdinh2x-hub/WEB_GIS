// Only this module calls the external OneHousing API.
const config = require('../config/env');

class UpstreamError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function getParcelByCoordinates(lat, lng) {
  const url = new URL(config.oneHousingApiUrl);
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lng', String(lng));

  const headers = { Accept: 'application/json' };
  if (config.oneHousingToken) {
    headers.Authorization = `Bearer ${config.oneHousingToken}`;
  }

  let response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(18000),
      redirect: 'error',
    });
  } catch (error) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      throw new UpstreamError('OneHousing API request timed out', 504);
    }
    throw new UpstreamError('Could not connect to OneHousing API', 502);
  }

  if (!response.ok) {
    // Keep upstream error messages private; do not expose the token or raw body.
    const status = response.status >= 500 ? 502 : response.status;
    throw new UpstreamError(`OneHousing returned HTTP ${response.status}`, status);
  }

  try {
    return await response.json();
  } catch {
    throw new UpstreamError('OneHousing did not return valid JSON', 502);
  }
}

module.exports = { getParcelByCoordinates, UpstreamError };