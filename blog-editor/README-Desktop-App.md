# Blog Editor Desktop Application

This blog editor can now be run as a desktop application that automatically handles the server lifecycle.

## 🚀 Quick Start

### Option 1: Double-click Launcher (Recommended)

**macOS:**
- Double-click `Blog-Editor-macOS.command`
- First time: You may need to right-click → "Open" to bypass Gatekeeper

**Linux:**
- Double-click `Blog-Editor.sh`

**Windows:**
- Double-click `Blog-Editor.bat`

The launcher will:
- ✅ Check for Node.js installation
- 📦 Install dependencies if needed (first time only)
- 🚀 Start the server automatically
- 🖥️ Open the blog editor in a dedicated window
- 🔄 Close the server when you close the window

### Option 2: Command Line

```bash
# Install dependencies (first time only)
npm install

# Run the desktop app
npm run electron
# or
npm run app
```

### Option 3: Web Browser (Original Method)

```bash
# Start server manually
npm start

# Open http://localhost:3000 in your browser
```

## 📦 Creating Distributable Applications

To create installer packages that users can install without Node.js:

### Build All Platforms
```bash
# Install build dependencies
npm install

# Build for all platforms
./build-distributables.sh
```

### Build Specific Platforms
```bash
# macOS (DMG and ZIP)
npm run build:mac

# Windows (NSIS Installer and Portable)
npm run build:win

# Linux (AppImage and DEB)
npm run build:linux
```

**Generated Files** (in `dist/` folder):
- **macOS**: `Blog Editor.dmg`, `Blog Editor.app.zip`
- **Windows**: `Blog Editor Setup.exe`, `Blog Editor Portable.exe`
- **Linux**: `Blog Editor.AppImage`, `blog-editor.deb`

## Features

- **Automatic Server Management**: No need to manually start/stop the server
- **Dedicated Window**: Runs in its own application window
- **Auto-cleanup**: Server automatically stops when you close the window
- **External Links**: Links open in your default browser
- **Cross-platform**: Works on Windows, Mac, and Linux

## Generated Files

Generated HTML files are saved to:
- `../research/articles/` (for publication)
- Local preview in the application

## Development

To modify the desktop app behavior, edit `electron-main.js`.

To modify the web interface, edit files in the `public/` directory.

## 🛠️ Troubleshooting

### App Won't Start
1. **Install Node.js**: Download from [nodejs.org](https://nodejs.org/)
2. **Install Dependencies**: Run `npm install` in the blog-editor directory
3. **Check Errors**: Run `npm run electron` from terminal to see error messages

### macOS Specific Issues
- **"Cannot open because it is from an unidentified developer"**:
  - Right-click the `.command` file → "Open" → "Open" again
  - Or in System Preferences → Security & Privacy → "Allow anyway"

### Port Already in Use
- Close any other instances of the blog editor
- Wait a few seconds and try again
- Check if another app is using port 3000

### Build Issues
- Make sure you have the latest Node.js version
- Clear node_modules: `rm -rf node_modules && npm install`
- For macOS builds: Xcode Command Line Tools required (`xcode-select --install`)

## ⚙️ Advanced Configuration

### Custom Port
Edit `server.js` to change the default port (3000):
```javascript
const PORT = 3001; // Change this line
```

### Custom Window Size
Edit `electron-main.js` to change window dimensions:
```javascript
mainWindow = new BrowserWindow({
  width: 1400,  // Change width
  height: 900,  // Change height
  // ...
});
```