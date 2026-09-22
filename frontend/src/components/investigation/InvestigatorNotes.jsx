"use client";
import React, { useState } from "react";
import { User, Send, MessageSquare } from "lucide-react";
import { formatDateTime } from "@/lib/formatters";
export const InvestigatorNotes = ({ notes, onAddNote, className = "", }) => {
    const [newNote, setNewNote] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newNote.trim())
            return;
        onAddNote(newNote);
        setNewNote("");
    };
    return (<div className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600"/>
            Investigator Case Notes & Observations
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit remarks logged by reviewing officers
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-slate-400">
          {notes.length} Remarks Logged
        </span>
      </div>

      {/* Existing Notes Feed */}
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {notes.length === 0 ? (<p className="text-xs text-slate-400 italic py-4 text-center">
            No notes logged yet. Add the first observation below.
          </p>) : (notes.map((note) => (<div key={note.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-[10px]">
                    <User className="w-3 h-3 text-slate-600 dark:text-slate-300"/>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {note.authorName} ({note.authorRole})
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {formatDateTime(note.createdAt)}
                </span>
              </div>

              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px] whitespace-pre-wrap">
                {note.content}
              </p>

              {note.linkedEvidenceIds && note.linkedEvidenceIds.length > 0 && (<div className="flex items-center gap-1.5 pt-1 text-[10px] text-slate-400">
                  <span>Linked Artifacts:</span>
                  {note.linkedEvidenceIds.map((id) => (<span key={id} className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-mono font-bold">
                      {id}
                    </span>))}
                </div>)}
            </div>)))}
      </div>

      {/* Note Composer Form */}
      <form onSubmit={handleSubmit} className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
        <input type="text" placeholder="Add auditor observation, request for clarification, or site findings..." value={newNote} onChange={(e) => setNewNote(e.target.value)} className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"/>
        <button type="submit" disabled={!newNote.trim()} className="px-4 py-2 rounded-xl bg-blue-600 text-white dark:bg-blue-600 dark:text-white hover:bg-blue-700 disabled:opacity-50 text-xs font-bold transition-all flex items-center gap-1.5">
          <span>Post Remark</span>
          <Send className="w-3 h-3"/>
        </button>
      </form>
    </div>);
};
