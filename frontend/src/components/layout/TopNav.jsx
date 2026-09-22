"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell, Sparkles, Menu, ChevronDown, LogOut, Key, UploadCloud, UserCheck } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { CommandPalette } from "./CommandPalette";
import { NotificationDrawer } from "./NotificationDrawer";
import { AskSentinelDrawer } from "./AskSentinelDrawer";
import { Breadcrumbs } from "../common/Breadcrumbs";
import { useAuth, DEMO_PERSONAS } from "@/lib/authContext";

export const TopNav = ({ breadcrumbs, onOpenMobileMenu, contextProjectId, contextCaseId }) => {
    const router = useRouter();
    const { profile, switchPersona, signOut } = useAuth();
    const [isCommandOpen, setIsCommandOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isCopilotOpen, setIsCopilotOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const handleSignOut = async () => {
        await signOut();
        setIsUserMenuOpen(false);
        router.push("/login?status=signed_out");
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (<>
      <header className="sticky top-0 z-30 h-16 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 px-4 md:px-6 flex items-center justify-between">
        {/* Left: Mobile Toggle & Breadcrumbs */}
        <div className="flex items-center gap-3">
          {onOpenMobileMenu && (<button onClick={onOpenMobileMenu} className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Menu className="w-5 h-5"/>
            </button>)}

          {breadcrumbs && breadcrumbs.length > 0 ? (<Breadcrumbs items={breadcrumbs} className="hidden sm:flex"/>) : (<div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                MoSPI DIID
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                National Audit Command
              </span>
            </div>)}
        </div>

        {/* Right Action Icons & Search */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Quick Search trigger (Cmd+K) */}
          <button onClick={() => setIsCommandOpen(true)} className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-colors">
            <Search className="w-3.5 h-3.5"/>
            <span className="hidden md:inline">Quick Search...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-500">
              ⌘K
            </kbd>
          </button>

          {/* Notifications Bell */}
          <button onClick={() => setIsNotifOpen(true)} className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Notifications">
            <Bell className="w-4 h-4"/>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900"/>
          </button>

          {/* Dark / Light Theme Toggle */}
          <ThemeToggle />

          {/* Quick Logout button in navbar */}
          <button
            onClick={handleSignOut}
            title="Sign Out / Logout"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200/80 dark:border-rose-900/60 transition-colors shadow-2xs cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Sign Out</span>
          </button>

          {/* User Profile Pill & Dropdown */}
          <div className="relative" ref={menuRef}>
            <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 text-left hover:opacity-85 transition-opacity cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {profile?.avatar_initials || profile?.full_name?.substring(0, 2).toUpperCase() || "AS"}
              </div>
              <div className="hidden xl:block text-left text-xs">
                <p className="font-semibold text-slate-800 dark:text-slate-200 leading-tight truncate max-w-[140px]">
                  {profile?.full_name || "Institutional Officer"}
                </p>
                <p className="text-[10px] text-slate-400 font-medium truncate max-w-[140px]">
                  {profile?.designation || "MoSPI Officer"}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block"/>
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (<div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                {/* Profile Header Section */}
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {profile?.avatar_initials || profile?.full_name?.substring(0, 2).toUpperCase() || "OF"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 dark:text-white truncate">
                        {profile?.full_name || "Official Stakeholder"}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{profile?.email}</p>
                    </div>
                  </div>
                  <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                    <span className="inline-block px-2 py-0.5 text-[9px] font-bold rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {profile?.role?.replace("_", " ").toUpperCase() || "MOSPI"}
                    </span>
                    {profile?.jurisdiction && (
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                        • {profile.jurisdiction}
                      </span>
                    )}
                  </div>
                </div>

                {/* Switch Audit Persona */}
                <div className="p-2">
                  <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Audit Persona
                  </p>
                  <div className="max-h-40 overflow-y-auto space-y-0.5">
                    {Object.entries(DEMO_PERSONAS).map(([key, p]) => (<button key={key} onClick={() => {
                      switchPersona(key);
                      setIsUserMenuOpen(false);
                  }} className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer ${profile?.role === key
                      ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                        <span className="truncate">{p.full_name}</span>
                        <span className="text-[9px] opacity-70 ml-1 shrink-0">({p.role ? p.role.split("_")[0] : ""})</span>
                      </button>))}
                  </div>
                </div>

                {/* Profile Section Actions: Switch Account & Sign Out */}
                <div className="p-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                  <Link href="/login" onClick={() => setIsUserMenuOpen(false)} className="w-full text-left px-2.5 py-2 rounded-xl flex items-center gap-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium">
                    <Key className="w-4 h-4 text-slate-400"/>
                    <span>Switch / Register Officer Account</span>
                  </Link>

                  {/* Prominent Profile Section Logout Button */}
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between text-rose-600 dark:text-rose-400 bg-rose-50/60 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200/60 dark:border-rose-900/60 transition-colors font-bold cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <LogOut className="w-4 h-4"/>
                      <span>Log Out Session</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-rose-500 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                      Exit
                    </span>
                  </button>
                </div>
              </div>)}
          </div>
        </div>
      </header>

      {/* Slide-over Drawers & Modals */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)}/>
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)}/>
      <AskSentinelDrawer isOpen={isCopilotOpen} onClose={() => setIsCopilotOpen(false)} contextProjectId={contextProjectId} contextCaseId={contextCaseId}/>
    </>);
};
