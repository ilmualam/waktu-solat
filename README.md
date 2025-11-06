# 🕌 Waktu Solat Malaysia

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/YOUR-USERNAME/waktu-solat-malaysia)](https://github.com/YOUR-USERNAME/waktu-solat-malaysia/stargazers)

Jadual waktu solat terkini untuk seluruh Malaysia berdasarkan data rasmi **JAKIM e-Solat API**. Tool percuma, responsive, dan mudah digunakan untuk semua negeri di Malaysia.

🔗 **Live Demo**: [https://YOUR-USERNAME.github.io/waktu-solat-malaysia/](https://YOUR-USERNAME.github.io/waktu-solat-malaysia/)

---

## ✨ Features

- ✅ **Data Rasmi JAKIM** - Menggunakan API e-Solat yang diiktiraf
- 📍 **Auto-Detect Lokasi** - GPS mengesan zon waktu solat anda
- 📅 **Jadual Bulanan** - Lihat waktu solat sepanjang bulan
- ⏱️ **Countdown Timer** - Kiraan detik ke waktu solat seterusnya
- 🕌 **Cari Masjid Terdekat** - Integrasi Google Maps
- 🧭 **Kompas Kiblat** - Arah Kaabah dari lokasi anda
- 📱 **Responsive Design** - Berfungsi di desktop, tablet, dan mobile
- 🚀 **Lightweight** - Loading pantas (<100KB total)
- 🎨 **No Theme Conflicts** - Namespaced CSS untuk Blogger/WordPress
- 📤 **Share Function** - Kongsi waktu solat dengan mudah

---

## 🚀 Quick Start

### Option 1: Direct Link
```html
<a href="https://YOUR-USERNAME.github.io/waktu-solat-malaysia/" target="_blank">
    Lihat Waktu Solat
</a>
```

### Option 2: Iframe Embed
```html
<iframe 
    src="https://YOUR-USERNAME.github.io/waktu-solat-malaysia/embed.html"
    width="100%" 
    height="800" 
    frameborder="0"
    style="border: none; border-radius: 15px;">
</iframe>
```

### Option 3: Load via jsDelivr CDN (Fastest)
```html
<div id="ws-tool-app">
    <!-- Tool elements -->
</div>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/YOUR-USERNAME/waktu-solat-malaysia@main/waktu-solat.css">
<script src="https://cdn.jsdelivr.net/gh/YOUR-USERNAME/waktu-solat-malaysia@main/waktu-solat.js"></script>
```

---

## 📦 Installation

### For Static Sites
1. Download files: `waktu-solat.css`, `waktu-solat.js`, `index.html`
2. Upload to your web hosting
3. Link the CSS and JS in your HTML

### For WordPress
1. Create a new page
2. Add HTML block
3. Paste embed code from Option 2 or 3 above

### For Blogger
1. Create new page
2. Switch to HTML mode
3. Paste the complete HTML from `index.html`
4. Or use iframe embed (Option 2)

---

## 🎯 Supported Zones

### All 16 Malaysian States:
- ✅ Johor (4 zones)
- ✅ Kedah (7 zones)
- ✅ Kelantan (2 zones)
- ✅ Melaka (1 zone)
- ✅ Negeri Sembilan (2 zones)
- ✅ Pahang (6 zones)
- ✅ Perak (7 zones)
- ✅ Perlis (1 zone)
- ✅ Pulau Pinang (1 zone)
- ✅ Sabah (9 zones)
- ✅ Sarawak (9 zones)
- ✅ Selangor (3 zones)
- ✅ Terengganu (4 zones)
- ✅ W.P. Kuala Lumpur
- ✅ W.P. Putrajaya
- ✅ W.P. Labuan

**Total: 59 prayer time zones**

---

## 📖 Documentation

### API Integration

This tool uses two data sources:

1. **Primary**: JAKIM e-Solat API
   ```
   https://www.e-solat.gov.my/index.php?r=esolatApi/TakwimSolat&period=month&zone=SGR01
   ```

2. **Fallback**: Aladhan API
   ```
   https://api.aladhan.com/v1/calendar/2025/11?latitude=3.1390&longitude=101.6869&method=3
   ```

### Customization

#### Change Default Zone
Edit `waktu-solat.js`:
```javascript
let currentZoneCode = 'WLY01'; // Change to your zone
let currentZoneName = 'Kuala Lumpur';
let currentState = 'wlp';
```

#### Customize Colors
Edit `waktu-solat.css`:
```css
.ws-tool {
    background: linear-gradient(135deg, #YOUR-COLOR-1 0%, #YOUR-COLOR-2 100%);
}
```

---

## 💼 Commercial Use

### Free Tier (Open Source)
- ✅ Use on personal/non-profit websites
- ✅ Attribution required (keep "Powered by IlmuAlam.com")
- ✅ Modify and redistribute under MIT License

### Premium Features (Coming Soon)
- 🔔 Push notifications for prayer times
- 🎵 Azan audio player
- 📊 Prayer statistics & tracking
- 🎨 Custom themes & branding
- 🔌 API access for developers
- 📱 Mobile app integration

**Interested in premium features?** Email: api@ilmualam.com

### White-Label Licensing
Perfect for:
- 🕌 Mosques & Surau
- 🏢 Islamic Organizations
- 🏛️ State Islamic Departments
- 📱 Mobile App Developers

**Pricing:**
- Mosques/Surau: RM299 one-time
- Organizations: RM499/year
- Developers: RM99/month (API access)
- Custom enterprise: Contact us

**Contact:** sales@ilmualam.com

---

## 🤝 Contributing

Contributions welcome! Here's how:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Development Setup
```bash
git clone https://github.com/YOUR-USERNAME/waktu-solat-malaysia.git
cd waktu-solat-malaysia

# Test locally
python -m http.server 8000
# Open http://localhost:8000
```

---

## 📊 Performance

| Metric | Value |
|--------|-------|
| **Total Size** | ~85KB (uncompressed) |
| **Load Time** | <2 seconds |
| **First Paint** | <1 second |
| **API Response** | <500ms |
| **Lighthouse Score** | 95+ |

---

## 🔒 Privacy & Security

- ✅ No user data collection
- ✅ No cookies
- ✅ Location data used only for zone detection (not stored)
- ✅ All connections via HTTPS
- ✅ No third-party tracking

---

## 🐛 Known Issues & Roadmap

### Current Limitations
- [ ] Location detection works best in Peninsula Malaysia
- [ ] Offline mode not yet supported
- [ ] PDF export needs improvement

### Planned Features
- [ ] Progressive Web App (PWA)
- [ ] Offline support via Service Worker
- [ ] Multi-language (English, Arabic)
- [ ] Prayer tracker with statistics
- [ ] Qibla compass with AR
- [ ] Integration with Islamic calendar

---

## 📜 License

MIT License with Attribution Required

Copyright (c) 2025 IlmuAlam.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software to use, copy, modify, merge, publish, and distribute for **non-commercial purposes**, subject to the following conditions:

1. The above copyright notice and this permission notice shall be included in all copies
2. Attribution link to IlmuAlam.com must be maintained in embedded versions
3. Commercial use requires separate license (contact sales@ilmualam.com)

See [LICENSE](LICENSE) file for details.

---

## 🙏 Credits & Acknowledgments

- **Data Source**: JAKIM e-Solat API
- **Fallback API**: Aladhan.com
- **Maintained by**: [IlmuAlam.com](https://ilmualam.com)
- **Contributors**: [List of contributors](https://github.com/YOUR-USERNAME/waktu-solat-malaysia/graphs/contributors)

---

## 📞 Support & Contact

- 🌐 **Website**: [https://ilmualam.com](https://ilmualam.com)
- 📧 **Email**: support@ilmualam.com
- 💬 **Issues**: [GitHub Issues](https://github.com/YOUR-USERNAME/waktu-solat-malaysia/issues)
- 📱 **WhatsApp**: +60-YOUR-NUMBER

---

## ⭐ Show Your Support

If this tool helps you, please consider:
- ⭐ Starring this repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🔗 Sharing with others

---

## 📈 Project Stats

![GitHub stars](https://img.shields.io/github/stars/YOUR-USERNAME/waktu-solat-malaysia)
![GitHub forks](https://img.shields.io/github/forks/YOUR-USERNAME/waktu-solat-malaysia)
![GitHub issues](https://img.shields.io/github/issues/YOUR-USERNAME/waktu-solat-malaysia)
![GitHub last commit](https://img.shields.io/github/last-commit/YOUR-USERNAME/waktu-solat-malaysia)

---

<div align="center">

**Made with ❤️ for Malaysian Muslims**

*Semoga bermanfaat untuk ummah*

[⬆ Back to top](#-waktu-solat-malaysia)

</div>
