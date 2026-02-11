# Backup Management Guide

## 📦 What Are SQL Backups?

When you use the **"Backup & Replace"** import strategy, the system automatically creates a `.sql` file containing all school data. This allows you to restore the database to a previous state if something goes wrong.

---

## 📁 Backup File Location

**Server Path:** `/home/servai/web/mantap.work/public_html/mantap-v1/server/backups/`

**File Format:** `schools_backup_YYYY-MM-DDTHH-MM-SS-mmmZ.sql`

---

## 🔧 Managing Backups

### 1. List All Backups

**Via API:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://mantap.work/api/schools/admin/import/backups/list
```

**Response:**
```json
{
  "success": true,
  "backups": [
    {
      "filename": "schools_backup_2026-02-11T08-30-15-123Z.sql",
      "created": "2026-02-11T08:30:15.123Z",
      "size": "4.2 MB",
      "recordCount": 10232
    }
  ],
  "totalBackups": 5,
  "totalSize": "21.0 MB"
}
```

---

### 2. Download a Backup

**Via Browser:**
1. Go to Admin → School Management
2. Click "Manage Backups" button (if UI available)
3. Click download icon next to backup

**Via API:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://mantap.work/api/schools/admin/import/backups/schools_backup_2026-02-11T08-30-15-123Z.sql \
  --output backup.sql
```

---

### 3. Restore Database from Backup

⚠️ **WARNING:** This will REPLACE all current school data with the backup data!

**Via API:**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  https://mantap.work/api/schools/admin/import/backups/schools_backup_2026-02-11T08-30-15-123Z.sql/restore
```

**Response:**
```json
{
  "success": true,
  "message": "Database restored successfully",
  "backup": "schools_backup_2026-02-11T08-30-15-123Z.sql",
  "currentSchoolCount": 10232,
  "restoredAt": "2026-02-11T09:15:30.000Z"
}
```

---

### 4. Delete a Backup

**Via API:**
```bash
curl -X DELETE \
  -H "Authorization: Bearer YOUR_TOKEN" \
  https://mantap.work/api/schools/admin/import/backups/schools_backup_2026-02-11T08-30-15-123Z.sql
```

**Response:**
```json
{
  "success": true,
  "message": "Backup schools_backup_2026-02-11T08-30-15-123Z.sql deleted successfully",
  "deletedFile": {
    "filename": "schools_backup_2026-02-11T08-30-15-123Z.sql",
    "size": "4.2 MB",
    "deletedAt": "2026-02-11T09:20:15.000Z"
  }
}
```

---

### 5. Auto Cleanup Old Backups

**Default Rules:**
- Keep backups newer than **30 days**
- Always keep at least **10 most recent** backups

**Via API:**
```bash
# Default cleanup (30 days, 10 backups)
curl -X DELETE \
  -H "Authorization: Bearer YOUR_TOKEN" \
  https://mantap.work/api/schools/admin/import/backups/cleanup

# Custom cleanup: Keep 7 days, keep 5 latest
curl -X DELETE \
  -H "Authorization: Bearer YOUR_TOKEN" \
  "https://mantap.work/api/schools/admin/import/backups/cleanup?keepDays=7&keepCount=5"
```

**Response:**
```json
{
  "success": true,
  "message": "Cleanup completed: 3 backups deleted",
  "deletedFiles": [
    {
      "filename": "schools_backup_2026-01-15T10-20-30-456Z.sql",
      "size": "4.1 MB",
      "age": 27
    }
  ],
  "freedSpace": "12.3 MB",
  "remainingBackups": 7
}
```

---

## 🛡️ Best Practices

### ✅ DO:
- **Keep at least 3-5 recent backups** before deleting old ones
- **Download important backups** to your local computer
- **Test restore process** on development server first
- **Run cleanup monthly** to free disk space
- **Label critical backups** with meaningful names (manually rename if needed)

### ❌ DON'T:
- **Delete all backups** - always keep at least 2-3 recent ones
- **Restore without verifying** - check backup date and size first
- **Ignore cleanup** - old backups accumulate and waste disk space
- **Delete backups while import is running** - wait for completion

---

## 📊 Backup Statistics

**Check backup stats:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://mantap.work/api/schools/admin/import/backups/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalBackups": 15,
    "totalSize": "63.5 MB",
    "oldestBackup": {
      "filename": "schools_backup_2026-01-01T00-00-00-000Z.sql",
      "date": "2026-01-01T00:00:00.000Z"
    },
    "newestBackup": {
      "filename": "schools_backup_2026-02-11T08-30-15-123Z.sql",
      "date": "2026-02-11T08:30:15.123Z"
    },
    "averageBackupSize": "4.2 MB"
  }
}
```

---

## 🔧 Manual Server Commands

If you have SSH access, you can also manage backups directly:

### List backups:
```bash
ls -lah /home/servai/web/mantap.work/public_html/mantap-v1/server/backups/
```

### Delete specific backup:
```bash
rm /home/servai/web/mantap.work/public_html/mantap-v1/server/backups/schools_backup_2026-02-11T08-30-15-123Z.sql
```

### Manual cleanup (keep last 10):
```bash
cd /home/servai/web/mantap.work/public_html/mantap-v1/server/backups/
ls -t *.sql | tail -n +11 | xargs rm -f
```

### Check disk usage:
```bash
du -sh /home/servai/web/mantap.work/public_html/mantap-v1/server/backups/
```

---

## 🆘 Emergency Restore

If you accidentally delete all schools or import wrong data:

### Step 1: Find Latest Backup
```bash
ls -t /home/servai/web/mantap.work/public_html/mantap-v1/server/backups/*.sql | head -1
```

### Step 2: Restore via MySQL
```bash
mysql -u your_db_user -p your_db_name < /path/to/backup.sql
```

### Step 3: Verify
```sql
SELECT COUNT(*) FROM schools;
```

---

## 📅 Recommended Backup Schedule

**Manual Backups:**
- Before any bulk import operation ✓ (automated)
- Before major updates to school data
- Monthly manual backup for archiving

**Auto Cleanup:**
- Run weekly: `0 0 * * 0` (Sunday midnight)
- Keep: Last 30 days, minimum 10 backups

---

## 💾 Storage Considerations

**Approximate Sizes:**
- Each backup: ~4-5 MB (for 10,000 schools)
- 30 backups: ~120-150 MB
- 100 backups: ~400-500 MB

**Disk Space:**
- Monitor with: `df -h`
- Cleanup when backups exceed 500 MB
- Consider offsite storage for critical backups

---

*Last Updated: February 11, 2026*