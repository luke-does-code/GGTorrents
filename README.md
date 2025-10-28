# GGTorrents

A modern, fully-featured BitTorrent client for Ubuntu Desktop with a beautiful user interface.

![GGTorrents](assets/icon.svg)

## Features

- **Full BitTorrent Support**: Download and seed torrents using the WebTorrent protocol
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **Torrent Management**: Add, pause, resume, and remove torrents with ease
- **File Selection**: Choose which files to download from multi-file torrents
- **Statistics Dashboard**: Monitor your download/upload speeds and overall stats
- **Customizable Settings**: Configure download location, bandwidth limits, and more
- **System Tray Integration**: Minimize to tray and keep torrenting in the background
- **Desktop Integration**: Launch from your application menu and handle magnet links

## Installation

### Prerequisites

- Ubuntu 20.04 or later
- Node.js 18+ (will be installed automatically if not present)

### Quick Install

1. Navigate to the GGTorrents directory:
   ```bash
   cd path/to/GGTorrents
   ```

2. Run the installation script:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

3. Launch GGTorrents from your application menu or run:
   ```bash
   ./ggtorrents
   ```

## Development

### Running in Development Mode

```bash
npm install
npm run dev
```

This will start the application with hot-reload enabled.

### Building for Production

```bash
npm run build
npm start
```

### Packaging

To create distributable packages (AppImage and .deb):

```bash
npm run package
```

The packages will be available in the `release` directory.

## Usage

### Adding Torrents

- **Magnet Link**: Click "Add Torrent" and paste a magnet link
- **Torrent File**: Click "Add Torrent" and select a .torrent file
- **Drag & Drop**: Drag torrent files directly into the application (coming soon)

### Managing Torrents

- **Pause/Resume**: Click the pause/play button on any torrent
- **Remove**: Click the trash icon to remove a torrent (choose whether to delete files)
- **View Details**: Click on a torrent to see detailed information and file list
- **Open Location**: Click the folder icon to open the download location

### Settings

Access settings from the header to configure:

- **Download Location**: Choose where torrents are saved
- **Bandwidth Limits**: Set upload/download speed limits
- **Connection Settings**: Configure port and max connections
- **DHT & PEX**: Enable/disable distributed hash table and peer exchange

## Uninstallation

To remove GGTorrents from your system:

```bash
./uninstall.sh
```

To completely remove all files including the application directory:

```bash
./uninstall.sh
cd .. && rm -rf GGTorrents
```

## Technology Stack

- **Electron**: Cross-platform desktop framework
- **React**: UI library
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **WebTorrent**: Streaming torrent client
- **Vite**: Fast build tool

## License

MIT License - feel free to use and modify as needed.

## Support

For issues and feature requests, please open an issue on the project repository.

---

Built for Ubuntu Desktop
