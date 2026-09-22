/**
 * Format numbers according to the Indian numbering system (Lakhs and Crores)
 * e.g. 3500000 -> ₹35,00,000
 */
export function formatIndianCurrency(amount) {
    if (amount === undefined || amount === null || isNaN(amount))
        return "₹0";
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
}
/**
 * Format large Indian currency into compact readable Lakh / Crore format
 * e.g. 3500000 -> ₹35.0 Lakh | 428000000 -> ₹42.8 Cr
 */
export function formatLakhCrore(amount) {
    if (amount === undefined || amount === null || isNaN(amount))
        return "₹0";
    const abs = Math.abs(amount);
    const sign = amount < 0 ? "-" : "";
    if (abs >= 10000000) {
        const cr = abs / 10000000;
        return `${sign}₹${cr.toFixed(1)} Cr`;
    }
    if (abs >= 100000) {
        const lk = abs / 100000;
        return `${sign}₹${lk.toFixed(1)} L`;
    }
    if (abs >= 1000) {
        const k = abs / 1000;
        return `${sign}₹${k.toFixed(1)}k`;
    }
    return `${sign}₹${abs}`;
}
export function formatPercentage(val) {
    if (val === undefined || val === null || isNaN(val))
        return "0%";
    return `${Math.round(val)}%`;
}
export function formatDate(dateStr) {
    if (!dateStr)
        return "N/A";
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }
    catch {
        return dateStr;
    }
}
export function formatDateTime(dateStr) {
    if (!dateStr)
        return "N/A";
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }
    catch {
        return dateStr;
    }
}
export function formatRelativeTime(dateStr) {
    if (!dateStr)
        return "";
    try {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHr = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHr / 24);
        if (diffDay > 30)
            return formatDate(dateStr);
        if (diffDay > 0)
            return `${diffDay}d ago`;
        if (diffHr > 0)
            return `${diffHr}h ago`;
        if (diffMin > 0)
            return `${diffMin}m ago`;
        return "just now";
    }
    catch {
        return dateStr;
    }
}
export function getRiskLevelFromScore(score) {
    if (score === null || score === undefined || isNaN(score))
        return "normal";
    const num = Number(score);
    if (num >= 80)
        return "normal";
    if (num >= 60)
        return "low";
    if (num >= 40)
        return "medium";
    if (num >= 20)
        return "high";
    return "critical";
}
export function getRiskBadgeStyles(level) {
    const norm = (level || "").toLowerCase();
    switch (norm) {
        case "duplicate":
            return {
                bg: "bg-purple-50 dark:bg-purple-950/40",
                text: "text-purple-700 dark:text-purple-400",
                border: "border-purple-200 dark:border-purple-800/60",
                dot: "bg-purple-500",
                label: "Duplicate",
            };
        case "critical":
            return {
                bg: "bg-rose-50 dark:bg-rose-950/40",
                text: "text-rose-700 dark:text-rose-400",
                border: "border-rose-200 dark:border-rose-800/60",
                dot: "bg-rose-600",
                label: "Critical",
            };
        case "corrupted":
            return {
                bg: "bg-rose-50 dark:bg-rose-950/40",
                text: "text-rose-700 dark:text-rose-400",
                border: "border-rose-200 dark:border-rose-800/60",
                dot: "bg-rose-600",
                label: "Corrupted Data",
            };
        case "high":
        case "high risk":
            return {
                bg: "bg-orange-50 dark:bg-orange-950/40",
                text: "text-orange-700 dark:text-orange-400",
                border: "border-orange-200 dark:border-orange-800/60",
                dot: "bg-orange-500",
                label: "High Risk",
            };
        case "suspicious":
            return {
                bg: "bg-orange-50 dark:bg-orange-950/40",
                text: "text-orange-700 dark:text-orange-400",
                border: "border-orange-200 dark:border-orange-800/60",
                dot: "bg-orange-500",
                label: "Suspicious",
            };
        case "medium":
        case "medium risk":
            return {
                bg: "bg-amber-50 dark:bg-amber-950/40",
                text: "text-amber-700 dark:text-amber-400",
                border: "border-amber-200 dark:border-amber-800/60",
                dot: "bg-amber-500",
                label: "Medium Risk",
            };
        case "normal":
            return {
                bg: "bg-emerald-50 dark:bg-emerald-950/40",
                text: "text-emerald-700 dark:text-emerald-400",
                border: "border-emerald-200 dark:border-emerald-800/60",
                dot: "bg-emerald-500",
                label: "Normal",
            };
        case "valid":
            return {
                bg: "bg-emerald-50 dark:bg-emerald-950/40",
                text: "text-emerald-700 dark:text-emerald-400",
                border: "border-emerald-200 dark:border-emerald-800/60",
                dot: "bg-emerald-500",
                label: "Valid",
            };
        case "low":
        case "low risk":
        default:
            return {
                bg: "bg-emerald-50 dark:bg-emerald-950/40",
                text: "text-emerald-700 dark:text-emerald-400",
                border: "border-emerald-200 dark:border-emerald-800/60",
                dot: "bg-emerald-500",
                label: "Low Risk",
            };
    }
}
export function getCaseStatusStyles(status) {
    switch (status) {
        case "new":
            return {
                bg: "bg-sky-50 dark:bg-sky-950/40",
                text: "text-sky-700 dark:text-sky-400",
                border: "border-sky-200 dark:border-sky-800",
                label: "New Case",
            };
        case "under_review":
            return {
                bg: "bg-amber-50 dark:bg-amber-950/40",
                text: "text-amber-700 dark:text-amber-400",
                border: "border-amber-200 dark:border-amber-800",
                label: "Under Review",
            };
        case "evidence_requested":
            return {
                bg: "bg-purple-50 dark:bg-purple-950/40",
                text: "text-purple-700 dark:text-purple-400",
                border: "border-purple-200 dark:border-purple-800",
                label: "Evidence Requested",
            };
        case "escalated":
            return {
                bg: "bg-orange-50 dark:bg-orange-950/40",
                text: "text-orange-700 dark:text-orange-400",
                border: "border-orange-200 dark:border-orange-800",
                label: "Escalated",
            };
        case "cleared":
            return {
                bg: "bg-emerald-50 dark:bg-emerald-950/40",
                text: "text-emerald-700 dark:text-emerald-400",
                border: "border-emerald-200 dark:border-emerald-800",
                label: "Cleared",
            };
        case "confirmed_irregularity":
            return {
                bg: "bg-rose-50 dark:bg-rose-950/40",
                text: "text-rose-700 dark:text-rose-400",
                border: "border-rose-200 dark:border-rose-800",
                label: "Irregularity Confirmed",
            };
        case "closed":
            return {
                bg: "bg-slate-100 dark:bg-slate-800",
                text: "text-slate-700 dark:text-slate-300",
                border: "border-slate-300 dark:border-slate-700",
                label: "Closed",
            };
        default:
            return {
                bg: "bg-slate-50 dark:bg-slate-900",
                text: "text-slate-600 dark:text-slate-400",
                border: "border-slate-200 dark:border-slate-800",
                label: status,
            };
    }
}
