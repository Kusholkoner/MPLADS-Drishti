"use client";
import React, { useState } from "react";
import { Sparkles, Send, Bot, User, ShieldAlert, FileText, BookOpen, CheckCircle2, RotateCcw, ArrowRight, } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { api } from "@/lib/api";
export default function CopilotPage() {
    const [messages, setMessages] = useState([
        {
            id: "INIT",
            sender: "sentinel",
            timestamp: new Date().toISOString(),
            content: "Welcome to the Sentinel AI Copilot Workspace. I am directly grounded in 18,432 MPLADS project records, PFMS treasury transactions, OCR document extractions, and official MoSPI 2023 Scheme Guidelines. How can I assist your audit investigation today?",
        },
    ]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const suggestedQuestions = [
        "Why is MPL-004821 prioritized as high risk?",
        "Show projects where spending >80% and physical progress <50%",
        "Identify duplicate scopes flagged in New Delhi district",
        "What statutory guidelines apply to milestone fund retention?",
    ];
    const handleSend = async (customQuery) => {
        const q = customQuery || query;
        if (!q.trim() || loading)
            return;
        const userMsg = {
            id: `USER-${Date.now()}`,
            sender: "user",
            timestamp: new Date().toISOString(),
            content: q,
        };
        setMessages((prev) => [...prev, userMsg]);
        setQuery("");
        setLoading(true);
        try {
            const resp = await api.queryCopilot(q);
            setMessages((prev) => [...prev, resp]);
        }
        catch {
            const errorMsg = {
                id: `ERR-${Date.now()}`,
                sender: "sentinel",
                timestamp: new Date().toISOString(),
                content: "Unable to query Sentinel Copilot service. Please verify server connectivity.",
            };
            setMessages((prev) => [...prev, errorMsg]);
        }
        finally {
            setLoading(false);
        }
    };
    const handleClear = () => {
        setMessages([
            {
                id: "INIT",
                sender: "sentinel",
                timestamp: new Date().toISOString(),
                content: "Welcome to the Sentinel AI Copilot Workspace. I am directly grounded in 18,432 MPLADS project records, PFMS treasury transactions, OCR document extractions, and official MoSPI 2023 Scheme Guidelines. How can I assist your audit investigation today?",
            },
        ]);
    };
    return (<AppShell breadcrumbs={[{ label: "AI Copilot" }]}>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-600"/>
                Grounded Audit Intelligence Assistant
              </span>
              <span className="text-xs text-slate-400">RAG + Structured SQL Grounding</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
              Sentinel AI Copilot Workspace
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Query multi-source intelligence, cross-reference statutory guidelines, and extract grounded evidence briefs
            </p>
          </div>

          <button onClick={handleClear} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors self-start sm:self-auto">
            <RotateCcw className="w-3.5 h-3.5"/>
            <span>Reset Conversation</span>
          </button>
        </div>

        {/* Suggested Queries Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {suggestedQuestions.map((sq, idx) => (<button key={idx} onClick={() => handleSend(sq)} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 text-left text-xs font-medium text-slate-700 dark:text-slate-300 transition-all flex items-center justify-between group shadow-xs">
              <span>{sq}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2"/>
            </button>))}
        </div>

        {/* Chat Stream Window */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col min-h-[500px] overflow-hidden">
          {/* Messages Feed */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (<div key={msg.id} className={`flex gap-3.5 ${isUser ? "justify-end" : "justify-start"}`}>
                  {!isUser && (<div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                      <Bot className="w-4 h-4"/>
                    </div>)}

                  <div className={`max-w-[85%] rounded-2xl p-5 text-xs space-y-4 ${isUser
                    ? "bg-slate-900 text-white dark:bg-blue-600 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-850/80 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-750"}`}>
                    <p className="leading-relaxed text-[13px] whitespace-pre-wrap">{msg.content}</p>

                    {/* Structured AI grounding sections */}
                    {msg.structuredResponse?.riskSignals && (<div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                        <p className="font-bold text-[11px] uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-600"/> Grounded Risk Signals Detected
                        </p>
                        <div className="space-y-1.5">
                          {msg.structuredResponse.riskSignals.map((rs, idx) => (<div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-rose-200/60 dark:border-rose-900/40 space-y-0.5">
                              <span className="font-bold text-rose-700 dark:text-rose-300">{rs.signal}</span>
                              <p className="text-[11px] text-slate-600 dark:text-slate-400">{rs.description}</p>
                            </div>))}
                        </div>
                      </div>)}

                    {msg.structuredResponse?.evidenceSources && (<div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
                        <p className="font-bold text-[11px] uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-blue-600"/> Linked Ground Artifacts
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {msg.structuredResponse.evidenceSources.map((src, idx) => (<span key={idx} className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-blue-50 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                              {src.title}
                            </span>))}
                        </div>
                      </div>)}

                    {msg.structuredResponse?.guidelinesCited && (<div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                        <p className="font-bold text-[11px] uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-purple-600"/> MoSPI & GFR Statutory Precedents
                        </p>
                        {msg.structuredResponse.guidelinesCited.map((g, idx) => (<div key={idx} className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-900/40 text-[11px]">
                            <span className="font-bold text-purple-800 dark:text-purple-300">
                              {g.section} ({g.clause}):{" "}
                            </span>
                            <span className="text-slate-700 dark:text-slate-300">{g.text}</span>
                          </div>))}
                      </div>)}

                    {msg.structuredResponse?.recommendedVerificationSteps && (<div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
                        <p className="font-bold text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600"/> Recommended Auditor Actions
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-700 dark:text-slate-300 pl-1">
                          {msg.structuredResponse.recommendedVerificationSteps.map((step, idx) => (<li key={idx}>{step}</li>))}
                        </ul>
                      </div>)}
                  </div>

                  {isUser && (<div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                      <User className="w-4 h-4"/>
                    </div>)}
                </div>);
        })}

            {loading && (<div className="flex gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4"/>
                </div>
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"/>
                  Grounded multi-source query in progress...
                </div>
              </div>)}
          </div>

          {/* Bottom Chat Input Form */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
            <form onSubmit={(e) => {
            e.preventDefault();
            handleSend();
        }} className="flex items-center gap-3">
              <input type="text" placeholder="Ask about project risks, evidence provenance, or statutory guidelines..." value={query} onChange={(e) => setQuery(e.target.value)} className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xs"/>
              <button type="submit" disabled={loading || !query.trim()} className="p-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm">
                <Send className="w-4 h-4"/>
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppShell>);
}
