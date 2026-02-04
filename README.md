# ☕ CafeHunt

**Discover Mexico's Best Cafés**

CafeHunt is a mobile-first progressive web app that helps you discover highly-rated cafés (4-5 stars) across Mexico. Built with a beautiful, coffee-inspired design and optimized for mobile devices.

![CafeHunt Preview](https://via.placeholder.com/800x400/D4744A/FFFFFF?text=CafeHunt+-+Discover+Mexico%27s+Best+Cafes)

## ✨ Features

### Core Features
- 🗺️ **Interactive Map** - Full-screen map interface showing nearby cafés
- ⭐ **Quality Filter** - Only displays 4-5 star rated cafés
- 📍 **Location-Based** - Automatically finds cafés near you
- 💾 **Smart Caching** - 30-day server-side cache to minimize API calls
- 🌓 **Dark/Light Mode** - Beautiful themes for any lighting condition
- 📱 **Mobile-First** - Optimized touch interactions and responsive design

### User Features
- ✍️ **Write Reviews** - Share your café experiences
- 📷 **Photo Uploads** - Add up to 3 photos per review
- ❤️ **Save Cafés** - Bookmark your favorites for later
- 📤 **Share** - Share cafés with friends
- 🗺️ **Directions** - Get directions via Google Maps
- 📋 **List View** - Alternative list-based browsing

### Technical Features
- 🚀 **Cloudflare Workers** - Edge-deployed for global performance
- 🔄 **KV Cache** - Persistent 30-day caching
- 🌐 **Google Places API** - Accurate, real-time café data
- 💾 **Local Storage** - User profiles and preferences saved locally
- 🎨 **Custom Design** - Unique coffee-themed aesthetic

## 🚀 Deployment Guide

### Prerequisites
- Cloudflare account
- Google Cloud Platform account (for Places API)
- Node.js installed (for Wrangler CLI)

### Step 1: Set Up Google Places API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Places API**
4. Create credentials (API Key)
5. **Important**: Restrict your API key:
   - Application restrictions: HTTP referrers (websites)
   - Add your domain: `cafehunt.app/*`
   - API restrictions: Select "Places API"

### Step 2: Install Wrangler CLI

```bash
npm install -g wrangler
```

### Step 3: Authenticate with Cloudflare

```bash
wrangler login
```

### Step 4: Create KV Namespace

```bash
# Production namespace
wrangler kv:namespace create "CAFEHUNT_CACHE"

# Preview namespace (for development)
wrangler kv:namespace create "CAFEHUNT_CACHE" --preview
```

Copy the IDs returned and update `wrangler.toml`:

```toml
kv_namespaces = [
  { binding = "CAFEHUNT_CACHE", id = "your_production_id", preview_id = "your_preview_id" }
]
```

### Step 5: Configure Your API Key

Update `worker.js` with your Google Places API key:

```javascript
const GOOGLE_PLACES_API_KEY = 'YOUR_API_KEY_HERE';
```

**Security Note**: In production, use Cloudflare Workers Secrets:

```bash
wrangler secret put GOOGLE_PLACES_API_KEY
```

Then update the worker to use:
```javascript
const GOOGLE_PLACES_API_KEY = env.GOOGLE_PLACES_API_KEY;
```

### Step 6: Create Public Directory

```bash
mkdir public
cp cafehunt.html public/index.html
```

### Step 7: Deploy to Cloudflare Workers

```bash
# Deploy to production
wrangler deploy

# Or deploy to staging
wrangler deploy --env staging
```

### Step 8: Configure Custom Domain

1. In Cloudflare dashboard, go to Workers & Pages
2. Select your `cafehunt` worker
3. Go to Settings → Triggers
4. Add custom domain: `cafehunt.app`
5. Make sure DNS is configured (A or CNAME record pointing to your worker)

### Step 9: Test Your Deployment

Visit `https://cafehunt.app` and verify:
- Map loads correctly
- Location permission works
- Cafés appear on the map
- All features function properly

## 🛠️ Development

### Local Development

```bash
# Start local development server
wrangler dev

# Access at http://localhost:8787
```

### Project Structure

```
cafehunt/
├── cafehunt.html       # Main app (single-file PWA)
├── worker.js           # Cloudflare Worker (API proxy + cache)
├── wrangler.toml       # Cloudflare configuration
├── README.md           # This file
└── public/             # Static files directory
    └── index.html      # Copy of cafehunt.html
```

### API Endpoints

The Cloudflare Worker provides these endpoints:

- `GET /api/cafes/nearby?lat={lat}&lng={lng}&radius={radius}`
  - Returns nearby cafés filtered to 4-5 stars
  - Cached for 30 days

- `GET /api/cafe/details?place_id={place_id}`
  - Returns detailed information about a specific café
  - Cached for 30 days

- `GET /api/cache/clear?key={cache_key}`
  - Admin endpoint to clear specific cache entries

## 🎨 Customization

### Changing Colors

Edit CSS variables in `cafehunt.html`:

```css
:root {
    --accent-primary: #D4744A;    /* Primary brand color */
    --accent-secondary: #E89B6D;   /* Secondary accent */
    --bg-primary: #FFF8F0;         /* Main background */
    /* ... more colors ... */
}
```

### Adjusting Map Appearance

Change the map tile provider in the `updateMapTiles()` function:

```javascript
// Light theme
'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

// Dark theme
'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
```

### Modifying Cache Duration

In `worker.js`:

```javascript
const CACHE_DURATION = 30 * 24 * 60 * 60; // Change to desired seconds
```

## 📱 PWA Installation

Users can install CafeHunt as a Progressive Web App:

1. Visit cafehunt.app on mobile
2. Tap browser menu
3. Select "Add to Home Screen"
4. Enjoy app-like experience!

## 🔒 Security Considerations

1. **API Key Protection**: Never commit API keys to version control
2. **Rate Limiting**: Consider adding rate limiting to worker endpoints
3. **Authentication**: Add auth for admin endpoints (`/api/cache/clear`)
4. **HTTPS Only**: Enforce HTTPS in production
5. **Input Validation**: Validate all user inputs server-side

## 📊 Monitoring

### Check Cache Performance

View cache hit rates in Cloudflare Workers Analytics:
- Workers & Pages → Your Worker → Analytics
- Look for "Requests" and custom headers (`X-Cache: HIT/MISS`)

### Monitor API Usage

Check Google Cloud Console for Places API usage:
- APIs & Services → Dashboard
- Monitor quota and costs

## 🐛 Troubleshooting

### Cafés Not Loading
- Check browser console for errors
- Verify API key is correct and unrestricted
- Ensure KV namespace is properly configured
- Check network tab for failed requests

### Location Not Working
- Grant location permissions in browser
- Ensure HTTPS is enabled (required for geolocation)
- Try refreshing the page

### Cache Not Working
- Verify KV namespace binding in `wrangler.toml`
- Check Cloudflare Workers logs
- Try clearing browser cache

## 💰 Cost Estimation

### Google Places API
- Nearby Search: $32 per 1,000 requests
- **With 30-day caching**: Minimal cost for repeat visitors

### Cloudflare Workers
- Free tier: 100,000 requests/day
- Paid: $5/month for 10M requests
- KV Storage: $0.50/GB-month, $0.50/million reads

**Estimated monthly cost for moderate traffic** (10K unique visitors):
- Google Places API: ~$5-10 (with caching)
- Cloudflare: Free tier (likely sufficient)
- **Total: ~$5-10/month**

## 📄 License

This project is created for askgato.com.

## 🤝 Contributing

This is a private project for cafehunt.app. For questions or issues, contact askgato.com.

## 🌟 Credits

- **Design & Development**: askgato.com
- **Map Provider**: OpenStreetMap / CartoDB
- **Data**: Google Places API
- **Hosting**: Cloudflare Workers
- **Fonts**: Google Fonts (Anybody, Work Sans)

---

**Made with ☕ by [askgato.com](https://askgato.com)**

Visit us at **[cafehunt.app](https://cafehunt.app)**
