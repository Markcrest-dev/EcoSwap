#!/bin/bash

# EcoSwap Deployment Script

echo "🌱 EcoSwap Deployment Script"
echo "=============================="

# Check if Node.js and npm are installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Build the project
echo ""
echo "🔨 Building project for production..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "✅ Build completed successfully!"
echo ""
echo "📁 Your production files are in the 'build' folder"
echo ""
echo "🚀 Deployment Options:"
echo "1. Netlify: Drag and drop the 'build' folder to netlify.com"
echo "2. Vercel: Run 'npx vercel' in this directory"
echo "3. GitHub Pages: Run 'npm run deploy' (after setting up gh-pages)"
echo "4. Firebase: Run 'firebase deploy' (after firebase init)"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
