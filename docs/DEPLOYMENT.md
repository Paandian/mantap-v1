# Deployment Guide

**Version:** 1.0.0  
**Last Updated:** February 2026  
**Environment:** Production

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Production Deployment](#production-deployment)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [SSL Configuration](#ssl-configuration)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements

**Server:**
- OS: Ubuntu 20.04 LTS or higher
- RAM: 2GB minimum (4GB recommended)
- Storage: 20GB minimum
- CPU: 2 cores minimum

**Software:**
- Node.js: v18.x LTS
- MySQL: v8.0+
- Nginx: v1.18+ (for reverse proxy)
- PM2: Latest version (for process management)

**Domain & DNS:**
- Registered domain name
- DNS A record pointing to server IP
- Optional: Wildcard SSL certificate

---

## Local Development Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd mantap
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your settings
nano .env
```

**Configure .env:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mantap_work_db
JWT_SECRET=your_super_secret_key_min_32_chars
PORT=5000
```

### 3. Database Setup

```bash
# Create database
mysql -u root -p
CREATE DATABASE mantap_work_db;
EXIT;

# Run migrations
mysql -u root -p mantap_work_db < ../db/mantap_work_db.sql
mysql -u root -p mantap_work_db < ../db/user_management_migration.sql
```

### 4. Start Backend

```bash
# Development mode
npm run dev

# Or production mode
npm start
```

Backend will run on: http://localhost:5000

### 5. Frontend Setup

```bash
cd ../client

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: http://localhost:8080

---

## Production Deployment

### Step 1: Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Install Nginx
sudo apt install nginx -y

# Install PM2
sudo npm install -g pm2
```

### Step 2: Create Application User

```bash
# Create user
sudo useradd -m -s /bin/bash mantap
sudo usermod -aG sudo mantap

# Switch to user
sudo su - mantap
```

### Step 3: Deploy Application

```bash
# Create app directory
mkdir -p ~/app
cd ~/app

# Clone repository
git clone <repository-url> .

# Install backend dependencies
cd server
npm install --production

# Create production .env
cp .env.example .env
nano .env
```

**Production .env:**
```env
DB_HOST=localhost
DB_USER=mantap_user
DB_PASSWORD=strong_password_here
DB_NAME=mantap_production
JWT_SECRET=very_long_random_string_32_chars_min
PORT=5000
NODE_ENV=production
```

### Step 4: Database Production Setup

```bash
# Login to MySQL
sudo mysql -u root

# Create production database and user
CREATE DATABASE mantap_production;
CREATE USER 'mantap_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON mantap_production.* TO 'mantap_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Run migrations
mysql -u mantap_user -p mantap_production < ../db/mantap_work_db.sql
mysql -u mantap_user -p mantap_production < ../db/user_management_migration.sql
```

### Step 5: Build Frontend

```bash
cd ../client

# Install dependencies
npm install

# Create production .env
echo "VITE_API_BASE_URL=https://api.mantap.work" > .env

# Build for production
npm run build

# Move build to server public directory
mkdir -p ../server/public
cp -r dist/* ../server/public/
```

### Step 6: PM2 Configuration

```bash
cd ~/app/server

# Create PM2 config
nano ecosystem.config.js
```

**ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'mantap-api',
    script: './server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
}
```

```bash
# Create logs directory
mkdir -p logs

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 config
pm2 save

# Setup PM2 startup script
pm2 startup systemd
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u mantap --hp /home/mantap
```

### Step 7: Nginx Configuration

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/mantap
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name mantap.work www.mantap.work;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name mantap.work www.mantap.work;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/mantap.work/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mantap.work/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Frontend - Static Files
    location / {
        root /home/mantap/app/server/public;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/mantap /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 8: SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d mantap.work -d www.mantap.work

# Auto-renewal test
sudo certbot renew --dry-run
```

---

## Environment Variables

### Backend (.env)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DB_HOST` | Yes | localhost | MySQL host |
| `DB_USER` | Yes | - | MySQL username |
| `DB_PASSWORD` | Yes | - | MySQL password |
| `DB_NAME` | Yes | - | MySQL database name |
| `JWT_SECRET` | Yes | - | JWT signing secret (min 32 chars) |
| `PORT` | No | 5000 | Server port |
| `NODE_ENV` | No | development | Environment mode |

### Frontend (.env)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE_URL` | Yes | - | Backend API URL |

---

## Database Setup

### Creating Super Admin

```bash
# Generate bcrypt hash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YourPassword123', 10));"

# Insert into database
mysql -u mantap_user -p mantap_production

INSERT INTO users (email, password, name, role, status, email_verified) 
VALUES (
  'superadmin@mantap.work',
  '$2a$10$YourHashHere',
  'Super Administrator',
  'super-admin',
  'active',
  TRUE
);

EXIT;
```

### Backup Script

```bash
# Create backup script
nano ~/backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/mantap/backups"
DB_NAME="mantap_production"
DB_USER="mantap_user"
DB_PASS="your_password"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: db_backup_$DATE.sql.gz"
```

```bash
# Make executable
chmod +x ~/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /home/mantap/backup.sh >> /home/mantap/logs/backup.log 2>&1
```

---

## Monitoring & Maintenance

### PM2 Monitoring

```bash
# View status
pm2 status

# View logs
pm2 logs mantap-api

# Monitor resources
pm2 monit

# Restart app
pm2 restart mantap-api

# Reload (zero-downtime)
pm2 reload mantap-api
```

### Log Rotation

```bash
# Install logrotate
sudo apt install logrotate -y

# Create config
sudo nano /etc/logrotate.d/mantap
```

```
/home/mantap/app/server/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 mantap mantap
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

### Health Checks

```bash
# Create health check script
nano ~/health-check.sh
```

```bash
#!/bin/bash
if ! curl -f http://localhost:5000/ > /dev/null 2>&1; then
    echo "$(date): Server is down, restarting..." >> ~/logs/health-check.log
    pm2 restart mantap-api
fi
```

```bash
chmod +x ~/health-check.sh

# Run every 5 minutes
crontab -e
*/5 * * * * /home/mantap/health-check.sh
```

---

## Troubleshooting

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs mantap-api

# Check if port is in use
sudo lsof -i :5000

# Kill process if needed
sudo kill -9 <PID>
```

### Database Connection Issues

```bash
# Check MySQL status
sudo systemctl status mysql

# Test connection
mysql -u mantap_user -p -e "SHOW DATABASES;"

# Check MySQL logs
sudo tail -f /var/log/mysql/error.log
```

### Nginx Errors

```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Check access logs
sudo tail -f /var/log/nginx/access.log
```

### SSL Certificate Issues

```bash
# Renew certificate manually
sudo certbot renew

# Check certificate status
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal
```

### 502 Bad Gateway

```bash
# Check if backend is running
pm2 status

# Check backend logs
pm2 logs

# Restart backend
pm2 restart mantap-api

# Check Nginx can connect
curl http://localhost:5000/
```

### Permission Denied

```bash
# Fix ownership
sudo chown -R mantap:mantap /home/mantap/app

# Fix permissions
chmod -R 755 /home/mantap/app
```

---

## Updates & Deployment

### Deploying Updates

```bash
# Login as mantap user
sudo su - mantap

# Go to app directory
cd ~/app

# Pull latest changes
git pull origin main

# Update backend
cd server
npm install --production

# Update frontend
cd ../client
npm install
npm run build

# Copy new build
cp -r dist/* ../server/public/

# Restart application
cd ../server
pm2 restart mantap-api
```

### Database Migrations

```bash
# Backup first
./backup.sh

# Run migration
mysql -u mantap_user -p mantap_production < db/migration_name.sql
```

---

## Security Checklist

- [ ] Change default MySQL root password
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable firewall (ufw)
- [ ] Configure fail2ban
- [ ] Keep system updated
- [ ] Use SSL certificates
- [ ] Secure file permissions
- [ ] Disable root SSH login
- [ ] Use SSH key authentication
- [ ] Regular backups
- [ ] Log monitoring
- [ ] Disable unnecessary services

---

*For API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)*  
*For database schema, see [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)*
