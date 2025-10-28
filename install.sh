#!/bin/bash

# GGTorrents Installation Script for Ubuntu

set -e

echo "========================================"
echo "  GGTorrents Installation Script"
echo "========================================"
echo ""

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if running on Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo "Error: This script is for Linux only."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "Node.js is already installed: $(node --version)"
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Installing npm..."
    sudo apt-get install -y npm
else
    echo "npm is already installed: $(npm --version)"
fi

echo ""
echo "Installing dependencies..."
cd "$SCRIPT_DIR"
npm install

echo ""
echo "Building the application..."
npm run build

echo ""
echo "Compiling preload script..."
npx tsc src/main/preload.ts --outDir dist --skipLibCheck

echo ""
echo "Converting SVG icon to PNG..."
# Check if ImageMagick or Inkscape is available
if command -v convert &> /dev/null; then
    convert -background none -density 1024 -resize 512x512 assets/icon.svg assets/icon.png
elif command -v inkscape &> /dev/null; then
    inkscape assets/icon.svg -o assets/icon.png -w 512 -h 512
else
    echo "Warning: Neither ImageMagick nor Inkscape found. Please manually convert assets/icon.svg to assets/icon.png"
    echo "You can install ImageMagick with: sudo apt-get install imagemagick"
fi

echo ""
echo "Creating launcher script..."
cat > "$SCRIPT_DIR/ggtorrents" << 'EOF'
#!/bin/bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"
NODE_ENV=production npx electron .
EOF
chmod +x "$SCRIPT_DIR/ggtorrents"

echo ""
echo "Setting up desktop integration..."
# Update desktop file with correct paths
sed -i "s|Exec=.*|Exec=$SCRIPT_DIR/ggtorrents|g" "$SCRIPT_DIR/ggtorrents.desktop"
sed -i "s|Icon=.*|Icon=$SCRIPT_DIR/assets/icon.png|g" "$SCRIPT_DIR/ggtorrents.desktop"

# Copy desktop file to applications directory
mkdir -p ~/.local/share/applications
cp "$SCRIPT_DIR/ggtorrents.desktop" ~/.local/share/applications/
chmod +x ~/.local/share/applications/ggtorrents.desktop

# Update desktop database
if command -v update-desktop-database &> /dev/null; then
    update-desktop-database ~/.local/share/applications
fi

echo ""
echo "========================================"
echo "  Installation Complete!"
echo "========================================"
echo ""
echo "You can now:"
echo "1. Launch GGTorrents from your application menu"
echo "2. Run it from the terminal: $SCRIPT_DIR/ggtorrents"
echo ""
echo "To uninstall, run: $SCRIPT_DIR/uninstall.sh"
echo ""
