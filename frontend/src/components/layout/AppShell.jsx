"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { useAuth, isRouteAllowed, ROLE_DEFAULT_ROUTES } from "@/lib/authContext";
import { ShieldAlert, ArrowLeft, Lock, CheckCircle2, ShieldCheck } from "lucide-react";

export const AppShell = ({ children, breadcrumbs, contextProjectId, contextCaseId }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { profile, loading, switchPersona } = useAuth();

  React.useEffect(() => {
    if (!loading && !profile) {
      router.replace("/login");
    }
  }, [loading, profile, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 text-xs">
        Verifying institutional authorization...
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const role = profile?.role || "mospi_officer";
  const isAllowed = isRouteAllowed(role, pathname);
  const defaultHomeRoute = ROLE_DEFAULT_ROUTES[role] || "/app/command-center";

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-sans">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block shrink-0 sticky top-0 h-screen z-30">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-72 max-w-[85vw] h-full z-10 animate-in slide-in-from-left duration-200">
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <TopNav
          breadcrumbs={breadcrumbs}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          contextProjectId={contextProjectId}
          contextCaseId={contextCaseId}
        />

        <main className="flex-1 p-3 sm:p-5 md:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-150">
          {!isAllowed ? (
            /* 403 Statutory Route Guard Interception */
            <div className="min-h-[60vh] flex items-center justify-center p-4">
              <div className="max-w-xl w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 shadow-xl space-y-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center shadow-inner">
                  <ShieldAlert className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                    <Lock className="w-3 h-3" /> Section 11 & 12 Statutory RBAC Barrier
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Access Restricted by Institutional Role
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                    Your active credential <strong className="text-slate-800 dark:text-slate-200">{profile?.role_label || profile?.full_name}</strong> is restricted from accessing <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-rose-600 dark:text-rose-400 text-xs">{pathname}</code> under MoSPI audit guidelines.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 text-left text-xs space-y-2">
                  <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span>Active Stakeholder</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{profile?.full_name}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span>Jurisdiction</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{profile?.jurisdiction || "Assigned Unit"}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Permissible Scope</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Designated Role Features Only
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Link
                    href={defaultHomeRoute}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition shadow-sm"
                  >
                    <ArrowLeft className="w-4 h-4" /> Return to Authorized Workspace
                  </Link>
                  <button
                    type="button"
                    onClick={() => switchPersona("mospi_officer")}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  >
                    <ShieldCheck className="w-4 h-4" /> Switch to Central MoSPI Officer
                  </button>
                </div>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
};
