"use client";
import React from "react";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans antialiased">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-950 text-rose-400 mx-auto flex items-center justify-center font-black text-2xl border border-rose-900">
            !
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">System Critical Error</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              A root layout exception occurred. The platform has halted to preserve data integrity.
            </p>
          </div>

          {error?.message && (
            <p className="text-[11px] font-mono text-rose-300 bg-slate-950 p-3 rounded-xl border border-slate-800 break-all text-left">
              {error.message}
            </p>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full py-3 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
            >
              Reboot Session
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
