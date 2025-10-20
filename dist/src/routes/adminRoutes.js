"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AdminController_1 = require("../controllers/AdminController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const enums_1 = require("../types/enums");
const router = (0, express_1.Router)();
const adminController = new AdminController_1.AdminController();
// Toutes les routes admin nécessitent authentification + rôle admin
router.use(authMiddleware_1.authenticate);
router.use((0, authMiddleware_1.authorize)(enums_1.Role.ADMIN));
// Stats dashboard
router.get('/stats', adminController.getAdminStats.bind(adminController));
// Gestion produits en attente
router.get('/pending-products', adminController.getPendingProducts.bind(adminController));
router.post('/products/:id/moderate', adminController.moderateProduct.bind(adminController));
// Gestion utilisateurs VIP
router.get('/vip-users', adminController.getVipUsers.bind(adminController));
router.post('/users/:id/toggle-vip', adminController.toggleVipStatus.bind(adminController));
// Actions récentes de modération
router.get('/recent-moderations', adminController.getRecentModerations.bind(adminController));
exports.default = router;
