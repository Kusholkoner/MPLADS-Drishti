# MediKiosk — AI Clinical History Platform

A working prototype of the patient-facing kiosk + physician dashboard described in the
Ministry of Ayush problem statement: patients give their history by voice or touch,
scan their old documents, and a structured, physician-ready summary is waiting when
they walk into the consultation room.

This is real, runnable code — not a mockup. It's split into two apps:

```
medikiosk/
  backend/   Node.js + Express + MongoDB API, talks to your local Ollama model
  frontend/  React + Vite + Tailwind — patient kiosk + physician dashboard
```

## What's real vs. what's mocked

| Piece | Status |
|---|---|
| Conversational history engine (SOCRATES-based interview, AYUSH Dashavidha Pariksha mode) | Real — deterministic clinical flow + your local Ollama model for phrasing/summarizing |
| Voice input | Real — browser Web Speech API (no key needed; Chrome has the best support) |
| Document OCR | Real — Tesseract.js for images, pdf-parse for text PDFs, all local |
| Document entity extraction (diagnoses/meds/investigations) | Real — sent to your local Ollama model |
| Red-flag / emergency detection | Real — rule-based, deliberately not left to the LLM alone |
| Auth, consent logging, database | Real — JWT auth, MongoDB via Mongoose |
| ABHA verification / ABDM consent / HIS push | **Mocked** — you said you don't have ABDM sandbox credentials yet. Clearly labelled in `backend/src/services/abdmMockService.js`, with the real integration points documented below. |

## 1. Prerequisites

- Node.js 18+
- A MongoDB database — either [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier) or a local `mongod`
- [Ollama](https://ollama.com) installed and running locally, with a model pulled, e.g.:
  ```bash
  ollama pull llama3.1
  ollama serve
  ```

## 2. Backend setup

```bash
cd backend
cp .env.example .env
# edit .env:
#   MONGODB_URI      -> your Atlas connection string or mongodb://127.0.0.1:27017/medikiosk
#   JWT_SECRET        -> any long random string
#   OLLAMA_BASE_URL   -> usually http://127.0.0.1:11434 (default is fine if Ollama runs on the same machine)
#   OLLAMA_MODEL      -> the model you pulled, e.g. llama3.1

npm install
npm run seed   # creates a demo doctor login: doctor@medikiosk.demo / password123
npm run dev    # starts the API on http://localhost:5000
```

Check it's alive: open `http://localhost:5000/api/health` — it reports whether Ollama is reachable too.

## 3. Frontend setup

```bash
cd frontend
cp .env.example .env   # defaults work if the backend runs on localhost:5000
npm install
npm run dev             # http://localhost:5173
```

## 4. Try it

- Patient kiosk: `http://localhost:5173/kiosk/identify` — enter any 10-digit number, the OTP is
  shown on screen in dev mode (no SMS gateway wired up — see `DEV_OTP_BYPASS` in `.env`).
- Physician dashboard: `http://localhost:5173/staff/login` — log in with the seeded demo
  account, or register your own.

## Going live with ABDM

Every ABDM/HIS call currently runs through `backend/src/services/abdmMockService.js`, which
simulates the shape and timing of the real APIs without any network calls. When you have
sandbox credentials:

1. Register as a Health Information Provider (HIP) at the [ABDM sandbox](https://sandbox.abdm.gov.in).
2. Set `ABDM_MODE=live` and fill in `ABDM_BASE_URL`, `ABDM_CLIENT_ID`, `ABDM_CLIENT_SECRET`,
   `ABDM_HIP_ID` in `backend/.env`.
3. Replace the body of `verifyABHA`, `recordConsent`, and `pushToHIS` in that file with real
   calls to the ABDM Gateway (`/v0.5/users/auth/...`, `/v0.5/consent-requests/...`,
   `/v0.5/health-information/...`). The function signatures are deliberately unchanged so no
   route or controller needs to change.
4. `toFhirLikeBundle()` in the same file is where the structured summary becomes a FHIR
   Bundle — tighten it against the actual ABDM FHIR profiles once you're validating against
   the sandbox.

## Extending the OCR pipeline

- Scanned/image-only PDFs aren't rasterized in this build (that needs a native dependency
  like Ghostscript). Ask patients to photograph those pages instead, or wire in `pdf2pic` /
  `pdf-poppler` in `backend/src/services/ocrService.js`.
- If you have a vision-capable Ollama model (`llava`, `llama3.2-vision`), set
  `OLLAMA_VISION_MODEL` in `.env` and extend `runOCR()` to send the image straight to it for
  a second opinion on handwriting Tesseract struggles with.

## Production notes before a real deployment

- Lock down `POST /api/auth/staff/register` (currently open, fine for a demo) behind an
  admin invite flow.
- Swap the in-memory OTP store in `authController.js` for Redis, and wire in a real SMS
  gateway (MSG91 / Twilio) instead of the console log.
- Move uploaded files (currently on local disk in `backend/src/uploads`) to object storage
  (S3 / GCS) if you deploy across multiple backend instances.
- Multer 1.x (used here) has known CVEs — upgrade to Multer 2.x once you've smoke-tested the
  new API against this codebase.
- Add HTTPS/CORS lockdown, rate limiting on `/api/auth/*`, and audit logging on consent and
  ABDM push events for DPDP compliance.

## Project structure

```
backend/src/
  config/       db.js, upload.js (multer)
  models/       Patient, StaffUser, Session, ConsentLog, MedicalDocument
  services/     ollamaService, conversationEngine, summaryService, ocrService, abdmMockService
  utils/        clinicalOntology.js (SOCRATES, AYUSH Dashavidha Pariksha, red-flag rules), jwt.js, seed.js
  routes/ + controllers/   auth, consent, history, documents, abdm, physician

frontend/src/
  pages/Landing/     marketing site
  pages/Kiosk/       patient flow: Identify -> Converse -> Scan -> Summary
  pages/Physician/   Queue, PatientView (edit + confirm + push to HIS)
  pages/Auth/        staff login/register
  components/        Navbar, Footer, VoiceButton, ProgressBar, RedFlagBanner, RequireStaff
```
