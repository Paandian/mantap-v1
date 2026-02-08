# Deployment Session Notes - February 2026

## 📝 Summary of Changes Made

This document tracks all configuration changes made during the deployment troubleshooting session to ensure smooth future deployments.

---

## ✅ Files Modified

### 1. `server/ecosystem.config.js`
**Change:** Default environment switched from development to production

**Before:**
```javascript
env: {
  NODE_ENV: 'development',  // ❌ Wrong default
  PORT: 5000
},
env_production: {
  NODE_ENV: 'production',
  PORT: 5000
}
```

**After:**
```javascript
env: {
  NODE_ENV: 'production',   // ✅ Default is production
  PORT: 5000
},
env_development: {
  NODE_ENV: 'development',  // For explicit dev mode
  PORT: 5000
}
```

**Impact:** PM2 now starts in production mode by default, fixing the "Development Mode" error.

---

### 2. `client/src/services/api.js`
**Change:** Updated comment to clarify Vite environment variable usage

**Key Point:** Uses `import.meta.env.VITE_API_BASE` (Vite syntax, not Vue CLI)

**Values:**
- Development: `http://localhost:5000/api`
- Production: `/api` (relative path - critical for avoiding CORS!)

---

### 3. `deploy.sh`
**Changes:**
- Default environment changed from `dev` to `prod`
- Added better PM2 environment handling with `--update-env`
- Added verification and troubleshooting tips in output
- Added warnings about production mode

**Key additions:**
```bash
ENV=${1:-prod}  # Default is now prod, not dev
pm2 reload mantap-api --update-env  # Force env update
```

---

### 4. `client/.env.development` (NEW FILE)
```env
VITE_API_BASE=http://localhost:5000/api
NODE_ENV=development
```

### 5. `client/.env.production` (NEW FILE)
```env
VITE_API_BASE=/api  # ⚠️ CRITICAL: Relative path, not localhost!
NODE_ENV=production
```

### 6. `server/.env.development` (NEW FILE)
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=mantap_work_db
JWT_SECRET=your_jwt_secret_key_change_in_production
CORS_ORIGIN=http://localhost:8080
```

### 7. `server/.env.production` (NEW FILE)
```env
NODE_ENV=production  # ⚠️ CRITICAL!
PORT=5000
DB_HOST=localhost
DB_USER=your_db_username
DB_PASSWORD=your_secure_password
DB_NAME=mantap_work_db
JWT_SECRET=your_very_secure_random_jwt_secret_key_here
CORS_ORIGIN=https://your-domain.com
```

---

## 🔧 Critical Configuration Checklist

### For Production Deployment:

**1. Server .env file MUST contain:**
```env
NODE_ENV=production
DB_USER=your_actual_db_user
DB_PASSWORD=your_actual_db_password
JWT_SECRET=long_random_string_min_32_chars
```

**2. Before running deploy.sh:**
```bash
# Copy production template
cd server
cp .env.production .env

# Edit with your actual values
nano .env
```

**3. Verify after deployment:**
```bash
pm2 logs mantap-api
# Should show: "Server running on port 5000 (production mode)"
# NOT: "Server running on port 5000 (development mode)"
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "Development Mode" API Message

**Symptoms:**
```json
{
  "message": "Mantap.work API is running (Development Mode)",
  "note": "Frontend runs separately on port 8080"
}
```

**Solution:**
```bash
# Fix 1: Ensure .env has NODE_ENV=production
cat server/.env | grep NODE_ENV

# Fix 2: Restart PM2 fresh
pm2 delete mantap-api
pm2 start server/ecosystem.config.js
pm2 save

# Fix 3: Force reload with env update
pm2 reload mantap-api --update-env
```

### Issue 2: CORS Errors

**Symptoms:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/auth/login' 
from origin 'https://mantap.work' has been blocked by CORS policy
```

**Root Cause:** Client built with localhost API URL instead of relative path.

**Solution:**
```bash
# Rebuild with production env
cd client
rm -rf dist
npm run build  # Uses .env.production automatically

# Verify
grep -r "localhost:5000" dist/  # Should be empty

# Redeploy
cd ..
./deploy.sh prod
```

### Issue 3: 500 Errors on User API

**Symptoms:**
```
GET https://mantap.work/api/users?page=1&limit=10 500
```

**Root Cause:** Missing database columns from migration.

**Solution:**
```bash
# Run migration
cd db
mysql -u root -p mantap_work_db < user_management_migration.sql

# Or manually add columns
mysql -u root -p mantap_work_db -e "ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'active';"
mysql -u root -p mantap_work_db -e "ALTER TABLE users ADD COLUMN last_login TIMESTAMP NULL DEFAULT NULL;"
```

---

## 🔄 Development vs Production Workflows

### Development (Local Machine)

**Terminal 1 - Backend:**
```bash
cd server
cp .env.development .env  # Use dev config
npm install
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm install
npm run dev
# Runs on http://localhost:8080
# Automatically uses http://localhost:5000/api
```

### Production (Ubuntu Server)

**One-time setup:**
```bash
cd /var/www/html/mantap-v1/server
cp .env.production .env
nano .env  # Edit credentials!
```

**Deploy:**
```bash
cd /var/www/html/mantap-v1
./deploy.sh prod
```

**Verify:**
```bash
pm2 logs mantap-api
# Look for: "Server running on port 5000 (production mode)"
```

---

## 📚 Related Documentation

- `docs/ENVIRONMENT_SETUP.md` - Detailed environment configuration
- `docs/QUICK_DEPLOY.md` - Deployment steps and troubleshooting
- `docs/API_DOCUMENTATION.md` - API endpoints reference
- `docs/DATABASE_SCHEMA.md` - Database structure

---

## 💾 Git Commit Recommendations

After fixing everything, commit these changes:

```bash
git add server/ecosystem.config.js
git add deploy.sh
git add client/src/services/api.js
git add client/.env.development
git add client/.env.production
git add server/.env.development
git add server/.env.production
git add docs/
git commit -m "fix: production deployment configuration

- Set default PM2 environment to production
- Add environment-specific .env templates
- Update deploy.sh with better error handling
- Fix API base URL configuration for Vite
- Add comprehensive deployment troubleshooting docs"
```

---

## 🎯 Next Steps for Clean Deployment

1. **Update server/.env** with production credentials
2. **Verify database** has all required columns
3. **Run deployment:** `./deploy.sh prod`
4. **Check logs:** `pm2 logs mantap-api` (should show production mode)
5. **Test:** Login and user management features
6. **Commit:** Save all configuration changes to git

---

**Session Date:** February 2026  
**Issues Resolved:** Environment configuration, CORS, PM2 setup  
**Status:** Configuration files updated, ready for clean deployment
