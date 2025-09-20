#!/bin/bash
# Bash setup script for macOS/Linux
# Run this script as: chmod +x setup.sh && ./setup.sh

echo "🌟 Setting up Mento Mental Health App..."

# Check if Node.js is installed
echo "Checking Node.js installation..."
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js is installed: $NODE_VERSION"
else
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
echo "Checking npm installation..."
if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm is installed: $NPM_VERSION"
else
    echo "❌ npm is not installed."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Copy environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created!"
fi

echo ""
echo "🎉 Setup complete! You can now run:"
echo "  npm run dev  - Start development server"
echo "  npm run build - Build for production"
echo ""
echo "🌐 The app will be available at http://localhost:3000"