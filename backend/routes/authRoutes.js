const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { requireAuth, optionalAuth } = require("../middleware/authMiddleware");

// ─── Auth ────────────────────────────────────────────────────────────────────
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/forgot-password", authController.forgotPassword);

// ─── Session / Profile ───────────────────────────────────────────────────────
router.get("/me", optionalAuth, authController.getCurrentUser);
router.patch("/profile", requireAuth, authController.updateProfile);

// ─── Roles & Personas ────────────────────────────────────────────────────────
router.get("/roles", authController.getRoles);
router.get("/personas", authController.getDemoPersonas);

// ─── Admin User Management & Audit Logs ──────────────────────────────────────
router.get("/users", authController.getAllUsers);
router.post("/users", authController.createUser);
router.patch("/users/:id", authController.updateUser);
router.get("/audit-logs", authController.getAuditLogs);

module.exports = router;
