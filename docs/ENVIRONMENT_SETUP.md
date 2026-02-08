# Environment Configuration Guide

This guide explains how to configure and switch between development and production environments for Mantap.work.

## 📁 Environment Files

### Server Environment Files

**Location:** `server/.env` (active configuration)

**Template files:**
- `server/.env.development` - For local development
- `server/.env.production` - For production deployment

### Client Environment Files

**Location:** `client/.env.development` and `client/.env.production`

Vite uses these files automatically based on the build mode.

---

## 🚀 Production Deployment

### Step 1: Prepare Production Environment File

On your production server, copy the template:

```bash
cd /var/www/html/mantap-v1/server
cp .env.production .env
```

**Edit the .env file and update these CRITICAL values:**

```env
# Database (use secure credentials)
DB_USER=your_db_username
DB_PASSWORD=your_secure_password

# Security (generate a strong random string)
JWT_SECRET=your_very_secure_random_string_min_32_chars

# Must be set to production
NODE_ENV=production
```

### Step 2: Deploy

```bash
cd /var/www/html/mantap-v1
./deploy.sh prod
```

### Step 3: Verify Production Mode

Check that the server is running in production mode:

```bash
pm2 logs mantap-api
```

You should see:
```
✅ Server running on port 5000 (production mode)
📁 Serving static files from: /path/to/public
```

**NOT:**
```
❌ Server running on port 5000 (development mode)  
```

If you see "development mode", see [Troubleshooting](#troubleshooting) below.

---

## 💻 Development Setup

### Running Development Mode (Two Terminals)

**Terminal 1 - Backend:**
```bash
cd server
cp .env.development .env   # Use development config
npm install
npm run dev
```
Backend runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd client
npm install
npm run dev
```
Frontend runs on: http://localhost:8080

The frontend will automatically connect to localhost:5000 for API calls.

---

## 🔧 Key Configuration Details

### API Base URL Configuration

**Development (client/.env.development):**
```env
VITE_API_BASE=http://localhost:5000/api
```

**Production (client/.env.production):**
```env
VITE_API_BASE=/api
```

**Why relative path in production?**
- Frontend and backend run on the same domain (e.g., https://mantap.work)
- Using `/api` makes requests to `https://mantap.work/api`
- This avoids CORS issues and SSL mixed content errors

### PM2 Ecosystem Configuration

**File:** `server/ecosystem.config.js`

**Default:** Production mode
```javascript
env: {
  NODE_ENV: 'production',
  PORT: 5000
}
```

**Development mode:**
```bash
pm2 start ecosystem.config.js --env development
```

---

## 🛠️ Troubleshooting

### Issue: "Development Mode" Message in Production

**Symptoms:**
- Opening https://your-domain.com shows API message instead of the app
- Browser shows: `{ "message": "Mantap.work API is running (Development Mode)" }`

**Root Causes:**
1. `NODE_ENV=production` not set in server/.env
2. PM2 caching old environment variables
3. ecosystem.config.js has wrong default environment

**Solutions:**

**Option 1: Fix environment and restart**
```bash
cd /var/www/html/mantap-v1/server
# Ensure .env has NODE_ENV=production
cat .env | grep NODE_ENV

# Delete and restart PM2 process
pm2 delete mantap-api
pm2 start ecosystem.config.js
pm2 save
```

**Option 2: Force environment update**
```bash
pm2 reload mantap-api --update-env
```

**Option 3: Manual environment check**
```bash
pm2 show mantap-api
# Look for NODE_ENV in the env section
```

### Issue: CORS Errors in Production

**Symptoms:**
- Browser console shows CORS policy errors
- API calls to http://localhost:5000 fail

**Solution:**
1. Ensure client was built with production .env:
   ```bash
   cd client
   npm run build  # This uses .env.production automatically
   ```

2. Verify VITE_API_BASE is set to `/api` in the built files:
   ```bash
   grep -r "localhost:5000" client/dist/
   # Should return nothing
   ```

3. Rebuild and redeploy:
   ```bash
   ./deploy.sh prod
   ```

### Issue: 500 Errors on API Calls

**Symptoms:**
- Login works but user list shows 500 error
- Database-related errors in PM2 logs

**Solution:**
Run the database migration:
```bash
cd /var/www/html/mantap-v1/db
mysql -u root -p mantap_work_db < user_management_migration.sql
```

Or add missing columns individually:
```bash
mysql -u root -p mantap_work_db -e "ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'active';"
mysql -u root -p mantap_work_db -e "ALTER TABLE users ADD COLUMN last_login TIMESTAMP NULL DEFAULT NULL;"
```

---

## 📋 Deployment Checklist

Before deploying to production:

- [ ] Update `server/.env` with production database credentials
- [ ] Change `JWT_SECRET` to a secure random string (min 32 chars)
- [ ] Ensure `NODE_ENV=production` is set
- [ ] Run database migrations
- [ ] Test locally with `npm run build` first
- [ ] Verify no localhost references in built files
- [ ] Deploy with `./deploy.sh prod`
- [ ] Check PM2 logs show "production mode"
- [ ] Test login and user management features
- [ ] Check browser console for errors

---

## 🔄 Switching Between Environments

### Local Machine (Development → Production Testing)

```bash
# Terminal 1 - Start backend in production mode
cd server
NODE_ENV=production npm start

# Terminal 2 - Build and serve frontend
cd client
npm run build
npx serve dist
```

### Server (Always Production)

The server should always run in production mode. Never use development mode on the production server.

---

## 📝 Environment Variable Reference

### Server Variables

| Variable | Development | Production | Description |
|----------|------------|------------|-------------|
| `NODE_ENV` | `development` | `production` | Sets app mode |
| `PORT` | `5000` | `5000` | API server port |
| `DB_HOST` | `localhost` | `localhost` | Database host |
| `DB_USER` | `root` | `your_user` | Database username |
| `DB_PASSWORD` | *(empty)* | `secure_pass` | Database password |
| `DB_NAME` | `mantap_work_db` | `mantap_work_db` | Database name |
| `JWT_SECRET` | `dev_secret` | `long_random_string` | JWT signing key |

### Client Variables

| Variable | Development | Production | Description |
|----------|------------|------------|-------------|
| `VITE_API_BASE` | `http://localhost:5000/api` | `/api` | API base URL |
| `NODE_ENV` | `development` | `production` | Build mode |

---

## 🆘 Quick Fixes

**Reset PM2 and start fresh:**
```bash
pm2 delete all
pm2 kill
cd /var/www/html/mantap-v1/server
pm2 start ecosystem.config.js
pm2 save
```

**Rebuild everything:**
```bash
cd /var/www/html/mantap-v1
rm -rf client/dist server/public/*
./deploy.sh prod
```

**Check what's running:**
```bash
pm2 status
pm2 logs mantap-api --lines 50
```
