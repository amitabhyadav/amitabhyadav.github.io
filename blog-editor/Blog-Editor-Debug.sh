#!/bin/bash

# Blog Editor Debug Launcher Script for Linux
# Use this version to see detailed logs and debug issues

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🐛 Starting Blog Editor in DEBUG mode..."
echo "📁 Working directory: $SCRIPT_DIR"
echo "🔍 This will show detailed logs to help diagnose issues"
echo ""

# Load NVM if it exists
if [ -f "$HOME/.nvm/nvm.sh" ]; then
    echo "🔄 Loading NVM..."
    source "$HOME/.nvm/nvm.sh"
    nvm use default >/dev/null 2>&1 || nvm use node >/dev/null 2>&1
fi

export PATH="$HOME/.nvm/versions/node/*/bin:$PATH"
export PATH="/usr/local/bin:$PATH"

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check for existing processes using port 3000
echo "🔍 Checking for existing processes on port 3000..."
lsof -i :3000 2>/dev/null && echo "⚠️  Port 3000 is in use!" || echo "✅ Port 3000 is available"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Set debug environment variables
export DEBUG=*
export ELECTRON_ENABLE_LOGGING=1
export ELECTRON_DISABLE_SANDBOX=1

echo "🎯 Launching Blog Editor with full logging..."
echo "📝 Watch for any error messages below:"
echo "----------------------------------------"

# Start with maximum verbosity
npm run electron:linux

echo "----------------------------------------"
echo "👋 Blog Editor closed."
echo ""
echo "💡 If you saw errors above, please share them for troubleshooting."
read -p "Press Enter to exit..."