// CafeHunt Cloudflare Worker - Updated for Security
const CACHE_DURATION = 30 * 24 * 60 * 60; // 30 days

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Pass the 'env' object to your handlers so they can access the API key
    if (url.pathname === '/api/cafes/nearby') {
      return handleNearbyCafes(request, env, corsHeaders);
    } else if (url.pathname === '/api/cafe/details') {
      return handleCafeDetails(request, env, corsHeaders);
    }

    return new Response('CafeHunt API Server', { headers: corsHeaders });
  }
};

async function handleNearbyCafes(request, env, corsHeaders) {
  // ... existing logic ...
  // USE SECRETS LIKE THIS:
  const apiKey = env.GOOGLE_PLACES_API_KEY; 
  
  const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
                    `location=${lat},${lng}&radius=${radius}&type=cafe&key=${apiKey}`;
  
  // Use the KV namespace from env
  const cached = await env.CAFEHUNT_CACHE.get(cacheKey, { type: 'json' });
  // ... rest of your function ...
}