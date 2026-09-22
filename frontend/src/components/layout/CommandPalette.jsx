"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, LayoutDashboard, FolderKanban, ShieldAlert, SearchCode, Sparkles, FileCheck, Database, ArrowRight, X, Building, } from "lucide-react";
export const CommandPalette = ({ isOpen, onClose }) => {
    const router = useRouter();
    const [query, setQuery] = useState("");
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                if (isOpen)
                    onClose();
                else {
                    // Open triggered from parent or global listener
                }
            }
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    const quickNav = [
        { label: "Command Center (National Overview)", href: "/app/command-center", icon: LayoutDashboard, category: "Navigation" },
        { label: "Master Projects Directory", href: "/app/projects", icon: FolderKanban, category: "Navigation" },
        { label: "Showcase Project: Community Hall (MPL-004821)", href: "/app/projects/MPL-004821", icon: Building, category: "Featured Case" },
        { label: "Financial Risk Intelligence", href: "/app/risk/financial", icon: ShieldAlert, category: "Risk Suite" },
        { label: "Visual Evidence & CV Image Reuse", href: "/app/risk/visual", icon: ShieldAlert, category: "Risk Suite" },
        { label: "Duplicate Project Screening (NLP/GIS)", href: "/app/risk/duplicates", icon: ShieldAlert, category: "Risk Suite" },
        { label: "Document Inconsistency & OCR", href: "/app/risk/documents", icon: ShieldAlert, category: "Risk Suite" },
        { label: "Timeline & Milestone Delays", href: "/app/risk/timeline", icon: ShieldAlert, category: "Risk Suite" },
        { label: "Investigation Workspace (CASE-2026-00128)", href: "/app/investigations/CASE-2026-00128", icon: SearchCode, category: "Investigations" },
        { label: "Evidence Repository", href: "/app/evidence", icon: FileCheck, category: "Evidence" },
        { label: "AI Copilot Workspace", href: "/app/copilot", icon: Sparkles, category: "AI Assistant" },
        { label: "Layout & Template Similarity Studio (OCR)", href: "/app/risk/documents/compare", icon: ShieldAlert, category: "Risk Suite" },
        { label: "Grounding Data Explorer (12 Datasets)", href: "/app/data", icon: Database, category: "Data" },
    ];
    const filtered = query
        ? quickNav.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()) || item.category.toLowerCase().includes(query.toLowerCase()))
        : quickNav;
    const handleSelect = (href) => {
        router.push(href);
        onClose();
        setQuery("");
    };
    return (<div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Search Header */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0"/>
          <input type="text" placeholder="Search projects, risk categories, case files, evidence (e.g. 'MPL-004821', 'Financial', 'Varanasi')..." value={query} onChange={(e) => setQuery(e.target.value)} autoFocus className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"/>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="w-4 h-4"/>
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/40">
          {filtered.length === 0 ? (<div className="p-8 text-center text-sm text-slate-400">
              No matching pages or cases found for &quot;{query}&quot;
            </div>) : (filtered.map((item, idx) => {
            const Icon = item.icon;
            return (<button key={idx} onClick={() => handleSelect(item.href)} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      <Icon className="w-4 h-4"/>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {item.label}
                      </p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        {item.category}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5"/>
                </button>);
        }))}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <span>Navigate with <strong>↑↓</strong> and <strong>Enter</strong></span>
          <span>Press <strong>ESC</strong> to close</span>
        </div>
      </div>
    </div>);
};
