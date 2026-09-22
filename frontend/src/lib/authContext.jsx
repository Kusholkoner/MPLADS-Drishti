"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "./supabaseClient";

/**
 * Standard Role-to-Permissions Matrix (per Section 11 & 12 of RBAC Specification)
 */
export const ROLE_PERMISSIONS = {
  mospi_officer: [
    "PROJECT_VIEW",
    "PROJECT_UPDATE",
    "FINANCIAL_VIEW",
    "EVIDENCE_VIEW",
    "EVIDENCE_UPLOAD",
    "EVIDENCE_VERIFY",
    "DOCUMENT_VIEW",
    "DOCUMENT_UPLOAD",
    "DOCUMENT_VERIFY",
    "RISK_VIEW",
    "RISK_REVIEW",
    "INVESTIGATION_VIEW",
    "INVESTIGATION_CREATE",
    "INVESTIGATION_ASSIGN",
    "INVESTIGATION_UPDATE",
    "INVESTIGATION_CLOSE",
    "ANALYTICS_VIEW",
    "NATIONAL_ANALYTICS_VIEW",
    "STATE_ANALYTICS_VIEW",
    "REPORT_EXPORT",
    "AI_COPILOT_USE",
    "DATASET_VIEW",
  ],
  state_nodal_authority: [
    "PROJECT_VIEW",
    "PROJECT_UPDATE",
    "FINANCIAL_VIEW",
    "EVIDENCE_VIEW",
    "EVIDENCE_UPLOAD",
    "EVIDENCE_VERIFY",
    "DOCUMENT_VIEW",
    "DOCUMENT_UPLOAD",
    "DOCUMENT_VERIFY",
    "RISK_VIEW",
    "RISK_REVIEW",
    "INVESTIGATION_VIEW",
    "INVESTIGATION_CREATE",
    "INVESTIGATION_ASSIGN",
    "INVESTIGATION_UPDATE",
    "ANALYTICS_VIEW",
    "STATE_ANALYTICS_VIEW",
    "REPORT_EXPORT",
    "AI_COPILOT_USE",
    "DATASET_VIEW",
  ],
  mp: [
    "PROJECT_VIEW",
    "PROJECT_CREATE",
    "FINANCIAL_VIEW",
    "EVIDENCE_VIEW",
    "DOCUMENT_VIEW",
    "RISK_VIEW",
    "ANALYTICS_VIEW",
    "REPORT_EXPORT",
    "AI_COPILOT_USE",
  ],
  implementing_agency: [
    "PROJECT_VIEW",
    "PROJECT_UPDATE",
    "FINANCIAL_VIEW",
    "FINANCIAL_SUBMIT",
    "EVIDENCE_VIEW",
    "EVIDENCE_UPLOAD",
    "DOCUMENT_VIEW",
    "DOCUMENT_UPLOAD",
    "REPORT_EXPORT",
  ],
  investigator: [
    "PROJECT_VIEW",
    "FINANCIAL_VIEW",
    "EVIDENCE_VIEW",
    "EVIDENCE_UPLOAD",
    "EVIDENCE_VERIFY",
    "DOCUMENT_VIEW",
    "DOCUMENT_UPLOAD",
    "DOCUMENT_VERIFY",
    "RISK_VIEW",
    "RISK_REVIEW",
    "INVESTIGATION_VIEW",
    "INVESTIGATION_CREATE",
    "INVESTIGATION_UPDATE",
    "INVESTIGATION_CLOSE",
    "ANALYTICS_VIEW",
    "REPORT_EXPORT",
    "AI_COPILOT_USE",
    "DATASET_VIEW",
  ],
  field_verification_officer: [
    "PROJECT_VIEW",
    "EVIDENCE_VIEW",
    "EVIDENCE_UPLOAD",
    "EVIDENCE_VERIFY",
    "DOCUMENT_VIEW",
    "DOCUMENT_UPLOAD",
    "INVESTIGATION_VIEW",
    "INVESTIGATION_UPDATE",
    "REPORT_EXPORT",
  ],
  system_admin: [
    "USER_MANAGE",
    "RBAC_ADMIN",
    "AUDIT_LOG_VIEW",
    "PROJECT_VIEW",
    "PROJECT_UPDATE",
    "FINANCIAL_VIEW",
    "EVIDENCE_VIEW",
    "EVIDENCE_UPLOAD",
    "EVIDENCE_VERIFY",
    "DOCUMENT_VIEW",
    "DOCUMENT_UPLOAD",
    "RISK_VIEW",
    "INVESTIGATION_VIEW",
    "ANALYTICS_VIEW",
    "NATIONAL_ANALYTICS_VIEW",
    "STATE_ANALYTICS_VIEW",
    "REPORT_EXPORT",
    "AI_COPILOT_USE",
    "DATASET_VIEW",
  ],
};

/**
 * Strict Route Protection Matrix
 */
export const ROLE_ALLOWED_ROUTES = {
  mospi_officer: [
    "/app",
    "/app/dashboard",
    "/app/command-center",
    "/app/reports",
    "/app/analytics",
    "/app/projects",
    "/app/risk",
    "/app/investigations",
    "/app/evidence",
    "/app/copilot",
    "/app/data",
  ],
  state_nodal_authority: [
    "/app",
    "/app/dashboard",
    "/app/command-center",
    "/app/reports",
    "/app/analytics",
    "/app/projects",
    "/app/risk",
    "/app/evidence",
    "/app/copilot",
    "/app/data",
  ],
  mp: [
    "/app",
    "/app/dashboard",
    "/app/command-center",
    "/app/reports",
    "/app/projects",
    "/app/analytics",
    "/app/copilot",
    "/app/data",
  ],
  implementing_agency: [
    "/app",
    "/app/dashboard",
    "/app/command-center",
    "/app/reports",
    "/app/projects",
    "/app/evidence",
    "/app/copilot",
    "/app/data",
  ],
  investigator: [
    "/app",
    "/app/dashboard",
    "/app/command-center",
    "/app/reports",
    "/app/investigations",
    "/app/risk",
    "/app/projects",
    "/app/evidence",
    "/app/copilot",
    "/app/data",
  ],
  field_verification_officer: [
    "/app",
    "/app/dashboard",
    "/app/command-center",
    "/app/reports",
    "/app/evidence",
    "/app/projects",
    "/app/copilot",
    "/app/data",
  ],
  system_admin: [
    "/app",
    "/app/dashboard",
    "/app/command-center",
    "/app/admin",
    "/app/reports",
    "/app/data",
    "/app/copilot",
    "/app/projects",
    "/app/risk",
    "/app/evidence",
    "/app/investigations",
    "/app/analytics",
  ],
};

export const ROLE_DEFAULT_ROUTES = {
  mospi_officer: "/app/dashboard",
  state_nodal_authority: "/app/dashboard",
  mp: "/app/dashboard",
  implementing_agency: "/app/dashboard",
  investigator: "/app/dashboard",
  field_verification_officer: "/app/dashboard",
  system_admin: "/app/dashboard",
};

export const isRouteAllowed = (role, pathname) => {
  if (!role) return false;
  if (
    !pathname ||
    pathname === "/app" ||
    pathname === "/login" ||
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/methodology" ||
    pathname === "/how-it-works" ||
    pathname === "/research" ||
    pathname === "/transparency"
  ) {
    return true;
  }
  const allowedPrefixes = ROLE_ALLOWED_ROUTES[role] || ["/app"];
  return allowedPrefixes.some(
    (prefix) =>
      pathname === prefix ||
      pathname.startsWith(prefix + "/") ||
      pathname.startsWith(prefix + "#")
  );
};

/**
 * 7 Official Institutional Stakeholder Profiles (Strict RBAC Master)
 */
export const INITIAL_INSTITUTIONAL_USERS = [
  {
    id: "usr-mospi-01",
    email: "ministry@mpladssentinel.demo",
    full_name: "Dr. Ananya Sharma",
    role: "mospi_officer",
    role_label: "Central Ministry Officer",
    designation: "Senior Audit & Surveillance Officer",
    department: "Data Informatics & Innovation Division (DIID), MoSPI",
    jurisdiction: "All India (National Oversight)",
    avatar_initials: "AS",
    status: "active",
    assignedCount: 48,
  },
  {
    id: "usr-state-01",
    email: "state@mpladssentinel.demo",
    full_name: "Rajiv Mehta",
    role: "state_nodal_authority",
    role_label: "State Nodal Authority",
    designation: "State Nodal & Monitoring Officer",
    department: "Department of Planning & Programme Implementation",
    state: "Rajasthan",
    jurisdiction: "State of Rajasthan (All Districts)",
    avatar_initials: "RM",
    status: "active",
    assignedCount: 312,
  },
  {
    id: "usr-mp-01",
    email: "mp@mpladssentinel.demo",
    full_name: "Hon'ble Demo MP",
    role: "mp",
    role_label: "Member of Parliament",
    designation: "Member of Parliament (Lok Sabha)",
    department: "Parliamentary Constituency Cell",
    state: "Delhi",
    constituency: "New Delhi",
    jurisdiction: "New Delhi Parliamentary Constituency (PC-04)",
    avatar_initials: "MP",
    status: "active",
    assignedCount: 84,
  },
  {
    id: "usr-agency-01",
    email: "agency@mpladssentinel.demo",
    full_name: "Er. Rajesh K. Sinha",
    role: "implementing_agency",
    role_label: "Implementing Agency",
    designation: "Executive Resident Engineer",
    department: "Civil Infrastructure & Works Division",
    agency: "Jaipur Development Authority (JDA)",
    state: "Rajasthan",
    district: "Jaipur",
    jurisdiction: "Jaipur Civil Circle",
    avatar_initials: "RS",
    status: "active",
    assignedCount: 26,
  },
  {
    id: "usr-investigator-01",
    email: "investigator@mpladssentinel.demo",
    full_name: "Priya Verma",
    role: "investigator",
    role_label: "Vigilance Investigator",
    designation: "Senior Vigilance & Audit Officer",
    department: "Technical Audit & Anti-Corruption Bureau",
    jurisdiction: "Northern Zone Vigilance Cell",
    avatar_initials: "PV",
    status: "active",
    assignedCount: 14,
  },
  {
    id: "usr-field-01",
    email: "field@mpladssentinel.demo",
    full_name: "Amit Singh",
    role: "field_verification_officer",
    role_label: "Field Verification Officer",
    designation: "Field Physical Verification Officer",
    department: "District Technical Inspection Wing",
    state: "Rajasthan",
    district: "Jaipur",
    jurisdiction: "Jaipur District Field Units",
    avatar_initials: "AS",
    status: "active",
    assignedCount: 9,
  },
  {
    id: "usr-admin-01",
    email: "admin@mpladssentinel.demo",
    full_name: "System Administrator",
    role: "system_admin",
    role_label: "System Administrator",
    designation: "Platform & Security Administrator",
    department: "NIC / MoSPI Technical Cell",
    jurisdiction: "All System Modules & User Governance",
    avatar_initials: "SA",
    status: "active",
    assignedCount: 7,
  },
];

export const DEMO_PERSONAS = INITIAL_INSTITUTIONAL_USERS.reduce((acc, user) => {
  acc[user.role] = {
    ...user,
    permissions: ROLE_PERMISSIONS[user.role] || [],
  };
  return acc;
}, {});

const ROLE_LABELS = {
  mospi_officer: "Central Ministry Officer",
  state_nodal_authority: "State Nodal Authority",
  mp: "Member of Parliament",
  implementing_agency: "Implementing Agency",
  investigator: "Vigilance Investigator",
  field_verification_officer: "Field Verification Officer",
  system_admin: "System Administrator",
};

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [managedUsers, setManagedUsers] = useState(INITIAL_INSTITUTIONAL_USERS);

  // Load managed users from storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("mplads_managed_users");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setManagedUsers(parsed);
          }
        }
      } catch (err) {
        console.warn("[Admin Users Load Error]", err);
      }
    }
  }, []);

  const saveManagedUsers = (newUsers) => {
    setManagedUsers(newUsers);
    if (typeof window !== "undefined") {
      localStorage.setItem("mplads_managed_users", JSON.stringify(newUsers));
    }
  };

  const updateManagedUser = (userId, updates) => {
    const updated = managedUsers.map((u) =>
      u.id === userId ? { ...u, ...updates } : u
    );
    saveManagedUsers(updated);
    if (profile && profile.id === userId) {
      const newRole = updates.role || profile.role;
      const updatedProfile = {
        ...profile,
        ...updates,
        permissions: ROLE_PERMISSIONS[newRole] || profile.permissions,
      };
      setProfile(updatedProfile);
      if (typeof window !== "undefined") {
        localStorage.setItem("mplads_active_user", JSON.stringify(updatedProfile));
      }
    }
  };

  const addManagedUser = (newUser) => {
    const userWithId = {
      ...newUser,
      id: newUser.id || `usr-${Date.now()}`,
      avatar_initials: (newUser.full_name || "U").substring(0, 2).toUpperCase(),
      status: newUser.status || "active",
      assignedCount: newUser.assignedCount || 0,
    };
    const updated = [...managedUsers, userWithId];
    saveManagedUsers(updated);
    return userWithId;
  };

  const toggleUserStatus = (userId) => {
    const updated = managedUsers.map((u) => {
      if (u.id === userId) {
        return { ...u, status: u.status === "active" ? "suspended" : "active" };
      }
      return u;
    });
    saveManagedUsers(updated);
  };

  /**
   * Fetch profile from Supabase profiles table
   */
  const fetchSupabaseProfile = async (supabaseUser) => {
    if (!isSupabaseConfigured || !supabase || !supabaseUser) return null;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", supabaseUser.id)
        .single();
      if (!error && data) return data;
    } catch (err) {
      console.warn("[fetchSupabaseProfile]", err.message);
    }
    return null;
  };

  /**
   * Build persona from Supabase user + profile data
   */
  const buildPersonaFromSupabase = (supabaseUser, dbProfile) => {
    const role =
      dbProfile?.role ||
      supabaseUser?.user_metadata?.role ||
      "field_verification_officer";
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      full_name:
        dbProfile?.full_name ||
        supabaseUser.user_metadata?.full_name ||
        supabaseUser.email?.split("@")[0] ||
        "Officer",
      role,
      role_label: ROLE_LABELS[role] || "Institutional Officer",
      designation:
        dbProfile?.designation ||
        supabaseUser.user_metadata?.designation ||
        "Assigned Officer",
      department:
        dbProfile?.department ||
        supabaseUser.user_metadata?.department ||
        "MPLADS Administration",
      state:
        dbProfile?.jurisdiction_state ||
        supabaseUser.user_metadata?.state ||
        "All India",
      district:
        dbProfile?.jurisdiction_district ||
        supabaseUser.user_metadata?.district ||
        "All",
      avatar_initials: (
        dbProfile?.full_name ||
        supabaseUser.user_metadata?.full_name ||
        supabaseUser.email ||
        "U"
      )
        .substring(0, 2)
        .toUpperCase(),
      status: "active",
      permissions: ROLE_PERMISSIONS[role] || [],
      supabase_uid: supabaseUser.id,
    };
  };

  const loadStoredSession = () => {
    if (typeof window !== "undefined") {
      const isLoggedOut = localStorage.getItem("mplads_logged_out") === "true";
      if (isLoggedOut) {
        setProfile(null);
        return;
      }
      const savedUser = localStorage.getItem("mplads_active_user");
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed && parsed.role) {
            setProfile({
              ...parsed,
              permissions: ROLE_PERMISSIONS[parsed.role] || [],
            });
            return;
          }
        } catch {}
      }
      const savedRole = localStorage.getItem("mplads_demo_role");
      if (savedRole && DEMO_PERSONAS[savedRole]) {
        setProfile(DEMO_PERSONAS[savedRole]);
      } else {
        setProfile(null);
      }
    }
  };

  // Initialize auth — Supabase session first, then localStorage fallback
  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      if (isSupabaseConfigured && supabase) {
        try {
          const isLoggedOut =
            typeof window !== "undefined" &&
            localStorage.getItem("mplads_logged_out") === "true";

          if (isLoggedOut) {
            if (isMounted) {
              setProfile(null);
              setLoading(false);
            }
            return;
          }

          const { data: sessionData } = await supabase.auth.getSession();

          if (sessionData?.session && isMounted) {
            const supabaseUser = sessionData.session.user;
            setSession(sessionData.session);
            setUser(supabaseUser);
            setToken(sessionData.session.access_token);

            // Fetch profile from DB
            const dbProfile = await fetchSupabaseProfile(supabaseUser);
            if (dbProfile) {
              const persona = buildPersonaFromSupabase(supabaseUser, dbProfile);
              setProfile(persona);
              if (typeof window !== "undefined") {
                localStorage.removeItem("mplads_logged_out");
                localStorage.setItem("mplads_active_user", JSON.stringify(persona));
              }
            } else {
              loadStoredSession();
            }
          } else {
            loadStoredSession();
          }
        } catch (err) {
          console.warn("[Auth Init Error]", err.message);
          loadStoredSession();
        } finally {
          if (isMounted) setLoading(false);
        }

        // Listen for auth state changes (e.g., token refresh, sign out from another tab)
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (!isMounted) return;

          if (event === "SIGNED_IN" && newSession) {
            const supabaseUser = newSession.user;
            setSession(newSession);
            setUser(supabaseUser);
            setToken(newSession.access_token);

            const dbProfile = await fetchSupabaseProfile(supabaseUser);
            const persona = buildPersonaFromSupabase(supabaseUser, dbProfile);
            setProfile(persona);
            if (typeof window !== "undefined") {
              localStorage.removeItem("mplads_logged_out");
              localStorage.setItem("mplads_active_user", JSON.stringify(persona));
            }
          } else if (event === "SIGNED_OUT") {
            setUser(null);
            setSession(null);
            setToken(null);
            setProfile(null);
          } else if (event === "TOKEN_REFRESHED" && newSession) {
            setSession(newSession);
            setToken(newSession.access_token);
          }
        });

        return () => {
          isMounted = false;
          subscription?.unsubscribe();
        };
      } else {
        loadStoredSession();
        if (isMounted) setLoading(false);
      }
    }

    const cleanup = initializeAuth();
    return () => {
      isMounted = false;
      if (cleanup && typeof cleanup.then === "function") {
        cleanup.then((fn) => fn && fn());
      }
    };
  }, []);

  const hasPermission = (permission) => {
    if (!profile) return false;
    return profile.permissions?.includes(permission) || false;
  };

  const canAccessState = (stateName) => {
    if (!profile) return false;
    if (
      profile.role === "mospi_officer" ||
      profile.role === "system_admin" ||
      profile.role === "investigator"
    ) {
      return true;
    }
    if (profile.state && stateName) {
      return profile.state.toLowerCase() === stateName.toLowerCase();
    }
    return true;
  };

  const canAccessDistrict = (districtName) => {
    if (!profile) return false;
    if (
      profile.role === "mospi_officer" ||
      profile.role === "system_admin" ||
      profile.role === "state_nodal_authority" ||
      profile.role === "investigator"
    ) {
      return true;
    }
    if (profile.district && districtName) {
      return profile.district.toLowerCase() === districtName.toLowerCase();
    }
    return true;
  };

  /**
   * Register a new user via Supabase Auth + profiles table
   * Data is stored in Supabase (primary) and localStorage (fallback)
   */
  const registerUser = async (userData) => {
    try {
      const {
        email,
        password,
        fullName,
        role = "field_verification_officer",
        designation = "Field Officer",
        department = "Planning & Monitoring Cell",
        state = "National",
        district = "All",
        constituency = "",
      } = userData;

      if (!email || !password) {
        return { error: new Error("Email and password are required.") };
      }
      if (password.length < 6) {
        return { error: new Error("Password must be at least 6 characters.") };
      }

      // Try Supabase signup first (primary data store)
      if (isSupabaseConfigured && supabase) {
        const { data: signUpData, error: signUpError } =
          await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              data: {
                full_name: fullName || email.split("@")[0],
                role,
                designation,
                department,
                state,
                district,
                constituency,
              },
            },
          });

        if (signUpError) {
          // Return real Supabase error to the UI
          return { error: signUpError };
        }

        if (signUpData?.user) {
          // Check if email confirmation is required
          if (
            !signUpData.session &&
            signUpData.user.identities?.length === 0
          ) {
            return {
              error: new Error(
                "This email is already registered. Please sign in or reset your password."
              ),
            };
          }

          if (!signUpData.session && signUpData.user) {
            // Email confirmation required
            return {
              error: new Error(
                "Registration successful! Please check your email inbox and click the confirmation link before logging in. (Tip: check spam folder too)"
              ),
              requiresEmailConfirmation: true,
              email: email.trim(),
            };
          }

          // Auto-confirmed — build persona and log in immediately
          const dbProfile = await fetchSupabaseProfile(signUpData.user);
          const persona = buildPersonaFromSupabase(signUpData.user, dbProfile);

          setUser(signUpData.user);
          setSession(signUpData.session);
          setToken(signUpData.session?.access_token || null);
          setProfile(persona);

          if (typeof window !== "undefined") {
            localStorage.removeItem("mplads_logged_out");
            localStorage.setItem("mplads_active_user", JSON.stringify(persona));
          }

          // Also add to managed users
          const localUser = {
            id: signUpData.user.id,
            email: email.trim(),
            full_name: fullName || email.split("@")[0],
            role,
            role_label: ROLE_LABELS[role] || "Institutional Officer",
            designation: designation || "Assigned Officer",
            department: department || "MPLADS Administration",
            state: state || "All India",
            district: district || "All",
            status: "active",
            assignedCount: 0,
            avatar_initials: (fullName || email).substring(0, 2).toUpperCase(),
            created_at: new Date().toISOString(),
          };
          const updatedUsers = [localUser, ...managedUsers];
          saveManagedUsers(updatedUsers);

          return { error: null, profile: persona };
        }
      }

      // Fallback: local-only registration (no Supabase)
      const existing = managedUsers.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (existing) {
        return {
          error: new Error(
            "An officer account with this email already exists."
          ),
        };
      }

      const newUser = {
        id: `usr-reg-${Date.now()}`,
        email: email.trim(),
        password,
        full_name: fullName || email.split("@")[0],
        role,
        role_label: ROLE_LABELS[role] || "Institutional Officer",
        designation: designation || "Assigned Officer",
        department: department || "MPLADS Administration",
        state: state || "All India",
        district: district || "All",
        constituency: constituency || "",
        jurisdiction:
          state && state !== "All India"
            ? `${state} (${district || "All"})`
            : "All India (National Oversight)",
        avatar_initials: (fullName || email).substring(0, 2).toUpperCase(),
        status: "active",
        assignedCount: 0,
        created_at: new Date().toISOString(),
      };

      const updatedUsers = [newUser, ...managedUsers];
      saveManagedUsers(updatedUsers);

      const persona = {
        ...newUser,
        permissions: ROLE_PERMISSIONS[newUser.role] || [],
      };

      setProfile(persona);
      if (typeof window !== "undefined") {
        localStorage.removeItem("mplads_logged_out");
        localStorage.setItem("mplads_demo_role", persona.role);
        localStorage.setItem("mplads_active_user", JSON.stringify(persona));
      }

      return { error: null, profile: persona };
    } catch (err) {
      console.error("[registerUser Error]", err);
      return { error: err };
    }
  };

  /**
   * Sign in with email/password
   * Tries Supabase first (session stored in Supabase), then local fallback
   */
  const signInWithPassword = async (email, password) => {
    if (!email || !password) {
      return { error: new Error("Email and password are required.") };
    }

    // 1. Try Supabase Auth (primary)
    if (isSupabaseConfigured && supabase) {
      const { data: supaData, error: supaErr } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (!supaErr && supaData?.user) {
        // Success — fetch profile from DB
        const dbProfile = await fetchSupabaseProfile(supaData.user);
        const persona = buildPersonaFromSupabase(supaData.user, dbProfile);

        setUser(supaData.user);
        setSession(supaData.session);
        setToken(supaData.session?.access_token || null);
        setProfile(persona);

        if (typeof window !== "undefined") {
          localStorage.removeItem("mplads_logged_out");
          localStorage.setItem("mplads_active_user", JSON.stringify(persona));
          localStorage.setItem("mplads_demo_role", persona.role);
        }

        // Sync to managedUsers if not present
        const existingIdx = managedUsers.findIndex(
          (u) => u.id === supaData.user.id || u.email === supaData.user.email
        );
        if (existingIdx === -1) {
          const updatedUsers = [
            {
              ...persona,
              id: supaData.user.id,
              assignedCount: 0,
            },
            ...managedUsers,
          ];
          saveManagedUsers(updatedUsers);
        }

        return { error: null, profile: persona };
      }

      if (supaErr) {
        // Map Supabase error codes to user-friendly messages
        const msg = supaErr.message || "";
        if (
          msg.includes("Email not confirmed") ||
          msg.includes("email_not_confirmed")
        ) {
          return {
            error: new Error(
              "Your email address is not confirmed yet. Please check your inbox for a confirmation link."
            ),
          };
        }
        if (
          msg.includes("Invalid login credentials") ||
          msg.includes("invalid_credentials")
        ) {
          // Don't return yet — try local fallback for demo users
        } else {
          return { error: supaErr };
        }
      }
    }

    // 2. Local fallback — check managedUsers (supports demo personas + locally registered)
    const matched = managedUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (matched) {
      if (matched.password && matched.password !== password) {
        return {
          error: new Error(
            "Incorrect password. Please check your credentials."
          ),
        };
      }

      const persona = {
        ...matched,
        permissions: ROLE_PERMISSIONS[matched.role] || [],
      };
      setProfile(persona);
      if (typeof window !== "undefined") {
        localStorage.removeItem("mplads_logged_out");
        localStorage.setItem("mplads_demo_role", persona.role);
        localStorage.setItem("mplads_active_user", JSON.stringify(persona));
      }
      return { error: null, profile: persona };
    }

    return {
      error: new Error(
        "Invalid credentials. Please check your email and password, or register a new account."
      ),
    };
  };

  const signInDemo = (role) => {
    const matched =
      managedUsers.find((u) => u.role === role) ||
      DEMO_PERSONAS[role] ||
      DEMO_PERSONAS.mospi_officer;
    const persona = {
      ...matched,
      permissions: ROLE_PERMISSIONS[matched.role] || [],
    };
    setProfile(persona);
    if (typeof window !== "undefined") {
      localStorage.removeItem("mplads_logged_out");
      localStorage.setItem("mplads_demo_role", role);
      localStorage.setItem("mplads_active_user", JSON.stringify(persona));
    }
    return persona;
  };

  const switchPersona = (role) => {
    signInDemo(role);
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn("[SignOut Warning]", err.message);
      }
    }
    setUser(null);
    setSession(null);
    setToken(null);
    setProfile(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("mplads_demo_role");
      localStorage.removeItem("mplads_active_user");
      localStorage.setItem("mplads_logged_out", "true");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        token,
        loading,
        managedUsers,
        updateManagedUser,
        addManagedUser,
        toggleUserStatus,
        isConfigured: isSupabaseConfigured,
        hasPermission,
        canAccessState,
        canAccessDistrict,
        signInWithPassword,
        signInDemo,
        signOut,
        switchPersona,
        registerUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
