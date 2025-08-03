#!/bin/bash

# Build Script for Creating Distributable Blog Editor Applications
# This script creates installers/packages for Windows, macOS, and Linux

echo "🏗️  Building Blog Editor Distributables"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Please run this script from the blog-editor directory."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create assets directory if it doesn't exist
mkdir -p assets

# Function to build for a specific platform
build_platform() {
    local platform=$1
    local description=$2
    
    echo ""
    echo "🚀 Building for $description..."
    echo "----------------------------------------"
    
    npm run "build:$platform"
    
    if [ $? -eq 0 ]; then
        echo "✅ $description build completed successfully!"
    else
        echo "❌ $description build failed!"
        return 1
    fi
}

# Build for all platforms
echo "Starting builds for all platforms..."

# macOS (only works on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    build_platform "mac" "macOS"
else
    echo "ℹ️  Skipping macOS build (requires macOS to build)"
fi

# Windows
build_platform "win" "Windows"

# Linux
build_platform "linux" "Linux"

echo ""
echo "🎉 Build process completed!"
echo "📁 Check the 'dist' folder for your distributable files:"
echo ""
echo "   macOS: Blog Editor.dmg, Blog Editor.app.zip"
echo "   Windows: Blog Editor Setup.exe, Blog Editor Portable.exe"
echo "   Linux: Blog Editor.AppImage, blog-editor.deb"
echo ""
echo "💡 You can now distribute these files to users who want to"
echo "   install Blog Editor without needing to set up Node.js!"