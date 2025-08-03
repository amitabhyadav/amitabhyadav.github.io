#!/bin/bash

# Blog Editor Launcher Script for Linux
# Double-click this file to run the Blog Editor

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🚀 Starting Blog Editor for Linux..."
echo "📁 Working directory: $SCRIPT_DIR"
echo "⏳ Please wait while the application loads..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Load NVM if it exists (common Node.js installation method)
if [ -f "$HOME/.nvm/nvm.sh" ]; then
    echo "🔄 Loading NVM (Node Version Manager)..."
    source "$HOME/.nvm/nvm.sh"
    # Use the default version
    nvm use default >/dev/null 2>&1 || nvm use node >/dev/null 2>&1
fi

# Also check common Node.js installation paths
export PATH="$HOME/.nvm/versions/node/*/bin:$PATH"
export PATH="/usr/local/bin:$PATH"

# Check if Node.js is installed
if ! command_exists node; then
    echo "❌ Node.js is not installed!"
    echo ""
    echo "📦 Please install Node.js using one of these methods:"
    echo ""
    echo "🔸 Ubuntu/Debian:"
    echo "   sudo apt update"
    echo "   sudo apt install nodejs npm"
    echo ""
    echo "🔸 CentOS/RHEL/Fedora:"
    echo "   sudo dnf install nodejs npm"
    echo "   # or: sudo yum install nodejs npm"
    echo ""
    echo "🔸 Arch Linux:"
    echo "   sudo pacman -S nodejs npm"
    echo ""
    echo "🔸 Or download from: https://nodejs.org/"
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

# Check if npm is installed
if ! command_exists npm; then
    echo "❌ npm is not installed!"
    echo ""
    echo "📦 Please install npm:"
    echo "   sudo apt install npm  # Ubuntu/Debian"
    echo "   sudo dnf install npm  # Fedora"
    echo "   sudo yum install npm  # CentOS/RHEL"
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies for the first time..."
    echo "⏳ This may take a few minutes..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies!"
        echo "💡 Try running: npm install"
        read -p "Press Enter to exit..."
        exit 1
    fi
fi

# Check if Electron is installed
if [ ! -d "node_modules/electron" ]; then
    echo "⚡ Installing Electron..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Electron!"
        echo "💡 Try running: npm install"
        read -p "Press Enter to exit..."
        exit 1
    fi
fi

# Start the Electron app
echo "🎯 Launching Blog Editor..."

# Fix Electron sandbox issue on Linux by disabling sandbox
# This is safe for a local desktop application
export ELECTRON_DISABLE_SANDBOX=1

# Use Linux-specific electron command with sandbox disabled
npm run electron:linux

echo "👋 Blog Editor closed."
echo "Thank you for using Blog Editor!"

# Keep terminal open to see any messages
read -p "Press Enter to exit..."