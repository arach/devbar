#!/bin/bash

echo "🚀 Starting production test server..."
echo "📄 Open: http://localhost:3001/devbar/docs"
echo ""
echo "Creating temporary directory structure..."

# Create temporary directory structure
rm -rf .test-prod
mkdir -p .test-prod/devbar/docs
cp -r out/* .test-prod/devbar/docs/

echo "Starting server..."
cd .test-prod
python3 -m http.server 3001