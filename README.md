# Custom Start Page Chrome Extension

A beautiful, customizable Chrome extension that replaces the new tab page with a modern glassmorphism interface featuring grouped links, theme switching, and comprehensive customization options.

## ✨ Features

### 🎨 **Modern Interface**
- **Glassmorphism Design**: Beautiful frosted glass effect with backdrop blur
- **Dark/Light Mode**: Toggle between professional dark and vibrant light themes
- **12 Color Presets**: Professional themes including Ocean, Forest, Sunset, Mint, and more
- **Custom Color Settings**: Full control over gradients, opacity, and text colors
- **Responsive Grid Layout**: Adapts perfectly to different screen sizes

### 📱 **Smart Organization**
- **Group Management**: Organize links into custom groups with box-like containers
- **Compact Link Display**: Space-efficient layout with text-width optimization
- **Accordion Menu**: Clean pull-down menu for all actions
- **Centered Layout**: Professional, balanced appearance

### 🔧 **Powerful Features**
- **Import/Export Data**: Backup and restore your complete configuration in JSON format
- **Chrome Sync**: Automatic synchronization across all your devices
- **Fetched Icons**: Automatically fetches website favicons
- **Quick Actions**: Add links, groups, and manage settings from the interface
- **Delete Functionality**: Remove links and groups with confirmation dialogs

### 🎯 **User Experience**
- **90% Container Size**: Clean, non-overwhelming interface
- **Smooth Animations**: Professional transitions and hover effects
- **Text Truncation**: Smart handling of long link names
- **Notification System**: Success/error messages for user feedback

## 🚀 Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension will now replace your new tab page

## 📖 Usage

### Getting Started

1. **Open the Menu**: Click the ☰ menu button in the top-left
2. **Add Groups**: Click "G Add Group" to create link categories
3. **Add Links**: Click "+ Add Link" to add bookmarks to groups
4. **Customize**: Click "🎨 Color Settings" to personalize appearance
5. **Switch Themes**: Click "🌙 Dark Mode" to toggle between themes

### Menu Options

- **+ Add Link**: Quickly add new bookmarks
- **G Add Group**: Create new link categories
- **🎨 Color Settings**: Access 12 preset themes and custom colors
- **🌙 Dark Mode**: Toggle between dark and light themes
- **📤 Export Data**: Download backup of your links and settings
- **📥 Import Data**: Restore from a backup file

### Managing Content

- **Edit Links**: Click any link to edit name, URL, or group
- **Delete Links**: Remove individual links with confirmation
- **Delete Groups**: Remove groups and all their links
- **Color Customization**: Adjust background gradients, glass opacity, and text colors

## 🎨 Theme Options

### Dark Mode Themes
- **Dark Professional**: Blue-gray corporate theme
- **Dark Minimal**: Pure black simplicity
- **Dark Ocean**: Deep sea blues
- **Dark Forest**: Natural green depths
- **Dark Sunset**: Warm evening colors
- **Dark Midnight**: Deep space vibes

### Light Mode Themes
- **Light Vibrant**: Rainbow energy
- **Light Soft**: Gentle pastels
- **Light Coral**: Warm coral tones
- **Light Mint**: Fresh green vibes
- **Light Lavender**: Soft purple dreams
- **Light Peach**: Warm sunset tones

## 📁 File Structure

```
chrome-start-page-extension/
├── manifest.json       # Extension configuration
├── newtab.html         # Main new tab page
├── newtab.js          # Core functionality and styling
├── styles.css         # Legacy styles (minimal usage)
├── icons/             # Extension icons folder
└── README.md          # This documentation
```

## 🔐 Permissions

- `storage`: Save groups, links, themes, and settings with Chrome Sync
- `favicon`: Fetch website favicons for visual appeal
- `tabs`: Refresh interface when settings change
- `host_permissions`: Access favicon URLs from any website

## 💾 Data Management

### Chrome Sync Storage
All data automatically syncs across devices where you're signed into Chrome:
- **Groups & Links**: Your bookmark organization
- **Theme Preferences**: Dark/light mode and custom colors
- **Color Settings**: All custom gradients and opacity settings
- **Automatic Sync**: Changes appear on all devices instantly

### Backup & Restore
- **Export**: Download complete configuration as JSON file
- **Import**: Restore from backup with confirmation dialog
- **Data Validation**: Ensures backup file integrity
- **Cross-Platform**: Share configurations between devices

## 🎛️ Customization

### Color Settings
Access advanced customization through the 🎨 Color Settings menu:
- **Background Gradients**: Custom CSS gradients
- **Glass Opacity**: Adjust transparency (0.1 - 0.9)
- **Glass Background**: RGBA color for glass elements
- **Text Color**: Optimize readability for your theme

### Preset Themes
Choose from 12 professionally designed themes or create your own:
- One-click theme application
- Optimized color combinations
- Glassmorphism effects
- Professional appearance

## 🛠️ Development

Built with modern web technologies:
- **Vanilla JavaScript ES6+**: Clean, efficient code
- **Chrome Extension API v3**: Latest extension standards
- **CSS Grid & Flexbox**: Responsive, modern layouts
- **Glassmorphism Design**: Contemporary UI trends
- **Chrome Sync Storage**: Reliable data persistence

## 📋 System Requirements

- Chrome 88+ (Manifest V3 support)
- Signed into Google Account (for sync features)
- Minimum screen resolution: 1024x768 recommended

## 📄 License

MIT License - feel free to modify and distribute as needed.

---

**Enjoy your beautiful, customized start page!** 🚀
