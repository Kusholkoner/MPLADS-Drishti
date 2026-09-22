# MPLABS Drishti — Workflow & Architecture Guide

> **Project:** MPLABS Drishti (दृष्टि)  
> **Programme:** SIH26102 | MoSPI DIID — AI-Powered MPLADS Fund Utilisation Surveillance  
> **Version:** 2.5.0  
> **Stack:** Next.js 16 · Express.js · FastAPI · Supabase · Gemini AI

---

## 1. Project Overview

MPLABS Drishti is a three-tier AI surveillance platform for monitoring the **Members of Parliament Local Area Development Scheme (MPLADS)** fund utilisation. It integrates **21 specialised AI modules** across financial anomaly detection, computer vision, natural language processing, geospatial analysis, and graph intelligence to provide end-to-end accountability for public works funded under MPLADS.

### Key Stakeholders & Roles

| Role | Description |
|------|-------------|
| `system_admin` | Full platform access, AI module management, user administration |
| `mospi_officer` | MoSPI federal oversight — dashboards, risk intelligence, audit reports |
| `mp` | MP constituency view — works overview and fund utilisation |
| `state_nodal_authority` | State-level project approval and monitoring |
| `field_verification_officer` | Field inspection, evidence upload, geo-verification |
| `implementing_agency` | Project execution, evidence submission, milestone updates |
| `investigator` | Deep-dive investigation mode, dossier generation |

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        MPLABS Drishti Stack                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐    REST/JSON    ┌──────────────────────────┐  │
│  │   Frontend       │ ◄────────────► │   Backend (Express)      │  │
│  │   Next.js 16     │                │   Node.js + Supabase     │  │
│  │   React 19       │                │   Port: 5000             │  │
│  │   Tailwind v4    │                │                          │  │
│  │   Port: 3000     │                │   Auth · Projects        │  │
│  │                  │    Direct      │   Evidence · Analytics   │  │
│  │   App Router     │ ◄────────────► │   Copilot · Datasets     │  │
│  │   40+ pages      │    AI calls    │   Investigations         │  │
│  └──────────────────┘                └──────────┬───────────────┘  │
│                                                 │                   │
│                                        REST/JSON │                  │
│                                                 ▼                   │
│                                 ┌───────────────────────────────┐   │
│                                 │   AI Engine (FastAPI)         │   │
│                                 │   Python + Gemini             │   │
│                                 │   Port: 8000                  │   │
│                                 │                               │   │
│                                 │   21 AI Modules               │   │
│                                 │   10 REST Endpoints           │   │
│                                 └───────────────────────────────┘   │
│                                                                     │
│  Database: Supabase PostgreSQL  ◄──── backend/config/supabase.js   │
│  Fallback: JSON file engine     ◄──── backend/services/reports…    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Directory Structure

```
MPLABS/
├── frontend/                    # Next.js 16 App Router (React 19, Tailwind v4)
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   │   ├── app/             # Authenticated app routes
│   │   │   │   ├── dashboard/   # Main dashboard
│   │   │   │   ├── projects/    # Project management
│   │   │   │   ├── risk/        # Risk Intelligence Suite
│   │   │   │   │   ├── page.jsx             # Risk Hub
│   │   │   │   │   ├── financial/           # Financial anomaly engine
│   │   │   │   │   ├── visual/              # Computer Vision engine
│   │   │   │   │   ├── duplicates/          # Duplicate detection (NLP/GIS)
│   │   │   │   │   ├── documents/           # OCR intelligence
│   │   │   │   │   ├── timeline/            # Milestone risk
│   │   │   │   │   ├── vendor-graph/        # Vendor Collusion GNN (NEW)
│   │   │   │   │   └── predictive/          # Predictive Risk Simulator (NEW)
│   │   │   │   ├── investigations/          # Dossier management
│   │   │   │   ├── datasets/                # Dataset management
│   │   │   │   ├── analytics/               # Analytics and reports
│   │   │   │   ├── copilot/                 # AI Audit Copilot
│   │   │   │   └── settings/                # Platform settings
│   │   │   ├── auth/            # Auth pages (login, register)
│   │   │   └── layout.jsx       # Root layout
│   │   ├── components/
│   │   │   ├── layout/          # AppShell, Sidebar, Header
│   │   │   ├── common/          # MetricCard, RiskBadge, etc.
│   │   │   └── features/        # Feature-specific components
│   │   └── lib/
│   │       ├── api/index.js     # All API calls (1200+ lines)
│   │       ├── constants.js     # App constants, nav config
│   │       └── formatters.js    # Currency, date formatters
│   ├── .env                     # Environment variables
│   ├── .env.example             # Template
│   └── package.json
│
├── backend/                     # Express.js + Supabase
│   ├── controllers/             # Route handlers
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── evidenceController.js
│   │   ├── investigationController.js
│   │   ├── copilotController.js
│   │   ├── analyticsController.js
│   │   ├── datasetController.js
│   │   ├── layoutController.js
│   │   └── aiEngineController.js  # AI Engine proxy (10 handlers)
│   ├── routes/                  # Express routers
│   ├── services/
│   │   ├── aiEngineService.js   # AI Engine HTTP client (13 methods)
│   │   ├── reportsDatabaseService.js  # JSON fallback engine
│   │   └── dynamicIngestionService.js
│   ├── config/
│   │   └── supabase.js          # Supabase client init
│   ├── middleware/
│   │   └── auth.js              # JWT middleware
│   ├── server.js                # Entry point (port 5000)
│   ├── .env                     # Environment variables
│   └── .env.example             # Template
│
├── ai-engine/                   # FastAPI Python AI Engine
│   ├── modules/                 # 21 AI modules
│   ├── api.py                   # FastAPI app + 10 endpoints
│   ├── config.py                # AI engine configuration
│   ├── requirements.txt         # Python dependencies
│   └── tests/                   # 30 unit tests
│
├── scripts/                     # Utility scripts
│   └── test_e2e_integration.js  # E2E integration test
│
└── workflow.md                  # This file
```

---

## 4. The 21 AI Modules

### Pipeline Flow
```
Entity Resolution (mod01)
    ↓
Signal Detection Layer (mod02–mod15)
    ↓
Risk Fusion (mod17)
    ↓
Explanation Engine (mod18)
    ↓
Dossier Generation (mod19)
    ↓
Audit Copilot Q&A (mod20)
```

### Module Reference

| # | Module File | Name | Category |
|---|------------|------|----------|
| 01 | `mod01_entity_resolution.py` | Entity Resolution & Identity Graph | Foundation |
| 02 | `mod02_financial_anomaly.py` | Financial Anomaly Detector | Financial |
| 03 | `mod03_image_similarity.py` | Visual Evidence Intelligence | Computer Vision |
| 04 | `mod04_gis_verification.py` | GIS & Geospatial Verification | Geospatial |
| 05 | `mod05_document_ocr.py` | Document OCR Intelligence | NLP/OCR |
| 06 | `mod06_semantic_similarity.py` | Semantic Duplicate Detection | NLP |
| 07 | `mod07_timeline_analysis.py` | Timeline & Milestone Risk | Temporal |
| 08 | `mod08_vendor_collusion.py` | Vendor Collusion Network (GNN) | Graph AI |
| 09 | `mod09_work_classification.py` | Work Type Classification | NLP |
| 10 | `mod10_quality_assessment.py` | Construction Quality Assessment | CV/ML |
| 11 | `mod11_fund_flow.py` | Fund Flow Analysis | Financial |
| 12 | `mod12_social_media.py` | Social Media Sentiment | NLP |
| 13 | `mod13_complaint_analysis.py` | Complaint & Grievance Analysis | NLP |
| 14 | `mod14_weather_correlation.py` | Weather & Environmental Correlation | External Data |
| 15 | `mod15_cross_ministry.py` | Cross-Ministry Duplicate Detection | NLP/GIS |
| 16 | `mod16_predictive_risk.py` | Predictive Risk Forecasting (XGBoost) | ML |
| 17 | `mod17_risk_fusion.py` | Risk Fusion & Composite Scoring | Aggregation |
| 18 | `mod18_explanation.py` | Explainability Engine (LIME/SHAP) | XAI |
| 19 | `mod19_dossier.py` | Automated Dossier Generation | Output |
| 20 | `mod20_audit_copilot.py` | Audit AI Copilot (Gemini) | LLM |
| 21 | `mod21_feedback.py` | Human Feedback & Model Learning | MLOps |

> **Note:** `composite_risk_score` uses **REVERSED convention**: 100 = fully compliant, 0 = maximum anomaly.  
> `risk_band = "critical"` when `final_score ≤ 25` AND `confirmatory_severe_signals ≥ 2`

---

## 5. API Endpoints

### Backend (Express) — Port 5000

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | Comprehensive multi-tier health check (Supabase DB, Storage, AI Engine) |
| POST | `/api/auth/register` | Register new institutional officer with Supabase Auth & PostgreSQL profile |
| POST | `/api/auth/login` | Officer sign in, retrieves Supabase JWT session and RBAC profile |
| POST | `/api/auth/logout` | Revoke active session |
| POST | `/api/auth/forgot-password` | Request password reset email via Supabase |
| GET | `/api/auth/me` | Fetch currently authenticated user session |
| GET | `/api/auth/roles` | List all 7 institutional roles and permission matrices |
| GET | `/api/auth/personas` | List 7 official synthetic test personas |
| GET | `/api/projects` | List projects with filters |
| GET | `/api/projects/:id` | Project detail |
| GET | `/api/evidence` | List evidence records |
| POST | `/api/evidence` | Upload photographic or document evidence binary |
| GET | `/api/investigations` | List investigation cases |
| POST | `/api/investigations` | Create new vigilance case file |
| POST | `/api/copilot/query` | AI Copilot Q&A grounded with Gemini 2.0 Flash & statutory RAG |
| GET | `/api/analytics/national` | National aggregate metrics |
| GET | `/api/analytics/states` | State-level metrics |
| GET | `/api/datasets` | List official datasets with schema introspection |
| GET | `/api/datasets/summary/national` | National dataset summary |
| POST | `/api/datasets/dynamic-ingest` | Multi-slot dynamic dataset ingestion |
| POST | `/api/ai/proposal-check` | Proposal eligibility & cost benchmark audit |
| POST | `/api/ai/duplicate-check` | Semantic and geospatial duplicate work detector |
| POST | `/api/ai/vision-verify` | Image dHash perceptual comparison & forensic verification |
| POST | `/api/ai/financial-physical-divergence` | Physical-financial progress divergence evaluation |
| GET | `/api/ai/graph-network` | Vendor collusion graph network |
| POST | `/api/ai/analyze-work` | Execute complete 21-module AI surveillance pipeline |
| POST | `/api/ai/semantic-similarity` | Sentence-BERT semantic text similarity |
| POST | `/api/ai/feedback/disposition` | Active learning auditor disposition feedback |

### AI Engine (FastAPI) — Port 8000

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Welcome banner, version, and active modules |
| GET | `/health` | Live health check (21 modules status, Gemini status) |
| GET | `/api/v1/health` | Canonical v1 health check endpoint |
| GET | `/api/v1/datasets` | List 12 cloud datasets catalog |
| POST | `/api/v1/analyze-work` | Run full 21-module AI surveillance pipeline |
| POST | `/api/v1/semantic/similarity` | 384-dimensional dense semantic similarity (Sentence-BERT) |
| POST | `/api/v1/semantic/rules-search` | RAG vector search over official MoSPI statutory rules |
| POST | `/api/v1/financial/isolation-forest` | 100-tree IsolationForest anomaly detection |
| POST | `/api/v1/vision/dhash-compare` | 64-bit difference hash (dHash) image verification |
| POST | `/api/v1/forensics/document-tamper-check` | Error Level Analysis (ELA) forensic tamper detection |
| POST | `/api/v1/copilot/query` | Gemini 2.0 Flash statutory grounded Audit Copilot |
| POST | `/api/v1/copilot/stream` | Server-Sent Events (SSE) streaming copilot |
| GET | `/api/v1/dossier/{work_id}` | Generate audit dossier & SHA-256 evidence card |
| GET | `/api/v1/vendor-graph/{district}` | NetworkX bipartite vendor relationship graph |
| POST | `/api/v1/feedback/disposition` | Active learning feedback loop |

---

## 6. How to Run the Project

### Quick Start (Run All Services Concurrently)

In the repository root:
```bash
npm run dev:all   #<--------------------------ise hi run karo ;)
# or: npm run dev
```
This automatically boots:
1. **AI Engine** on `http://localhost:8000`
2. **Express Backend** on `http://localhost:5000`
3. **Next.js Frontend** on `http://localhost:3000`

---

### Step-by-Step Manual Start (Individual Terminals)

If you prefer to run services in separate terminal windows:

#### Terminal 1 — Python AI Engine (FastAPI)
```bash
# From repository root
.venv\Scripts\python ai-engine/api.py
```
> Server starts on `http://localhost:8000`. Verify by opening `http://localhost:8000/health`.

#### Terminal 2 — Node.js Express Backend
```bash
# From repository root
node backend/server.js
```
> Server starts on `http://localhost:5000`. Supabase connects automatically. Verify via `http://localhost:5000/api/health`.

#### Terminal 3 — Next.js 16 Frontend
```bash
# From repository root
cd frontend
npm run dev
```
> Frontend compiles with Turbopack and starts on `http://localhost:3000`.

---

### Application Access Points

| Page / Service | URL | Purpose |
|----------------|-----|---------|
| **Institutional Dashboard** | [http://localhost:3000/app/dashboard](http://localhost:3000/app/dashboard) | Main landing overview, live system health, AI pipeline monitor |
| **Command Center** | [http://localhost:3000/app/command-center](http://localhost:3000/app/command-center) | High-density surveillance and work stream analytics |
| **Login / Register Portal** | [http://localhost:3000/login](http://localhost:3000/login) | Authenticate with Supabase or 1-click evaluation personas |
| **Master Projects** | [http://localhost:3000/app/projects](http://localhost:3000/app/projects) | Browse, inspect, and filter MPLADS works |
| **Risk Intelligence** | [http://localhost:3000/app/risk](http://localhost:3000/app/risk) | Financial anomalies, duplicate works, image verification |
| **AI Audit Copilot** | [http://localhost:3000/app/copilot](http://localhost:3000/app/copilot) | Grounded AI consultation powered by Gemini 2.0 Flash |
| **Backend Health** | [http://localhost:5000/api/health](http://localhost:5000/api/health) | Live latency and database diagnostics |
| **AI Engine Health** | [http://localhost:8000/health](http://localhost:8000/health) | AI microservice status and module manifest |

---

## 7. Testing

### AI Engine Tests (30 unit tests)
```bash
python -m unittest discover ai-engine/tests
# Expected: Ran 30 tests in ~1s OK
```

### Backend Syntax Checks
```bash
node -c backend/server.js
node -c backend/controllers/authController.js
node -c backend/services/aiEngineService.js
```

### E2E Integration Tests
```bash
node scripts/test_e2e_integration.js
```

### Frontend Build Verification
```bash
cd frontend
npm run build
```

---

## 8. Environment Variables Reference

### Frontend (`frontend/.env.example`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | ✅ | — | Backend API URL (production) |
| `NEXT_PUBLIC_LOCAL_API_URL` | ✅ | `http://localhost:5000/api` | Backend API URL (local) |
| `NEXT_PUBLIC_AI_ENGINE_URL` | ✅ | `http://localhost:8000` | AI engine URL |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | — | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✅ | — | Supabase anon key |

### Backend (`backend/.env.example`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | ❌ | `5000` | Backend server port |
| `NODE_ENV` | ❌ | `development` | Environment |
| `SUPABASE_URL` | ✅ | — | Supabase project URL |
| `SUPABASE_ANON_KEY` | ✅ | — | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | — | Supabase service role key |
| `AI_ENGINE_URL` | ✅ | `http://localhost:8000` | AI engine URL |
| `FRONTEND_URL` | ✅ | `http://localhost:3000` | Frontend URL (for CORS) |
| `GEMINI_API_KEY` | ✅ | — | Google Gemini API key |
| `JWT_SECRET` | ✅ | — | JWT signing secret |

---

## 9. Deployment

### Production URLs
- **Frontend:** Vercel or any static host → `https://drishti.mplabs.gov.in`
- **Backend:** Render / Railway → `https://mplads-backend.onrender.com`
- **AI Engine:** Render / Fly.io → `https://mplads-sentinel-2.onrender.com`

### Production Environment
1. Set `NODE_ENV=production` in backend
2. Set `NEXT_PUBLIC_API_URL` to production backend URL
3. Update CORS in `backend/server.js` `allowedOrigins`
4. Set `AI_ENGINE_URL` in backend to production AI Engine URL

---

## 10. Key Design Decisions

1. **Fallback-First Architecture:** When Supabase is unconfigured, the backend automatically falls back to a local JSON-based database engine (`reportsDatabaseService.js`). All API responses maintain the same shape.

2. **Demo Mode:** Frontend supports `mplads_demo_role` in localStorage for UI testing without backend auth — enabling rapid prototyping.

3. **AI Engine Resilience:** Each AI module wraps its logic in try/except. If an optional dependency (e.g., `sentence-transformers`) is missing, the module falls back to TF-IDF or heuristics. All 30 tests pass regardless of optional packages.

4. **Risk Score Convention:** `composite_risk_score` is intentionally reversed (100 = safe, 0 = critical). This is by design to allow direct use as a "compliance score" while treating low values as alerts.

5. **Streaming Copilot:** The `/api/v1/copilot` AI engine endpoint supports Server-Sent Events (SSE) streaming. The frontend uses `queryCopilot()` in `lib/api/index.js` for chunked streaming responses.

---

## 11. Deep Feature Audit & Implementation Status Matrix

All features have been systematically audited across `frontend/`, `backend/`, and `ai-engine/`:

| Module / Feature | Status | Details & Implementation Notes |
|------------------|:------:|--------------------------------|
| **Supabase Authentication** | ✅ **Active** | Full email/password registration and login with Supabase Auth, persistent JWT sessions, and profile synchronization with the PostgreSQL `profiles` table. |
| **RBAC Matrix (7 Roles)** | ✅ **Active** | Role-based route protection and persona switching (`mospi_officer`, `state_nodal_authority`, `mp`, `implementing_agency`, `investigator`, `field_verification_officer`, `system_admin`). |
| **Institutional Dashboard** | ✅ **Active** | Located at `/app/dashboard`. Features live health probes for all tiers, quick metrics, quick actions, and 21-module AI surveillance pipeline monitor. |
| **National Command Center** | ✅ **Active** | Located at `/app/command-center`. Real-time multi-source work streams, risk donut chart, priority inspection queue, and district filters. |
| **Master Projects Directory** | ✅ **Active** | Located at `/app/projects`. Multi-filter search, CSV export, single work inspection brief (`/app/projects/[...projectId]`). |
| **Risk Intelligence Suite** | ✅ **Active** | Located at `/app/risk`. Sub-pages for financial velocity (`/risk/financial`), image dHash (`/risk/visual`), duplicates (`/risk/duplicates`), document OCR (`/risk/documents`), and timeline SLA (`/risk/timeline`). |
| **Vendor Collusion GNN** | ✅ **Active** | Located at `/app/risk/vendor-graph`. Powered by NetworkX bipartite graph intelligence from Python AI Engine (`MOD-10` & `MOD-15`). |
| **Attack Simulator** | ✅ **Active** | Located at `/app/risk/predictive`. Multi-vector stress testing and fraud pattern synthesis. |
| **Vigilance Investigations** | ✅ **Active** | Located at `/app/investigations`. Case file management, SHA-256 evidence card generation, and audit notes. |
| **Evidence Repository** | ✅ **Active** | Located at `/app/evidence`. File upload with 25MB ceiling, geotag validation, and SHA-256 integrity hashing. |
| **AI Audit Copilot** | ✅ **Active** | Located at `/app/copilot`. Powered by Google Gemini 2.0 Flash (`MOD-20`) grounded in GFR 2017 & MPLADS Guidelines 2023 with SSE streaming. |
| **e-SAKSHI Ingestion Hub** | ✅ **Active** | Located at `/app/data`. 12 official national datasets, multi-slot dynamic ingestion, and local streaming fallback engine. |
| **National & State Analytics** | ✅ **Active** | Located at `/app/analytics`. GeoJSON map rendering, state-by-state drilldown (`/app/analytics/states/[state]`), and spending velocity curves. |
| **Layout Similarity Studio** | ✅ **Active** | Located at `/app/risk/documents/compare`. Digital forensics, ELA tamper detection, and template match score. |
| **21-Module AI Pipeline** | ✅ **Active** | Complete suite in `ai-engine/modules/`. 31 out of 31 unit tests passing (`ai-engine/tests`). |

### Ideal Future Enhancements (Post-SIH Prototype)
- **Production SMS / Aadhaar OTP**: For production field inspections, integrate Gov.in CDAC SMS gateway.
- **Drone / Satellite Multispectral Feeds**: Direct ingestion of ISRO Bhuvan satellite polygons into `MOD-14`.

---

*Generated by MPLABS Drishti implementation pipeline — SIH26102 | MoSPI DIID*
