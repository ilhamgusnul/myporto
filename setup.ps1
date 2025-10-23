# Portfolio Supabase Setup Script (Windows)
# Run this with: .\setup.ps1

Write-Host "🚀 Portfolio Supabase Setup" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check if .env exists
if (!(Test-Path .env)) {
    Write-Host "📝 Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "⚠️  Please edit .env file with your Supabase credentials before continuing." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter after you've updated .env file"
}

# Install dependencies
Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install

# Generate Prisma Client
Write-Host ""
Write-Host "🔧 Generating Prisma Client..." -ForegroundColor Cyan
npx prisma generate

# Check if DATABASE_URL is set
$envContent = Get-Content .env -Raw
if ($envContent -match "YOUR_DB_PASSWORD") {
    Write-Host ""
    Write-Host "⚠️  WARNING: DATABASE_URL still contains placeholder values!" -ForegroundColor Yellow
    Write-Host "Please update your .env file with real Supabase credentials." -ForegroundColor Yellow
    Write-Host ""
    $response = Read-Host "Continue anyway? (y/N)"
    if ($response -ne "y" -and $response -ne "Y") {
        exit 1
    }
}

# Run migrations
Write-Host ""
Write-Host "🗄️  Running database migrations..." -ForegroundColor Cyan
npx prisma migrate dev --name init

# Seed database
Write-Host ""
Write-Host "🌱 Seeding database with initial data..." -ForegroundColor Cyan
npm run prisma:seed

# Success
Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Your portfolio is ready!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. npm run dev - Start development server"
Write-Host "2. Open http://localhost:3000"
Write-Host "3. Login at http://localhost:3000/login"
Write-Host "   Email: admin@example.com"
Write-Host "   Password: Admin123!"
Write-Host ""
Write-Host "📚 Check README.md for more information" -ForegroundColor Cyan
Write-Host ""
