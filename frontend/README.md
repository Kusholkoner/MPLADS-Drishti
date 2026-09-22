# 🌐 MPLADS  — Frontend Web Application
### Pure Multipage Surveillance Command Center & Statutory Audit UI

[![Next.js 16](https://img.shields.io/badge/Next.js-16_App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19_Pure_JSX-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-CSS_v4-teal?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Lucide Icons](https://img.shields.io/badge/Icons-Lucide_React-orange?style=for-the-badge)](https://lucide.dev)
[![Recharts](https://img.shields.io/badge/Charts-Recharts-indigo?style=for-the-badge)](https://recharts.org)

> **Beneficiary Ministry**: Ministry of Statistics and Programme Implementation (MoSPI), Government of India  
> **Problem Statement**: **SIH26102** — AI-Powered Multi-Source Surveillance, Risk-Intelligence, and Vigilance Governance Layer for MPLADS  
> **Deployment**: [https://mplads-sentinel-omega.vercel.app](https://mplads-sentinel-omega.vercel.app)

---

## 🏛️ Architecture & Design Philosophy

The frontend is built using **Next.js 16 App Router** with **React 19** in a pure multipage architecture designed for operational vigilance and statutory auditing:

1. **Multipage Layout**: 
   - The standalone landing page has been removed. The **Surveillance Command Center** (`/app/command-center`) is the primary application interface and dashboard.
   - Root URL (`/`) automatically performs a server-level redirect to `/app/command-center`.
2. **Zero Fake Data Policy**:
   - Strictly presents authentic ingested data. Prior to dataset ingestion, dashboards rest at an authentic zero baseline (`0 works monitored`, `₹0 Cr sanctioned`, `0 risk flags`).
   - When datasets are ingested, all KPI cards, risk donuts, and priority anomaly queues compute dynamically from processed records.
3. **Dynamic API Resolution (`getApiBase()`)**:
   - The client dynamically resolves the backend URL, prioritizing the local Express server on port `5000` (`http://localhost:5000/api`) when running in local browsers before falling back to production cloud endpoints.
4. **Catch-All Project Twin Route (`/app/projects/[...projectId]`)**:
   - Safely handles official Indian government work codes containing forward slashes (e.g. `WS/MP620/2024` or `WS/MP18152/2024`).
5. **Calibrated National Geospatial Project Risk Map**:
   - Interactive India state-boundary geographic risk map (`/maps/india-states.png`) with calibrated WGS84 Geodetic normalization, animated pulsing radar pins, risk severity filters, and Digital Project Twin side drawers.
6. **Live System Activity Telemetry**:
   - Embedded in the bottom-left sidebar footer across all pages, polling `GET /api/system/activity` to display the operational status of the Database, Backend port `5000`, and `21/21 Ready` AI Modules.

---

## 🧭 Multipage Route Directory

| Route Path | View / Component | Primary Operational Role |
|---|---|---|
| **`/`** | Root Index | Server-side redirect to `/app/command-center`. |
| **`/app/command-center`** | National Command Center | Surveillance velocity charts, risk donut, priority anomaly queue, and 1-click batch ingest. |
| **`/app/analytics`** | National Geospatial Risk Map | Calibrated WGS84 Geodetic India risk map, state-by-state risk rankings, macro indicators. |
| **`/app/reports`** | Statutory Reports Panel | Persistent reports catalog browser (`reports_db.json`), official A4 HTML dossier viewer, batch ledgers. |
| **`/app/data`** | e-SAKSHI Ingestion Hub | 12 official MoSPI datasets mapping, drag-and-drop file dropzone, and 1-click batch ingestion. |
| **`/app/projects`** | Master Projects Directory | Multi-column filterable projects ledger, physical vs financial progress gap bars, CSV export. |
| **`/app/projects/[...projectId]`** | Digital Project Twin | Catch-all route for work details, triggered AI signals with statutory citations, and photo forensics. |
| **`/app/risk`** | Risk Screening Suite | Deep-dive anomaly filtering across critical, high, medium, and duplicate work tiers. |
| **`/app/copilot`** | Grounded Audit Copilot | Conversational AI assistant powered by Google Gemini 2.0 Flash citing MoSPI 2023 Guidelines & GFR 2017. |
| **`/app/investigations`** | Case Management Portal | Priority vigilance inquiry tracker, field inspection order dispatcher, and fund freeze actions. |
| **`/app/evidence`** | Evidence Vault | Cryptographic SHA-256 evidence vault, dHash photo deduplication studio, and EXIF geotag checks. |
| **`/app/admin`** | User & RBAC Manager | System administrator portal for user provisioning, jurisdiction scoping, and surveillance scope reset. |

---

## 🚀 Local Setup & Development

### 1. Prerequisites
- **Node.js**: `>= 18.18.0` (Node.js 20 LTS recommended)
- **npm**: `>= 9.x`

### 2. Install Dependencies
From the repository root:
```bash
npm install
```
Or within the `frontend/` directory:
```bash
cd frontend && npm install
```

### 3. Environment Variables
Create or verify `frontend/.env`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_AI_ENGINE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://vehldtcasdnmghnoktay.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Start Development Server
```bash
npm run dev
# Starts Next.js on http://localhost:3000
```

To run both frontend and backend concurrently from root:
```bash
npm run dev:all
```

### 5. Validate Production Build
```bash
npm run build
# Compiles all 27 App Router routes with zero TypeScript/lint errors
```

---

## 🛠️ Technology Stack & Dependencies

- **Framework**: Next.js 16.3.3 (App Router)
- **UI Runtime**: React 19.2.8 & React DOM 19.2.8
- **Styling**: Tailwind CSS v4 (PostCSS engine)
- **Visualizations**: Recharts 3.10.1 (ResponsiveContainer, BarChart, LineChart, PieChart)
- **Icons**: Lucide React 1.35.0
- **Class Utilities**: `clsx` & `tailwind-merge`
- **GIS Mapping**: Survey of India calibrated base raster (`/maps/india-states.png`) with WGS84 Geodetic normalization

---
*(MPLADS  — Frontend Web Application Documentation)*
