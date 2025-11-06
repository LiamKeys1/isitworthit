// Rebuild trigger — 6 Nov 2025
import fetch from 'node-fetch';

import fetch from 'node-fetch';

export async function handler() {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/mindsers/open-fuel-prices/main/prices.json'
    );
    const data = await response.json();

    const stations = data.stations
      .filter(st => st.unleaded || st.diesel)
      .map(st => ({
        brand: st.brand || 'Unknown',
        postcode: st.postcode || '',
        unleaded: st.unleaded || null,
        diesel: st.diesel || null
      }));

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',          // ✅ Allow any domain
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ stations })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: err.message })
    };
  }
}
