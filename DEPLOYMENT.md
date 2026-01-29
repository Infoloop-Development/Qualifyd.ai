# Deployment Guide for Hostinger VPS

This guide will help you deploy the Resume Analyzer application to your Hostinger VPS.

## Prerequisites

- Hostinger VPS with Ubuntu/Debian
- SSH access to your VPS
- Domain name pointing to your VPS IP
- Basic knowledge of Linux commands

## Step 1: Initial Server Setup

### 1.1 Connect to your VPS
```bash
ssh root@your-vps-ip
```

### 1.2 Update system packages
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.3 Install Node.js (v18 or higher)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Verify installation
```

### 1.4 Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 1.5 Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

## Step 2: Upload Your Code

### Option A: Using Git (Recommended)
```bash
# Install Git if not already installed
sudo apt install -y git

# Clone your repository
cd /var/www
sudo git clone YOUR_REPO_URL resume-analyzer
cd resume-analyzer
```

### Option B: Using SCP (from your local machine)
```bash
# From your local machine
scp -r /path/to/your/project root@your-vps-ip:/var/www/resume-analyzer
```

## Step 3: Configure Environment Variables

### 3.1 Backend Configuration
```bash
cd /var/www/resume-analyzer/backend
cp .env.example .env
nano .env  # Edit with your values
```

**Important values to set:**
- `JWT_SECRET`: Generate a strong random secret (min 32 characters)
- `PORT`: 4000 (default)
- `GEMINI_API_KEY`: If using AI rewrite feature

### 3.2 Frontend Configuration
```bash
cd /var/www/resume-analyzer/frontend
cp .env.example .env
nano .env  # Edit with your production API URL
```

Set `VITE_API_BASE` to your production API URL:
```
VITE_API_BASE=https://yourdomain.com/api
```

## Step 4: Build and Install Dependencies

```bash
cd /var/www/resume-analyzer

# Backend
cd backend
npm ci --production
npm run build

# Frontend
cd ../frontend
npm ci
npm run build
```

## Step 5: Set Up PM2

```bash
cd /var/www/resume-analyzer

# Start the backend with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
# Follow the instructions shown in the output
```

## Step 6: Configure Nginx

### 6.1 Create Nginx configuration
```bash
sudo nano /etc/nginx/sites-available/resume-analyzer
```

Copy the contents from `nginx.conf` file and update:
- Replace `yourdomain.com` with your actual domain
- Adjust paths if needed

### 6.2 Enable the site
```bash
sudo ln -s /etc/nginx/sites-available/resume-analyzer /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

### 6.3 Update Nginx config for production
Edit `/etc/nginx/sites-available/resume-analyzer`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        root /var/www/resume-analyzer/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 10M;
    }
}
```

## Step 7: Set Up SSL Certificate (Let's Encrypt)

### 7.1 Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 7.2 Obtain SSL Certificate
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts. Certbot will automatically update your Nginx configuration.

### 7.3 Auto-renewal (already set up by certbot)
```bash
sudo certbot renew --dry-run  # Test renewal
```

## Step 8: Set Permissions

```bash
# Create uploads directory
sudo mkdir -p /var/www/resume-analyzer/backend/uploads
sudo mkdir -p /var/www/resume-analyzer/logs

# Set ownership (adjust user if needed)
sudo chown -R www-data:www-data /var/www/resume-analyzer
sudo chmod -R 755 /var/www/resume-analyzer
sudo chmod -R 775 /var/www/resume-analyzer/backend/uploads
sudo chmod -R 775 /var/www/resume-analyzer/logs
```

## Step 9: Firewall Configuration

```bash
# Allow HTTP, HTTPS, and SSH
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## Step 10: Verify Deployment

1. **Check PM2 status:**
   ```bash
   pm2 status
   pm2 logs resume-analyzer-backend
   ```

2. **Check Nginx status:**
   ```bash
   sudo systemctl status nginx
   ```

3. **Test your domain:**
   - Visit `https://yourdomain.com` in your browser
   - Check API: `https://yourdomain.com/api/health`

## Useful Commands

### PM2 Commands
```bash
pm2 status                    # Check status
pm2 logs                      # View logs
pm2 restart resume-analyzer-backend  # Restart backend
pm2 stop resume-analyzer-backend     # Stop backend
pm2 delete resume-analyzer-backend   # Remove from PM2
```

### Nginx Commands
```bash
sudo nginx -t                 # Test configuration
sudo systemctl reload nginx   # Reload configuration
sudo systemctl restart nginx  # Restart Nginx
```

### Update Deployment
```bash
cd /var/www/resume-analyzer
git pull  # If using Git
cd backend && npm ci --production && npm run build
cd ../frontend && npm ci && npm run build
pm2 restart resume-analyzer-backend
sudo systemctl reload nginx
```

## Troubleshooting

### Backend not starting
- Check logs: `pm2 logs resume-analyzer-backend`
- Verify .env file exists and has correct values
- Check if port 4000 is available: `sudo netstat -tulpn | grep 4000`

### Frontend not loading
- Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
- Verify frontend/dist directory exists
- Check Nginx configuration: `sudo nginx -t`

### Database issues
- Check file permissions on `backend/data.db`
- Ensure directory is writable: `sudo chmod 775 backend/`

### SSL Certificate issues
- Check certificate: `sudo certbot certificates`
- Renew manually: `sudo certbot renew`

## Security Checklist

- [ ] Changed default JWT_SECRET
- [ ] Set strong passwords for server access
- [ ] SSL certificate installed and working
- [ ] Firewall configured (UFW)
- [ ] Regular backups of database file (`backend/data.db`)
- [ ] PM2 running as non-root user (recommended)
- [ ] File permissions set correctly

## Backup Strategy

### Database Backup
```bash
# Create backup script
sudo nano /usr/local/bin/backup-resume-analyzer.sh
```

Add:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/resume-analyzer"
mkdir -p $BACKUP_DIR
cp /var/www/resume-analyzer/backend/data.db $BACKUP_DIR/data-$(date +%Y%m%d-%H%M%S).db
# Keep only last 7 days
find $BACKUP_DIR -name "data-*.db" -mtime +7 -delete
```

Make executable:
```bash
sudo chmod +x /usr/local/bin/backup-resume-analyzer.sh
```

Add to crontab (daily at 2 AM):
```bash
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-resume-analyzer.sh
```

## Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify all environment variables are set correctly
4. Ensure all ports are accessible

