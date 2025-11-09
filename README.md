# 💱 Currency Converter by Goosendorf

A professional currency converter application available in both **Desktop** and **Mobile Web** versions.

## 🌐 **Live Mobile Web App**
**Try it now**: **https://goosendorf.github.io/Goose-Currency-Converter/**

- 📱 **Mobile-optimized** responsive design
- 🏠 **Install to home screen** (PWA)
- 🔄 **Real-time rates** from live APIs
- 🎨 **Three themes**: Light ☀️, Dark 🌙, Matrix 🟢

## 🖥️ **Desktop Application**
- **Windows .exe**: `Currency-Converter-v2.3-Windows-x64.zip` (136 MB)
- 🪟 **Semi-transparent** draggable window
- 📌 **Always-on-top** functionality
- 🎯 **Frameless design** with custom controls

---

## ✨ **Core Features**

### 💰 **13 Currencies Supported**
- **Fiat**: AED, AUD, CAD, CHF, CNY, EUR, GBP, INR, JPY, USD, ZAR
- **Crypto**: BTC (Bitcoin), SAT (Satoshis)

### 🔧 **Advanced Functionality**
- ⭐ **Favorites System** - Star your most-used currencies
- 📋 **Click-to-Copy** - One-click copying of converted amounts
- 🎨 **Theme Switching** - Light, Dark, and Matrix themes
- 💾 **Persistent Settings** - Remembers your preferences
- 🔄 **Auto-refresh** - Updates rates every 5 minutes

### 📊 **Live Data Sources**
- **ExchangeRate-API**: Real-time fiat currency rates
- **CoinGecko**: Live Bitcoin pricing (~$102K+ USD)

---

## 🚀 **Quick Start**

### Mobile/Web Version:
1. Visit: https://goosendorf.github.io/Goose-Currency-Converter/
2. Add to home screen for app-like experience
3. Select currency and enter amount - instant conversion!

### Desktop Version:
1. Download `Currency-Converter-v2.3-Windows-x64.zip`
2. Extract and run the `.exe` file
3. Enjoy the transparent, draggable desktop experience

---

## 🎯 **Version Status**

### 🎉 **v1.0.0-pwa** - PWA Milestone ✅
- **Complete mobile web app** with all features
- **Live deployment** on GitHub Pages
- **Professional PWA** with offline capability

### 🖥️ **v2.3** - Desktop Complete ✅
- **Perfect desktop application** with Electron
- **All features implemented** and polished
- **Standalone .exe** distribution ready

---

## 🛠️ **Technical Stack**

### **Frontend**
- **HTML5/CSS3** with glass-morphism design
- **Vanilla JavaScript** - modular architecture
- **Progressive Web App** - service worker, manifest

### **Desktop Framework**
- **Electron** for native Windows application
- **Custom window controls** and transparency
- **IPC communication** between main/renderer

### **APIs & Data**
- **ExchangeRate-API** - Fiat currency rates
- **CoinGecko** - Cryptocurrency pricing
- **localStorage** - Client-side persistence

---

## 🏗️ **Project Structure**

```
├── index.html              # Main UI structure
├── web-renderer.js         # Web-compatible main logic
├── renderer.js             # Desktop Electron logic
├── main.js                 # Electron main process
├── styles.css              # Complete styling + themes
├── manifest.json           # PWA configuration
├── service-worker.js       # Offline functionality
├── add_stars.js           # Star button functionality
├── favorites.js           # Favorites management
├── click_to_copy.js       # Copy-to-clipboard feature
├── theme_toggle.js        # Theme switching system
└── backups/               # Version history backups
```

---

## 🎨 **Themes Preview**

### ☀️ **Light Theme**
- Clean white background with blue accents
- Original glass-morphism transparency
- Professional business look

### 🌙 **Dark Theme** 
- Dark backgrounds with light text
- Modern dark mode aesthetics
- Easy on the eyes

### 🟢 **Matrix Theme**
- Black background with green text
- Monospace "Courier New" font
- Glowing Matrix movie-style effects

---

## 👨‍💻 **Developer: Goosendorf**

**Signature**: "Goosendorf, 2025" (appears in app with theme-adaptive styling)

### 📈 **Project Stats**
- **Development Time**: ~12 hours
- **Features**: 25+ implemented
- **File Architecture**: 8+ modular components
- **Supported Platforms**: Web, Windows Desktop
- **API Integrations**: 2 live data sources

---

## 📋 **License & Usage**

This project is open source. Feel free to use, modify, and distribute.

**Attribution**: Built by Goosendorf using modern web technologies and Electron framework.

---

## 🔗 **Links**

- **🌐 Live Web App**: https://goosendorf.github.io/Goose-Currency-Converter/
- **📦 Repository**: https://github.com/Goosendorf/Goose-Currency-Converter
- **📄 Version History**: See `VERSION.md` for detailed changelog

---

*Built with ❤️ and modern web technologies*
