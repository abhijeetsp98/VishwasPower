# VishwasPower Project Context

> **Purpose:** This file is a reference for AI assistants and developers. Read this before making any changes to the codebase.

---

## 1. Project Overview

**VishwasPower** is a transformer servicing management system for **M/S Vishvas Power Engineering Services (P) Ltd**, Nagpur. It manages the complete lifecycle of transformer installation/servicing projects — from receiving the transformer to final commissioning.

**Live URL:** `https://vishwaspower.in`  
**GitHub:** `https://github.com/abhijeetsp98/VishwasPower`  
**VPS:** `root@147.93.98.68` (CloudPanel)

---

## 2. Architecture

```
Browser
├── https://vishwaspower.in          → React frontend (CRA, served from /var/www/vishwaspower/frontend/build)
├── https://vishwaspower.in/api/     → Main backend (Node.js/Express, port 8000)
├── https://vishwaspower.in/uploads/ → Static file uploads (images)
└── https://vishwaspower.in/volttrack/api/ → VoltTrack backend (TypeScript/Express, port 4000)

VPS (/var/www/vishwaspower/)
├── backend/     → Main Express backend (port 8000, PM2: vishwaspower-backend)
└── frontend/    → React CRA frontend (built to frontend/build/)

VPS (/var/www/volttrack-api/testing/)
└── server/      → VoltTrack TypeScript backend (port 4000, PM2: volttrack-api)

MongoDB (localhost:27017)
├── VishwasPower  → Main app database
└── volttrack     → VoltTrack testing app database
```

### Nginx Config Files
- `/etc/nginx/sites-enabled/vishwaspower.in` — HTTP config (port 80)
- `/etc/nginx/sites-enabled/vishwaspower.in.conf` — HTTPS config (port 443, SSL via Let's Encrypt)

### PM2 Processes
```
id 0: vishwaspower-backend  → node /var/www/vishwaspower/backend/index.js  (port 8000)
id 1: volttrack-api         → npx tsx server/index.ts                      (port 4000)
```

---

## 3. Main Application (VishwasPower)

### Tech Stack
- **Frontend:** React 18 (Create React App), JavaScript, Axios, html2pdf.js
- **Backend:** Node.js, Express 5, Mongoose, MongoDB, Multer (file uploads), Puppeteer (PDF generation), JWT auth, bcryptjs

### User Roles
| Role | Access |
|---|---|
| `admin` | Full access — sees MainAdminDashboard, can access all departments |
| `etcadmin` | ETC panel access — manages projects and companies |
| `site-engineer` | Same as etcadmin (redirects to etc-panel) |

### Frontend Navigation Flow
```
Login → MainAdminDashboard (admin) or ETCAdminPanel (etcadmin/site-engineer)
     → CompanyWorkflow (when a company/project is selected)
     → VoltTrackApp (separate testing department app, embedded)
```

### Key Frontend Files
| File | Purpose |
|---|---|
| `frontend/src/App.js` | Root component, handles routing between views |
| `frontend/src/components/constant.js` | **Central config** — API base URL, feature flags |
| `frontend/src/components/ETCAdminPanel.js` | Main panel for etcadmin — lists companies, projects, departments |
| `frontend/src/components/MainAdminDashboard.js` | Admin dashboard |
| `frontend/src/components/CompanyWorkflow.js` | Handles company/project workflow |
| `frontend/src/components/FormStage.js` | Generic form stage component |
| `frontend/src/utils/auth.js` | Auth utilities — token management, login/logout |

### constant.js (IMPORTANT — Change API URL here)
```js
export const BACKEND_API_BASE_URL = 'https://vishwaspower.in';
// export const BACKEND_API_BASE_URL = 'http://localhost:8000'; // for local dev

export const BACKEND_IMG_API_BASE_URL = 'https://vishwaspower.in/uploads/';
export const TESTING_DEPARTMENT = false; // Set true to show testing dept in UI
export const ENABLE_IMAGE_COMPRESSION = true;
export const IMAGE_COMPRESSION_MAX_WIDTH = 1920;
export const IMAGE_COMPRESSION_QUALITY = 0.8;
```

---

## 4. Transformer Departments

The app manages 3 types of transformers, each with their own set of forms organized into stages:

### 4.1 Auto Transformer
- **Frontend:** `frontend/src/components/TestingAutoTransformerForms.js`
- **Backend routes:** `/api/autoData/` → `backend/routes/autoDataRoutes.js`
- **Controller:** `backend/controller/autoDataController.js`
- **Model:** `backend/model/AutoTransformer.js`
- **Company routes:** `/api/autocompany/`
- **Stages:** 6 stages with multiple forms each
  - Stage 1: Transformer Details, Accessories, Safety Checklist, Bushing Test, IR Values
  - Stage 2: Oil Filtration, IR Values
  - Stage 3: Pressure Test, Filtration Records
  - Stage 4: Bushing/Winding Tests, Voltage Ratio, Magnetising, Winding Resistance
  - Stage 5: Valve Status, Final Checks
  - Stage 6: Commissioning Certificate

### 4.2 Traction Transformer
- **Frontend:** `frontend/src/components/TractionTransformerForms.js`
- **Backend routes:** `/api/tractionData/` → `backend/routes/tractionDataRoutes.js`
- **Controller:** `backend/controller/tractionDataController.js`
- **Model:** `backend/model/Traction.js`
- **Company routes:** `/api/tractioncompany/`

### 4.3 V Connect 63 MVA Transformer
- **Frontend:** `frontend/src/components/VConnected63MVATransformerForms.js` (11,590 lines)
- **Backend routes:** `/api/vconnectData/` → `backend/routes/vConnectDataRoutes.js`
- **Controller:** `backend/controller/vConnectDataController.js`
- **Model:** `backend/model/VConnect.js`
- **Company routes:** `/api/vconnectcompany/`
- **Stages:** 6 stages with multiple forms each
- **⚠️ KNOWN ISSUE:** Some forms use wrong API path `/api/table/getTable/...` instead of `/api/vconnectData/getTable/...`

---

## 5. Backend API Routes

### Auth
```
POST /api/auth/register   { name, email, password, role }
POST /api/auth/login      { email, password } → { token, _id, name, email, role }
GET  /api/auth/users      (admin only)
GET  /api/auth/validate-token
```

### Auto Transformer
```
GET/POST /api/autocompany/...     Company CRUD
POST     /api/autoData/getTable   { projectName, companyName, stage, formNumber } → form data
POST     /api/autoData/setTable   multipart/form-data → saves form + photos
POST     /api/autoData/getStageTable  { projectName, companyName, stage }
POST     /api/autoData/getCompleteTable { projectName, companyName }
POST     /api/autoData/download-all-forms  → PDF
```

### V Connect 63 MVA
```
GET/POST /api/vconnectcompany/...     Company CRUD
POST     /api/vconnectData/getTable   { projectName, companyName, stage, formNumber }
POST     /api/vconnectData/setTable   multipart/form-data → saves form + photos
POST     /api/vconnectData/getStageTable  { projectName, companyName, stage }
POST     /api/vconnectData/getCompleteTable { projectName, companyName }
POST     /api/vconnectData/download-all-forms → PDF
```

### Traction Transformer
```
GET/POST /api/tractioncompany/...
POST     /api/tractionData/getTable
POST     /api/tractionData/setTable
...
```

### VoltTrack (Testing Department — separate backend on port 4000)
```
POST /api/auth/register   { name, username, password, role: 'Tester'|'Reviewer'|'Authorizer' }
POST /api/auth/login      { username, password, role }
GET  /api/auth/me
GET  /api/jobs
POST /api/jobs            { name, capacity, type }
PATCH /api/jobs/:id/rating
PATCH /api/jobs/:id/tests/:testId/observation
PATCH /api/jobs/:id/tests/:testId/stage  { stage, action: 'promote'|'reject' }
PATCH /api/jobs/:id/tests/:testId/accept
POST  /api/jobs/:id/tests/accept-all
GET  /api/health
```

---

## 6. Data Storage Pattern

### Main App (Auto/Traction/VConnect)
- Each project is stored as a single MongoDB document
- Forms are nested: `autoTransformerData.stage1.form1`, `autoTransformerData.stage2.form1`, etc.
- Photos stored as file paths in `uploads/AutoTransformer/{Company}/{Project}/` folder
- Photo paths stored in MongoDB as relative paths (e.g., `uploads/AutoTransformer/Company/Project/Stage1_Form1_Photo1.jpg`)
- Photo URLs returned with full base URL prepended

### VoltTrack App
- Each job is a document in `volttrack` MongoDB database
- Tests stored as array inside job document
- No file uploads — all data is text/numbers

---

## 7. File Upload System

### How Photos Work (Auto/VConnect/Traction)
1. Frontend sends `multipart/form-data` POST to `/api/*/setTable`
2. Multer saves files to `uploads/{TransformerType}/{CompanyName}/{ProjectName}/`
3. Filename format: `Stage{N}_Form{N}_{PhotoKey}.{ext}`
4. File path stored in MongoDB as relative path
5. On retrieval, backend prepends `${protocol}://${host}/` to make full URL
6. Frontend displays images using `BACKEND_IMG_API_BASE_URL` + relative path

### Image Compression (Frontend)
- Controlled by `ENABLE_IMAGE_COMPRESSION` flag in `constant.js`
- Max width: 1920px, Quality: 80% JPEG
- Applied before upload to save VPS storage

---

## 8. Known Issues & Bugs

### Bug 1: V Connect 63 MVA — GET instead of POST for getTable
**File:** `frontend/src/components/VConnected63MVATransformerForms.js`  
**Problem:** Frontend calls `GET /api/vconnectData/getTable/Stage1Form1?companyName=...&projectName=...`  
**Root cause:** Backend only has `POST /getTable` that reads from `req.body`. GET with query params returns 404.  
**Fix needed:** Change frontend calls from `axios.get(url, { params: {...} })` to `axios.post(url, { stage, formNumber, companyName, projectName })`

### Bug 2: V Connect 63 MVA — Wrong API path for some forms
**File:** `frontend/src/components/VConnected63MVATransformerForms.js`  
**Problem:** Some forms call `/api/table/getTable/...` instead of `/api/vconnectData/getTable/...`  
**Affected forms:** Stage3Form1, Stage4Form1-4, Stage5Form7-9  
**Fix needed:** Change `/api/table/getTable/` to `/api/vconnectData/getTable/` in those calls

### Bug 3: V Connect 63 MVA — Photos not uploading
**Likely cause:** Related to Bug 1 — if the GET call fails on load, the form state may not initialize correctly, causing the save (POST setTable) to fail or send incomplete data.

---

## 9. Deployment Workflow

### Making Changes
1. Edit code locally at `C:\Hobby\Akshay\VishwasPower`
2. Test locally (optional — run `npm start` in frontend/, `npm run dev` in backend/)
3. `git add . && git commit -m "description" && git push origin main`
4. SSH to VPS: `ssh root@147.93.98.68`
5. `cd /var/www/vishwaspower && git pull origin main`
6. If backend changed: `pm2 restart vishwaspower-backend`
7. If frontend changed: `cd frontend && npm run build`

### Rebuilding Frontend on VPS
```bash
cd /var/www/vishwaspower/frontend
npm run build
# Build output goes to frontend/build/ which Nginx serves directly
```

### PM2 Commands
```bash
pm2 list                          # Show all processes
pm2 restart vishwaspower-backend  # Restart main backend
pm2 restart volttrack-api         # Restart VoltTrack backend
pm2 logs vishwaspower-backend     # View logs
pm2 save                          # Save process list
```

---

## 10. VoltTrack Testing App (Separate Application)

This is a **completely separate application** from the main VishwasPower app.

- **Frontend:** Hosted on Hostinger at `https://test.apivishvaspower.com`
- **Frontend repo:** `https://github.com/AkshayNinawe/Testing` (frontend engineer's repo)
- **Backend:** Running on VPS at port 4000, accessible via `https://vishwaspower.in/volttrack/api/`
- **Backend location on VPS:** `/var/www/volttrack-api/testing/`
- **Database:** MongoDB `volttrack` DB (separate from main app's `VishwasPower` DB)

### VoltTrack Auth (Different from main app)
- Uses `username` (not email) + `password` + `role`
- Roles: `Tester`, `Reviewer`, `Authorizer` (3-tier approval workflow)
- JWT tokens stored in localStorage as `volttrack_token_v1`

### VoltTrack Transformer Types
- Capacities: `8MVA`, `12.3MVA`, `16.5MVA`
- Types: `Auto`, `Traction`, `V Connect`
- Each job has 11 fixed tests that go through stages: `Not Started → Tested → Reviewed → Authorized`

---

## 11. Environment Variables

### Main Backend (`/var/www/vishwaspower/backend/.env`)
```
PORT=8000
MONGO_URL=mongodb://127.0.0.1:27017/VishwasPower
JWT_SECRET=your_jwt_secret_here
NODE_ENV=production
PUPPETEER_SKIP_DOWNLOAD=true
PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
NODE_TLS_REJECT_UNAUTHORIZED=0
```

### VoltTrack Backend (`/var/www/volttrack-api/testing/.env`)
```
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/volttrack
JWT_SECRET=volttrack-super-secret-change-this-2026
CORS_ORIGINS=https://test.apivishvaspower.com
API_BASE_PATH=/volttrack
```

---

## 12. Local Development Setup

```bash
# Backend
cd backend
npm install
npm run dev   # starts on port 8000 (or PORT from .env)

# Frontend
cd frontend
npm install
npm start     # starts on port 3000, proxies /api to localhost:8000
```

For local dev, change `constant.js`:
```js
export const BACKEND_API_BASE_URL = 'http://localhost:8000';
```
**Remember to revert before pushing to production.**

---

## 13. Form Submission, Approval & Rejection Workflow

This section explains the complete lifecycle of a project's forms across all 3 transformer departments. The workflow is **identical** for Auto Transformer, Traction Transformer, and V Connect 63 MVA — only the API routes differ.

---

### 13.1 Data Model — Company & Project

Each department has two MongoDB collections:
1. **Company collection** (e.g., `AutoTransformerCompany`) — stores company info + array of projects with stage tracking
2. **Data collection** (e.g., `AutoTransformer`) — stores the actual form field data, nested by stage/form

**Project document fields (inside `companyProjects` array):**
```js
{
  id: Number,
  name: String,           // project name
  companyName: String,
  stage: Number,          // current active stage (1-6)
  formsCompleted: Number, // how many forms filled in current stage
  totalForms: Number,     // total forms in current stage
  status: String,         // "in-progress" | "pending-approval" | "rejected" | "completed"
  stageApprovals: Map,    // { "1": true, "2": true, ... } — which stages are approved
  submittedStages: Map,   // { "1": true, "2": false, ... } — which stages are submitted
  rejectionReason: String,
  lastEventUser: String,
  lastEventAction: String,
  lastEventTimestamp: Date,
  lastSubmittedUser: String,
  lastApprovedUser: String,
}
```

---

### 13.2 Stage Structure (Auto Transformer — same pattern for all departments)

| Stage | Forms | Description |
|---|---|---|
| 1 | 5 | Name Plate Details, Accessories Check, Core Insulation, Bushing Test, IR Values |
| 2 | 2 | Oil Filtration, IR After Erection |
| 3 | 3 | Pressure Test, Filtration Records, Final IR |
| 4 | 4 | Bushing/Winding Tests, Voltage Ratio, Magnetising, Winding Resistance |
| 5 | 2 | Valve Status/Air Venting, Final Pre-Commissioning Checks |
| 6 | 1 | Work Completion Certificate |

**V Connect 63 MVA** has the same 6-stage structure but different form content.  
**Traction Transformer** follows the same pattern with its own form set.

---

### 13.3 Complete Workflow — Step by Step

```
[Site Engineer / ETC Admin]
        │
        ▼
1. SELECT DEPARTMENT → SELECT COMPANY → SELECT PROJECT
        │
        ▼
2. FILL FORMS (Stage N, Form 1 of M)
   - Each form: user fills fields + uploads photos
   - Click "Next Form" → saves form data via POST /api/{dept}Data/setTable
   - Repeat for all forms in the stage
        │
        ▼
3. SUBMIT STAGE (last form of stage)
   - Click "Submit Stage N"
   - Saves last form data
   - Calls POST /api/{dept}company/updateFormsCompleted with:
     { companyName, projectName, stage, status: "pending-approval", formsCompleted, userName }
   - Sets project.submittedStages[N] = true
   - Sets project.status = "pending-approval"
        │
        ▼
4. ETC ADMIN REVIEWS
   - Sees project with status "⏳ pending-approval"
   - Clicks "Review Stage N" button
   - Calls POST /api/{dept}Data/getStageTable to load all form data for that stage
   - Views all submitted forms in read-only review mode
        │
        ├──── APPROVE ────────────────────────────────────────────────────────┐
        │     - Calls POST /api/{dept}company/approveCompanyStage             │
        │       { companyName, projectName, stage, userName }                 │
        │     - Sets stageApprovals[N] = true                                 │
        │     - Advances project.stage to N+1 (unless stage 6)               │
        │     - Sets status = "in-progress" (or "completed" if stage 6)       │
        │     - Site engineer can now fill Stage N+1 forms                    │
        │                                                                     │
        └──── REJECT ─────────────────────────────────────────────────────────┘
              - Admin enters rejection reason in modal
              - Calls POST /api/{dept}company/rejectStage
                { companyName, projectName, stage, rejectionReason, userName }
              - Sets submittedStages[N] = false
              - Sets stageApprovals[N] = false
              - Sets status = "rejected"
              - Sets rejectionReason = "..."
              - Site engineer sees rejection message and must resubmit
```

---

### 13.4 API Routes for Each Department

| Action | Auto Transformer | Traction Transformer | V Connect 63 MVA |
|---|---|---|---|
| Save form data | `POST /api/autoData/setTable` | `POST /api/tractionData/setTable` | `POST /api/vconnectData/setTable` |
| Load form data | `POST /api/autoData/getTable` | `POST /api/tractionData/getTable` | `POST /api/vconnectData/getTable` |
| Load stage data | `POST /api/autoData/getStageTable` | `POST /api/tractionData/getStageTable` | `POST /api/vconnectData/getStageTable` |
| Submit stage | `POST /api/autocompany/updateFormsCompleted` | `POST /api/tractioncompany/updateFormsCompleted` | `POST /api/vconnectcompany/updateFormsCompleted` |
| Approve stage | `POST /api/autocompany/approveCompanyStage` | `POST /api/tractioncompany/approveCompanyStage` | `POST /api/vconnectcompany/approveCompanyStage` |
| Reject stage | `POST /api/autocompany/rejectStage` | `POST /api/tractioncompany/rejectStage` | `POST /api/vconnectcompany/rejectStage` |
| Get all companies | `GET /api/autocompany/` | `GET /api/tractioncompany/` | `GET /api/vconnectcompany/` |
| Add company | `POST /api/autocompany/` | `POST /api/tractioncompany/` | `POST /api/vconnectcompany/` |
| Add project | `POST /api/autocompany/addCompany` | `POST /api/tractioncompany/addCompany` | `POST /api/vconnectcompany/addCompany` |
| Delete project | `DELETE /api/autocompany/deleteProject` | `DELETE /api/tractioncompany/deleteProject` | `DELETE /api/vconnectcompany/deleteProject` |
| Delete company | `DELETE /api/autocompany/deleteCompany` | `DELETE /api/tractioncompany/deleteCompany` | `DELETE /api/vconnectcompany/deleteCompany` |
| Edit project name | `PUT /api/autocompany/editProjectName` | `PUT /api/tractioncompany/editProjectName` | `PUT /api/vconnectcompany/editProjectName` |
| Edit company name | `PUT /api/autocompany/editCompanyName` | `PUT /api/tractioncompany/editCompanyName` | `PUT /api/vconnectcompany/editCompanyName` |
| Download PDF | `POST /api/autoData/download-all-forms` | `POST /api/tractionData/download-all-forms` | `POST /api/vconnectData/download-all-forms` |

---

### 13.5 Form Data Save/Load Pattern

**Saving a form (setTable):**
```
Frontend sends: multipart/form-data POST to /api/{dept}Data/setTable
Body fields:
  - companyName: string
  - projectName: string
  - stage: number (1-6)
  - formNumber: number (1-N)
  - [all form fields as JSON strings or plain strings]
  - photos[PhotoKey]: File (image)

Backend stores in MongoDB:
  {dept}TransformerData.stage{N}.form{N} = { ...formFields, photos: { PhotoKey: "uploads/..." } }
```

**Loading a form (getTable):**
```
Frontend sends: POST to /api/{dept}Data/getTable
Body: { companyName, projectName, stage, formNumber }

Backend returns: { data: { ...formFields, photos: { PhotoKey: "https://vishwaspower.in/uploads/..." } } }
```

**⚠️ V Connect Bug:** Frontend incorrectly uses `axios.get(url, { params: {...} })` instead of `axios.post(url, body)` for getTable calls. This causes 404 errors. Fix: change to POST with body.

---

### 13.6 Project Status Values

| Status | Meaning | Who sets it |
|---|---|---|
| `in-progress` | Forms being filled, stage not yet submitted | Set on project creation or after approval |
| `pending-approval` | Stage submitted, waiting for ETC admin review | Set by `updateFormsCompleted` when last form submitted |
| `rejected` | Stage rejected by ETC admin | Set by `rejectStage` |
| `completed` | All 6 stages approved | Set by `approveCompanyStage` when stage 6 approved |

---

### 13.7 Stage Status Values (per stage)

| Stage Status | Meaning |
|---|---|
| `approved` | `stageApprovals[N] === true` |
| `pending-review` | `submittedStages[N] === true` AND `stageApprovals[N] !== true` |
| (empty) | Stage not yet submitted |

---

### 13.8 Authorization Rules

- **Approve stage:** Requires `etcadmin` or `admin` role (enforced by `protect + authorize` middleware)
- **Reject stage:** No auth check currently (open route) — `POST /api/{dept}company/rejectStage`
- **Submit forms:** No auth check — any logged-in user can submit
- **View forms:** No auth check on data routes

---

### 13.9 Frontend Components for Each Department

| Department | Form Component | Stage Review Component | View Form Component |
|---|---|---|---|
| Auto Transformer | `FormStage.js` | `AutoTransformerStageReviewPanel.js` | `AutoTransformerViewForm.js` |
| Traction Transformer | `TractionTransformerForms.js` | `TractionTransformerStageReviewPanel.js` | `TractionTransformerViewForm.js` |
| V Connect 63 MVA | `VConnected63MVATransformerForms.js` | `VConnected63MVATransformerStageReviewPanel.js` | `VConnected63MVATransformerViewForm.js` |

All three are rendered inside `ETCAdminPanel.js` based on `selectedDepartment`.

---

### 13.10 Image Compression (Frontend)

Before uploading photos, the frontend compresses images:
- Controlled by `ENABLE_IMAGE_COMPRESSION` in `constant.js` (currently `true`)
- Max width: 1920px, JPEG quality: 80%
- Implemented in `FormStage.js` → `compressImage()` function
- Applied to all photo uploads before sending to backend

---

## 14. Testing Department Routes (Legacy — Hidden in UI)

The main backend also has testing department routes that are currently hidden (`TESTING_DEPARTMENT = false` in constant.js):
```
/api/test_autocompany/
/api/test_autoData/
/api/test_autoTransformerData/
/api/test_tractioncompany/
/api/test_tractionData/
/api/test_vconnectcompany/
/api/test_vconnectData/
/api/volttrack/  (old VoltTrack routes — now superseded by separate volttrack-api on port 4000)
```
These routes exist in the backend but the UI doesn't show them. Do not remove them as they may have existing data.