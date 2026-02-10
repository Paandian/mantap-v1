# Documentation Index

**Last Updated:** February 10, 2026  
**Version:** 1.1.0

---

## 📚 Documentation Structure

This folder contains all documentation for the Mantap.work platform, organized by module for easy navigation.

---

## 🚀 Quick Start

| Document | Purpose | Audience |
|----------|---------|----------|
| [../README.md](../README.md) | Project overview | Everyone |
| [../CHANGELOG.md](../CHANGELOG.md) | Version history | Everyone |
| [../SESSION_SUMMARY.md](../SESSION_SUMMARY.md) | Current session status | Developers |
| [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) | Quick deployment guide | DevOps |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Detailed deployment | DevOps |

---

## 📦 Feature Modules

### Profile Settings
**Status:** ✅ Complete | **Path:** `./profile-settings/`

- Avatar upload
- Personal information management
- Password change

[View Documentation](./profile-settings/README.md)

### School Directory
**Status:** ✅ Core Complete | **Path:** `./school-directory/`

- 10,229 Malaysian schools
- Advanced search & filters
- School claim system
- Bulk import

[View Documentation](./school-directory/README.md)  
[View Progress Report](./school-directory/PROGRESS_REPORT.md)

---

## 🏗️ Architecture & Technical

### Core Documentation
| Document | Description |
|----------|-------------|
| [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) | Complete database schema |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | REST API reference |
| [AUTHENTICATION.md](./AUTHENTICATION.md) | Authentication system |
| [USER_MANAGEMENT.md](./USER_MANAGEMENT.md) | User roles & permissions |
| [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md) | Vue.js frontend structure |
| [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) | Environment configuration |

---

## 📊 Resources

**Path:** `./resources/`

Data inputs and reference files:
- `data-inputs/` - Excel files, CSV imports, bulk data

---

## 🔄 Module-Based Documentation Standard

To maintain consistency, all feature modules follow this structure:

```
docs/
├── README.md                          # Project overview
├── INDEX.md                           # This file
├── CHANGELOG.md                       # Root: version history
├── SESSION_SUMMARY.md                 # Root: session status
├── QUICK_DEPLOY.md                    # Deployment guide
├── DEPLOYMENT.md                      # Detailed deployment
├── ENVIRONMENT_SETUP.md              # Environment config
├── DATABASE_SCHEMA.md                # Database docs
├── API_DOCUMENTATION.md              # API reference
├── AUTHENTICATION.md                 # Auth system
├── USER_MANAGEMENT.md                # User roles
├── FRONTEND_ARCHITECTURE.md          # Frontend docs
│
├── [module-name]/                    # Module folders
│   ├── README.md                     # Module overview
│   └── PROGRESS_REPORT.md            # Detailed progress
│
├── profile-settings/                 # ✅ Example module
│   └── README.md
│
├── school-directory/                 # ✅ Example module
│   ├── README.md
│   └── PROGRESS_REPORT.md
│
└── resources/                        # Data & inputs
    └── data-inputs/
        └── *.xlsx, *.csv files
```

---

## 📝 Adding New Modules

When creating a new feature module:

1. Create folder: `docs/[module-name]/`
2. Add `README.md` - module overview and features
3. Add `PROGRESS_REPORT.md` - detailed implementation status
4. Update this INDEX.md
5. Update root CHANGELOG.md

---

## 🎯 Documentation Standards

1. **Keep it simple** - One concept per document
2. **Stay updated** - Sync with code changes
3. **Root files** - Only keep in root what needs to be found quickly:
   - README.md
   - CHANGELOG.md
   - SESSION_SUMMARY.md
4. **Module docs** - Everything else goes in module folders

---

## 🆘 Quick Help

**Can't find something?**
- Start with [../README.md](../README.md)
- Check [../CHANGELOG.md](../CHANGELOG.md) for recent changes
- See [../SESSION_SUMMARY.md](../SESSION_SUMMARY.md) for current status

**Documentation issues?**
- Outdated info → Update the relevant file
- Missing docs → Create new file in appropriate folder
- Broken links → Fix in source file

---

## 📊 Stats

| Metric | Count |
|--------|-------|
| Core Documents | 10 |
| Feature Modules | 2 |
| API Endpoints | 30+ |
| Database Tables | 15+ |

---

**Maintained by:** Development Team  
**Last Review:** February 2026
