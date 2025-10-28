# GGTorrents - Quick Start Guide

Welcome to GGTorrents! Follow these simple steps to get started.

## Installation

### Step 1: Run the Installation Script

Open a terminal in this directory and run:

```bash
./install.sh
```

This script will:
- Install Node.js if not already installed (requires sudo)
- Install all dependencies
- Build the application
- Set up desktop integration
- Create a launcher icon in your application menu

### Step 2: Launch the Application

After installation, you can launch GGTorrents in two ways:

1. **From Application Menu**: Search for "GGTorrents" in your application launcher
2. **From Terminal**: Run `./ggtorrents` from this directory

## First Time Setup

When you first launch GGTorrents:

1. Click the **Settings** icon (gear icon in the top right)
2. Configure your preferred download location
3. Set bandwidth limits if needed
4. Adjust connection settings (optional)

## Adding Your First Torrent

### Method 1: Magnet Link
1. Click the **"Add Torrent"** button
2. Paste your magnet link
3. Click **"Add from Magnet Link"**

### Method 2: Torrent File
1. Click the **"Add Torrent"** button
2. Click **"Choose Torrent File"**
3. Select your .torrent file

## Managing Torrents

- **Pause/Resume**: Click the pause or play button
- **Remove**: Click the trash icon
- **View Details**: Click on any torrent to see files and statistics
- **Open Folder**: Click the folder icon to open the download location

## Features Overview

### Main Screen
- **Torrents List**: View all your active and completed torrents
- **Speed Monitor**: Real-time download/upload speeds in the header
- **Progress Bars**: Visual progress for each torrent

### Torrent Details (Right Panel)
- **General Info**: Size, speeds, peers, ratio
- **File List**: Select/deselect individual files
- **Magnet Link**: Copy for sharing

### Statistics Tab
- **Speed Graphs**: Monitor download and upload speeds
- **Transfer Stats**: Total downloaded, uploaded, and ratio
- **Session Info**: Active torrents, completed torrents

### Settings
- **Downloads**: Configure save location and auto-start
- **Bandwidth**: Set upload/download limits
- **Connection**: Port, max connections, DHT, PEX

## System Tray

GGTorrents runs in the system tray when you close the window:
- Click the tray icon to show/hide the window
- Right-click for quick options

## Tips

1. **Seeding**: Keep completed torrents running to share with others
2. **Ratio**: Try to maintain a good upload/download ratio (>1.0)
3. **Bandwidth**: Set limits if you need bandwidth for other tasks
4. **DHT**: Enable for better peer discovery on public torrents

## Keyboard Shortcuts

- `Ctrl+O`: Add torrent (coming soon)
- `Ctrl+,`: Open settings (coming soon)
- `Delete`: Remove selected torrent (coming soon)

## Troubleshooting

### Torrents won't start downloading
- Check your firewall settings
- Ensure the configured port is open
- Verify DHT is enabled in settings

### Slow download speeds
- Increase max connections in settings
- Check your bandwidth limits
- Ensure you have good internet connectivity

### Application won't launch
```bash
# Check if dependencies are installed
npm install

# Rebuild the application
npm run build

# Try running in development mode
npm run dev
```

## Uninstallation

To remove GGTorrents from your system:

```bash
./uninstall.sh
```

## Need Help?

- Check the main README.md for detailed documentation
- Review your settings for proper configuration
- Ensure all dependencies are installed

---

Happy torrenting!
