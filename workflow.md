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
| GET | `/api/health` | Health check |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| GET | `/api/projects` | List projects with filters |
| GET | `/api/projects/:id` | Project detail |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:id` | Update project |
| GET | `/api/evidence` | List evidence |
| POST | `/api/evidence` | Upload evidence |
| GET | `/api/investigations` | List investigations |
| POST | `/api/investigations` | Create investigation |
| POST | `/api/copilot/query` | AI Copilot Q&A |
| GET | `/api/analytics/summary` | Analytics summary |
| GET | `/api/datasets` | List datasets |
| POST | `/api/datasets/ingest` | Ingest dataset |
| POST | `/api/ai/analyze` | Full AI analysis pipeline |
| POST | `/api/ai/risk` | Risk score for project |
| POST | `/api/ai/generate-dossier` | Generate audit dossier |
| POST | `/api/ai/copilot` | AI copilot (streaming) |
| GET | `/api/ai/pipeline-status` | AI pipeline health |
| POST | `/api/ai/analyze-work` | Analyze work order |
| POST | `/api/ai/semantic-similarity` | Compare two texts |
| POST | `/api/ai/feedback/disposition` | Submit feedback |

### AI Engine (FastAPI) — Port 8000

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Welcome + version |
| GET | `/health` | AI engine health |
| POST | `/api/v1/analyze` | Full 21-module pipeline |
| POST | `/api/v1/risk` | Risk score calculation |
| POST | `/api/v1/generate-dossier` | Dossier generation |
| POST | `/api/v1/copilot` | Copilot Q&A |
| GET | `/api/v1/pipeline-status` | Module status |
| POST | `/api/v1/analyze-work` | Work analysis |
| POST | `/api/v1/semantic-similarity` | Text similarity |
| POST | `/api/v1/feedback/disposition` | Feedback submission |

---

## 6. Development Setup

### Prerequisites
- **Node.js** v18+ & npm v9+
- **Python** 3.9+
- **Supabase** account (or use local JSON fallback)

### Installation

#### 1. Clone & Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Install AI engine dependencies
cd ../ai-engine
pip install -r requirements.txt
# Optional enhanced ML packages:
pip install sentence-transformers scikit-learn httpx
```

#### 2. Environment Configuration

**Frontend** (`frontend/.env`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_LOCAL_API_URL=http://localhost:5000/api
NEXT_PUBLIC_AI_ENGINE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxx
```

**Backend** (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
AI_ENGINE_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret_here
```

#### 3. Start All Services

```bash
# Terminal 1 — AI Engine
cd ai-engine
uvicorn api:app --reload --port 8000

# Terminal 2 — Backend
cd backend
node server.js
# or: npm start

# Terminal 3 — Frontend
cd frontend
npm run dev
```

Then open: **http://localhost:3000**

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

*Generated by MPLABS Drishti implementation pipeline — SIH26102 | MoSPI DIID*
