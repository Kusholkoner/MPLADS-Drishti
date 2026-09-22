"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
  Landmark,
  HardHat,
  SearchCode,
  ClipboardCheck,
  Settings,
  UserPlus,
  LogIn,
  User,
  Building2,
  MapPin,
  BadgeCheck,
  LogOut,
} from "lucide-react";
import { useAuth, DEMO_PERSONAS, ROLE_DEFAULT_ROUTES } from "@/lib/authContext";
import { APP_NAME, APP_HINDI_NAME } from "@/lib/constants";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const { signInWithPassword, signInDemo, registerUser } = useAuth();

  // Active Tab: "login" or "register"
  const [activeTab, setActiveTab] = useState("login");

  // Sign In Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register Form State
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regRole, setRegRole] = useState("field_verification_officer");
  const [regDesignation, setRegDesignation] = useState("");
  const [regDepartment, setRegDepartment] = useState("");
  const [regState, setRegState] = useState("Rajasthan");
  const [regDistrict, setRegDistrict] = useState("Jaipur");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Status & Feedback State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loggedOutBanner, setLoggedOutBanner] = useState(false);

  // Read query params client-side to avoid Suspense/hydration issues
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("status") === "signed_out" || params.get("logout") === "true") {
      setLoggedOutBanner(true);
    }
  }, []);

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoggedOutBanner(false);
    setLoading(true);

    try {
      const res = await signInWithPassword(loginEmail, loginPassword);
      if (res.error) {
        setErrorMsg(res.error.message);
      } else {
        const dest = ROLE_DEFAULT_ROUTES[res.profile?.role] || "/app/dashboard";
        setSuccessMsg(`Authenticated as ${res.profile?.full_name || "Officer"}! Redirecting...`);
        setTimeout(() => router.push(dest), 600);
      }
    } catch (err) {
      setErrorMsg(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoggedOutBanner(false);

    if (regPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg("Passwords do not match. Please recheck.");
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser({
        fullName: regFullName.trim(),
        email: regEmail.trim(),
        role: regRole,
        designation: regDesignation.trim() || undefined,
        department: regDepartment.trim() || undefined,
        state: regState.trim() || undefined,
        district: regDistrict.trim() || undefined,
        password: regPassword,
      });

      if (res.error) {
        // Special case: email confirmation required
        if (res.requiresEmailConfirmation) {
          setSuccessMsg(res.error.message);
          setErrorMsg(null);
        } else {
          setErrorMsg(res.error.message);
        }
      } else {
        const dest = ROLE_DEFAULT_ROUTES[res.profile?.role] || "/app/dashboard";
        setSuccessMsg(`Officer account registered successfully! Initializing workspace for ${res.profile?.full_name}...`);
        setTimeout(() => router.push(dest), 700);
      }
    } catch (err) {
      setErrorMsg(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  // Handle 1-Click Demo Login
  const handleDemoLogin = (targetRole) => {
    setErrorMsg(null);
    setLoggedOutBanner(false);
    const persona = signInDemo(targetRole);
    const dest = ROLE_DEFAULT_ROUTES[targetRole] || "/app/command-center";
    setSuccessMsg(`Authenticated as ${persona.full_name} (${persona.designation})`);
    setTimeout(() => router.push(dest), 450);
  };

  // Quick fill login form for convenience
  const quickFillCredential = (email, password = "••••••••••••") => {
    setLoginEmail(email);
    setLoginPassword(password);
    setErrorMsg(null);
  };

  const roleIcons = {
    mospi_officer: ShieldCheck,
    state_nodal_authority: Landmark,
    mp: Landmark,
    implementing_agency: HardHat,
    investigator: SearchCode,
    field_verification_officer: ClipboardCheck,
    system_admin: Settings,
  };

  const roleOptions = [
    { value: "mospi_officer", label: "Central MoSPI Officer (DIID Oversight)" },
    { value: "state_nodal_authority", label: "State Nodal Authority (SNA Planner)" },
    { value: "mp", label: "Hon'ble Member of Parliament (MP Cell)" },
    { value: "implementing_agency", label: "Implementing Agency (Executive Engineer)" },
    { value: "investigator", label: "Vigilance Investigator (Anti-Corruption)" },
    { value: "field_verification_officer", label: "Field Verification Officer (Inspections)" },
    { value: "system_admin", label: "System Administrator (Governance & Security)" },
  ];

  const roleOrder = [
    "mospi_officer",
    "state_nodal_authority",
    "mp",
    "implementing_agency",
    "investigator",
    "field_verification_officer",
    "system_admin",
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur sticky top-0 z-30 shadow-xs">
        <Link href="/login" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-blue-600/25 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-blue-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white">
                {APP_NAME}
              </span>
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                {APP_HINDI_NAME}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              <span>MoSPI DIID</span>
              <span>•</span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">Institutional Governance Portal</span>
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Govt Portal Live</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Platform Overview & 1-Click Institutional Demo Personas */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>MoSPI Audit & Vigilance Surveillance • SIH26102</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Institutional MPLADS Security & Governance Portal
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Welcome to the official portal for AI-powered multi-source surveillance and vigilance analytics.
              Sign in with your official officer credentials, register a new verified departmental account, or select any of the 7 pre-configured stakeholder personas for instant 1-click evaluation access.
            </p>
          </div>

          {/* 1-Click Demo Personas (Evaluation Tool) */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  7 Official Stakeholder Personas (1-Click Instant Login)
                </h2>
              </div>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                RBAC Evaluator
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Click any profile below to immediately launch its tailored command center and RBAC clearance:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {roleOrder.map((key) => {
                const p = DEMO_PERSONAS[key];
                if (!p) return null;
                const Icon = roleIcons[key] || ShieldCheck;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleDemoLogin(key)}
                    className="text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/70 dark:bg-slate-850/60 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 transition-all group active:scale-[0.98] shadow-2xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs mt-0.5 group-hover:bg-blue-700 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {p.full_name}
                          </p>
                        </div>
                        <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400 truncate">
                          {p.designation}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {p.jurisdiction || p.department}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Unified Login & Registration Card */}
        <div className="lg:col-span-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            {/* Header Tabs: Sign In / Register */}
            <div className="p-2 bg-slate-100/80 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-800 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("login");
                  setErrorMsg(null);
                }}
                className={`flex-1 py-2.5 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === "login"
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Officer Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("register");
                  setErrorMsg(null);
                }}
                className={`flex-1 py-2.5 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === "register"
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Register Account</span>
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              {/* Form Title */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {activeTab === "login" ? "Institutional Sign In" : "Register Institutional Officer"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {activeTab === "login"
                    ? "Enter your official email address and password to access your jurisdiction."
                    : "Create a verified institutional account for MoSPI audit, SNA, or field verification."}
                </p>
              </div>

              {/* Logout Feedback Banner */}
              {loggedOutBanner && (
                <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 text-xs flex items-center gap-2.5 animate-in fade-in">
                  <LogOut className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold">Logged Out Successfully</p>
                    <p className="text-[11px] text-blue-600 dark:text-blue-300">
                      Your session was securely terminated. Sign in below or register a new account to continue.
                    </p>
                  </div>
                </div>
              )}

              {/* Alerts */}
              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* TAB 1: SIGN IN FORM */}
              {activeTab === "login" && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Official Email / NIC ID
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="e.g. ministry@mpladssentinel.demo"
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => quickFillCredential("ministry@mpladssentinel.demo", "admin123")}
                        className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Auto-fill Demo Ministry Login
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                  >
                    <span>{loading ? "Verifying Credentials..." : "Sign In to Sentinel"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Switch to Register link */}
                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Need a new institutional officer account?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("register");
                          setErrorMsg(null);
                        }}
                        className="font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Register here</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* TAB 2: REGISTER FORM */}
              {activeTab === "register" && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Full Name & Title *
                      </label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={regFullName}
                          onChange={(e) => setRegFullName(e.target.value)}
                          placeholder="e.g. Dr. Rajesh Sharma"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Official Email */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Official Email / NIC ID *
                      </label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="officer@nic.in / @gov.in"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Institutional Role */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Institutional Stakeholder Role *
                    </label>
                    <div className="relative">
                      <BadgeCheck className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {roleOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Designation & Department */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Official Designation
                      </label>
                      <div className="relative">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={regDesignation}
                          onChange={(e) => setRegDesignation(e.target.value)}
                          placeholder="e.g. Senior Audit Officer"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Department / Wing
                      </label>
                      <input
                        type="text"
                        value={regDepartment}
                        onChange={(e) => setRegDepartment(e.target.value)}
                        placeholder="e.g. Planning & Vigilance Wing"
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Jurisdiction: State & District */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Jurisdiction State
                      </label>
                      <div className="relative">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={regState}
                          onChange={(e) => setRegState(e.target.value)}
                          placeholder="e.g. Rajasthan"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        District / Constituency
                      </label>
                      <input
                        type="text"
                        value={regDistrict}
                        onChange={(e) => setRegDistrict(e.target.value)}
                        placeholder="e.g. Jaipur"
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Password (min 6 chars) *
                      </label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showRegPassword ? "text" : "password"}
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showRegPassword ? "text" : "password"}
                          required
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                  >
                    <span>{loading ? "Registering Institutional Account..." : "Create Account & Sign In"}</span>
                    <UserPlus className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Already have an officer account?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("login");
                          setErrorMsg(null);
                        }}
                        className="font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Sign in here</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* Footer Specs Note */}
              <div className="pt-3 text-center border-t border-slate-100 dark:border-slate-800">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Authentication Layer: <span className="font-mono text-blue-600 dark:text-blue-400">RBAC Token Matrix</span> • Cloud Storage: <span className="font-mono text-emerald-600 dark:text-emerald-400">Supabase SSR</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
        © 2026 MPLADS Sentinel • Ministry of Statistics and Programme Implementation (MoSPI) • SIH26102
      </footer>
    </div>
  );
}

