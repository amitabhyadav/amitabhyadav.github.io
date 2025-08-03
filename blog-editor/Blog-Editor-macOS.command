#!/bin/bash

# Blog Editor Launcher for macOS
# Double-click this file to run the Blog Editor
# The .command extension makes it executable from Finder

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🚀 Starting Blog Editor for macOS..."
echo "📁 Working directory: $SCRIPT_DIR"
echo "⏳ Please wait while the application loads..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "📦 Please install Node.js from https://nodejs.org/"
    echo "🔄 After installation, try running this script again."
    read -p "Press Enter to exit..."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    echo "📦 npm should come with Node.js. Please reinstall Node.js."
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
        read -p "Press Enter to exit..."
        exit 1
    fi
fi

# Start the Electron app
echo "🎯 Launching Blog Editor..."
npm run electron

echo "👋 Blog Editor closed."
echo "Thank you for using Blog Editor!"

# Optional: Keep terminal open to see any error messages
# read -p "Press Enter to exit..."