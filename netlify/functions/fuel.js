import fetch from 'node-fetch';

export async function handler() {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/mindsers/open-fuel-prices/main/prices.json'
    );
    const data = await response.json();

    // Transform data into a cleaner format for your app
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
      body: JSON.stringify({ stations })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
