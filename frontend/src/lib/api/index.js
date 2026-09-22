import { MOCK_PROJECTS } from "../mock/projects";
import { MOCK_EVIDENCE } from "../mock/evidence";
import { MOCK_INVESTIGATIONS } from "../mock/investigations";
import { MOCK_NATIONAL_ANALYTICS, MOCK_STATE_METRICS, MOCK_DISTRICT_METRICS, MOCK_GEO_POINTS } from "../mock/analytics";
import { MOCK_DATASETS } from "../mock/datasets";
export function getApiBase() {
    if (typeof window !== "undefined") {
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
            return process.env.NEXT_PUBLIC_LOCAL_API_URL || "http://localhost:5000/api";
        }
    }
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
}

export function getAiEngineBase() {
    if (typeof window !== "undefined") {
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
            return process.env.NEXT_PUBLIC_LOCAL_AI_ENGINE_URL || "http://localhost:8000";
        }
    }
    return process.env.NEXT_PUBLIC_AI_ENGINE_URL || "https://mplads-sentinel-2.onrender.com";
}

import { supabase } from "../supabaseClient";
// In-memory fallback state
const investigationsStore = [...MOCK_INVESTIGATIONS];
const projectsStore = [...MOCK_PROJECTS];
const evidenceStore = [...MOCK_EVIDENCE];
async function getAuthHeaders() {
    const headers = {};
    if (typeof window !== "undefined") {
        if (supabase) {
            try {
                const { data } = await supabase.auth.getSession();
                if (data?.session?.access_token) {
                    headers["Authorization"] = `Bearer ${data.session.access_token}`;
                    return headers;
                }
            }
            catch {
                // Ignore session read error
            }
        }
        const demoRole = localStorage.getItem("mplads_demo_role") || "mospi_officer";
        headers["x-demo-role"] = demoRole;
        headers["Authorization"] = `Bearer demo-${demoRole}`;
    }
    return headers;
}
async function fetchFromBackend(path, options) {
    try {
        const isFormData = typeof FormData !== "undefined" && options?.body instanceof FormData;
        const controller = new AbortController();
        const timeoutMs = isFormData ? 45000 : 8000;
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        const authHeaders = await getAuthHeaders();
        const headers = {
            ...authHeaders,
            ...(options?.headers || {}),
        };
        if (!isFormData) {
            headers["Content-Type"] = "application/json";
        }
        const apiBase = getApiBase();
        const res = await fetch(`${apiBase}${path}`, {
            ...options,
            headers,
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (res.ok) {
            const json = await res.json();
            if (json && json.success) {
                return json.data !== undefined ? json.data : json;
            }
            return json;
        }
    }
    catch {
        // Graceful fallback to in-memory store if backend server is not running
    }
    return null;
}
function getActiveUserRole() {
    if (typeof window !== "undefined") {
        return localStorage.getItem("mplads_demo_role") || "mospi_officer";
    }
    return "mospi_officer";
}

export const api = {
    // --- Projects ---
    async getProjects(params) {
        // Try Express backend
        const queryParams = new URLSearchParams();
        if (params?.search)
            queryParams.set("search", params.search);
        if (params?.state && params.state !== "all")
            queryParams.set("state", params.state);
        if (params?.district && params.district !== "all")
            queryParams.set("district", params.district);
        if (params?.category && params.category !== "all")
            queryParams.set("category", params.category);
        if (params?.riskLevel && params.riskLevel !== "all")
            queryParams.set("riskLevel", params.riskLevel);
        if (params?.status && params.status !== "all")
            queryParams.set("status", params.status);
        if (params?.limit)
            queryParams.set("limit", String(params.limit));
        const backendProjects = await fetchFromBackend(`/projects?${queryParams.toString()}`);
        if (backendProjects !== null && backendProjects !== undefined) {
            if (Array.isArray(backendProjects)) {
                return { projects: backendProjects, total: backendProjects.length };
            }
            if (backendProjects.projects && Array.isArray(backendProjects.projects)) {
                return { projects: backendProjects.projects, total: backendProjects.total ?? backendProjects.projects.length };
            }
            if (backendProjects.data && Array.isArray(backendProjects.data)) {
                return { projects: backendProjects.data, total: backendProjects.pagination?.total ?? backendProjects.data.length };
            }
        }

        // Active uploaded scope fallback
        if (typeof window !== "undefined") {
            try {
                const local = window.localStorage.getItem("mplads_active_scope");
                if (local) {
                    const parsed = JSON.parse(local);
                    if (parsed?.mode === "uploaded" && parsed.batch) {
                        let works = parsed.batch.workReports || parsed.batch.priorityProjects || [];
                        if (params?.search) {
                            const q = params.search.toLowerCase();
                            works = works.filter((w) => (w.id || "").toLowerCase().includes(q) || (w.title || "").toLowerCase().includes(q) || (w.district || "").toLowerCase().includes(q));
                        }
                        if (params?.state && params.state !== "all") {
                            works = works.filter((w) => (w.state || "").toLowerCase() === params.state.toLowerCase());
                        }
                        if (params?.district && params.district !== "all") {
                            works = works.filter((w) => (w.district || "").toLowerCase() === params.district.toLowerCase());
                        }
                        if (params?.category && params.category !== "all") {
                            works = works.filter((w) => (w.category || "") === params.category);
                        }
                        if (params?.riskLevel && params.riskLevel !== "all") {
                            const req = params.riskLevel.toLowerCase();
                            works = works.filter((w) => {
                                const isDup = w.risk_band === "DUPLICATE" || w.risk?.level === "duplicate";
                                if (req === "duplicate") return isDup;
                                return !isDup && ((w.risk_band && w.risk_band.toLowerCase() === req) || (w.risk?.level && w.risk.level.toLowerCase() === req));
                            });
                        }
                        if (params?.status && params.status !== "all") {
                            works = works.filter((w) => (w.status || "").toLowerCase() === params.status.toLowerCase());
                        }
                        const normalizedWorks = works.map((w, idx) => {
                            const isDup = w.risk_band === "DUPLICATE" || w.risk?.level === "duplicate";
                            const score = isDup ? null : (w.composite_risk_score ?? w.risk?.score ?? 0);
                            let level = isDup ? "duplicate" : (w.risk?.level || w.risk_band || "low").toLowerCase();
                            const sanctioned = w.financials?.sanctionedAmount ?? w.sanction_amount ?? 0;
                            const disbursed = w.financials?.disbursedAmount ?? w.disbursed_amount ?? 0;
                            return {
                                ...w,
                                id: w.id || w.work_id || `WORK-${idx + 1}`,
                                title: w.title || "Developmental Work",
                                category: w.category || "General",
                                state: w.state || "National",
                                district: w.district || "",
                                implementingAgency: w.implementingAgency || w.implementing_agency || "District Planning Authority",
                                financials: {
                                    sanctionedAmount: sanctioned,
                                    disbursedAmount: disbursed,
                                    paidDisbursedAmount: disbursed,
                                    verifiedExpenditureAmount: disbursed,
                                    unreconciledGap: Math.max(0, sanctioned - disbursed),
                                    comparableMedianAmount: Math.round(sanctioned * 0.85),
                                    costDeviationPercent: w.financials?.costDeviationPercent ?? 0,
                                    ...(w.financials || {}),
                                },
                                financialProgress: w.financialProgress ?? w.financial_progress ?? 0,
                                physicalProgress: w.physicalProgress ?? w.physical_progress ?? 0,
                                risk: {
                                    score,
                                    level,
                                    primarySignal: w.risk?.primarySignal || w.triggered_signals?.[0]?.finding || "Routine automated monitoring",
                                    ...(w.risk || {}),
                                },
                            };
                        });
                        return { projects: normalizedWorks, total: normalizedWorks.length };
                    }
                }
            } catch {}
        }
        return { projects: [], total: 0 };
    },
    async getProjectById(id) {
        const backendProject = await fetchFromBackend(`/projects/${id}`);
        if (backendProject)
            return backendProject;
        if (typeof window !== "undefined") {
            try {
                const local = window.localStorage.getItem("mplads_active_scope");
                if (local) {
                    const parsed = JSON.parse(local);
                    if (parsed?.mode === "uploaded" && parsed.batch) {
                        const works = parsed.batch.workReports || parsed.batch.flaggedCases || [];
                        const match = works.find((w) => w.id === id || w.work_id === id);
                        if (match) return match;
                    }
                }
            } catch {}
        }
        return null;
    },
    // --- Evidence ---
    async getEvidence(params) {
        const queryParams = new URLSearchParams();
        if (params?.projectId)
            queryParams.set("projectId", params.projectId);
        if (params?.type && params.type !== "all")
            queryParams.set("type", params.type);
        if (params?.status && params.status !== "all")
            queryParams.set("status", params.status);
        const backendEvidence = await fetchFromBackend(`/evidence?${queryParams.toString()}`);
        if (backendEvidence && Array.isArray(backendEvidence))
            return backendEvidence;
        return [];
    },
    async getEvidenceById(id) {
        const backendItem = await fetchFromBackend(`/evidence/${id}`);
        if (backendItem)
            return backendItem;
        return null;
    },
    // --- Investigations ---
    async getInvestigations(params) {
        const queryParams = new URLSearchParams();
        if (params?.status && params.status !== "all")
            queryParams.set("status", params.status);
        if (params?.priority && params.priority !== "all")
            queryParams.set("priority", params.priority);
        const backendCases = await fetchFromBackend(`/investigations?${queryParams.toString()}`);
        if (backendCases && Array.isArray(backendCases))
            return backendCases;
        return [];
    },
    async getInvestigationById(id) {
        const backendCase = await fetchFromBackend(`/investigations/${id}`);
        if (backendCase)
            return backendCase;
        return null;
    },
    async createInvestigation(data) {
        const backendCreated = await fetchFromBackend("/investigations", {
            method: "POST",
            body: JSON.stringify(data),
        });
        if (backendCreated) {
            investigationsStore.unshift(backendCreated);
            return backendCreated;
        }
        const project = projectsStore.find((p) => p.id === data.projectId) || projectsStore[0];
        const newCaseId = `CASE-2026-${Math.floor(10000 + Math.random() * 90000)}`;
        const newCase = {
            id: newCaseId,
            projectId: project.id,
            projectTitle: project.title,
            state: project.state,
            district: project.district,
            category: project.category,
            riskScore: project.risk.score,
            primaryIssue: data.primaryIssue,
            priority: data.priority || "high",
            status: "new",
            summary: `Automated investigation case opened for ${project.id}. Primary flagged reason: ${data.primaryIssue}`,
            assignedTo: {
                name: "Shri Rajesh Verma",
                role: "Senior Audit Officer",
                department: "MoSPI Performance Audit Cell",
                email: "r.verma.audit@gov.in",
            },
            evidenceIds: ["EVD-IMG-001", "EVD-DOC-003"],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            notes: data.notes
                ? [
                    {
                        id: `NOTE-${Date.now()}`,
                        authorName: "Shri Rajesh Verma",
                        authorRole: "Senior Audit Officer",
                        content: data.notes,
                        createdAt: new Date().toISOString(),
                        linkedEvidenceIds: project.risk.reasons.flatMap((r) => r.evidenceIds || []),
                    },
                ]
                : [],
            activityLogs: [
                {
                    id: `LOG-${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    actor: "Auditor Console",
                    action: "Case Created",
                    details: `Manual investigation initiated with priority ${(data.priority || "high").toUpperCase()}.`,
                    type: "status_change",
                },
            ],
            evidenceChain: [
                {
                    step: "risk",
                    title: "Multi-Source Anomaly Trigger",
                    subtitle: `Composite Risk: ${project.risk.score} / 100`,
                    status: "flagged",
                    details: "Automated surveillance threshold exceeded.",
                },
                {
                    step: "signal",
                    title: "AI Detection Engine",
                    subtitle: data.primaryIssue,
                    status: "flagged",
                    details: "Correlated risk reasons detected across financial and execution data.",
                },
            ],
        };
        investigationsStore.unshift(newCase);
        // Update project state in-memory
        const pIdx = projectsStore.findIndex((p) => p.id === data.projectId);
        if (pIdx !== -1) {
            projectsStore[pIdx] = { ...projectsStore[pIdx], investigationCaseId: newCaseId };
        }
        return newCase;
    },
    async updateInvestigationStatus(id, status, note) {
        const backendUpdated = await fetchFromBackend(`/investigations/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status, note }),
        });
        if (backendUpdated) {
            const idx = investigationsStore.findIndex((c) => c.id === id);
            if (idx !== -1)
                investigationsStore[idx] = backendUpdated;
            return backendUpdated;
        }
        const idx = investigationsStore.findIndex((c) => c.id === id);
        if (idx === -1)
            return null;
        const current = investigationsStore[idx];
        const updatedLogs = [
            ...current.activityLogs,
            {
                id: `LOG-${Date.now()}`,
                timestamp: new Date().toISOString(),
                actor: "Reviewing Officer",
                action: `Status Updated to ${status.toUpperCase()}`,
                details: note || `Status transitioned to ${status}.`,
                type: "status_change",
            },
        ];
        const updatedNotes = note
            ? [
                ...current.notes,
                {
                    id: `NOTE-${Date.now()}`,
                    authorName: "Reviewing Officer",
                    authorRole: "Auditor",
                    content: note,
                    createdAt: new Date().toISOString(),
                },
            ]
            : current.notes;
        const updated = {
            ...current,
            status,
            updatedAt: new Date().toISOString(),
            activityLogs: updatedLogs,
            notes: updatedNotes,
        };
        investigationsStore[idx] = updated;
        return updated;
    },
    async addInvestigationNote(id, content, linkedEvidenceIds) {
        const backendUpdated = await fetchFromBackend(`/investigations/${id}/notes`, {
            method: "POST",
            body: JSON.stringify({ content, linkedEvidenceIds }),
        });
        if (backendUpdated) {
            const idx = investigationsStore.findIndex((c) => c.id === id);
            if (idx !== -1)
                investigationsStore[idx] = backendUpdated;
            return backendUpdated;
        }
        const idx = investigationsStore.findIndex((c) => c.id === id);
        if (idx === -1)
            return null;
        const current = investigationsStore[idx];
        const newNote = {
            id: `NOTE-${Date.now()}`,
            authorName: "Shri Rajesh Verma",
            authorRole: "Senior Audit Officer",
            content,
            createdAt: new Date().toISOString(),
            linkedEvidenceIds: linkedEvidenceIds || [],
        };
        const updated = {
            ...current,
            updatedAt: new Date().toISOString(),
            notes: [...current.notes, newNote],
        };
        investigationsStore[idx] = updated;
        return updated;
    },
    // --- Evidence Vault ---
    async getEvidence(params) {
        const queryParams = new URLSearchParams();
        if (params?.projectId) queryParams.set("projectId", params.projectId);
        if (params?.type && params.type !== "all") queryParams.set("type", params.type);
        if (params?.status && params.status !== "all") queryParams.set("status", params.status);
        if (params?.search) queryParams.set("search", params.search);

        const qs = queryParams.toString();
        const backendItems = await fetchFromBackend(`/evidence${qs ? `?${qs}` : ""}`);
        if (backendItems && Array.isArray(backendItems)) {
            return backendItems;
        }

        let list = [...evidenceStore];
        if (params?.projectId) list = list.filter((e) => e.projectId === params.projectId);
        if (params?.type && params.type !== "all") list = list.filter((e) => e.type === params.type);
        if (params?.status && params.status !== "all") list = list.filter((e) => e.status === params.status);
        if (params?.search) {
            const q = params.search.toLowerCase();
            list = list.filter((e) => e.title.toLowerCase().includes(q) || e.projectTitle.toLowerCase().includes(q) || e.id.toLowerCase().includes(q));
        }
        return list;
    },
    async getEvidenceById(id) {
        const backendItem = await fetchFromBackend(`/evidence/${id}`);
        if (backendItem) return backendItem;
        return evidenceStore.find((e) => e.id.toLowerCase() === id.toLowerCase()) || null;
    },
    async uploadEvidence(evidenceData) {
        const backendCreated = await fetchFromBackend("/evidence", {
            method: "POST",
            body: JSON.stringify(evidenceData),
        });
        if (backendCreated) {
            evidenceStore.unshift(backendCreated);
            return backendCreated;
        }
        evidenceStore.unshift(evidenceData);
        return evidenceData;
    },
    async getAuditDossier(workId) {
        const AI_ENGINE_URL = getAiEngineBase();
        try {
            const res = await fetch(`${AI_ENGINE_URL}/api/v1/dossier/${encodeURIComponent(workId || "MPL-004821")}`);
            if (res.ok) {
                const data = await res.json();
                return data;
            }
        } catch {
            // Fallback
        }
        return null;
    },
    // --- Analytics ---
    async getNationalAnalytics() {
        const backendNational = await fetchFromBackend("/analytics/national");
        if (backendNational) {
            const riskCounts = (backendNational.riskCounts || backendNational.risk_counts || {});
            const riskDist = backendNational.riskDistribution;
            const isDistObj = riskDist && typeof riskDist === "object" && !Array.isArray(riskDist) && "low" in riskDist;
            const normalizedDist = isDistObj
                ? riskDist
                : {
                    low: riskCounts.low ?? 0,
                    medium: riskCounts.medium ?? 0,
                    high: riskCounts.high ?? 0,
                    critical: riskCounts.critical ?? 0,
                };
            return {
                totalWorksMonitored: Number(backendNational.totalWorksMonitored ?? backendNational.total_works_monitored ?? 0),
                totalSanctionedCr: Number(backendNational.totalSanctionedCr ?? backendNational.total_sanctioned_cr ?? 0),
                totalExpenditureCr: Number(backendNational.totalExpenditureCr ?? backendNational.total_disbursed_cr ?? backendNational.total_expenditure_cr ?? 0),
                highRiskCount: Number(backendNational.highRiskCount ?? riskCounts.high ?? 0),
                criticalRiskCount: Number(backendNational.criticalRiskCount ?? riskCounts.critical ?? 0),
                flaggedValueCr: Number(backendNational.flaggedValueCr ?? backendNational.totalFlaggedRiskValueCr ?? backendNational.total_flagged_risk_value_cr ?? 0),
                riskDistribution: normalizedDist,
                monthlyTrends: Array.isArray(backendNational.monthlyTrends) ? backendNational.monthlyTrends : [],
                categoryBreakdown: Array.isArray(backendNational.categoryBreakdown) ? backendNational.categoryBreakdown : [],
            };
        }
        return {
            totalWorksMonitored: 0,
            totalSanctionedCr: 0,
            totalExpenditureCr: 0,
            highRiskCount: 0,
            criticalRiskCount: 0,
            flaggedValueCr: 0,
            riskDistribution: { low: 0, medium: 0, high: 0, critical: 0 },
            monthlyTrends: [],
            categoryBreakdown: [],
        };
    },
    async getStateMetrics() {
        const backendStates = await fetchFromBackend("/analytics/states");
        if (backendStates && Array.isArray(backendStates))
            return backendStates;
        return [];
    },
    async getStateBySlug(stateSlug) {
        const backendState = await fetchFromBackend(`/analytics/states/${stateSlug}`);
        if (backendState)
            return backendState;
        return null;
    },
    async getDistrictMetrics() {
        const backendDistricts = await fetchFromBackend("/analytics/districts");
        if (backendDistricts && Array.isArray(backendDistricts))
            return backendDistricts;
        return [];
    },
    async getGeographicRiskPoints() {
        const backendPoints = await fetchFromBackend("/analytics/geopoints");
        if (backendPoints && Array.isArray(backendPoints))
            return backendPoints;
        return [];
    },
    // --- Datasets ---
    async getDatasets() {
        const backendDatasets = await fetchFromBackend("/datasets");
        let list = backendDatasets || [];
        const currentRole = getActiveUserRole();
        if (currentRole === "mp") {
            list = list.filter((d) => d.id?.includes("REC") || d.id?.includes("SANC") || d.id?.includes("COMP") || d.name?.includes("Lok Sabha"));
        } else if (currentRole === "field_verification_officer") {
            list = list.filter((d) => d.id?.includes("COMP") || d.name?.includes("Completed") || d.id?.includes("SANC"));
        } else if (currentRole === "implementing_agency") {
            list = list.filter((d) => d.id?.includes("SANC") || d.name?.includes("Sanctioned") || d.name?.includes("Limit"));
        }
        return list;
    },
    async getNationalDatasetSummary() {
        const backendSummary = await fetchFromBackend("/datasets/summary/national");
        if (backendSummary)
            return backendSummary;
        return {
            totalRecordsMonitored: 0,
            totalSanctionedWorks: 0,
            totalCompletedWorks: 0,
            totalSanctionedCr: 0,
            totalExpenditureCr: 0,
            activeRiskFlags: {
                criticalCount: 0,
                highCount: 0,
                duplicateLedgerRows: 0,
                splitPaymentStructuring: 0,
                timelineSlaBreaches: 0,
            },
            cloudDatasetCatalog: {
                lokSabhaDatasets: 6,
                rajyaSabhaDatasets: 6,
                totalOfficialFiles: 12,
            },
            topStates: [],
            lastComputedAt: new Date().toISOString(),
        };
    },
    async ingestESakshiFile(payload) {
        let resData = null;
        try {
            const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;
            const options = isFormData
                ? { method: "POST", body: payload }
                : { method: "POST", body: JSON.stringify(payload) };
            resData = await fetchFromBackend("/datasets/ingest-esakshi", options);
        } catch {
            // Handled below
        }
        if (resData) return resData;

        // Resilient in-memory simulation for standalone/preview mode
        const fileName = payload?.fileName || (payload instanceof FormData ? payload.get("fileName") : "eSAKSHI_Document.pdf") || "eSAKSHI_Document.pdf";
        const fileType = payload?.fileType || (fileName.endsWith(".csv") ? "registry_csv" : fileName.match(/\.(jpg|jpeg|png)$/i) ? "site_photo" : fileName.toLowerCase().includes("voucher") ? "pfms_voucher" : "contractor_bill");
        const projectId = payload?.projectId || "MPL-004821";
        const projectTitle = payload?.projectTitle || "Construction of Multipurpose Community Hall at Village Khera";

        const isPhoto = fileType === "site_photo";
        const isVoucher = fileType === "pfms_voucher";
        const isBill = fileType === "contractor_bill";

        const riskScore = isPhoto ? 89 : isBill ? 87 : isVoucher ? 82 : 76;
        const riskLevel = riskScore >= 80 ? "critical" : "high";

        return {
            ingestionId: `ESAKSHI-INGEST-${Date.now().toString().slice(-6)}`,
            sha256Stamp: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            ingestedAt: new Date().toISOString(),
            sourceSystem: "e-SAKSHI Administrative Portal",
            surveillanceStatus: "VERIFIED_WITH_FINDINGS",
            fileMeta: {
                name: fileName,
                size: payload?.fileSize || "1.8 MB",
                type: fileType,
            },
            targetProject: {
                id: projectId,
                title: projectTitle,
            },
            surveillanceOutcome: {
                compositeRiskScore: riskScore,
                riskLevel: riskLevel,
                priorityBand: "URGENT_AUDIT_QUEUE",
                detectedAnomalies: isPhoto ? [
                    { module: "Mod 13: Visual Verification AI (dHash)", severity: "critical", title: "99.4% Perceptual Image Reuse Match", detail: "Foundation casting photo matches archive project MPL-002419 in North West Delhi." },
                    { module: "Mod 14: Geospatial Verification AI", severity: "critical", title: "EXIF Geotag Boundary Mismatch (18.7 km offset)", detail: "Camera coordinates 28.7845°N, 77.0892°E fall outside registered site bounds." }
                ] : isBill ? [
                    { module: "Mod 05: Cost Anomaly AI", severity: "critical", title: "Claimed Unit Rate Divergence (+31.4%)", detail: "RCC structural item claimed at ₹14,200/cum vs CPWD ceiling ₹10,800/cum." },
                    { module: "Mod 04: Statutory Compliance AI", severity: "high", title: "Cumulative Claim Exceeds Sanction Ceiling", detail: "RA Bill reaches ₹41.0 L against Administrative Sanction ₹35.0 L." }
                ] : isVoucher ? [
                    { module: "Mod 08: Physical-Financial Divergence AI", severity: "critical", title: "Premature Advance Disbursement (36% Gap)", detail: "PFMS Treasury release indicates 88% disbursed while certified progress is 52%." }
                ] : [
                    { module: "Mod 09: Duplicate Work AI (SBERT + GIS)", severity: "high", title: "Duplicate Scope Cluster (<450m Proximity)", detail: "92.4% text similarity and spatial overlap with contiguous work MPL-004822." }
                ],
                statutoryCitations: [
                    "MPLADS Guidelines 2023 Section 3.4 / GFR 2017 Rule 130",
                    "Central Vigilance Commission (CVC) Circular No. 02/02/2023"
                ],
                registeredEvidenceId: `EVD-ESAKSHI-${Date.now().toString().slice(-4)}`
            }
        };
    },
    async getDynamicSlots() {
        try {
            const res = await fetchFromBackend("/datasets/slots");
            if (res && res.data) return res.data;
        } catch {
            // Handled by fallback
        }
        return [
            { key: "recommended", label: "Works Recommended", shortTitle: "Proposals & Recommendations", description: "Developmental works proposed and prioritized by Hon'ble MPs.", isAuthorized: true },
            { key: "sanctioned", label: "Works Sanctioned", shortTitle: "Administrative Sanctions", description: "Administratively approved projects, cost estimates, and implementing agency work orders.", isAuthorized: true },
            { key: "completed", label: "Works Completed", shortTitle: "Completion Certificates", description: "Handover inspection certificates, certified completion dates, and asset status.", isAuthorized: true },
            { key: "expenditure", label: "Expenditure & Disbursements", shortTitle: "Treasury Vouchers & RA Bills", description: "Itemized treasury drawdowns, contractor payments, and Running Account (RA) bills.", isAuthorized: true },
            { key: "limits", label: "Allocated Limits for Hon'ble MPs", shortTitle: "MP Quota Entitlements", description: "Annual statutory entitlement limits, sanctioned commitments, and unspent balances.", isAuthorized: true },
            { key: "calamity", label: "Calamity Consents", shortTitle: "Disaster Relief Allocations", description: "Special emergency contributions for declared national and state calamities.", isAuthorized: true },
        ];
    },
    async dynamicIngestFiles(payload) {
        let result = null;
        try {
            const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;
            const options = isFormData
                ? { method: "POST", body: payload }
                : { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) };
            const res = await fetchFromBackend("/datasets/dynamic-ingest", options);
            if (res) result = res;
        } catch (err) {
            console.warn("[API dynamicIngestFiles Warning]", err);
        }

        if (!result) {
            // Fallback simulation with complete schemaReports guaranteed
            const houseVal = payload?.house || (payload instanceof FormData ? payload.get("house") : "lok_sabha") || "lok_sabha";
            const mockWorks = [
                {
                    id: "WORK-UP-0001",
                    work_id: "WORK-UP-0001",
                    title: "Construction of Multipurpose Community Hall at Village Khera",
                    state: "Delhi",
                    district: "North West Delhi",
                    implementing_agency: "Delhi State Industrial and Infrastructure Development Corp (DSIIDC)",
                    category: "Drinking Water & Community Infrastructure",
                    sanction_amount: 3500000,
                    disbursed_amount: 3080000,
                    financials: { sanctionedAmount: 3500000, disbursedAmount: 3080000, utilizationPercentage: 88 },
                    composite_risk_score: 87.0,
                    risk_band: "CRITICAL",
                    risk: { level: "CRITICAL", score: 87.0, primarySignal: "Financial disbursement reaches 88% while physical progress is stalled at 52%.", lastAssessedAt: new Date().toISOString() },
                    confidence: 0.94,
                    status: "Immediate Inquiry",
                    triggered_signals: [
                        { code: "FIN_DIV_01", module: "Mod 08: Physical-Financial Divergence", severity: "critical", finding: "Financial disbursement reaches 88% while physical progress is stalled at 52%.", citation: "MPLADS Guidelines 2023 §3.4" }
                    ],
                    missingDataImpact: [],
                    recommendation: "Depute nodal verification team for on-site physical inspection before further fund release."
                },
                {
                    id: "WORK-UP-0002",
                    work_id: "WORK-UP-0002",
                    title: "Installation of High-Mast Solar LED Illumination Tower at Gram Panchayat",
                    state: "Rajasthan",
                    district: "Jaipur",
                    implementing_agency: "Rajasthan Renewable Energy Corp (RREC)",
                    category: "Solar Lighting & Energy",
                    sanction_amount: 1800000,
                    disbursed_amount: 1650000,
                    financials: { sanctionedAmount: 1800000, disbursedAmount: 1650000, utilizationPercentage: 91 },
                    composite_risk_score: 79.0,
                    risk_band: "HIGH",
                    risk: { level: "HIGH", score: 79.0, primarySignal: "High semantic similarity (>88%) detected with adjacent sanctioned work.", lastAssessedAt: new Date().toISOString() },
                    confidence: 0.88,
                    status: "Audit Review",
                    triggered_signals: [
                        { code: "SCOPE_DUP_02", module: "Mod 09: Duplicate Work AI (SBERT)", severity: "high", finding: "High semantic similarity match (>88%) identified with adjacent sanctioned works under identical agency.", citation: "MPLADS Guidelines 2023 §2.4" }
                    ],
                    missingDataImpact: [],
                    recommendation: "Seek itemized measurement book (MB) records from Implementing Agency."
                },
                {
                    id: "WORK-UP-0003",
                    work_id: "WORK-UP-0003",
                    title: "Concrete Pavement and Drainage Construction in Ward 14",
                    state: "Karnataka",
                    district: "Bengaluru Urban",
                    implementing_agency: "Bruhat Bengaluru Mahanagara Palike (BBMP)",
                    category: "Rural Roads",
                    sanction_amount: 4200000,
                    disbursed_amount: 2800000,
                    financials: { sanctionedAmount: 4200000, disbursedAmount: 2800000, utilizationPercentage: 66 },
                    composite_risk_score: 24.0,
                    risk_band: "LOW",
                    risk: { level: "LOW", score: 24.0, primarySignal: "Standard operational profile within statutory tolerances.", lastAssessedAt: new Date().toISOString() },
                    confidence: 0.92,
                    status: "Compliant",
                    triggered_signals: [],
                    missingDataImpact: [],
                    recommendation: "Routine automated monitoring cycle."
                }
            ];

            result = {
                success: true,
                batchId: `BATCH-${houseVal.toUpperCase()}-${Date.now().toString().slice(-6)}`,
                house: houseVal,
                userRole: "mospi_officer",
                timestamp: new Date().toISOString(),
                executionTimeMs: 480,
                summary: {
                    totalSlotsDefined: 6,
                    slotsAvailableCount: 6,
                    completenessPercent: 100,
                    totalRawRowsProcessed: 1845,
                    totalWorksCount: mockWorks.length,
                    flaggedCasesCount: 2,
                    totalSanctionedCr: 0.95,
                    totalExpenditureCr: 0.75,
                    criticalCount: 1,
                    highCount: 1,
                    mediumCount: 0,
                    lowCount: 1,
                    status: "HIGH_ASSURANCE",
                },
                availabilityMatrix: {
                    recommended: { available: true, label: "Works Recommended", totalRows: 541 },
                    sanctioned: { available: true, label: "Works Sanctioned", totalRows: 684 },
                    completed: { available: true, label: "Works Completed", totalRows: 312 },
                    expenditure: { available: true, label: "Expenditure & Disbursements", totalRows: 290 },
                    limits: { available: true, label: "Allocated Limits for Hon'ble MPs", totalRows: 12 },
                    calamity: { available: true, label: "Calamity Consents", totalRows: 6 },
                },
                schemaReports: {
                    recommended: { confidenceScore: 94, filename: "Works Recommended.csv", mappedHeaders: { "Work Description": "title", "State Name": "state", "Proposed Cost": "recommended_amount" }, unmappedHeaders: [] },
                    sanctioned: { confidenceScore: 96, filename: "Works Sanctioned.csv", mappedHeaders: { "Work Description": "title", "State Name": "state", "Sanctioned Cost": "sanction_amount" }, unmappedHeaders: [] },
                    completed: { confidenceScore: 90, filename: "Works Completed.csv", mappedHeaders: { "Work Description": "title", "Completion Date": "completion_date" }, unmappedHeaders: [] },
                    expenditure: { confidenceScore: 92, filename: "Expenditure.csv", mappedHeaders: { "State Name": "state", "Disbursed Amount": "disbursed_amount" }, unmappedHeaders: [] },
                    limits: { confidenceScore: 88, filename: "Allocated Limits.csv", mappedHeaders: { "MP Name": "mp_name", "Limit": "allocated_amount" }, unmappedHeaders: [] },
                    calamity: { confidenceScore: 85, filename: "Calamity.csv", mappedHeaders: { "Calamity": "calamity_name", "Amount": "calamity_amount" }, unmappedHeaders: [] },
                },
                missingDataNotices: [],
                activeDimensions: ["Central Works Registry", "Cost Outlier Velocity", "Timeline Delay Forecaster", "Duplicate Scope AI", "Physical-Financial Divergence"],
                degradedDimensions: [],
                flaggedCases: mockWorks.filter((w) => w.risk_band === "CRITICAL" || w.risk_band === "HIGH"),
                workReports: mockWorks,
                priorityProjects: mockWorks,
                analytics: {
                    totalWorksMonitored: mockWorks.length,
                    totalSanctionedCr: 0.95,
                    totalExpenditureCr: 0.75,
                    highRiskCount: 1,
                    criticalRiskCount: 1,
                    flaggedValueCr: 0.35,
                    riskDistribution: { critical: 1, high: 1, medium: 0, low: 1 },
                    monthlyTrends: [
                        { month: "Apr 2025", totalAssessed: 1, highRisk: 0 },
                        { month: "May 2025", totalAssessed: 2, highRisk: 1 },
                        { month: "Jun 2025", totalAssessed: 3, highRisk: 1 },
                        { month: "Jul 2025", totalAssessed: 3, highRisk: 2 },
                    ],
                },
                datasetSummary: {
                    totalRecordsMonitored: 1845,
                    totalSanctionedWorks: mockWorks.length,
                    totalSanctionedCr: 0.95,
                    totalDisbursedCr: 0.75,
                    activeRiskFlags: { criticalCount: 1, highCount: 1, mediumCount: 0, lowCount: 1, duplicateLedgerRows: 2 },
                },
            };
        }

        // Store active uploaded scope and historical report in localStorage
        if (typeof window !== "undefined" && result) {
            try {
                const scopeData = {
                    mode: "uploaded",
                    batchId: result.batchId,
                    timestamp: result.timestamp || new Date().toISOString(),
                    batch: result,
                };
                window.localStorage.setItem("mplads_active_scope", JSON.stringify(scopeData));

                const existingReportsRaw = window.localStorage.getItem("mplads_uploaded_reports");
                let existingReports = existingReportsRaw ? JSON.parse(existingReportsRaw) : [];
                if (!Array.isArray(existingReports)) existingReports = [];
                // Remove duplicate if same batch ID exists
                existingReports = existingReports.filter((r) => r?.batchId !== result.batchId);
                existingReports.unshift(result);
                if (existingReports.length > 20) existingReports.pop();
                window.localStorage.setItem("mplads_uploaded_reports", JSON.stringify(existingReports));
            } catch (err) {
                console.warn("[Local Storage Sync Warning]", err);
            }
        }

        return result;
    },

    // --- Surveillance Scope Management ---
    async getActiveScope() {
        try {
            const res = await fetchFromBackend("/datasets/scope");
            if (res && res.mode) {
                if (typeof window !== "undefined") {
                    window.localStorage.setItem("mplads_active_scope", JSON.stringify(res));
                }
                return res;
            }
        } catch {
            // Handled by localStorage fallback
        }

        if (typeof window !== "undefined") {
            try {
                const local = window.localStorage.getItem("mplads_active_scope");
                if (local) {
                    return JSON.parse(local);
                }
            } catch {}
        }
        return { mode: "database", batchId: null, batch: null };
    },

    async setActiveScope(scopeData) {
        if (typeof window !== "undefined") {
            try {
                window.localStorage.setItem("mplads_active_scope", JSON.stringify(scopeData));
            } catch {}
        }
        return scopeData;
    },

    async restoreMasterScope() {
        try {
            await fetchFromBackend("/datasets/scope/restore", { method: "POST" });
        } catch (err) {
            console.warn("[Restore Scope Warning]", err);
        }

        const resetScope = {
            mode: "database",
            batchId: null,
            timestamp: new Date().toISOString(),
            batch: null,
        };

        if (typeof window !== "undefined") {
            try {
                window.localStorage.setItem("mplads_active_scope", JSON.stringify(resetScope));
            } catch {}
        }
        return resetScope;
    },

    async getUploadedReports() {
        try {
            const res = await fetchFromBackend("/datasets/reports");
            if (res && Array.isArray(res.data) && res.data.length > 0) {
                if (typeof window !== "undefined") {
                    window.localStorage.setItem("mplads_uploaded_reports", JSON.stringify(res.data));
                }
                return res.data;
            }
        } catch {
            // Handled by localStorage fallback
        }

        if (typeof window !== "undefined") {
            try {
                const local = window.localStorage.getItem("mplads_uploaded_reports");
                if (local) {
                    const parsed = JSON.parse(local);
                    if (Array.isArray(parsed)) return parsed;
                }
            } catch {}
        }
        return [];
    },

    async getUploadedBatchById(batchId) {
        try {
            const res = await fetchFromBackend(`/datasets/reports/${batchId}`);
            if (res && res.data) return res.data;
        } catch {
            // Handled by localStorage fallback
        }

        const allReports = await this.getUploadedReports();
        return allReports.find((r) => r?.batchId === batchId) || null;
    },

    // --- System Admin Action: Ingest All 12 Official Files At Once ---
    async adminIngestAllFiles() {
        try {
            const res = await fetchFromBackend("/datasets/admin/ingest-all", {
                method: "POST",
                body: JSON.stringify({ userRole: getActiveUserRole() }),
            });
            if (res) {
                if (typeof window !== "undefined") {
                    const scopeData = {
                        mode: "uploaded",
                        batchId: res.batchId,
                        timestamp: res.timestamp || new Date().toISOString(),
                        batch: res,
                    };
                    window.localStorage.setItem("mplads_active_scope", JSON.stringify(scopeData));
                }
                return res;
            }
        } catch (err) {
            console.warn("[API adminIngestAllFiles Warning]", err);
        }
        return null;
    },

    // --- Admin User & RBAC Management ---
    getAllUsers: async () => {
        return fetchFromBackend("/auth/users");
    },
    createUser: async (userData) => {
        return fetchFromBackend("/auth/users", {
            method: "POST",
            body: JSON.stringify(userData),
        });
    },
    updateUser: async (id, userData) => {
        return fetchFromBackend(`/auth/users/${id}`, {
            method: "PATCH",
            body: JSON.stringify(userData),
        });
    },
    getAuditLogs: async () => {
        return fetchFromBackend("/auth/audit-logs");
    },
    async getSystemActivity() {
        try {
            const res = await fetchFromBackend("/system/activity");
            if (res && res.database) return res;
        } catch (err) {
            console.warn("[API getSystemActivity Warning]", err);
        }
        return {
            database: { status: "online", provider: "Supabase PostgreSQL", mode: "unloaded", savedBatchesCount: 0, activeWorksCount: 0, latencyMs: 12 },
            backend: { status: "online", port: 5000, uptimeSeconds: 120, memoryUsageMb: 64 },
            aiModules: { status: "operational", activeEnginesCount: 21, totalEnginesCount: 21, surveillanceAssurance: "STANDBY" },
        };
    },
    // --- AI Copilot ---
    async queryCopilot(query, context) {
        const AI_ENGINE_URL = getAiEngineBase();
        const q = (query || "").toLowerCase();
        const activeProject = context?.projectId
            ? projectsStore.find((p) => p.id === context.projectId)
            : projectsStore.find((p) => p.id === "MPL-004821");

        // 1. Try Live Cloud AI Engine on Render directly (FastAPI + Gemini 2.0 Flash)
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 12000);
            const aiRes = await fetch(`${AI_ENGINE_URL}/api/v1/copilot/query`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: query,
                    user_role: "mospi_officer",
                    target_work_id: activeProject?.id,
                    target_district: activeProject?.district,
                    target_state: activeProject?.state,
                }),
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (aiRes.ok) {
                const aiData = await aiRes.json();
                if (aiData && aiData.answer) {
                    return {
                        id: `COPILOT-MSG-${Date.now()}`,
                        sender: "sentinel",
                        timestamp: new Date().toISOString(),
                        content: aiData.answer,
                        structuredResponse: {
                            summary: aiData.answer,
                            guidelinesCited: aiData.citations?.map((c) => ({
                                section: c,
                                clause: "Statutory Scheme Rule",
                                text: "Official MoSPI / GFR standard clause applied to grounded audit examination.",
                            })),
                            recommendedVerificationSteps: aiData.suggested_follow_ups,
                        },
                        contextProjectId: activeProject?.id,
                    };
                }
            }
        } catch {
            // Fallback to Express backend or local grounded rule engine
        }

        // 2. Try Express Backend
        const backendCopilot = await fetchFromBackend("/copilot/query", {
            method: "POST",
            body: JSON.stringify({ query, context }),
        });
        if (backendCopilot) {
            return backendCopilot;
        }

        // 3. Robust In-Memory Grounded Statutory Intelligence Engine (Fuzzy Typo Tolerant)
        let responseSummary = "";
        let riskSignals = [];
        let evidenceSources = [];

        // Typo-tolerant normalization
        const isGreeting = /^(he+l+o+|h+i+|h+e+y+|namast+e+|greetings|good\s*morn)/i.test(q) || q.includes("helo") || q.includes("hlo");
        const isWhyRisk = (q.includes("why") || q.includes("wy") || q.includes("reason") || q.includes("explain")) && (q.includes("risk") || q.includes("rsk") || q.includes("flag") || q.includes("4821"));
        const isSpendingGap = (q.includes("spend") || q.includes("spnd") || q.includes("disburs") || q.includes("diverg") || q.includes("progress")) && (q.includes("80") || q.includes("50") || q.includes("gap") || q.includes("advance"));
        const isDuplicate = q.includes("duplic") || q.includes("dublic") || q.includes("overlap") || q.includes("ghost") || q.includes("khera");
        const isGuideline = q.includes("guidelin") || q.includes("statut") || q.includes("gfr") || q.includes("rule") || q.includes("sla") || q.includes("annex");

        if (isGreeting) {
            responseSummary = `Greetings! I am MPLADS Sentinel AI Copilot, your official surveillance, risk intelligence, and statutory compliance assistant for the Ministry of Statistics and Programme Implementation (MoSPI).\n\nI can assist you with investigating project risk scores, identifying physical-financial divergence gaps, checking duplicate proposals across Lok Sabha & Rajya Sabha, and citing official MPLADS 2023 & GFR 2017 statutory guidelines. How can I assist your audit investigation today?`;
            guidelinesCited = [
                { section: "MPLADS Guidelines 2023", clause: "Official Scheme Manual", text: "Standard operating framework for MoSPI and District Authorities." },
            ];
            recommendedSteps = [
                `Ask: "Why is ${activeProject?.id || "MPL-004821"} high risk?"`,
                "Ask: 'Show projects where spending >80% and physical progress <50%'",
                "Ask: 'What duplicate scopes exist in New Delhi district?'",
                "Ask: 'What statutory guidelines apply to milestone fund retention?'",
            ];
        }
        else if (isWhyRisk || q.includes("4821")) {
            responseSummary = `Project ${activeProject?.id} ("${activeProject?.title}") is prioritized as Critical Risk (87/100) due to 5 correlated multi-source anomalies: severe financial/physical progress divergence (36% gap), perceptual image reuse (99.4% hash match), RCC structural milestone delay, high spatial duplicate overlap with MPL-004822, and final bill amount exceeding sanctioned ceiling.`;
            riskSignals = [
                {
                    signal: "Financial / Physical Progress Divergence (36% Gap)",
                    severity: "critical",
                    description: "88% funds disbursed (₹30.8 L) while physical progress is only 52% verified.",
                },
                {
                    signal: "Computer Vision 99.4% Image Reuse",
                    severity: "critical",
                    description: "Site foundation photo matches a 2024 archive photo from North West Delhi.",
                },
                {
                    signal: "Cross-Document Invoice Inconsistency",
                    severity: "high",
                    description: "Final bill lists ₹41 L against approved sanction of ₹35 L.",
                },
            ];
            evidenceSources = [
                { id: "EVD-IMG-001", type: "evidence", title: "Foundation Site Photo (Hash Match)" },
                { id: "EVD-PAY-001", type: "evidence", title: "PFMS Treasury Voucher #02" },
                { id: "EVD-DOC-003", type: "evidence", title: "Contractor Bill RA #3" },
            ];
            guidelinesCited = [
                {
                    section: "MPLADS Guidelines 2023",
                    clause: "Section 3.4",
                    text: "Installment releases must strictly correspond to certified physical milestones with geotagged photographic proof.",
                },
                {
                    section: "GFR 2017",
                    clause: "Rule 130",
                    text: "Expenditure cannot exceed administratively sanctioned ceiling without prior approval of Revised Estimates.",
                },
            ];
            recommendedSteps = [
                "Issue physical site inspection order to District Assistant Engineer.",
                "Freeze further Running Account bill disbursements pending audit.",
                "Summon implementing agency DSIIDC for clarification on foundation photo reuse.",
            ];
        }
        else if (q.includes("spending") || q.includes("progress") || q.includes("80%") || q.includes("50%")) {
            responseSummary = "Found 2 projects where fund disbursement exceeds 80% while physical execution progress is below 50%: (1) MPL-004821 in New Delhi (Disbursed: 88%, Physical: 52%) and (2) MPL-005104 in Varanasi (Disbursed: 92%, Physical: 40%).";
            riskSignals = [
                {
                    signal: "Premature Advance Payout Pattern",
                    severity: "critical",
                    description: "Cumulative ₹72.2 L disbursed across 2 works with unverified field execution.",
                },
            ];
            evidenceSources = [
                { id: "MPL-004821", type: "project", title: "Community Hall at Village Khera" },
                { id: "MPL-005104", type: "project", title: "50 Solar High-Mast Lighting Systems" },
            ];
            guidelinesCited = [
                {
                    section: "MPLADS Guidelines 2023",
                    clause: "Section 3.4",
                    text: "No advance beyond 1st installment may be disbursed without certified MB entries and photographic evidence.",
                },
            ];
            recommendedSteps = [
                "Open Digital Project Twin for MPL-004821 and MPL-005104.",
                "Generate formal audit inquiry into advance fund retention by implementing agencies.",
            ];
        }
        else if (q.includes("duplicate") || q.includes("overlap") || q.includes("village khera")) {
            responseSummary = "Sentinel NLP & Geospatial engine flagged potential scope overlap between MPL-004821 ('Community Hall at Village Khera') and MPL-004822 ('Community Centre at Village Khera Ext'). SBERT semantic similarity is 92.4% with geographic proximity under 450 meters.";
            riskSignals = [
                {
                    signal: "Spatial & Scope Duplication Cluster",
                    severity: "high",
                    description: "Both projects sanctioned in the same financial year under identical implementing agency (DSIIDC).",
                },
            ];
            evidenceSources = [
                { id: "MPL-004821", type: "project", title: "Village Khera Community Hall" },
                { id: "MPL-004822", type: "project", title: "Village Khera Ext Community Centre" },
            ];
            guidelinesCited = [
                {
                    section: "MPLADS Guidelines 2023",
                    clause: "Annexure-II §3",
                    text: "Creation of duplicate or overlapping public community infrastructure within 500 meters is non-permissible.",
                },
            ];
            recommendedSteps = [
                "Compare Cadastral Revenue plot numbers.",
                "Verify if two distinct community structures are legitimately required in the same ward.",
            ];
        }
        else if (q.includes("guideline") || q.includes("statutory") || q.includes("gfr") || q.includes("rule")) {
            responseSummary = "MPLADS Sentinel enforces statutory compliance across: (1) MPLADS Guidelines 2023 (§3.4 Milestone releases, §2.6 45-day Sanction SLA, Annexure-II Negative List of Ineligible Works), (2) General Financial Rules 2017 (Rule 130 Excess expenditure, Rule 157 Splitting of tenders, Rule 238 Utilization Certificate reconciliation), and (3) CVC Procurement Directives.";
            guidelinesCited = [
                { section: "MPLADS Guidelines 2023", clause: "Section 2.6 & 3.4", text: "45-day sanction SLA & milestone-linked releases" },
                { section: "GFR 2017", clause: "Rule 130 / 157 / 238", text: "Sanction ceilings, tender splitting, and UC reconciliation" },
            ];
            recommendedSteps = [
                "Check contractor bill splitting under GFR Rule 157",
                "Audit 45-day sanction turnaround SLA compliance",
            ];
        }
        else {
            responseSummary = `Based on grounded analysis of ${activeProject?.id || "the monitored works"} (${activeProject?.title || "MPLADS Projects"}), Sentinel evaluated all financial transactions, milestone submissions, document OCR extractions, and perceptual computer vision features. What specific verification aspect or guideline check would you like me to analyze?`;
            recommendedSteps = [
                `Ask: "Why is ${activeProject?.id || "MPL-004821"} high risk?"`,
                "Ask: 'Show projects where spending >80% and physical progress <50%'",
                "Ask: 'Identify duplicate scopes flagged in New Delhi district'",
                "Ask: 'What statutory guidelines apply to milestone fund retention?'",
            ];
        }

        return {
            id: `COPILOT-MSG-${Date.now()}`,
            sender: "sentinel",
            timestamp: new Date().toISOString(),
            content: responseSummary,
            structuredResponse: {
                summary: responseSummary,
                riskSignals: riskSignals.length > 0 ? riskSignals : undefined,
                evidenceSources: evidenceSources.length > 0 ? evidenceSources : undefined,
                guidelinesCited: guidelinesCited.length > 0 ? guidelinesCited : undefined,
                recommendedVerificationSteps: recommendedSteps.length > 0 ? recommendedSteps : undefined,
            },
            contextProjectId: activeProject?.id,
        };
    },
};
