const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { requireAuth, optionalAuth } = require("../middleware/authMiddleware");

router.get("/me", optionalAuth, authController.getCurrentUser);
router.get("/roles", authController.getRoles);
router.get("/personas", authController.getDemoPersonas);
router.patch("/profile", requireAuth, authController.updateProfile);

// Admin User Management & Audit Logs
router.get("/users", authController.getAllUsers);
router.post("/users", authController.createUser);
router.patch("/users/:id", authController.updateUser);
router.get("/audit-logs", authController.getAuditLogs);

module.exports = router;
