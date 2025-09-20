# SETUP SCRIPT - Run this first!
# This script copies necessary config files and sets up the environment

echo "🌟 Setting up Mento Mental Health App..."

# Copy environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📋 Creating .env file from template..."
    cp requirements/config/.env .env
    echo "✅ .env file created!"
else
    echo "⚠️  .env file already exists, skipping..."
fi

echo "📦 Installing dependencies..."
npm install

echo "🎉 Setup complete! You can now run:"
echo "  npm run dev  - Start development server"
echo "  npm run build - Build for production"
echo ""
echo "🌐 The app will be available at http://localhost:3000"