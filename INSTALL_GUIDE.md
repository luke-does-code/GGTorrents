# GGTorrents Installation Guide

## Prerequisites Check

Before installing, make sure you have:
- Ubuntu 20.04 or later
- Terminal access
- Internet connection

## Installation Steps

### Step 1: Open Terminal

Navigate to the GGTorrents directory:

```bash
cd path/to/GGTorrents
```

### Step 2: Run Installation Script

Execute the installation script:

```bash
./install.sh
```

**What this does:**
- ✅ Checks for Node.js (installs if needed - may require password)
- ✅ Installs all dependencies (npm packages)
- ✅ Builds the application
- ✅ Compiles TypeScript code
- ✅ Sets up desktop integration
- ✅ Creates application launcher

**Note:** If prompted for your password, it's to install Node.js system-wide.

### Step 3: Launch the Application

After successful installation, launch GGTorrents:

**Option A - From Application Menu:**
1. Press `Super` key (Windows key)
2. Type "GGTorrents"
3. Click the GGTorrents icon

**Option B - From Terminal:**
```bash
./ggtorrents
```

## First Launch

When GGTorrents opens for the first time:

1. **Set Download Location**
   - Click the Settings icon (top right)
   - Click "Browse" next to Download Location
   - Choose your preferred folder
   - Click "Save Settings"

2. **Ready to Download!**
   - Click "+ Add Torrent"
   - Paste a magnet link or choose a .torrent file
   - Watch your download start!

## Troubleshooting

### "Node.js not found"
```bash
# Install Node.js manually
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### "Permission denied"
```bash
# Make scripts executable
chmod +x install.sh uninstall.sh ggtorrents
```

### "npm: command not found"
```bash
# Install npm
sudo apt-get update
sudo apt-get install -y npm
```

### Build Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Verification

To verify installation was successful:

1. Check if launcher exists:
   ```bash
   ls ~/.local/share/applications/ggtorrents.desktop
   ```

2. Check if build completed:
   ```bash
   ls dist/main.js dist/renderer/
   ```

3. Test launch:
   ```bash
   ./ggtorrents
   ```

## What Gets Installed

### Application Files
- **Location**: Your installation directory
- **Size**: ~150-200 MB (with dependencies)
- **Components**:
  - Electron framework
  - React libraries
  - WebTorrent engine
  - UI components

### System Integration
- **Desktop Entry**: `~/.local/share/applications/ggtorrents.desktop`
- **Icon**: `assets/icon.png`
- **Launcher**: `ggtorrents` (executable script)

### User Data
- **Settings**: `~/.config/ggtorrents/settings.json`
- **Downloads**: `~/Downloads/GGTorrents/` (default, customizable)

## Updating

To update GGTorrents in the future:

```bash
cd path/to/GGTorrents
git pull
npm install
npm run build
```

## Uninstalling

To remove GGTorrents:

```bash
./uninstall.sh
```

To completely remove including the application folder:

```bash
./uninstall.sh
cd .. && rm -rf GGTorrents
```

To remove downloaded files and settings:

```bash
rm -rf ~/.config/ggtorrents
rm -rf ~/Downloads/GGTorrents
```

## Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review `README.md` for detailed documentation
3. Check `QUICKSTART.md` for usage tips
4. Verify all prerequisites are met

## Quick Commands Reference

```bash
# Install
./install.sh

# Run
./ggtorrents

# Development mode (with hot reload)
npm run dev

# Build only
npm run build

# Package (create .deb and AppImage)
npm run package

# Uninstall
./uninstall.sh
```

---

## Installation Complete

Once installed, GGTorrents will be available in your application menu.

For usage instructions, see `QUICKSTART.md` or `README.md`.
