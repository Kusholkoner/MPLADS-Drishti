"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ProjectTable } from "@/components/project/ProjectTable";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { api } from "@/lib/api";
import { PROJECT_CATEGORIES } from "@/lib/constants";
function ProjectsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [projects, setProjects] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    // Filter States from URL
    const initialSearch = searchParams.get("search") || "";
    const initialState = searchParams.get("state") || "all";
    const initialDistrict = searchParams.get("district") || "all";
    const initialCategory = searchParams.get("category") || "all";
    const initialRisk = searchParams.get("risk") || "all";
    const initialStatus = searchParams.get("status") || "all";
    const [search, setSearch] = useState(initialSearch);
    const [selectedState, setSelectedState] = useState(initialState);
    const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [selectedRisk, setSelectedRisk] = useState(initialRisk);
    const [selectedStatus, setSelectedStatus] = useState(initialStatus);
    // Sync state to URL and fetch projects
    useEffect(() => {
        async function fetchFilteredProjects() {
            setLoading(true);
            try {
                const res = await api.getProjects({
                    search: search || undefined,
                    state: selectedState !== "all" ? selectedState : undefined,
                    district: selectedDistrict !== "all" ? selectedDistrict : undefined,
                    category: selectedCategory !== "all" ? selectedCategory : undefined,
                    riskLevel: selectedRisk !== "all" ? selectedRisk : undefined,
                    status: selectedStatus !== "all" ? selectedStatus : undefined,
                });
                setProjects(res.projects);
                setTotal(res.total);
            }
            catch (err) {
                console.error("Failed to load projects:", err);
            }
            finally {
                setLoading(false);
            }
        }
        // Update URL query parameters cleanly
        const params = new URLSearchParams();
        if (search)
            params.set("search", search);
        if (selectedState !== "all")
            params.set("state", selectedState);
        if (selectedDistrict !== "all")
            params.set("district", selectedDistrict);
        if (selectedCategory !== "all")
            params.set("category", selectedCategory);
        if (selectedRisk !== "all")
            params.set("risk", selectedRisk);
        if (selectedStatus !== "all")
            params.set("status", selectedStatus);
        const queryStr = params.toString();
        const newUrl = queryStr ? `/app/projects?${queryStr}` : "/app/projects";
        router.replace(newUrl, { scroll: false });
        fetchFilteredProjects();
    }, [search, selectedState, selectedDistrict, selectedCategory, selectedRisk, selectedStatus, router]);
    const resetFilters = () => {
        setSearch("");
        setSelectedState("all");
        setSelectedDistrict("all");
        setSelectedCategory("all");
        setSelectedRisk("all");
        setSelectedStatus("all");
    };
    return (<div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              National Project Registry
            </span>
            <span className="text-xs text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
              {total} Monitored
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-0.5">
            Master Projects Database
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Search and inspect digital project twins, physical/financial ledger progress, and AI anomaly signals
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        {/* Top Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
          <input type="text" placeholder="Search by project ID, keyword, district, MP name, or agency (e.g. 'MPL-004821', 'Community Hall', 'Varanasi', 'DSIIDC')..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"/>
          {search && (<button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600">
              Clear
            </button>)}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
          {/* State */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              State / UT
            </label>
            <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-none">
              <option value="all">All States</option>
              <option value="Delhi">Delhi</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Bihar">Bihar</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Kerala">Kerala</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Asset Category
            </label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-none truncate">
              <option value="all">All Categories</option>
              {PROJECT_CATEGORIES.map((cat) => (<option key={cat} value={cat}>
                  {cat}
                </option>))}
            </select>
          </div>

          {/* Risk Level */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Risk Level
            </label>
            <select value={selectedRisk} onChange={(e) => setSelectedRisk(e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-none">
              <option value="all">All Risk Levels</option>
              <option value="duplicate">Duplicate</option>
              <option value="critical">Critical (&lt;20)</option>
              <option value="high">High Risk (20-39)</option>
              <option value="medium">Medium Risk (40-59)</option>
              <option value="low">Normal / Low Risk (60+)</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Execution Status
            </label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-none">
              <option value="all">All Statuses</option>
              <option value="in_progress">In Progress</option>
              <option value="milestone_delayed">Milestone Delayed</option>
              <option value="flagged">Flagged</option>
              <option value="under_investigation">Under Investigation</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <button onClick={resetFilters} className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 transition-colors">
              <RotateCcw className="w-3.5 h-3.5"/>
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      {loading ? (<LoadingSkeleton variant="table" count={6}/>) : projects.length === 0 ? (<EmptyState title="No projects match your criteria" description="Try broadening your search query or resetting active state, category, and risk filters." action={{ label: "Clear All Filters", onClick: resetFilters }}/>) : (<ProjectTable projects={projects} total={total}/>)}
    </div>);
}
export default function ProjectsPage() {
    return (<AppShell breadcrumbs={[{ label: "Projects" }]}>
      <Suspense fallback={<LoadingSkeleton variant="table" count={6}/>}>
        <ProjectsContent />
      </Suspense>
    </AppShell>);
}
