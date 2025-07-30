// netlify/functions/fuel.js
import fetch from "node-fetch";

// Free retailer feeds (CMA scheme)
const RETAILERS = [
  { brand: "Tesco", url: "https://www.tesco.com/fuel_prices/fuel_prices_data.json" },
  { brand: "Asda", url: "https://storelocator.asda.com/fuel_prices_data.json" },
  { brand: "Morrisons", url: "https://www.morrisons.com/fuel-prices/fuel.json" }
];

export async function handler(event) {
  try {
    const params = new URLSearchParams(event.queryStringParameters);
    const type = params.get("type") || "unleaded";

    // Collect data from retailers
    const stations = [];
    for (const r of RETAILERS) {
      try {
        const res = await fetch(r.url);
        const data = await res.json();
        // Normalize
        const items = (data.sites || data.stations || data || []).map(s => ({
          brand: r.brand,
          name: s.name || s.site || "Station",
          postcode: s.postcode || "",
          unleaded: s.e5 || s.unleaded || s["unleaded-price"],
          diesel: s.b7 || s.diesel || s["diesel-price"]
        }));
        stations.push(...items);
      } catch {
        // Ignore retailer errors
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ stations })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
