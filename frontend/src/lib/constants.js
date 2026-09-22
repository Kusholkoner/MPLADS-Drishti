export const APP_NAME = "MPLABS Drishti";
export const APP_HINDI_NAME = "दृष्टि";
export const APP_TAGLINE = "AI-Powered Multi-Source Surveillance, Risk-Intelligence & Vigilance Governance for MPLADS";
export const SIH_PROBLEM_ID = "SIH26102";
export const MINISTRY_NAME = "Ministry of Statistics and Programme Implementation (MoSPI), DIID";
export const DEFAULT_DEMO_PROJECT_ID = "MPL-004821";
export const DEFAULT_DEMO_CASE_ID = "CASE-2026-00128";

export const NAV_LINKS = [
    {
        label: "Command Center",
        href: "/app/command-center",
        icon: "LayoutDashboard",
        badge: undefined,
    },
    {
        label: "Projects",
        href: "/app/projects",
        icon: "FolderKanban",
        badge: undefined,
    },
    {
        label: "Risk Intelligence",
        href: "/app/risk",
        icon: "ShieldAlert",
        badge: "161",
    },
    {
        label: "Vendor Graph (AI)",
        href: "/app/risk/vendor-graph",
        icon: "Share2",
        badge: "GNN",
    },
    {
        label: "Attack Simulator",
        href: "/app/risk/predictive",
        icon: "Cpu",
        badge: "Sim",
    },
    {
        label: "Evidence Vault",
        href: "/app/evidence",
        icon: "FileCheck",
        badge: undefined,
    },
    {
        label: "Investigations",
        href: "/app/investigations",
        icon: "SearchCode",
        badge: "8",
    },
    {
        label: "Analytics & Maps",
        href: "/app/analytics",
        icon: "BarChart3",
        badge: undefined,
    },
    {
        label: "AI Copilot",
        href: "/app/copilot",
        icon: "Sparkles",
        badge: "AI",
    },
    {
        label: "Reports",
        href: "/app/reports",
        icon: "FileText",
        badge: "Reports",
    },
    {
        label: "e-SAKSHI Ingest",
        href: "/app/data",
        icon: "Database",
        badge: undefined,
    },
];

export const PUBLIC_NAV_LINKS = [
    { label: "Overview", href: "/" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Methodology", href: "/methodology" },
    { label: "Research", href: "/research" },
    { label: "Transparency", href: "/transparency" },
    { label: "About", href: "/about" },
];

export const RISK_CATEGORIES = [
    { id: "financial", name: "Financial Risk", href: "/app/risk/financial", icon: "BadgeIndianRupee", count: 47 },
    { id: "timeline", name: "Timeline Risk", href: "/app/risk/timeline", icon: "Clock", count: 38 },
    { id: "duplicate", name: "Duplicate Detection", href: "/app/risk/duplicates", icon: "CopyCheck", count: 19 },
    { id: "documents", name: "Document Intelligence", href: "/app/risk/documents", icon: "FileText", count: 26 },
    { id: "visual", name: "Visual Evidence (CV)", href: "/app/risk/visual", icon: "Camera", count: 31 },
    { id: "vendor-graph", name: "Vendor Collusion Network", href: "/app/risk/vendor-graph", icon: "Share2", count: 12 },
    { id: "predictive", name: "Predictive Risk & Simulator", href: "/app/risk/predictive", icon: "Cpu", count: 15 },
];

export const PROJECT_CATEGORIES = [
    "Community Infrastructure",
    "Drinking Water",
    "Education & Schools",
    "Health & Family Welfare",
    "Roads, Pathways & Bridges",
    "Sanitation & Public Utilities",
    "Renewable Energy & Lighting",
    "Irrigation & Flood Control",
];
