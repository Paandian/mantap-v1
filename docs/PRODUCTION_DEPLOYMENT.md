# Production Deployment Guide

## Quick Deployment Steps

### 1. Standard Update
```bash
# SSH into production server
cd /home/servai/web/mantap.work/public_html/mantap-v1

# Save local changes (if any)
git stash

# Pull latest changes
git pull origin main

# Restore local changes
git stash pop

# Restart application
pm2 restart mantap-api

# Verify status
pm2 status
pm2 logs mantap-api --lines 20
```

### 2. Database Migration (if needed)
```bash
# Run migration scripts
mysql -u root -p mantap_work_db < db/migrations/003_normalize_negeri_casing.sql
mysql -u root -p mantap_work_db < db/migrations/004_fix_wilayah_persekutuan.sql
mysql -u root -p mantap_work_db < db/migrations/005_complete_negeri_normalization.sql
```

### 3. Troubleshooting

**If PM2 not found:**
```bash
npm install -g pm2
pm2 start server/server.js --name mantap-api
pm2 save
```

**If port 5000 is in use:**
```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>

# Or change port in server/.env
PORT=5001
```

**If git conflicts:**
```bash
git checkout --theirs .
git add .
git commit -m "Resolved conflicts"
```

---

## Environment Variables

### Server (.env)
```
PORT=5000
NODE_ENV=production
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mantap_work_db
JWT_SECRET=your_jwt_secret
```

### Client (.env.production)
```
VITE_API_URL=https://mantap.work/api
```

---

## Important File Locations

- **Server:** `server/controllers/schoolController.js`
- **Landing Page:** `client/src/components/landing/SchoolsDirectory.vue`
- **School Directory:** `client/src/views/schools/SchoolDirectory.vue`
- **Store:** `client/src/stores/schools.js`
- **Database:** `db/migrations/`

---

## Testing After Deployment

1. **Homepage:** https://mantap.work
2. **School Directory:** https://mantap.work/schools
3. **API Health:** https://mantap.work/api/health
4. **Test Filters:** Select Johor → PPD Johor Bahru → Search

---

## Rollback (if needed)
```bash
# View previous commits
git log --oneline -10

# Rollback to specific commit
git reset --hard <commit-hash>
pm2 restart mantap-api
```

---

## Support

- **PM2 Docs:** https://pm2.keymetrics.io/
- **Git Docs:** https://git-scm.com/doc
- **MySQL Docs:** https://dev.mysql.com/doc/