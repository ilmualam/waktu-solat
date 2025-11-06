# Waktu Solat Malaysia - GitHub Deployment Guide

## REPOSITORY STRUCTURE

```
waktu-solat-malaysia/
├── index.html                 # Main tool (standalone)
├── embed.html                 # Embeddable version (iframe-friendly)
├── js/
│   ├── waktu-solat.js        # Core JavaScript (extracted)
│   └── waktu-solat.min.js    # Minified version
├── css/
│   ├── waktu-solat.css       # Core styles (extracted)
│   └── waktu-solat.min.css   # Minified version
├── premium/
│   ├── azan-player.js        # Premium feature (paywalled)
│   └── qibla-compass.js      # Premium feature (paywalled)
├── docs/
│   ├── api.md                # API documentation
│   └── integration.md        # Integration guide
├── LICENSE
└── README.md
```

## STEP 1: CREATE REPOSITORY

1. Go to github.com/new
2. Repository name: `waktu-solat-malaysia`
3. Description: "Waktu Solat Malaysia - Jadual Waktu Sembahyang Tepat & Rasmi JAKIM"
4. Public repository (for free GitHub Pages)
5. Add README.md

## STEP 2: ENABLE GITHUB PAGES

1. Go to Settings > Pages
2. Source: Deploy from branch
3. Branch: main / root
4. Custom domain: solat.ilmualam.com (optional)
5. Enforce HTTPS: ✓ enabled

## STEP 3: FILE PREPARATION

### A. Split HTML into Modular Components

**index.html** (standalone page):
```html
<!DOCTYPE html>
<html lang="ms">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Waktu Solat Malaysia - JAKIM</title>
    <link rel="stylesheet" href="css/waktu-solat.min.css">
</head>
<body>
    <div class="ws-tool" id="ws-tool-app">
        <!-- Content here -->
    </div>
    <script src="js/waktu-solat.min.js"></script>
</body>
</html>
```

**embed.html** (for iframe embedding):
```html
<!DOCTYPE html>
<html lang="ms">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/waktu-solat.min.css">
    <style>
        body { margin: 0; padding: 0; background: transparent; }
    </style>
</head>
<body>
    <div class="ws-tool" id="ws-tool-app"></div>
    <script src="js/waktu-solat.min.js"></script>
</body>
</html>
```

## STEP 4: USAGE ON YOUR BLOGGER SITE

### Method 1: Direct Link
```html
<a href="https://YOUR-USERNAME.github.io/waktu-solat-malaysia/" 
   target="_blank" class="btn-primary">
   Lihat Waktu Solat
</a>
```

### Method 2: Iframe Embed
```html
<iframe 
    src="https://YOUR-USERNAME.github.io/waktu-solat-malaysia/embed.html"
    width="100%" 
    height="800" 
    frameborder="0"
    style="border: none; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
</iframe>
```

### Method 3: Load Scripts Directly (FASTEST)
```html
<!-- On your Blogger page -->
<div id="waktu-solat-container"></div>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/YOUR-USERNAME/waktu-solat-malaysia@main/css/waktu-solat.min.css">
<script src="https://cdn.jsdelivr.net/gh/YOUR-USERNAME/waktu-solat-malaysia@main/js/waktu-solat.min.js"></script>
```

**Note:** jsDelivr CDN auto-caches and serves from nearest location = FASTER than GitHub Pages

## STEP 5: MONETIZATION SETUP

### Free Tier (GitHub)
- Basic prayer times
- Zone selection
- Monthly schedule

### Premium Tier (Your Server)
Add in `js/waktu-solat.js`:
```javascript
const PREMIUM_FEATURES = {
    azanPlayer: false,
    qiblaCompass: false,
    customNotifications: false,
    apiAccess: false
};

// Check if user has premium access
async function checkPremiumStatus() {
    try {
        const response = await fetch('https://api.ilmualam.com/check-premium', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('userToken')}`
            }
        });
        const data = await response.json();
        
        if (data.isPremium) {
            PREMIUM_FEATURES.azanPlayer = true;
            PREMIUM_FEATURES.qiblaCompass = true;
            // Load premium modules
            loadPremiumFeatures();
        } else {
            showUpgradePrompt();
        }
    } catch (error) {
        // Free tier only
    }
}
```

## STEP 6: UPDATE WORKFLOW

```bash
# Local development
git clone https://github.com/YOUR-USERNAME/waktu-solat-malaysia.git
cd waktu-solat-malaysia

# Make changes to files
nano js/waktu-solat.js

# Minify (use online tools or install terser)
npx terser js/waktu-solat.js -o js/waktu-solat.min.js -c -m

# Commit and push
git add .
git commit -m "Update: improved JAKIM API handling"
git push origin main
```

**Result:** All sites using your tool auto-update within 24 hours (jsDelivr cache)

## STEP 7: LICENSING & CREDIBILITY

### LICENSE File
```
MIT License with Attribution Required

Copyright (c) 2025 IlmuAlam.com

Permission is granted to use this software for free with attribution.
Commercial use requires license: https://ilmualam.com/license

Premium features require separate license.
```

### README.md (Critical for SEO + Backlinks)
```markdown
# 🕌 Waktu Solat Malaysia

Jadual waktu solat terkini untuk seluruh Malaysia berdasarkan data rasmi JAKIM.

## Features
- ✅ Real-time prayer times from JAKIM e-Solat API
- 📍 Auto-detect location (GPS)
- 📅 Monthly prayer schedule
- 🕌 Find nearby mosques
- 🧭 Qibla direction compass

## Usage

### Embed on Your Website
```html
<iframe src="https://YOUR-USERNAME.github.io/waktu-solat-malaysia/embed.html" 
        width="100%" height="800"></iframe>
```

### API Access (Premium)
Contact: api@ilmualam.com

## License
MIT with attribution required

## Support
Website: https://ilmualam.com
Email: support@ilmualam.com
```

## STEP 8: PROMOTION STRATEGY

### A. GitHub Ecosystem (FREE Traffic)
1. Add topics: `waktu-solat`, `malaysia`, `islamic`, `jakim`, `prayer-times`
2. Star your own repo (looks more credible)
3. Submit to Awesome Lists:
   - awesome-islam
   - awesome-malaysia
   - awesome-open-source

### B. Developer Community
1. Post on Reddit: r/malaysia, r/islam, r/webdev
2. Share on Dev.to with tutorial
3. Hacker News (if trending = 50k+ views)

### C. Backlink Strategy
Message to mosque websites:
"Hi, saya bina tool waktu solat percuma yang boleh embed di website masjid. 
Link GitHub: [link]. Boleh credit IlmuAlam.com?"

**Target:** 20-30 mosque websites = 20-30 quality backlinks

## STEP 9: ANALYTICS SETUP

Add to `index.html` and `embed.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Track:
- Page views
- Zone selections
- Location detections
- Premium upgrade clicks

## STEP 10: WHITE-LABEL SALES

Create `custom/README.md`:
```markdown
# Custom Branded Versions

We offer white-label versions for:
- Mosques: RM299 one-time
- Islamic organizations: RM499/year
- State Islamic departments: RM2,999/year

Includes:
- Custom branding (logo, colors)
- Custom domain
- Priority support
- Premium features included

Contact: sales@ilmualam.com
```

---

## REVENUE PROJECTIONS

### Free Tier (GitHub)
- 50,000 users/month
- 0% direct revenue
- 100% brand awareness
- Backlinks = SEO value = ~RM5,000/month equivalent

### Premium Conversion (2%)
- 1,000 paying users x RM9.90/month = RM9,900/month
- Year 1 conservative: RM5,000/month average

### White-Label Sales
- 10 mosques x RM299 = RM2,990
- 5 organizations x RM499/year = RM2,495/year

**Total Potential Year 1:** RM60,000 - RM120,000

---

## TECHNICAL OPTIMIZATION

### A. Minification (CRITICAL)
Use online tools:
- CSS: https://cssminifier.com/
- JS: https://javascript-minifier.com/

Size reduction: 60-70% = faster loading

### B. Cache Strategy
Add to jsDelivr URL:
```html
<!-- Caches for 7 days -->
<script src="https://cdn.jsdelivr.net/gh/USER/repo@main/js/waktu-solat.min.js"></script>

<!-- Specific version (immutable cache) -->
<script src="https://cdn.jsdelivr.net/gh/USER/repo@v1.0.0/js/waktu-solat.min.js"></script>
```

### C. Progressive Enhancement
```javascript
// Check if running on your domain vs embedded
const isEmbedded = window.self !== window.top;
const isDevelopment = window.location.hostname === 'localhost';
const isProduction = window.location.hostname.includes('ilmualam.com');

if (isProduction) {
    // Show premium upgrade CTA
    showPremiumBanner();
} else if (isEmbedded) {
    // Show "Powered by IlmuAlam.com" footer
    showAttribution();
}
```

---

## NEXT STEPS PRIORITY

1. ✅ Extract CSS/JS from HTML (1 hour)
2. ✅ Create GitHub repository (15 min)
3. ✅ Enable GitHub Pages (5 min)
4. ✅ Test embed on test blog (30 min)
5. ✅ Deploy to ilmualam.com (15 min)
6. ⏭️ Create premium features (1 week)
7. ⏭️ Set up payment gateway (3 hours)
8. ⏭️ Outreach to 50 mosques (ongoing)

**Timeline to First Revenue:** 2-4 weeks
