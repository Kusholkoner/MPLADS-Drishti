"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Menu, X, ArrowRight, KeyRound } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { APP_NAME, APP_HINDI_NAME, PUBLIC_NAV_LINKS } from "@/lib/constants";
import { useAuth } from "@/lib/authContext";
export const PublicHeader = () => {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { profile } = useAuth();
    return (<header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 dark:bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/25 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-blue-200 dark:text-white"/>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                {APP_NAME}
              </span>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-1 py-0.2 rounded border border-blue-200 dark:border-blue-800">
                {APP_HINDI_NAME}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              MoSPI DIID • SIH26102
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {PUBLIC_NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (<Link key={link.href} href={link.href} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${isActive
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-850"}`}>
                {link.label}
              </Link>);
        })}
        </nav>

        {/* Right CTA & Theme */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <Link href="/login" className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors">
            <KeyRound className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400"/>
            <span>{profile ? "Switch Account" : "Sign In"}</span>
          </Link>

          <Link href="/app/command-center" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all active:scale-[0.98]">
            <span>Command Center</span>
            <ArrowRight className="w-3.5 h-3.5"/>
          </Link>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            {mobileOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (<div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-2 animate-in slide-in-from-top duration-150">
          {PUBLIC_NAV_LINKS.map((link) => (<Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
              {link.label}
            </Link>))}
          <div className="pt-2 space-y-2">
            <Link href="/login" onClick={() => setMobileOpen(false)} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800">
              <KeyRound className="w-3.5 h-3.5"/>
              <span>Sign In / Switch Persona</span>
            </Link>
            <Link href="/app/command-center" onClick={() => setMobileOpen(false)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm">
              <span>Launch Command Center</span>
              <ArrowRight className="w-3.5 h-3.5"/>
            </Link>
          </div>
        </div>)}
    </header>);
};
