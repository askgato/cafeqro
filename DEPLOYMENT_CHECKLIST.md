# CafeHunt Deployment Checklist

Use this checklist to ensure a smooth deployment of CafeHunt to production.

## Pre-Deployment

### Google Cloud Platform Setup
- [ ] Create GCP project or use existing one
- [ ] Enable Places API in GCP Console
- [ ] Create API Key for Places API
- [ ] Configure API Key restrictions:
  - [ ] HTTP referrer restriction: `cafehunt.app/*`
  - [ ] API restriction: Only Places API
- [ ] Set up billing alerts (recommended: $10-20/month threshold)
- [ ] Copy API key (you'll need it later)

### Cloudflare Setup
- [ ] Sign up for Cloudflare account (if not already)
- [ ] Add domain `cafehunt.app` to Cloudflare
- [ ] Update nameservers at domain registrar
- [ ] Verify domain is active in Cloudflare (status: Active)
- [ ] Enable "Always Use HTTPS" in SSL/TLS settings
- [ ] Set SSL/TLS encryption mode to "Full (strict)"

### Local Environment
- [ ] Install Node.js (v16 or higher)
- [ ] Install Wrangler CLI: `npm install -g wrangler`
- [ ] Clone or download CafeHunt project files
- [ ] Run `npm install` in project directory

## Configuration

### API Key Setup
- [ ] Open `worker.js`
- [ ] Replace `GOOGLE_PLACES_API_KEY` with your actual key (temporarily)
- [ ] OR use Cloudflare Secrets (recommended):
  ```bash
  wrangler secret put GOOGLE_PLACES_API_KEY
  ```
  Then update worker.js to use: `env.GOOGLE_PLACES_API_KEY`

### Cloudflare Workers Setup
- [ ] Login to Cloudflare via CLI: `wrangler login`
- [ ] Create KV namespace (production):
  ```bash
  wrangler kv:namespace create "CAFEHUNT_CACHE"
  ```
- [ ] Create KV namespace (preview):
  ```bash
  wrangler kv:namespace create "CAFEHUNT_CACHE" --preview
  ```
- [ ] Copy the namespace IDs from command output
- [ ] Update `wrangler.toml` with your namespace IDs:
  ```toml
  kv_namespaces = [
    { binding = "CAFEHUNT_CACHE", id = "YOUR_PRODUCTION_ID", preview_id = "YOUR_PREVIEW_ID" }
  ]
  ```

### Domain Configuration
- [ ] Update `wrangler.toml` routes section:
  ```toml
  routes = [
    { pattern = "cafehunt.app/*", zone_name = "cafehunt.app" }
  ]
  ```

## Testing

### Local Testing
- [ ] Run `wrangler dev` to start local server
- [ ] Open `http://localhost:8787` in browser
- [ ] Test location permission prompt
- [ ] Verify cafés load on map
- [ ] Test search functionality
- [ ] Test theme toggle (dark/light)
- [ ] Test writing a review
- [ ] Test uploading photos
- [ ] Test saving a café
- [ ] Test sharing functionality
- [ ] Test directions button
- [ ] Test list view
- [ ] Check browser console for errors

### Mobile Testing (via tunneling)
- [ ] Use ngrok or Cloudflare Tunnel to expose localhost
- [ ] Test on actual mobile device
- [ ] Verify touch interactions work smoothly
- [ ] Test location services on mobile
- [ ] Check responsive layout on different screen sizes

## Deployment

### Build & Deploy
- [ ] Run build script: `npm run build`
- [ ] Verify `public/index.html` was created
- [ ] Deploy to Cloudflare Workers: `wrangler deploy`
- [ ] Note the deployed URL (e.g., `cafehunt.YOURSUBDOMAIN.workers.dev`)

### Custom Domain Setup
- [ ] In Cloudflare Dashboard: Workers & Pages → cafehunt → Settings → Triggers
- [ ] Add custom domain: `cafehunt.app`
- [ ] Verify DNS records are correct
- [ ] Wait for SSL certificate provisioning (2-5 minutes)
- [ ] Test custom domain: `https://cafehunt.app`

## Post-Deployment Verification

### Functionality Tests
- [ ] Visit `https://cafehunt.app` in browser
- [ ] Grant location permission
- [ ] Verify cafés load within 5 seconds
- [ ] Click on multiple café markers
- [ ] Verify bottom sheet appears with café info
- [ ] Test all action buttons (directions, review, save, share)
- [ ] Write and submit a test review
- [ ] Upload test photos (up to 3)
- [ ] Toggle dark mode and verify theme changes
- [ ] Search for a café by name
- [ ] Toggle list view
- [ ] Click café from list, verify it centers on map

### Mobile Verification
- [ ] Test on iPhone Safari
- [ ] Test on Android Chrome
- [ ] Test "Add to Home Screen" functionality
- [ ] Verify PWA icon and splash screen (if configured)
- [ ] Test offline behavior (should show cached data)

### API & Caching Tests
- [ ] Open browser DevTools Network tab
- [ ] Reload page, note API call to `/api/cafes/nearby`
- [ ] Check response headers for `X-Cache: MISS` (first load)
- [ ] Reload page again, verify `X-Cache: HIT` (cache working)
- [ ] Move map to new location
- [ ] Verify new API call for new location
- [ ] Check that old location data is cached

### Performance Checks
- [ ] Run Lighthouse audit (aim for 90+ on Performance, Best Practices, SEO, Accessibility)
- [ ] Check Core Web Vitals:
  - [ ] LCP (Largest Contentful Paint) < 2.5s
  - [ ] FID (First Input Delay) < 100ms
  - [ ] CLS (Cumulative Layout Shift) < 0.1

## Monitoring Setup

### Cloudflare Workers Analytics
- [ ] Navigate to Workers & Pages → cafehunt → Analytics
- [ ] Bookmark this page for regular monitoring
- [ ] Note baseline metrics (requests, errors, CPU time)
- [ ] Set up email notifications for errors (optional)

### Google Places API Monitoring
- [ ] Open Google Cloud Console → APIs & Services → Dashboard
- [ ] Click on "Places API"
- [ ] Review quota limits
- [ ] Set up billing alerts:
  - [ ] Alert at $5/month
  - [ ] Alert at $10/month
  - [ ] Hard cap at $20/month (adjust as needed)

### Uptime Monitoring (Optional)
- [ ] Set up uptime monitoring with service like:
  - UptimeRobot (free)
  - Pingdom
  - StatusCake
- [ ] Monitor: `https://cafehunt.app`
- [ ] Set alert email for downtime

## Security Hardening

### API Key Security
- [ ] Verify API key is NOT in version control
- [ ] Verify API key restrictions are active in GCP
- [ ] Consider rotating API key every 90 days
- [ ] Use Cloudflare Secrets for production (not hardcoded)

### Worker Security
- [ ] Add rate limiting to worker endpoints (optional but recommended)
- [ ] Add authentication to `/api/cache/clear` endpoint
- [ ] Review CORS headers in worker.js
- [ ] Enable bot protection in Cloudflare (optional)

### SSL/TLS
- [ ] Verify HTTPS is working: `https://cafehunt.app`
- [ ] Check SSL certificate validity
- [ ] Enable HSTS (HTTP Strict Transport Security) in Cloudflare
- [ ] Verify no mixed content warnings

## Documentation

- [ ] Update README.md with actual deployment details
- [ ] Document any custom configurations
- [ ] Create internal documentation for team (if applicable)
- [ ] Save API keys in secure password manager
- [ ] Document emergency contact procedures

## Rollback Plan

In case of issues:
- [ ] Have previous version of `worker.js` saved
- [ ] Know how to rollback: `wrangler rollback`
- [ ] Have database backup strategy (if using Durable Objects later)
- [ ] Document rollback steps

## Launch

### Soft Launch
- [ ] Share link with 5-10 test users
- [ ] Collect feedback
- [ ] Fix any critical bugs
- [ ] Monitor for 24-48 hours

### Public Launch
- [ ] Announce on social media
- [ ] Update askgato.com with link to CafeHunt
- [ ] Monitor for traffic spikes
- [ ] Be ready to scale if needed

## Post-Launch Monitoring (First Week)

Daily checks:
- [ ] Check Cloudflare Workers Analytics (requests, errors)
- [ ] Check Google Places API usage
- [ ] Review any error logs
- [ ] Monitor costs
- [ ] Collect and respond to user feedback

Weekly checks:
- [ ] Review performance metrics
- [ ] Check cache hit rate
- [ ] Review and prioritize feature requests
- [ ] Update documentation as needed

---

## Emergency Contacts

- **Domain Registrar**: _____________
- **Cloudflare Support**: support.cloudflare.com
- **Google Cloud Support**: cloud.google.com/support
- **Developer Contact**: _____________

## Notes

Use this section for deployment-specific notes:

```
Date deployed: _______________
Deployed by: _______________
Version: 1.0.0
Special configurations: _______________
Known issues: _______________
```

---

**Congratulations! 🎉 CafeHunt is now live!**

Don't forget to:
- Share the app with coffee lovers
- Gather user feedback
- Plan for future features
- Monitor and optimize regularly

**Made with ☕ by askgato.com**
