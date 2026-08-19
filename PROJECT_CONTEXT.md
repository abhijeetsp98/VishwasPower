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
- **Frontend:** `frontend/src/components/VConnected63MVATransformerForms.js`
- **Backend routes:** `/api/vconnectData/` → `backend/routes/vConnectDataRoutes.js`
- **Controller:** `backend/controller/vConnectDataController.js`
- **Model:** `backend/model/VConnect.js`
- **Company routes:** `/api/vconnectcompany/`
- **Stages:** **7 stages** (Stage 1–6 = testing/commissioning forms, Stage 7 = Work Completion Report)
- **View form:** `frontend/src/components/VConnected63MVATransformerViewForm.js`
- **Stage review panel:** `frontend/src/components/VConnected63MVATransformerStageReviewPanel.js`

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

All previously known V Connect 63 MVA bugs have been resolved. See Section 15 for the current V Connect architecture.

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
- **Frontend repo:** `https://github.com/AkshayNinawe/vp-testing` (frontend engineer's repo — **updated Aug 2026**, previously `AkshayNinawe/Testing`)
- **Backend:** Running on VPS at port 4000, accessible via `https://vishwaspower.in/volttrack/api/`
- **Backend repo:** `https://github.com/AkshayNinawe/vp-testing.git` (branch: `master`) — **local copy at `C:\Hobby\vp-testing`**
- **Backend location on VPS:** `/var/www/volttrack-api/testing/`
- **Database:** MongoDB `volttrack` DB (separate from main app's `VishwasPower` DB)

### VoltTrack Auth (Different from main app)
- Uses `username` (not email) + `password` + `role`
- Roles: `Tester`, `Reviewer`, `Authorizer` (3-tier approval workflow)
- JWT tokens stored in localStorage as `volttrack_token_v1`
- **Bootstrap rule:** The very first account registered must be an `Authorizer`. After that, only an `Authorizer` (with valid JWT) can create `Tester` or `Reviewer` accounts. Check registration status via `GET /api/auth/registration-status`.

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

> **Why `PUPPETEER_SKIP_DOWNLOAD=true`:** The VPS has SSL certificate chain issues that prevent Puppeteer from downloading Chrome during `npm install`. The fix is to skip the download and point Puppeteer at the system Chrome (`/usr/bin/google-chrome-stable`). Make sure `google-chrome-stable` is installed on any new VPS: `apt-get install -y google-chrome-stable`.

### VoltTrack Backend (`/var/www/volttrack-api/testing/.env`)
```
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/volttrack
JWT_SECRET=volttrack-super-secret-change-this-2026
CORS_ORIGINS=https://test.apivishvaspower.com
API_BASE_PATH=/volttrack
```

> **`API_BASE_PATH=/volttrack`** — This mounts the API at both `/api` (direct) and `/volttrack/api` (via Nginx reverse proxy). The Nginx config proxies `https://vishwaspower.in/volttrack/api/` → `http://localhost:4000/volttrack/api/`. Do NOT change this value on the VPS.

> **`.env` is NOT in git** (gitignored). If you re-clone the repo, you must manually restore `.env` from backup. Always back up with: `cp /var/www/volttrack-api/testing/.env /root/volttrack-api.env.backup` before any destructive operation.

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

### 13.2 Stage Structure

**Auto Transformer (6 stages):**

| Stage | Forms | Description |
|---|---|---|
| 1 | 5 | Name Plate Details, Accessories Check, Core Insulation, Bushing Test, IR Values |
| 2 | 2 | Oil Filtration, IR After Erection |
| 3 | 3 | Pressure Test, Filtration Records, Final IR |
| 4 | 4 | Bushing/Winding Tests, Voltage Ratio, Magnetising, Winding Resistance |
| 5 | 2 | Valve Status/Air Venting, Final Pre-Commissioning Checks |
| 6 | 1 | Work Completion Certificate |

**V Connect 63 MVA (7 stages):**

| Stage | Forms | Description |
|---|---|---|
| 1 | 8 | Name Plate Details, CT Ratio Tests (Phase 1-3), Tan Delta, IR Values |
| 2 | 2 | Oil Filling Records, IR After Erection |
| 3 | 1 | Vacuum Cycle Recording + Pressure Test |
| 4 | 4 | Oil Filtration (Main Tank, Cooler Bank, Combine), IR & PI Values |
| 5 | 11 | SFRA, Ratio Test, Magnetising, Polarity, Short Circuit (×3), Winding Resistance, Tan Delta (×2), IR Values |
| 6 | 3 | Pre-Commissioning Checklist, Transformer Protection & Accessories, Final Checklist |
| 7 | 1 | Work Completion Report |

**Traction Transformer** follows the same 6-stage pattern with its own form set.

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

**All three departments use `POST` with a JSON body for `getTable` calls.** Do not use `axios.get` with query params — the backend only has a `POST /getTable` route that reads from `req.body`.

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
- Implemented in `FormStage.js` → `compressImage()` function (Auto Transformer)
- Also implemented in `VConnected63MVATransformerForms.js` → `compressImage()` function (V Connect)
- Applied to all photo uploads before sending to backend

---

### 13.11 Project Card — Last Submitted / Last Approved Display

Each project card in `ETCAdminPanel.js` shows who last submitted and who last approved, along with the stage number and timestamp. Here is the complete data flow:

**Step 1 — Data written to MongoDB on submit:**
When a site engineer submits the last form of a stage, the frontend calls `POST /api/{dept}company/updateFormsCompleted` with:
```js
{
  projectName, companyName, stage, formsCompleted,
  status: "pending-approval",
  userName,                          // logged-in user's name
  eventAction: `Stage ${stage} Submitted`
}
```
The backend stores:
- `lastSubmittedUser` = userName
- `lastSubmittedTimestamp` = current time
- `submittedStages[stage]` = true

**Step 2 — Data written to MongoDB on approve:**
When ETC admin approves a stage, the frontend calls `POST /api/{dept}company/approveCompanyStage`. The backend stores:
- `lastApprovedUser` = approving user's name
- `lastApprovedTimestamp` = current time
- `stageApprovals[stage]` = true
- `stage` advances to `stage + 1`

**Step 3 — Project card renders the stage number:**
`ETCAdminPanel.js` does NOT rely on any string field to determine the stage number. Instead it derives it directly from the maps at render time:

```js
// Last submitted stage = highest stage where submittedStages[N] = true
const lastSubmittedStage = Math.max(
  ...Object.entries(Project.submittedStages || {})
    .filter(([, v]) => v === true)
    .map(([k]) => parseInt(k))
);

// Last approved stage = highest stage where stageApprovals[N] = true
const lastApprovedStage = Math.max(
  ...Object.entries(Project.stageApprovals || {})
    .filter(([, v]) => v === true)
    .map(([k]) => parseInt(k))
);
```

**Why this approach:**
- `stageApprovals` and `submittedStages` are the source of truth — they are set atomically by the backend and never overwritten by subsequent events
- This works identically for Auto Transformer, V Connect, and Traction Transformer — no department-specific logic in the display code
- The displayed result: `👤 Last Submitted: Stage 3 by Pranay Patil` and `✅ Last Approved: Stage 2 by wilfred anthony`

---

## 14. V Connect 63 MVA — Photo Upload & View Form Architecture

### 14.1 PhotoUploadSection Component (`VConnected63MVATransformerForms.js`)

The `PhotoUploadSection` is a shared component used by all V Connect form components. It handles camera capture, gallery selection, and photo preview.

**Key state:**
```js
const [capturedPhotos, setCapturedPhotos] = useState({})  // preview URLs keyed by photoKey
const [currentPhotoKey, setCurrentPhotoKey] = useState(null)  // which slot is being captured
const [cameraStream, setCameraStream] = useState(null)
const [showCamera, setShowCamera] = useState(false)
```

**Props:**
```js
<PhotoUploadSection
  title="..."                    // description text
  photos={[{ key, label }]}      // array of photo slots
  onPhotoChange={(key, file) => {}} // called when photo selected/captured
  allowMultiple={false}          // enable bulk upload
  initialPhotos={{}}             // pre-populate previews from DB (photo URLs)
/>
```

**How camera works:**
1. `startCamera(photoKey)` — opens camera for a specific photo slot, stores `currentPhotoKey`
2. `useEffect` assigns `srcObject` + calls `.play()` AFTER the `<video>` element renders (avoids null ref)
3. `capturePhoto()` — draws video frame to canvas, creates File blob, stores preview URL in `capturedPhotos`
4. Camera buttons have `type="button"` + `e.preventDefault()` + `e.stopPropagation()` to prevent form auto-submit

**Important rules:**
- Each photo slot has its own Camera button — clicking Camera on slot 2 captures to slot 2 (not slot 1)
- After capture, a thumbnail preview appears with a red ❌ remove button
- Gallery selection also shows preview immediately
- `initialPhotos` is used when loading existing form data from DB to show previously uploaded photos

---

### 14.2 View Form Architecture (`VConnected63MVATransformerViewForm.js`)

The view form renders submitted form data in **read-only mode** for ETC admin review.

**Component structure:**
```
VConnected63MVATransformerViewFormRenderer (exported)
  ├── Stage1ReviewRenderer  → uses Stage1Form1-8 from StageReviewPanel
  ├── Stage2ReviewRenderer  → uses Stage2Form1-2
  ├── Stage3ReviewRenderer  → uses Stage3Form1
  ├── Stage4ReviewRenderer  → uses Stage4Form1-4
  ├── Stage5ReviewRenderer  → uses Stage5Form1-11
  ├── Stage6ReviewRenderer  → uses Stage6Form1-3
  ├── Stage7ReviewRenderer  → uses Stage7Form1
  └── GenericStageRenderer  → fallback, renders fields manually
```

**Form components are imported from `VConnected63MVATransformerStageReviewPanel.js`** (NOT from `VConnected63MVATransformerForms.js`). The stage review panel has its own read-only form components.

**The `FormComponent` pattern:**
```jsx
{FormComponent ? (
  <FormComponent formData={formData} />   // renders form + photos via PhotoUploadSection
) : (
  <div>...manual field rendering...</div>
)}

// ⚠️ IMPORTANT: Only call renderPhotos when FormComponent is absent
{!FormComponent && formData.photos && renderPhotos(formData.photos, form.id)}
```

**Why `!FormComponent &&` is required:**
- When `FormComponent` exists, it renders photos via `PhotoUploadSection` with `initialPhotos`
- Without the guard, `renderPhotos()` would also render the same photos → **double rendering**
- `GenericStageRenderer` has no `FormComponent`, so its `renderPhotos()` call has no guard (correct)

**`renderPhotos()` function:**
- Renders photos from DB as a grid with thumbnail, label, and Download button
- Handles full URL construction from relative paths stored in MongoDB

---

## 15. Testing Department Routes (Legacy — Hidden in UI)

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

---

## 16. VoltTrack Backend — Breaking Changes (Old → New, Aug 2026)

On **19 Aug 2026**, the VoltTrack backend was migrated from the old repo (`akshayninawe/testing`, branch `main`) to the new repo (`AkshayNinawe/vp-testing`, branch `master`). The following breaking changes were introduced. The **frontend engineer** must update the Hostinger frontend to match.

---

### 16.1 Job Name Normalization (NEW — Breaking)

**Old behavior:** Backend stored whatever name the frontend sent (e.g., `"V/M/ 2061"` with space).

**New behavior:** `normalizeJobName()` is applied before saving. It:
- Strips leading/trailing spaces
- Enforces `V/M/` prefix (no space after `/`)
- Example: `"V/M/ 2061"` → `"V/M/2061"`, `"2061"` → `"V/M/2061"`

**Frontend must:** Always send job names in `V/M/{number}` format (no space after last `/`). The backend will normalize, but the frontend display must match what the backend returns.

---

### 16.2 Registration Flow Changed (NEW — Breaking)

**Old behavior:** Any client could call `POST /api/auth/register` with any role freely.

**New behavior:**
1. Call `GET /api/auth/registration-status` first:
   ```json
   { "canBootstrapAuthorizer": true, "staffRegistrationRequiresAuthorizer": true }
   ```
2. If `canBootstrapAuthorizer: true` → first account must be `Authorizer` (no token needed)
3. If `canBootstrapAuthorizer: false` → only an `Authorizer` with a valid JWT can register `Tester`/`Reviewer` accounts. Send `Authorization: Bearer <token>` header.
4. Authorizers cannot register other Authorizers (only Tester/Reviewer).

**Frontend must:** Implement the registration-status check and pass the Authorizer's JWT when creating staff accounts.

---

### 16.3 `recomputeJobStatus` — Stricter Completion Criteria (Breaking for Existing Data)

**Old behavior:** Job status = `"Completed"` when ALL tests have `stage === "Authorized"`.

**New behavior:** Job status = `"Completed"` only when ALL tests have `stage === "Authorized"` **AND** each test has its authorizer sign-off name filled in (`authorized_by` field, or `pct_authorized_by` for POST-CONNECTION TEST, `pt_authorized_by` for POST-TANKING TEST).

**Impact on existing data:** Jobs that were previously `"Completed"` in the DB may now return as `"Processing"` if the authorizer name was not saved. The frontend must handle this gracefully (don't assume old "Completed" jobs stay completed).

---

### 16.4 Observation Save — Role-Based Field Locks (NEW — Breaking)

**Old behavior:** `PATCH /api/jobs/:jobId/tests/:testId/observation` saved the entire `observationData` object as-is.

**New behavior:** `applyRoleSignOffLocks()` is applied server-side:
- `Reviewer` (`Admin_Reviewed`) cannot change Technician or Authorizer sign-off fields
- `Tester` (`Admin_Tested`) cannot change Reviewer or Authorizer sign-off fields
- Locked fields are silently restored to their previous values

**Frontend must:** Do NOT rely on sending all fields and having them all saved. Each role should only send the fields it owns. The backend will protect the rest.

---

### 16.5 Stage Promotion — Mandatory Sign-Off Validation (NEW — Breaking)

**Old behavior:** A test could be promoted to any stage without any field validation.

**New behavior:**
- Promoting to `Reviewed`: `Select Technician` field must be filled (returns `403` if empty)
- Promoting to `Authorized`: `Select Reviewer` field must be filled (returns `403` if empty)

The specific field keys per test:
| Test Name | Technician Key | Reviewer Key |
|---|---|---|
| Most tests | `tested_by` | `reviewed_by` |
| POST-CONNECTION TEST | `pct_tested_by` | `pct_reviewed_by` |
| POST-TANKING TEST | `pt_tested_by` | `pt_reviewed_by` |
| FINAL LV TEST REPORT | `offered_by` | `tested_by` |

**Frontend must:** Validate that the required sign-off person is selected before calling the stage promotion endpoint. Show a clear error message if not.

---

### 16.6 New Endpoints Added

| Endpoint | Description | Auth Required |
|---|---|---|
| `GET /api/auth/registration-status` | Check if bootstrap Authorizer needed | None |
| `GET /api/users` | List all registered users | Authorizer only |
| `PATCH /api/users/:userId` | Edit user (name, username, role, password) | Authorizer only |
| `DELETE /api/users/:userId` | Delete a user | Authorizer only |
| `DELETE /api/jobs/:jobId` | Delete a job | Authorizer only |
| `PATCH /api/jobs/:jobId/tests/:testId/unaccept` | Undo accept on a test offer | Reviewer/Authorizer |

---

### 16.7 Sign-Off Date Stamping Changed

**Old behavior:** Date fields (`tested_at`, `reviewed_at`, etc.) were stamped inline in `index.ts` with simple key deletion on reject.

**New behavior:** `stampPrefixedSignOffDates()` and `clearSignOffOnReject()` from `signOff.ts` handle all date stamping. The logic is more comprehensive — covers PCT, PT, and FINAL LV prefixed keys.

**Frontend must:** Ensure it reads both `_at` and `_date` variants of date fields (e.g., `tested_at` and `tested_date`) as the backend may write either depending on the test type.

---

## 17. VoltTrack Backend — Deployment Runbook

### 17.1 Normal Deployment (Code Update)

```bash
# 1. SSH into VPS
ssh root@147.93.98.68

# 2. Go to backend directory
cd /var/www/volttrack-api/testing

# 3. Pull latest code
git pull origin master

# 4. Install any new dependencies
npm install

# 5. Restart PM2
pm2 restart volttrack-api
pm2 save

# 6. Verify
pm2 logs volttrack-api --lines 20
# Expected: "VoltTrack API running on http://localhost:4000"
#           "Also mounted at /volttrack/api"
#           "MongoDB connected: volttrack"

# 7. Health check
curl http://localhost:4000/api/health
# Expected: {"ok":true,"service":"volttrack-api","db":"mongodb"}
```

---

### 17.2 Full Re-Clone (Repo Change or Corruption)

Use this when the git remote needs to change or the directory is corrupted.

```bash
# 1. ALWAYS back up .env first
cp /var/www/volttrack-api/testing/.env /root/volttrack-api.env.backup
cat /root/volttrack-api.env.backup   # verify it looks correct

# 2. Stop PM2
pm2 stop volttrack-api

# 3. Delete old code and clone fresh
cd /var/www/volttrack-api
rm -rf testing
git clone https://github.com/AkshayNinawe/vp-testing.git testing
cd testing

# 4. Restore .env
cp /root/volttrack-api.env.backup .env

# 5. Install dependencies
npm install

# 6. Restart PM2
pm2 restart volttrack-api
pm2 save

# 7. Verify (same as above)
pm2 logs volttrack-api --lines 20
curl http://localhost:4000/api/health
```

> ⚠️ **Data is NEVER at risk** — MongoDB data lives in `/var/lib/mongodb/` and is never touched by these operations.

---

### 17.3 Checking MongoDB Data

```bash
# Open MongoDB shell
mongosh

# Switch to volttrack DB
use volttrack

# Count records
db.jobs.countDocuments()
db.users.countDocuments()

# View recent jobs (name, status, type)
db.jobs.find({}, {name:1, status:1, type:1, capacity:1, createdAt:1}).sort({createdAt:-1}).limit(10).pretty()

# View users (no passwords)
db.users.find({}, {passwordHash:0}).pretty()

# Exit
exit
```

---

### 17.4 PM2 Quick Reference

```bash
pm2 list                          # Show all processes + status
pm2 restart volttrack-api         # Restart VoltTrack backend
pm2 stop volttrack-api            # Stop VoltTrack backend
pm2 logs volttrack-api --lines 50 # View last 50 log lines
pm2 logs volttrack-api --err      # View error logs only
pm2 save                          # Save process list (survives reboot)
pm2 startup                       # Generate startup script (run once on new VPS)
```

---

## 18. VoltTrack Frontend — POC Handoff Document

> **For:** Frontend engineer (Hostinger deployment at `https://test.apivishvaspower.com`)  
> **Date:** 19 Aug 2026  
> **Context:** The VoltTrack backend has been updated to a new codebase (`AkshayNinawe/vp-testing`). The frontend must be updated to match the new API contract.

---

### 18.1 API Base URL (No Change)

The backend is still accessible at the same URL:
```
https://vishwaspower.in/volttrack/api
```
No change needed here.

---

### 18.2 Registration Flow — MUST UPDATE

The old open registration is gone. Implement this flow:

**Step 1 — Check registration status (new endpoint):**
```
GET /api/auth/registration-status
Response: { canBootstrapAuthorizer: boolean, staffRegistrationRequiresAuthorizer: boolean }
```

**Step 2a — If `canBootstrapAuthorizer: true`:**
- Show a special "Setup First Authorizer" screen
- Call `POST /api/auth/register` with `{ name, username, password, role: "Authorizer" }` — NO auth header needed
- Only `Authorizer` role is accepted here

**Step 2b — If `canBootstrapAuthorizer: false`:**
- Only an Authorizer can register new staff
- The Authorizer must be logged in
- Call `POST /api/auth/register` with `Authorization: Bearer <authorizer_token>` header
- Only `Tester` or `Reviewer` roles are accepted (not another Authorizer)

**Error responses to handle:**
- `403` — "First account must be an Authorizer" (bootstrap case, wrong role)
- `403` — "Only an Authorizer can register Tester and Reviewer accounts" (no token)
- `409` — "Username already exists"

---

### 18.3 Job Creation — Name Format

The backend now normalizes job names. Always send names in `V/M/{number}` format:
```json
POST /api/jobs
{ "name": "V/M/2061", "capacity": "8MVA", "type": "Auto" }
```
The backend will store `"V/M/2061"` (no space after last `/`). Display the name exactly as returned by the API — do not add spaces.

**Validation added:** If the name resolves to just `"V/M/"` (empty suffix), the backend returns `400`. Show a "Job name is required" error.

---

### 18.4 Observation Save — Role Locks

When saving observation data (`PATCH /api/jobs/:jobId/tests/:testId/observation`), the backend now enforces role-based field locks server-side:

- **Tester** can only write: `tested_by`, `tested_at`, `tested_date`, and all test-specific observation fields
- **Reviewer** can only write: `reviewed_by`, `reviewed_at`, `reviewed_date` (cannot overwrite Technician or Authorizer fields)
- **Authorizer** can write all fields

The frontend should already be locking these fields in the UI. The backend is now a second layer of enforcement.

---

### 18.5 Stage Promotion — Mandatory Validation

Before calling `PATCH /api/jobs/:jobId/tests/:testId/stage` with `action: "promote"`:

| Promoting to | Required field | Error if missing |
|---|---|---|
| `Reviewed` | Technician sign-off selected | `403: "Select Technician is mandatory before submitting to Reviewer."` |
| `Authorized` | Reviewer sign-off selected | `403: "Select Reviewer is mandatory before submitting to Authorizer."` |

The technician/reviewer field keys vary by test:
```
Most tests:           tested_by / reviewed_by
POST-CONNECTION TEST: pct_tested_by / pct_reviewed_by
POST-TANKING TEST:    pt_tested_by / pt_reviewed_by
FINAL LV TEST REPORT: offered_by / tested_by
```

---

### 18.6 Job Status — Stricter "Completed" Criteria

A job is now `"Completed"` only when ALL tests are `Authorized` AND each test has an authorizer name filled in. Previously, `Authorized` stage alone was enough.

The frontend should use the `status` field returned by the API — do not compute it client-side.

---

### 18.7 New Endpoints to Integrate (Authorizer UI)

These endpoints enable an Authorizer to manage staff and jobs from the UI:

```
GET    /api/users                    → List all users (name, username, role)
PATCH  /api/users/:userId            → Edit user { name, username, role, password? }
DELETE /api/users/:userId            → Delete user (cannot delete self or last Authorizer)
DELETE /api/jobs/:jobId              → Delete a job
PATCH  /api/jobs/:jobId/tests/:testId/unaccept  → Undo accept on a test offer
```

All require `Authorization: Bearer <authorizer_token>` header.

---

### 18.8 Sign-Off Date Fields — Read Both Variants

The backend may write date fields in two formats depending on the test type. Always read both:
```js
const date = observationData.tested_at || observationData.tested_date || '';
const pctDate = observationData.pct_tested_date || observationData.pct_tested_at || '';
```

---

### 18.9 Summary Checklist for Frontend POC

- [ ] Implement `GET /api/auth/registration-status` check before showing registration form
- [ ] Update registration to pass Authorizer JWT when creating Tester/Reviewer accounts
- [ ] Update job name display to match normalized format (`V/M/2061` not `V/M/ 2061`)
- [ ] Handle `403` errors on stage promotion (missing sign-off person)
- [ ] Do not compute job `status` client-side — use API response
- [ ] Read both `_at` and `_date` variants of sign-off date fields
- [ ] Add Authorizer UI for user management (`GET/PATCH/DELETE /api/users`)
- [ ] Add Authorizer UI for job deletion (`DELETE /api/jobs/:jobId`)
- [ ] Add unaccept test functionality (`PATCH .../unaccept`)

---

## 19. Incident & Change Log

| Date | Who | What |
|---|---|---|
| 19 Aug 2026 | Backend team | Migrated VoltTrack backend from `akshayninawe/testing` (branch `main`) to `AkshayNinawe/vp-testing` (branch `master`). Fresh clone at `/var/www/volttrack-api/testing/`. `.env` preserved. MongoDB data (51 jobs, 11 users) intact. |
| 19 Aug 2026 | Backend team | Identified breaking changes between old and new VoltTrack backend. Frontend POC handoff document created (see Section 18). |