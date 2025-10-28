#!/bin/bash

# GGTorrents Uninstallation Script

set -e

echo "========================================"
echo "  GGTorrents Uninstallation Script"
echo "========================================"
echo ""

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Removing desktop integration..."
rm -f ~/.local/share/applications/ggtorrents.desktop

# Update desktop database
if command -v update-desktop-database &> /dev/null; then
    update-desktop-database ~/.local/share/applications
fi

echo ""
echo "Desktop integration removed."
echo ""
echo "To completely remove GGTorrents, delete the directory:"
echo "  rm -rf '$SCRIPT_DIR'"
echo ""
echo "Your downloaded files and settings are stored in:"
echo "  ~/.config/ggtorrents/"
echo "  ~/Downloads/GGTorrents/"
echo ""
