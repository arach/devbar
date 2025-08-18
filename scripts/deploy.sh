#!/bin/bash

# Deploy script for GitHub Pages
# This builds both demo and docs sites and prepares them for deployment

set -e

echo "🚀 Starting deployment build..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf ./demo-app/out
rm -rf ./docs-site/out
rm -rf ./public-deploy

# Build the main library first
echo "📦 Building @arach/devbar library..."
pnpm build

# Build demo app
echo "🎮 Building demo app..."
cd demo-app
npm install
NEXT_PUBLIC_BASE_PATH="/devbar" \
NEXT_PUBLIC_DOCS_URL="https://arach.github.io/devbar/docs" \
npm run build
cd ..

# Build docs site
echo "📚 Building docs site..."
cd docs-site
npm install
NEXT_PUBLIC_BASE_PATH="/devbar/docs" \
NEXT_PUBLIC_DEMO_URL="https://arach.github.io/devbar" \
npm run build
cd ..

# Combine outputs
echo "🔄 Combining outputs..."
mkdir -p ./public-deploy
cp -r ./demo-app/out/* ./public-deploy/
mkdir -p ./public-deploy/docs
cp -r ./docs-site/out/* ./public-deploy/docs/

# Add .nojekyll file for GitHub Pages
touch ./public-deploy/.nojekyll

echo "✅ Build complete! Files ready in ./public-deploy"
echo ""
echo "📝 Next steps:"
echo "1. Commit and push these changes to your repository"
echo "2. Go to Settings > Pages in your GitHub repository"
echo "3. Set Source to 'GitHub Actions'"
echo "4. The workflow will run automatically on push to main/master"