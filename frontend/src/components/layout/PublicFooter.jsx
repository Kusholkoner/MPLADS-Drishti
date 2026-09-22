import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { APP_NAME, APP_HINDI_NAME, SIH_PROBLEM_ID, MINISTRY_NAME } from "@/lib/constants";
export const PublicFooter = () => {
    return (<footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 dark:bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                <ShieldCheck className="w-4 h-4"/>
              </div>
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                {APP_NAME} ({APP_HINDI_NAME})
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              AI-powered evidence verification and risk-intelligence platform designed for {MINISTRY_NAME}.
            </p>
            <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Smart India Hackathon • {SIH_PROBLEM_ID}
            </span>
          </div>

          {/* Navigation */}
          <div className="space-y-2.5">
            <p className="font-bold uppercase tracking-wider text-slate-900 dark:text-white text-[11px]">
              Platform
            </p>
            <ul className="space-y-1.5">
              <li>
                <Link href="/app/command-center" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Command Center
                </Link>
              </li>
              <li>
                <Link href="/app/projects" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Master Projects
                </Link>
              </li>
              <li>
                <Link href="/app/risk" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Risk Intelligence
                </Link>
              </li>
              <li>
                <Link href="/app/investigations" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Investigation Workspace
                </Link>
              </li>
              <li>
                <Link href="/app/copilot" className="hover:text-blue-600 dark:hover:text-blue-400">
                  AI Copilot
                </Link>
              </li>
            </ul>
          </div>

          {/* Transparency & Research */}
          <div className="space-y-2.5">
            <p className="font-bold uppercase tracking-wider text-slate-900 dark:text-white text-[11px]">
              Trust & Architecture
            </p>
            <ul className="space-y-1.5">
              <li>
                <Link href="/how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Hybrid AI Methodology
                </Link>
              </li>
              <li>
                <Link href="/research" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Academic & CAG Research
                </Link>
              </li>
              <li>
                <Link href="/transparency" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Transparency & Human-in-the-Loop
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400">
                  About the Project
                </Link>
              </li>
            </ul>
          </div>

          {/* Operations & Tools */}
          <div className="space-y-2.5">
            <p className="font-bold uppercase tracking-wider text-slate-900 dark:text-white text-[11px]">
              Operations & Tools
            </p>
            <ul className="space-y-1.5">
              <li>
                <Link href="/app/command-center" className="hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
                  Command Center
                </Link>
              </li>
              <li>
                <Link href="/app/risk/documents/compare" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline flex items-center gap-1">
                  <span>Layout Similarity Studio</span>
                </Link>
              </li>
              <li>
                <Link href="/app/investigations" className="hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
                  Investigation Cases
                </Link>
              </li>
              <li>
                <Link href="/app/data" className="hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
                  Grounding Dataset Explorer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p className="max-w-2xl text-center sm:text-left">
            <strong>Statement of Intent:</strong> MPLADS Sentinel acts strictly as an evidence-linked risk prioritization layer for authorized reviewers. AI risk scores prioritize investigations and do not constitute legal fraud verdicts.
          </p>
          <p className="shrink-0 flex items-center gap-1">
            Ministry of Statistics and Programme Implementation • Government of India
          </p>
        </div>
      </div>
    </footer>);
};
