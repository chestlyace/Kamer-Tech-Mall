#!/bin/bash

# Kamer Tech Mall - Quick Start Script
# This script helps you get started quickly

echo "🏪 Kamer Tech Mall - Authentication System"
echo "=========================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Creating .env file from template..."
    echo ""
    
    read -p "Enter your MySQL root password: " mysql_pass
    read -p "Enter session secret (or press Enter for default): " session_secret
    
    if [ -z "$session_secret" ]; then
        session_secret="change-this-in-production-$(date +%s)"
    fi
    
    cat > .env << EOF
NODE_ENV=development
PORT=3000
SESSION_SECRET=$session_secret

# MySQL Configuration
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=$mysql_pass
DB_NAME=kamer_tech_mall
EOF
    
    echo "✅ .env file created!"
    echo ""
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if database is set up
echo "🗄️  Setting up database..."
npm run setup-db
echo ""

echo "🚀 Starting server..."
echo ""
echo "📍 Your application will be available at:"
echo "   http://localhost:3000"
echo ""
echo "📖 Quick Links:"
echo "   → Home: http://localhost:3000"
echo "   → Register: http://localhost:3000/auth/register"
echo "   → Login: http://localhost:3000/auth/login"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=========================================="
echo ""

npm run dev

