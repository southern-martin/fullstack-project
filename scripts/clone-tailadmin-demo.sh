#!/bin/bash

# Clone TailAdmin Demo Template Script
# This script will extract the complete theme and assets from the TailAdmin demo

set -e

echo "🎨 Cloning TailAdmin Demo Template..."
echo "======================================"

# Create backup of current react-admin2
if [ -d "react-admin2" ]; then
    echo "📦 Creating backup of current react-admin2..."
    mv react-admin2 react-admin2-backup-$(date +%Y%m%d-%H%M%S)
fi

# Create new react-admin2 directory
echo "📁 Creating new react-admin2 directory..."
mkdir -p react-admin2
cd react-admin2

# Initialize new React app
echo "⚛️  Initializing new React app..."
npx create-react-app . --template typescript --yes

# Install required dependencies
echo "📦 Installing dependencies..."
npm install @heroicons/react @tanstack/react-query react-router-dom chart.js react-chartjs-2

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p src/components/Layout
mkdir -p src/components/Charts
mkdir -p src/pages
mkdir -p src/data
mkdir -p public/assets
mkdir -p public/assets/css
mkdir -p public/assets/js
mkdir -p public/assets/images

# Download demo assets
echo "🌐 Downloading demo assets..."

# Download main CSS file
echo "📥 Downloading main CSS..."
curl -s "https://demo.tailadmin.com/assets/css/style.css" -o public/assets/css/style.css

# Download main JS file
echo "📥 Downloading main JS..."
curl -s "https://demo.tailadmin.com/assets/js/script.js" -o public/assets/js/script.js

# Download images
echo "📥 Downloading images..."
curl -s "https://demo.tailadmin.com/assets/images/logo/logo-icon.svg" -o public/assets/images/logo-icon.svg
curl -s "https://demo.tailadmin.com/assets/images/country/country-01.svg" -o public/assets/images/country-01.svg
curl -s "https://demo.tailadmin.com/assets/images/country/country-02.svg" -o public/assets/images/country-02.svg

# Download product images
echo "📥 Downloading product images..."
mkdir -p public/assets/images/product
curl -s "https://demo.tailadmin.com/assets/images/product/product-01.jpg" -o public/assets/images/product/product-01.jpg
curl -s "https://demo.tailadmin.com/assets/images/product/product-02.jpg" -o public/assets/images/product/product-02.jpg
curl -s "https://demo.tailadmin.com/assets/images/product/product-03.jpg" -o public/assets/images/product/product-03.jpg
curl -s "https://demo.tailadmin.com/assets/images/product/product-04.jpg" -o public/assets/images/product/product-04.jpg
curl -s "https://demo.tailadmin.com/assets/images/product/product-05.jpg" -o public/assets/images/product/product-05.jpg

# Download the complete HTML structure
echo "📥 Downloading complete HTML structure..."
curl -s "https://demo.tailadmin.com/" -o demo-source.html

echo "✅ TailAdmin demo assets downloaded successfully!"
echo "📁 Assets saved to: react-admin2/public/assets/"
echo "🌐 Demo source saved to: react-admin2/demo-source.html"
echo ""
echo "Next steps:"
echo "1. Extract CSS and JS from demo-source.html"
echo "2. Create React components based on the HTML structure"
echo "3. Apply the exact theme and styling"
echo ""
echo "🎯 Ready to create pixel-perfect TailAdmin clone!"
