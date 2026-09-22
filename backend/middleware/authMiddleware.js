const { supabase, isConfigured } = require("../config/supabase");
const supabaseService = require("../services/supabaseService");

const DEMO_PERSONA_MAP = {
  mospi_officer: {
    name: "Dr. Ananya Sharma",
    designation: "Senior Audit Officer",
    department: "Data Informatics & Innovation Division (DIID), MoSPI",
    jurisdiction: "All India (National Surveillance)",
  },
  state_nodal_authority: {
    name: "Rajiv Mehta",
    designation: "State Nodal & Monitoring Authority",
    department: "Department of Planning & Programme Implementation",
    jurisdiction: "State of Rajasthan",
  },
  mp: {
    name: "Hon'ble Demo MP",
    designation: "Member of Parliament (Lok Sabha)",
    department: "Parliamentary Constituency Cell",
    jurisdiction: "New Delhi PC-04",
  },
  implementing_agency: {
    name: "Er. Rajesh K. Sinha",
    designation: "Executive Resident Engineer",
    department: "Civil Infrastructure & Works Division",
    jurisdiction: "Jaipur Civil Circle",
  },
  investigator: {
    name: "Priya Verma",
    designation: "Senior Vigilance & Audit Officer",
    department: "Technical Audit & Anti-Corruption Bureau",
    jurisdiction: "Northern Zone Vigilance Cell",
  },
  field_verification_officer: {
    name: "Amit Singh",
    designation: "Field Physical Verification Officer",
    department: "District Technical Inspection Wing",
    jurisdiction: "Jaipur District Field Units",
  },
  system_admin: {
    name: "Sanjay Singhania",
    designation: "Platform Principal Administrator",
    department: "National Informatics & Platform Governance",
    jurisdiction: "Central Infrastructure & All-India Scope",
  },
};

/**
 * Middleware to authenticate requests via Supabase JWT or Demo Session
 */
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // Demo / Mock header support for testing environments
      const demoRole = req.headers["x-demo-role"] || req.headers["x-user-role"];
      if (demoRole) {
        const info = DEMO_PERSONA_MAP[demoRole] || DEMO_PERSONA_MAP.mospi_officer;
        req.user = {
          id: `demo-${demoRole}`,
          email: `${demoRole}@mpladssentinel.demo`,
          role: demoRole,
          isDemo: true,
        };
        req.profile = {
          id: req.user.id,
          email: req.user.email,
          full_name: info.name,
          role: demoRole,
          designation: info.designation,
          department: info.department,
          jurisdiction: info.jurisdiction,
        };
        return next();
      }

      return res.status(401).json({
        success: false,
        message: "Authorization token missing or invalid. Please provide 'Authorization: Bearer <token>' header.",
      });
    }

    const token = authHeader.split(" ")[1];

    // Check if demo token provided
    if (token.startsWith("demo-")) {
      const roleKey = token.replace("demo-", "");
      const info = DEMO_PERSONA_MAP[roleKey] || DEMO_PERSONA_MAP.mospi_officer;
      req.user = {
        id: `demo-${roleKey}`,
        email: `${roleKey}@mpladssentinel.demo`,
        role: roleKey,
        isDemo: true,
      };
      req.profile = {
        id: req.user.id,
        email: req.user.email,
        full_name: info.name,
        role: roleKey,
        designation: info.designation,
        department: info.department,
        jurisdiction: info.jurisdiction,
      };
      return next();
    }

    if (isConfigured && supabase) {
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data.user) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired Supabase authentication session.",
          error: error?.message,
        });
      }

      req.user = data.user;
      const profile = await supabaseService.getProfileById(data.user.id);
      req.profile = profile || {
        id: data.user.id,
        email: data.user.email,
        role: data.user.user_metadata?.role || "mospi_officer",
        full_name: data.user.user_metadata?.full_name || data.user.email,
      };
      return next();
    }

    // Fallback if Supabase offline
    req.user = {
      id: "demo-user-authenticated",
      email: "ministry@mpladssentinel.demo",
      role: "mospi_officer",
    };
    req.profile = {
      id: "demo-user-authenticated",
      email: "ministry@mpladssentinel.demo",
      full_name: "Dr. Ananya Sharma",
      role: "mospi_officer",
      designation: "Senior Audit Officer",
      department: "MoSPI Surveillance Cell",
      jurisdiction: "All India",
    };
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "Authentication validation error: " + error.message });
  }
};

/**
 * Optional Auth middleware - attaches user if token is present, but doesn't block if absent
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      if (token.startsWith("demo-")) {
        const roleKey = token.replace("demo-", "");
        const info = DEMO_PERSONA_MAP[roleKey] || DEMO_PERSONA_MAP.mospi_officer;
        req.user = { id: `demo-${roleKey}`, email: `${roleKey}@mpladssentinel.demo`, role: roleKey };
        req.profile = { id: req.user.id, full_name: info.name, role: roleKey };
      } else if (isConfigured && supabase) {
        const { data } = await supabase.auth.getUser(token);
        if (data?.user) {
          req.user = data.user;
          req.profile = await supabaseService.getProfileById(data.user.id);
        }
      }
    }
  } catch {
    // Ignore errors for optional auth
  }
  next();
};

/**
 * Role-based access control guard
 */
const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }
    const userRole = req.profile?.role || req.user.role || "mospi_officer";
    if (!allowedRoles.includes(userRole) && !allowedRoles.includes("*")) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${userRole}' does not have required permissions [${allowedRoles.join(", ")}].`,
      });
    }
    next();
  };
};

module.exports = {
  requireAuth,
  optionalAuth,
  requireRole,
};
