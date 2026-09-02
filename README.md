# VishwasPower

Transformer servicing management system for **M/S Vishvas Power Engineering Services (P) Ltd**, Nagpur.

**Live URL:** https://vishwaspower.in  
**VPS:** `root@147.93.98.68`

---

## Quick Start (Local Dev)

```bash
# Backend
cd backend && npm install && npm run dev   # port 8000

# Frontend
cd frontend && npm install && npm start    # port 3001
```

For local dev, set in `frontend/src/components/constant.js`:
```js
export const BACKEND_API_BASE_URL = 'http://localhost:8000';
```
**Revert to `https://vishwaspower.in` before pushing to production.**

---

## Deploy to VPS

```bash
# 1. Push code
git add . && git commit -m "description" && git push origin main

# 2. SSH into VPS
ssh root@147.93.98.68

# 3. Pull latest
cd /var/www/vishwaspower && git pull origin main

# 4. If backend changed
pm2 restart vishwaspower-backend && pm2 save

# 5. If frontend changed
cd /var/www/vishwaspower/frontend && npm run build
```

---

## Architecture

```
https://vishwaspower.in          → React frontend (CRA)
https://vishwaspower.in/api/     → Node.js/Express backend (port 8000, PM2: vishwaspower-backend)
https://vishwaspower.in/uploads/ → Static file uploads
https://vishwaspower.in/volttrack/api/ → VoltTrack backend (port 4000, PM2: volttrack-api)
```

MongoDB runs locally on the VPS (`localhost:27017`):
- `VishwasPower` — main app database
- `volttrack` — VoltTrack testing app database

---

## Applications

### 1. Main App (VishwasPower)
Manages transformer installation/servicing projects across 3 departments:
- **Auto Transformer** — Stage 0 (Unloading) + Stages 1–6
- **Traction Transformer** — Stages 1–6
- **V Connect 63 MVA** — Stages 1–7

Each project goes through a stage-based form submission → ETC admin review → approve/reject workflow.

### 2. VoltTrack Testing App (Separate)
- **Frontend:** https://test.apivishvaspower.com (Hostinger)
- **Backend repo:** https://github.com/AkshayNinawe/vp-testing (branch: `master`)
- **Backend on VPS:** `/var/www/volttrack-api/testing/`
- 3-tier approval workflow: Tester → Reviewer → Authorizer

---

## Key Files

| File | Purpose |
|---|---|
| `PROJECT_CONTEXT.md` | **Full reference document** — read this before making changes |
| `frontend/src/components/constant.js` | API base URL, feature flags |
| `frontend/src/components/ETCAdminPanel.js` | Main panel — departments, companies, projects |
| `frontend/src/components/FormStage.js` | Auto Transformer form stages (Stage 0–6) |
| `backend/model/AutoTransformer.js` | MongoDB schema for Auto Transformer data |
| `backend/controller/autoDataController.js` | Form save/load/PDF endpoints |
| `backend/controller/autoCompanyController.js` | Company/project CRUD + stage approve/reject |

---

## Recent Changes (02 Sep 2026)

- **VoltTrack backend deployed** — pulled latest `vp-testing` changes, restarted PM2
- **Stage 0 (Unloading Checklist) added** for Auto Transformer — new projects now start at Stage 0 with 3 forms before the existing Stage 1–6 workflow. See `PROJECT_CONTEXT.md` Section 20.
- **Fixed stage=0 falsy bug** — `!stage` evaluates to `true` when `stage===0` in JavaScript. Fixed in `autoDataController.js` and `autoCompanyController.js`.

---

> For full architecture, API routes, deployment runbooks, and change history, see **`PROJECT_CONTEXT.md`**.