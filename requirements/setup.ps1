# SETUP SCRIPT - Run this first!
# PowerShell version for Windows

Write-Host "🌟 Setting up Mento Mental Health App..." -ForegroundColor Cyan

# Copy environment file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "📋 Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item "requirements\config\.env" ".env"
    Write-Host "✅ .env file created!" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env file already exists, skipping..." -ForegroundColor Yellow
}

Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "`n🎉 Setup complete! You can now run:" -ForegroundColor Green
Write-Host "  npm run dev  - Start development server" -ForegroundColor Cyan
Write-Host "  npm run build - Build for production" -ForegroundColor Cyan
Write-Host "`n🌐 The app will be available at http://localhost:3000" -ForegroundColor Yellow