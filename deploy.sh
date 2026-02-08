#!/bin/bash

# Mantap.work Deployment Script
# Usage: ./deploy.sh [environment]
# Environments: dev (default), prod

set -e

ENV=${1:-dev}
echo "🚀 Starting deployment for environment: $ENV"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if we're in the right directory
if [ ! -d "client" ] || [ ! -d "server" ]; then
    print_error "Error: Must run from project root directory"
    exit 1
fi

# Step 1: Build Frontend
print_status "Building frontend..."
cd client

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_warning "Installing frontend dependencies..."
    npm install
fi

# Build based on environment
if [ "$ENV" = "prod" ]; then
    print_status "Building for production..."
    npm run build
else
    print_status "Building for development..."
    npm run build
fi

# Step 2: Copy build to server public directory
print_status "Copying build files to server..."
cd ..

# Create public directory if it doesn't exist
mkdir -p server/public

# Clear old files
rm -rf server/public/*

# Copy new build files
cp -r client/dist/* server/public/

print_status "Build files copied successfully"

# Step 3: Install/Update backend dependencies
print_status "Installing backend dependencies..."
cd server

if [ ! -d "node_modules" ]; then
    npm install
else
    npm install
fi

# Step 4: Handle PM2
print_status "Managing server with PM2..."

if command -v pm2 &> /dev/null; then
    if pm2 list | grep -q "mantap-api"; then
        print_status "Reloading existing PM2 process..."
        pm2 reload mantap-api
    else
        print_status "Starting new PM2 process..."
        pm2 start ecosystem.config.js || pm2 start server.js --name mantap-api
        pm2 save
    fi
else
    print_warning "PM2 not found. Starting with node..."
    npm start &
fi

cd ..

print_status "✅ Deployment completed successfully!"
echo ""
echo "📱 Frontend: Built and copied to server/public"
echo "🔧 Backend: Running with PM2"
echo ""
echo "Useful commands:"
echo "  pm2 status        - Check server status"
echo "  pm2 logs          - View server logs"
echo "  pm2 restart all   - Restart all processes"
