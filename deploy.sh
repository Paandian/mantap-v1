#!/bin/bash

# Mantap.work Deployment Script
# Usage: ./deploy.sh [environment]
# Environments: prod (default), dev
# 
# IMPORTANT: This script is for PRODUCTION deployment only!
# For development, run client and server separately (see docs/DEVELOPMENT.md)
#
# Examples:
#   ./deploy.sh prod    - Deploy to production (default)
#   ./deploy.sh dev     - Deploy for testing (not recommended)

set -e

ENV=${1:-prod}
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
        pm2 reload mantap-api --update-env
    else
        print_status "Starting new PM2 process in $ENV mode..."
        if [ "$ENV" = "prod" ]; then
            # Production: use default production environment
            pm2 start ecosystem.config.js
        else
            # Development: explicitly use development environment
            pm2 start ecosystem.config.js --env development
        fi
        pm2 save
    fi
else
    print_warning "PM2 not found. Starting with node..."
    if [ "$ENV" = "prod" ]; then
        NODE_ENV=production npm start &
    else
        NODE_ENV=development npm start &
    fi
fi

cd ..

print_status "✅ Deployment completed successfully!"
echo ""
echo "📱 Frontend: Built and copied to server/public"
echo "🔧 Backend: Running with PM2 in $ENV mode"
echo ""
echo "Verification:"
echo "  curl https://your-domain.com/api/health    - Check API health"
echo ""
echo "Useful commands:"
echo "  pm2 status              - Check server status"
echo "  pm2 logs mantap-api     - View server logs"
echo "  pm2 restart mantap-api  - Restart the API"
echo "  pm2 reload mantap-api --update-env  - Reload with new env vars"
echo ""
echo "⚠️  IMPORTANT: If you see 'Development Mode' message:"
echo "   1. Check server/.env has NODE_ENV=production"
echo "   2. Run: pm2 delete mantap-api && pm2 start ecosystem.config.js"
echo "   3. Run: pm2 save"
