"use client";
import React, { useState } from "react";
import { X, Sparkles, Send, Bot, User, CheckCircle2, FileText, BookOpen, ShieldAlert } from "lucide-react";
import { api } from "@/lib/api";
export const AskSentinelDrawer = ({ isOpen, onClose, contextProjectId, contextCaseId, initialQuestion, }) => {
    const [query, setQuery] = useState(initialQuestion || "");
    const [messages, setMessages] = useState([
        {
            id: "INIT",
            sender: "sentinel",
            timestamp: "2026-08-29T12:00:00.000Z",
            content: contextProjectId
                ? `I am Sentinel AI Copilot, grounded in the real project records and MPLADS guidelines for ${contextProjectId}. How can I assist your verification?`
                : "I am Sentinel AI Copilot. Ask me to verify financial velocity, compare site photos, check duplicate proposals, or cite official MPLADS guidelines.",
            contextProjectId,
        },
    ]);
    const [loading, setLoading] = useState(false);
    const handleSend = async (textToSend) => {
        const q = textToSend || query;
        if (!q.trim() || loading)
            return;
        const userMsg = {
            id: `USER-${Date.now()}`,
            sender: "user",
            timestamp: new Date().toISOString(),
            content: q,
            contextProjectId,
            contextCaseId,
        };
        setMessages((prev) => [...prev, userMsg]);
        setQuery("");
        setLoading(true);
        try {
            const resp = await api.queryCopilot(q, { projectId: contextProjectId, caseId: contextCaseId });
            setMessages((prev) => [...prev, resp]);
        }
        catch {
            const errorMsg = {
                id: `ERR-${Date.now()}`,
                sender: "sentinel",
                timestamp: new Date().toISOString(),
                content: "Unable to complete AI query at this moment. Please verify network connection or backend service status.",
            };
            setMessages((prev) => [...prev, errorMsg]);
        }
        finally {
            setLoading(false);
        }
    };
    const sampleQuestions = contextProjectId
        ? [
            `Why is ${contextProjectId} prioritized as high risk?`,
            "What evidence supports the financial progress gap?",
            "Which official MPLADS guidelines are relevant here?",
        ]
        : [
            "Why is MPL-004821 high risk?",
            "Show projects where spending >80% and progress <50%",
            "What duplicate scopes exist in New Delhi district?",
        ];
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm">
              <Sparkles className="w-4 h-4"/>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Ask Sentinel AI
                </h3>
                {contextProjectId && (<span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                    {contextProjectId}
                  </span>)}
              </div>
              <p className="text-xs text-slate-400">
                Grounded in structured project records & MPLADS 2023 Guidelines
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-4 h-4"/>
          </button>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (<div key={msg.id} className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
                {!isUser && (<div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-4 h-4"/>
                  </div>)}

                <div className={`max-w-[85%] rounded-2xl p-4 text-xs space-y-3 ${isUser
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80"}`}>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                  {/* Structured response components */}
                  {msg.structuredResponse?.riskSignals && (<div className="pt-2 border-t border-slate-200/80 dark:border-slate-700 space-y-1.5">
                      <p className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-rose-500"/> Detected Risk Signals
                      </p>
                      {msg.structuredResponse.riskSignals.map((rs, idx) => (<div key={idx} className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-0.5">
                          <span className="font-semibold text-rose-600 dark:text-rose-400">{rs.signal}</span>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{rs.description}</p>
                        </div>))}
                    </div>)}

                  {msg.structuredResponse?.evidenceSources && (<div className="pt-2 border-t border-slate-200/80 dark:border-slate-700 space-y-1">
                      <p className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <FileText className="w-3 h-3 text-blue-500"/> Evidence Provenance
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.structuredResponse.evidenceSources.map((src, idx) => (<span key={idx} className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            {src.title}
                          </span>))}
                      </div>
                    </div>)}

                  {msg.structuredResponse?.guidelinesCited && (<div className="pt-2 border-t border-slate-200/80 dark:border-slate-700 space-y-1">
                      <p className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-purple-500"/> Statutory Guidelines Cited
                      </p>
                      {msg.structuredResponse.guidelinesCited.map((g, idx) => (<div key={idx} className="text-[11px] bg-purple-50/50 dark:bg-purple-950/40 p-2 rounded-lg border border-purple-200/50 dark:border-purple-800/50">
                          <span className="font-bold text-purple-700 dark:text-purple-300">{g.section} ({g.clause}): </span>
                          <span className="text-slate-600 dark:text-slate-300">{g.text}</span>
                        </div>))}
                    </div>)}

                  {msg.structuredResponse?.recommendedVerificationSteps && (<div className="pt-2 border-t border-slate-200/80 dark:border-slate-700 space-y-1">
                      <p className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500"/> Recommended Auditor Actions
                      </p>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600 dark:text-slate-300">
                        {msg.structuredResponse.recommendedVerificationSteps.map((step, idx) => (<li key={idx}>{step}</li>))}
                      </ul>
                    </div>)}
                </div>

                {isUser && (<div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <User className="w-4 h-4"/>
                  </div>)}
              </div>);
        })}

          {loading && (<div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4"/>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"/>
                Screening project evidence & guidelines...
              </div>
            </div>)}
        </div>

        {/* Suggested Quick Questions */}
        <div className="px-4 py-2 bg-slate-50/50 dark:bg-slate-950/30 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Suggested Verification Prompts
          </p>
          <div className="flex flex-wrap gap-1.5">
            {sampleQuestions.map((sq, idx) => (<button key={idx} onClick={() => handleSend(sq)} className="text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 transition-colors truncate max-w-full text-left">
                {sq}
              </button>))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSend();
        }} className="flex items-center gap-2">
            <input type="text" placeholder="Ask Sentinel anything about risks, evidence, or guidelines..." value={query} onChange={(e) => setQuery(e.target.value)} className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"/>
            <button type="submit" disabled={loading || !query.trim()} className="p-2.5 rounded-xl bg-blue-600 text-white disabled:opacity-50 hover:bg-blue-700 transition-colors shadow-sm">
              <Send className="w-4 h-4"/>
            </button>
          </form>
        </div>
      </div>
    </div>);
};
