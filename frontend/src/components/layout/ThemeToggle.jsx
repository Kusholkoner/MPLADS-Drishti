"use client";
import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
export const ThemeToggle = ({ className = "" }) => {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const isCurrentlyDark = document.documentElement.classList.contains("dark");
        setIsDark(isCurrentlyDark);
        setMounted(true);
    }, []);
    const toggleTheme = () => {
        const isNowDark = !document.documentElement.classList.contains("dark");
        if (isNowDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("mplads_theme", "dark");
            setIsDark(true);
        }
        else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("mplads_theme", "light");
            setIsDark(false);
        }
    };
    if (!mounted) {
        return (<div className={`w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${className}`}/>);
    }
    return (<button onClick={toggleTheme} aria-label="Toggle theme" className={`p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-900 shadow-xs ${className}`} title={isDark ? "Switch to White / Light Mode" : "Switch to Dark Mode"}>
      {isDark ? <Sun className="w-4 h-4 text-amber-400"/> : <Moon className="w-4 h-4 text-slate-700"/>}
    </button>);
};
