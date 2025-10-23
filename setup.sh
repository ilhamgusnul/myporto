#!/bin/bash

# Portfolio Supabase Setup Script
# This script helps you set up the project quickly

set -e

echo "🚀 Portfolio Supabase Setup"
echo "=========================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your Supabase credentials before continuing."
    echo ""
    read -p "Press Enter after you've updated .env file..."
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Generate Prisma Client
echo ""
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Check if DATABASE_URL is set
if grep -q "YOUR_DB_PASSWORD" .env; then
    echo ""
    echo "⚠️  WARNING: DATABASE_URL still contains placeholder values!"
    echo "Please update your .env file with real Supabase credentials."
    echo ""
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Run migrations
echo ""
echo "🗄️  Running database migrations..."
npx prisma migrate dev --name init

# Seed database
echo ""
echo "🌱 Seeding database with initial data..."
npm run prisma:seed

# Success
echo ""
echo "✅ Setup complete!"
echo ""
echo "🎉 Your portfolio is ready!"
echo ""
echo "Next steps:"
echo "1. npm run dev - Start development server"
echo "2. Open http://localhost:3000"
echo "3. Login at http://localhost:3000/login"
echo "   Email: admin@example.com"
echo "   Password: Admin123!"
echo ""
echo "📚 Check README.md for more information"
echo ""
