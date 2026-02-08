# Quick Deployment Guide

**Last Updated:** February 2026  
**For:** Development and Production Deployment

---

## 🚀 Simple Deployment Workflow

### Prerequisites

Ensure you have:
- ✅ Node.js installed (v18+)
- ✅ MySQL running
- ✅ PM2 installed globally (`npm install -g pm2`)
- ✅ Git repository cloned

---

## Development Deployment (Local)

### Step 1: Start Backend
```bash
cd server
npm install        # First time only
npm run dev        # Development mode with auto-restart
```

**Backend runs at:** http://localhost:5000

### Step 2: Start Frontend (Separate Terminal)
```bash
cd client
npm install        # First time only
npm run dev        # Development server with HMR
```

**Frontend runs at:** http://localhost:8080

### Access the App
- **Landing Page:** http://localhost:8080
- **Admin Dashboard:** http://localhost:8080/admin
- **API:** http://localhost:5000/api

---

## Production Deployment (Ubuntu Server with Nginx)

### Option A: Using the Deployment Script (Recommended)

#### ⚠️ CRITICAL: Environment Configuration First!

Before deploying, ensure your environment files are configured:

**1. Server Environment (REQUIRED)**
```bash
cd server
cp .env.production .env
nano .env  # Edit with your production credentials!
```

**Required changes in server/.env:**
```env
NODE_ENV=production
DB_USER=your_db_user
DB_PASSWORD=your_secure_password
JWT_SECRET=your_long_random_secret_key
```

**2. Make script executable (First time only)**
```bash
chmod +x deploy.sh
```

**3. Deploy**
```bash
# For production (default)
./deploy.sh prod

# For testing (not recommended for production servers)
./deploy.sh dev
```

**What the script does:**
1. ✅ Builds the frontend (`npm run build` using .env.production)
2. ✅ Copies build files to `server/public/`
3. ✅ Installs backend dependencies
4. ✅ Starts/Restarts server with PM2 in production mode

---

### Option B: Manual Steps

If you prefer manual control, follow these steps:

#### 1. Build Frontend
```bash
cd client
npm install
npm run build
```

#### 2. Copy to Server
```bash
# From project root
mkdir -p server/public
rm -rf server/public/*
cp -r client/dist/* server/public/
```

#### 3. Start Backend
```bash
cd server
npm install

# Option A: Using PM2 (Recommended for production)
pm2 start ecosystem.config.js
# OR
pm2 start server.js --name mantap-api

# Option B: Direct node (Development only)
npm start
```

---

## Production Server Setup (Ubuntu + Nginx)

### 1. Initial Server Setup

```bash
# SSH into your Ubuntu server
ssh user@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install MySQL (if not using XAMPP)
sudo apt install mysql-server -y
```

### 2. Clone Repository

```bash
cd /var/www
sudo git clone <your-repo-url> mantap
sudo chown -R $USER:$USER mantap
cd mantap
```

### 3. Database Setup

```bash
# Create MySQL database and user
sudo mysql -u root

CREATE DATABASE mantap_production;
CREATE USER 'mantap_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON mantap_production.* TO 'mantap_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Run migrations
mysql -u mantap_user -p mantap_production < db/mantap_work_db.sql
mysql -u mantap_user -p mantap_production < db/user_management_migration.sql
```

### 4. Environment Configuration

```bash
cd server
cp .env.example .env
nano .env
```

**Edit .env:**
```env
DB_HOST=localhost
DB_USER=mantap_user
DB_PASSWORD=your_secure_password
DB_NAME=mantap_production
JWT_SECRET=your_super_secret_key_min_32_characters
PORT=5000
NODE_ENV=production
```

### 5. Deploy Application

```bash
# From project root
cd /var/www/mantap
./deploy.sh prod
```

### 6. Configure Nginx

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/mantap
```

**Add this configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Redirect HTTP to HTTPS (after SSL setup)
    # return 301 https://$server_name$request_uri;
    
    # Frontend - Static Files
    location / {
        root /var/www/mantap/server/public;
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
    }
}
```

**Enable the site:**
```bash
sudo ln -s /etc/nginx/sites-available/mantap /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### 7. Setup SSL (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## 🔧 Common Commands

### Development
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

### Production
```bash
# Deploy updates
cd /var/www/mantap && ./deploy.sh prod

# Check server status
pm2 status

# View logs
pm2 logs mantap-api

# Restart server
pm2 restart mantap-api

# Stop server
pm2 stop mantap-api

# Monitor resources
pm2 monit
```

### Database
```bash
# Backup database
mysqldump -u mantap_user -p mantap_production > backup_$(date +%Y%m%d).sql

# Restore database
mysql -u mantap_user -p mantap_production < backup_file.sql
```

---

## 📁 File Structure After Deployment

```
mantap/
├── client/                 # Frontend source (not served directly)
│   ├── dist/              # Built files (generated by npm run build)
│   ├── .env.development   # Dev environment variables
│   ├── .env.production    # Production build variables
│   └── ...
├── server/                 # Backend
│   ├── public/            # ✅ Served by Nginx (contains built frontend)
│   ├── node_modules/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── ecosystem.config.js # ✅ PM2 config (default: production)
│   ├── server.js
│   ├── .env               # ✅ Active environment (copy from .env.production)
│   ├── .env.development   # Template for local dev
│   └── .env.production    # Template for production
├── db/                     # Database migrations
├── docs/                   # Documentation
├── deploy.sh              # ✅ Deployment script
└── ...
```

**Important Files:**
- `server/.env` - **MUST** have `NODE_ENV=production` on server
- `client/.env.production` - Must have `VITE_API_BASE=/api` (not localhost)
- `server/ecosystem.config.js` - Default environment is now production

---

## 🔄 Update Workflow

When you make changes and want to deploy:

```bash
# 1. Pull latest changes
git pull origin main

# 2. Deploy
./deploy.sh prod

# 3. Done! 🎉
```

---

## 🐛 Troubleshooting

### ⚠️ CRITICAL: "Development Mode" Message in Production

**Problem:** Browser shows `{ "message": "Mantap.work API is running (Development Mode)" }` instead of the app.

**Cause:** `NODE_ENV=production` not set or PM2 using cached environment.

**Solution:**
```bash
# 1. Verify .env file
cat server/.env | grep NODE_ENV
# Should show: NODE_ENV=production

# 2. Kill PM2 and restart fresh
pm2 delete mantap-api
pm2 start server/ecosystem.config.js
pm2 save

# 3. Verify production mode in logs
pm2 logs mantap-api
# Should see: "Server running on port 5000 (production mode)"
```

### CORS Errors (API calls failing)

**Problem:** Browser console shows CORS errors when calling API.

**Cause:** Client built with wrong API base URL (localhost instead of relative path).

**Solution:**
```bash
# Rebuild client with production environment
cd client
rm -rf dist
npm run build  # Automatically uses .env.production

# Verify no localhost references
grep -r "localhost:5000" dist/
# Should return nothing

# Redeploy
cd ..
./deploy.sh prod
```

### 500 Errors on User List

**Problem:** Login works but `/api/users` returns 500 error.

**Cause:** Missing database columns from migration.

**Solution:**
```bash
# Run database migration
cd db
mysql -u root -p mantap_work_db < user_management_migration.sql

# Or add missing columns individually
mysql -u root -p mantap_work_db -e "ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'active';"
mysql -u root -p mantap_work_db -e "ALTER TABLE users ADD COLUMN last_login TIMESTAMP NULL DEFAULT NULL;"
```

### Build Fails
```bash
# Clear cache and rebuild
cd client
rm -rf node_modules dist
npm install
npm run build
```

### Port Already in Use
```bash
# Find and kill process on port 5000
sudo lsof -i :5000
sudo kill -9 <PID>

# Or use different port in .env
PORT=5001
```

### PM2 Issues
```bash
# Clear PM2 logs
pm2 flush

# Restart PM2 daemon
pm2 kill
pm2 start server/ecosystem.config.js
```

### Nginx Errors
```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

---

## 📝 Environment-Specific Notes

### XAMPP (Windows Local Development)
- MySQL runs on port 3306 (default)
- Use `localhost` as DB_HOST
- No changes needed to the deployment workflow

### Ubuntu Production
- MySQL should be installed and running
- Ensure port 5000 (or your chosen port) is open
- Nginx serves static files from `server/public/`
- PM2 keeps Node.js app running

---

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| **Start Dev** | `npm run dev` (in both client & server) |
| **Build** | `cd client && npm run build` |
| **Deploy** | `./deploy.sh prod` |
| **Check Status** | `pm2 status` |
| **View Logs** | `pm2 logs` |
| **Restart** | `pm2 restart all` |

---

*For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)*
