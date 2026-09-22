"use client";
import React, { useState, useEffect } from "react";
import {
  Users,
  ShieldCheck,
  UserPlus,
  Edit2,
  Lock,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  RotateCcw,
  Search,
  Filter,
  Activity,
  History,
  ShieldAlert,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/authContext";

const OFFICIAL_ROLES = [
  { role: "mospi_officer", label: "MoSPI Central Officer", scope: "National" },
  { role: "state_nodal_authority", label: "State Nodal Authority", scope: "Statewide" },
  { role: "mp", label: "Member of Parliament", scope: "Constituency" },
  { role: "implementing_agency", label: "Implementing Agency", scope: "Assigned Works" },
  { role: "investigator", label: "Vigilance Investigator", scope: "Cases & Zone" },
  { role: "field_verification_officer", label: "Field Verification Officer", scope: "Site Level" },
  { role: "system_admin", label: "System Administrator", scope: "Platform Governance" },
];

export default function AdminPortalPage() {
  const { profile } = useAuth();
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("users"); // "users" | "logs" | "operations"

  // Modal State
  const [editingUser, setEditingUser] = useState(null);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    role: "mospi_officer",
    designation: "",
    department: "",
    state: "All India",
    district: "All",
    constituency: "",
    status: "active",
  });
  const [saving, setSaving] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [userData, logsData] = await Promise.all([
          api.getAllUsers(),
          api.getAuditLogs(),
        ]);
        if (Array.isArray(userData)) setUsers(userData);
        if (Array.isArray(logsData)) setAuditLogs(logsData);
      } catch (err) {
        console.error("Failed to load admin portal data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      designation: user.designation || "",
      department: user.department || "",
      state: user.jurisdiction_state || "All India",
      district: user.jurisdiction_district || "All",
      constituency: user.jurisdiction_constituency || "",
      status: user.status || "active",
    });
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingUser) {
        // Update user
        const res = await api.updateUser(editingUser.id, formData);
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u))
        );
        setActionSuccess(`Updated profile for ${formData.full_name || formData.email}`);
      } else {
        // Create user
        const res = await api.createUser(formData);
        if (res && res.data) {
          setUsers((prev) => [res.data, ...prev]);
        } else {
          setUsers((prev) => [
            { id: `usr-${Date.now().toString().slice(-4)}`, ...formData, created_at: new Date().toISOString() },
            ...prev,
          ]);
        }
        setActionSuccess(`Provisioned institutional user ${formData.email}`);
      }
      setEditingUser(null);
      setIsNewUserModalOpen(false);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      console.error("Save user error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === "suspended" ? "active" : "suspended";
    try {
      await api.updateUser(user.id, { ...user, status: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
      );
      setActionSuccess(`User ${user.email} is now ${newStatus.toUpperCase()}`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      console.error("Toggle status error:", err);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <AppShell breadcrumbs={[{ label: "System Administration" }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                Platform Governance & Security
              </span>
              <span className="text-xs text-slate-400">7-Role RBAC Standard</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
              System Administration & RBAC Portal
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Provision institutional stakeholders, calibrate jurisdictional boundaries, inspect audit trails, and manage surveillance scoping
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingUser(null);
                setFormData({
                  email: "",
                  full_name: "",
                  role: "mospi_officer",
                  designation: "",
                  department: "",
                  state: "All India",
                  district: "All",
                  constituency: "",
                  status: "active",
                });
                setIsNewUserModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Provision New User</span>
            </button>
          </div>
        </div>

        {/* Action Feedback Banner */}
        {actionSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "users"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>User Profiles ({users.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "logs"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail Logs ({auditLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("operations")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "operations"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Surveillance Scoping & Operations</span>
          </button>
        </div>

        {/* TAB 1: USERS LIST */}
        {activeTab === "users" && (
          <div className="space-y-4">
            {/* Filter Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search user by name, email, department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs bg-transparent border-none focus:outline-none text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
                >
                  <option value="all">All Roles (7 Total)</option>
                  {OFFICIAL_ROLES.map((r) => (
                    <option key={r.role} value={r.role}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 dark:bg-slate-850/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Stakeholder</th>
                      <th className="px-4 py-3">Institutional Role</th>
                      <th className="px-4 py-3">Jurisdiction</th>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredUsers.map((u) => (
                      <tr key={u.id || u.email} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900 dark:text-white">{u.full_name}</div>
                          <div className="text-[11px] font-mono text-slate-400">{u.email}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            {OFFICIAL_ROLES.find((r) => r.role === u.role)?.label || u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                          <div>{u.jurisdiction_state || "All India"}</div>
                          {u.jurisdiction_district && u.jurisdiction_district !== "All" && (
                            <div className="text-[10px] text-slate-400 font-mono">{u.jurisdiction_district}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                          {u.department || "MPLADS Monitoring Wing"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.status === "suspended"
                                ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                u.status === "suspended" ? "bg-rose-500" : "bg-emerald-500"
                              }`}
                            />
                            <span>{(u.status || "active").toUpperCase()}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                          <button
                            onClick={() => handleEditClick(u)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                              u.status === "suspended"
                                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
                                : "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100"
                            }`}
                          >
                            <span>{u.status === "suspended" ? "Activate" : "Suspend"}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AUDIT LOGS */}
        {activeTab === "logs" && (
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Immutable Platform Audit Trail</h3>
                <p className="text-xs text-slate-400">Cryptographically ordered governance events and surveillance triggers</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 dark:bg-slate-850/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">Action Code</th>
                    <th className="px-4 py-3">Actor / Agent</th>
                    <th className="px-4 py-3">Audit Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50">
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded text-[11px]">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">{log.actor}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-sans">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SCOPING & OPERATIONS */}
        {activeTab === "operations" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Batch Statutory Ingestion</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Ingests and cross-reconciles all 12 official MoSPI CSV datasets (Lok Sabha & Rajya Sabha across all 6 slots: Recommended, Sanctioned, Completed, Expenditure, Installments, Calamity Consents) in a single operation.
              </p>
              <button
                onClick={async () => {
                  setSaving(true);
                  try {
                    await api.adminIngestAllFiles();
                    setActionSuccess("Ingested all 12 official datasets across Lok Sabha & Rajya Sabha!");
                    setTimeout(() => setActionSuccess(null), 4000);
                  } finally {
                    setSaving(false);
                  }
                }}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm disabled:opacity-50"
              >
                <span>{saving ? "Ingesting..." : "Ingest All 12 Files at Once"}</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Zero Fake Data Scope Reset</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Restores surveillance metrics to the clean baseline (0 works, ₹0 Cr, 0 risk flags). Clears in-memory active scope while preserving historical dossiers in the persistent database.
              </p>
              <button
                onClick={async () => {
                  setSaving(true);
                  try {
                    await api.restoreSurveillanceScope();
                    setActionSuccess("Surveillance scope reset to zero baseline successfully.");
                    setTimeout(() => setActionSuccess(null), 4000);
                  } finally {
                    setSaving(false);
                  }
                }}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-rose-600 hover:text-white transition-colors disabled:opacity-50"
              >
                <span>Reset Scope to Clean Baseline</span>
              </button>
            </div>
          </div>
        )}

        {/* User Edit / Create Modal */}
        {(isNewUserModalOpen || editingUser) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {editingUser ? "Edit Stakeholder Profile" : "Provision Institutional User"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {editingUser ? `Modifying ID: ${editingUser.id}` : "Assign institutional role and territorial jurisdiction"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsNewUserModalOpen(false);
                    setEditingUser(null);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveUser} className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!!editingUser}
                      placeholder="officer@mpladssentinel.gov.in"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="e.g. Dr. Rajesh Verma"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Institutional Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                  >
                    {OFFICIAL_ROLES.map((r) => (
                      <option key={r.role} value={r.role}>
                        {r.label} ({r.scope})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Designation</label>
                    <input
                      type="text"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      placeholder="e.g. Senior Audit Officer"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Department</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder="e.g. MoSPI DIID"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">State Jurisdiction</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="All India or State"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">District</label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      placeholder="All or District"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none font-bold"
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewUserModalOpen(false);
                      setEditingUser(null);
                    }}
                    className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-500 font-bold shadow-sm disabled:opacity-50"
                  >
                    {saving ? "Saving..." : editingUser ? "Save Changes" : "Create User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
