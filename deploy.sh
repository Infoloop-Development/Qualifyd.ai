#!/bin/bash

# Deployment script for Hostinger VPS
# Usage: ./deploy.sh

set -e  # Exit on error

echo "🚀 Starting deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root or with sudo"
    exit 1
fi

# Set deployment directory (adjust if needed)
DEPLOY_DIR="/var/www/resume-analyzer"
APP_USER="www-data"  # or create a dedicated user: resume-analyzer

echo -e "${YELLOW}Step 1: Creating deployment directory...${NC}"
mkdir -p $DEPLOY_DIR
mkdir -p $DEPLOY_DIR/logs
mkdir -p $DEPLOY_DIR/uploads

echo -e "${YELLOW}Step 2: Installing Node.js dependencies...${NC}"
cd $DEPLOY_DIR/backend
npm ci --production

cd $DEPLOY_DIR/frontend
npm ci
npm run build

echo -e "${YELLOW}Step 3: Building backend...${NC}"
cd $DEPLOY_DIR/backend
npm run build

echo -e "${YELLOW}Step 4: Setting up PM2...${NC}"
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow the instructions shown

echo -e "${YELLOW}Step 5: Setting permissions...${NC}"
chown -R $APP_USER:$APP_USER $DEPLOY_DIR
chmod -R 755 $DEPLOY_DIR
chmod -R 775 $DEPLOY_DIR/logs
chmod -R 775 $DEPLOY_DIR/uploads

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Configure .env files in backend/ and frontend/"
echo "2. Set up Nginx configuration (see nginx.conf)"
echo "3. Set up SSL certificate (Let's Encrypt)"
echo "4. Update frontend .env with production API URL"
echo "5. Restart services: pm2 restart resume-analyzer-backend"

