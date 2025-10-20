import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import { Role } from '../types/enums';

const router = Router();
const adminController = new AdminController();

// Toutes les routes admin nécessitent authentification + rôle admin
router.use(authenticate);
router.use(authorize(Role.ADMIN));

// Stats dashboard
router.get('/stats', adminController.getAdminStats.bind(adminController));

// Gestion produits en attente
router.get('/pending-products', adminController.getPendingProducts.bind(adminController));
router.post('/products/:id/moderate', adminController.moderateProduct.bind(adminController));

// Gestion utilisateurs VIP
router.get('/vip-users', adminController.getVipUsers.bind(adminController));
router.post('/users/:id/toggle-vip', adminController.toggleVipStatus.bind(adminController));

// Gestion produits VIP
router.post('/products/:id/toggle-vip', adminController.toggleProductVipStatus.bind(adminController));

// Gestion de tous les produits
router.get('/products', adminController.getAllProducts.bind(adminController));

// Actions récentes de modération
router.get('/recent-moderations', adminController.getRecentModerations.bind(adminController));

export default router;
