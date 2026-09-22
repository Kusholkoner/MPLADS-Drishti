"use client";
import React, { useState, useRef } from "react";
import { UploadCloud, FileText, Sparkles, X, ArrowRight } from "lucide-react";
export const FileUploadDropzone = ({ onFileSelect, isAnalyzing = false, }) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const sampleDocuments = [
        {
            name: "Sample_Contractor_Running_Account_Bill_03.pdf",
            label: "Contractor RA Bill #3 (Claimed: ₹41.0 L)",
            type: "Invoice / Bill",
            text: "RUNNING ACCOUNT BILL NO. 03 CONTRACTOR CIVIL MEASUREMENT & PASSING ORDER DSIIDC VILLAGE KHERA",
        },
        {
            name: "Sample_Form_GFR_12A_Utilization_Certificate.pdf",
            label: "Provisional Utilization Certificate GFR 12-A",
            type: "Certificate (UC)",
            text: "FORM GFR 12-A FORM OF UTILIZATION CERTIFICATE FOR MPLADS EXECUTING AGENCIES BBMP BENGALURU",
        },
        {
            name: "Sample_Administrative_Sanction_Order_2025.pdf",
            label: "Administrative Approval & Sanction Order",
            type: "Sanction Order",
            text: "ORDER OF ADMINISTRATIVE SANCTION AND ALLOCATION OF MPLADS FUNDS UNDER GUIDELINES 2023 DSIIDC",
        },
    ];
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        }
        else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setSelectedFile({
                name: file.name,
                size: `${(file.size / 1024).toFixed(1)} KB`,
                type: file.type || "Document",
            });
            onFileSelect(file);
        }
    };
    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile({
                name: file.name,
                size: `${(file.size / 1024).toFixed(1)} KB`,
                type: file.type || "Document",
            });
            onFileSelect(file);
        }
    };
    const handleSelectSample = (sample) => {
        setSelectedFile({
            name: sample.name,
            size: "248 KB",
            type: sample.type,
        });
        onFileSelect(null, sample.text, sample.name);
    };
    const handleClear = () => {
        setSelectedFile(null);
        if (fileInputRef.current)
            fileInputRef.current.value = "";
        onFileSelect(null);
    };
    return (<div className="space-y-4">
      {/* Dropzone Container */}
      <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={() => !selectedFile && fileInputRef.current?.click()} className={`relative border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer ${dragActive
            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30"
            : selectedFile
                ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/10 cursor-default"
                : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-600 shadow-sm"}`}>
        <input ref={fileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.tiff,.doc,.docx" onChange={handleChange} className="hidden"/>

        {selectedFile ? (<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                <FileText className="w-6 h-6"/>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                    {selectedFile.name}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Ready for Analysis
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Size: {selectedFile.size} • Format: {selectedFile.type}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button type="button" onClick={handleClear} className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1">
                <X className="w-3.5 h-3.5"/> Change Document
              </button>
            </div>
          </div>) : (<div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
              <UploadCloud className="w-6 h-6"/>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Drag & Drop Document / Bill / Certificate or{" "}
                <span className="text-blue-600 dark:text-blue-400 underline">Browse Files</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports PDF, Scanned Images (PNG, JPG), Word invoices up to 10MB
              </p>
            </div>
          </div>)}
      </div>

      {/* Quick Sample Document Preset Chips */}
      {!selectedFile && (<div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-600"/> Or evaluate with official sample audit documents:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {sampleDocuments.map((s, idx) => (<button key={idx} type="button" onClick={() => handleSelectSample(s)} className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 text-left transition-all group shadow-2xs flex flex-col justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold uppercase">
                    {s.type}
                  </span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 line-clamp-1">
                    {s.label}
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 pt-2 font-mono">
                  Inspect Layout <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"/>
                </span>
              </button>))}
          </div>
        </div>)}
    </div>);
};
