# Production Deployment Guide

Complete deployment guide for Mantap.work production server running on HestiaCP.

## 🎯 Prerequisites

- SSH access to server (`root@mantap.work`)
- HestiaCP user account (`servai`)
- PM2 process manager installed
- Application path: `/home/servai/web/mantap.work/public_html/mantap-v1`

---

## 🚀 Complete Deployment Workflow

### Step 1: SSH into Server

```bash
ssh root@mantap.work
```

### Step 2: Switch to Application User

```bash
su - servai
cd web/mantap.work/public_html/mantap-v1
```

### Step 3: Backup Environment

```bash
cp server/.env server/.env.backup.$(date +%Y%m%d_%H%M%S)
```

### Step 4: Pull Latest Changes

**Clean Pull (Recommended - Discards local changes):**
```bash
# Discard all local changes and pull fresh
git stash drop 2>/dev/null || true
git reset --hard origin/main
```

**Alternative: If you have custom changes to preserve:**
```bash
git pull origin main
# If conflicts occur:
git checkout --theirs .
git add .
git commit -m "Resolved conflicts - using remote version"
```

### Step 5: Restore Environment

```bash
# Find the most recent backup and restore
cp server/.env.backup.* server/.env 2>/dev/null || true
```

### Step 6: Set Correct Permissions (as root)

```bash
exit  # Back to root

chown -R servai:www-data /home/servai/web/mantap.work/public_html/mantap-v1
chmod -R 755 /home/servai/web/mantap.work/public_html/mantap-v1
```

### Step 7: Deploy Application (as servai)

```bash
su - servai
cd web/mantap.work/public_html/mantap-v1
./deploy.sh prod
```

Or manually:
```bash
cd server && npm install
cd ../client && npm install && npm run build
pm2 restart mantap-api
```

### Step 8: Verify Deployment

```bash
pm2 list
pm2 logs mantap-api --lines 50
```

---

## 🔧 Common Issues & Solutions

### Issue 1: Git Pull Conflicts

**Error:**
```
error: Pulling is not possible because you have unmerged files.
fatal: Exiting because of an unresolved conflict.
```

**Solution:**
```bash
# Force overwrite with remote version
git stash drop 2>/dev/null || true
git fetch origin
git reset --hard origin/main
```

### Issue 2: Permission Denied

**Error:**
```
EACCES: permission denied, open '/home/servai/web/...'
```

**Solution:**
```bash
# Run as root
chown -R servai:www-data /home/servai/web/mantap.work/public_html/mantap-v1
chmod -R 755 /home/servai/web/mantap.work/public_html/mantap-v1
```

### Issue 3: PM2 Process Not Found

**Error:**
```
[PM2][ERROR] Process mantap-api not found
```

**Solution:**
```bash
cd /home/servai/web/mantap.work/public_html/mantap-v1/server
pm2 start server.js --name mantap-api
pm2 save
```

### Issue 4: MySQL Connection Timeout During Import

**Error:**
```
ER_CLIENT_INTERACTION_TIMEOUT: The client was disconnected by the server
```

**Cause:** Checking too many schools one by one causes connection timeout

**Solution:** Already fixed in latest code - uses batch queries instead of loops

**Manual Fix (if needed):**
```bash
# SSH to server
ssh root@mantap.work
su - servai

# Edit MySQL config to increase timeout
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Add these lines under [mysqld]:
wait_timeout = 600
interactive_timeout = 600

# Restart MySQL
sudo systemctl restart mysql
```

---

## 📊 Database Migrations

### Run Migrations Manually

```bash
# SSH to server
ssh root@mantap.work
su - servai

# Connect to MySQL
mysql -u your_db_user -p your_db_name

# Run migration (inside MySQL prompt)
source /home/servai/web/mantap.work/public_html/mantap-v1/db/migrations/006_add_enhanced_import_columns_simple.sql
```

### Quick Migration Commands

```sql
-- Add strategy column
ALTER TABLE school_import_logs 
ADD COLUMN strategy VARCHAR(50) DEFAULT 'merge';

-- Add normalization_log column
ALTER TABLE school_import_logs 
ADD COLUMN normalization_log TEXT NULL;

-- Verify columns
DESCRIBE school_import_logs;
```

---

## 📦 Bulk Import (Enhanced)

### Using the New Enhanced Import

1. **Go to Admin Dashboard** → School Management
2. **Click "Bulk Import"** (the one with NEW badge)
3. **Select Import Strategy:**
   - **Merge:** Update existing + add new (safest)
   - **Drop & Import:** Delete all and import fresh (dangerous)
   - **Backup & Replace:** Create backup, then drop & import (recommended for major updates)
4. **Upload Excel File**
5. **Preview & Validate** - See normalization preview
6. **Execute Import**

### Import Troubleshooting

**If import fails:**
1. Check PM2 logs: `pm2 logs mantap-api --lines 100`
2. Verify database columns exist
3. Check file size (max 50MB)
4. Ensure Excel has required columns

---

## 🔄 Rollback Procedure

If deployment fails:

```bash
su - servai
cd web/mantap.work/public_html/mantap-v1

# View previous commits
git log --oneline -10

# Rollback to previous version
git reset --hard <previous-commit-hash>

# Restore environment
cp server/.env.backup.* server/.env

# Redeploy
./deploy.sh prod
```

---

## 📝 Environment Variables

Ensure these are set in `server/.env`:

```bash
# Database
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=mantap_work_db

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Server
PORT=5000
NODE_ENV=production

# File Upload
MAX_FILE_SIZE=52428800
UPLOAD_PATH=./uploads
```

---

## 🧪 Post-Deployment Checklist

- [ ] Application loads without errors (https://mantap.work)
- [ ] School directory accessible (https://mantap.work/schools)
- [ ] Database connection working
- [ ] API endpoints responding
- [ ] Frontend built successfully
- [ ] PM2 process running: `pm2 list`
- [ ] File uploads working
- [ ] SSL certificate valid
- [ ] Filters working (test: Select Johor → check PPD dropdown)

---

## 📞 Server Information

- **Server:** mantap.work
- **Path:** /home/servai/web/mantap.work/public_html/mantap-v1
- **User:** servai
- **PM2 Process:** mantap-api
- **Database:** mantap_work_db

---

## 🔒 Security Notes

1. **Never commit `.env` files to git**
2. **Always backup before deployment**
3. **Use strong JWT secrets in production**
4. **Keep server and dependencies updated**
5. **Monitor PM2 logs regularly:** `pm2 logs mantap-api`
6. **Backup database before major changes**

---

## 📚 Related Documentation

- `SESSION_SUMMARY.md` - Current session context
- `CHANGELOG.md` - Version history
- `docs/school-directory/README.md` - School directory module docs

---

*Last Updated: February 11, 2026*
*Version: 1.2.1*