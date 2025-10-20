"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const AdminService_1 = require("../services/AdminService");
const enums_1 = require("../types/enums");
class AdminController {
    constructor() {
        this.adminService = new AdminService_1.AdminService();
    }
    async getAdminStats(req, res) {
        try {
            const stats = await this.adminService.getAdminStats();
            const response = {
                success: true,
                data: stats
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error getting admin stats:', error);
            const response = {
                success: false,
                message: 'Erreur lors de la récupération des statistiques'
            };
            res.status(500).json(response);
        }
    }
    async getPendingProducts(req, res) {
        try {
            const pendingProducts = await this.adminService.getPendingProducts();
            const response = {
                success: true,
                data: pendingProducts
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error getting pending products:', error);
            const response = {
                success: false,
                message: 'Erreur lors de la récupération des produits en attente'
            };
            res.status(500).json(response);
        }
    }
    async moderateProduct(req, res) {
        try {
            const productId = parseInt(req.params.id);
            const adminId = req.user.id;
            const { action, reason } = req.body;
            if (!Object.values(enums_1.Action).includes(action)) {
                const response = {
                    success: false,
                    message: 'Action de modération invalide'
                };
                res.status(400).json(response);
                return;
            }
            await this.adminService.moderateProduct({
                productId,
                moderatorId: adminId,
                action,
                reason
            });
            const response = {
                success: true,
                message: `Produit ${action === enums_1.Action.APPROVED ? 'approuvé' : 'rejeté'} avec succès`
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error moderating product:', error);
            const response = {
                success: false,
                message: 'Erreur lors de la modération du produit'
            };
            res.status(500).json(response);
        }
    }
    async getVipUsers(req, res) {
        try {
            const vipUsers = await this.adminService.getVipUsers();
            const response = {
                success: true,
                data: vipUsers
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error getting VIP users:', error);
            const response = {
                success: false,
                message: 'Erreur lors de la récupération des utilisateurs VIP'
            };
            res.status(500).json(response);
        }
    }
    async toggleVipStatus(req, res) {
        try {
            const userId = parseInt(req.params.id);
            const adminId = req.user.id;
            await this.adminService.toggleVipStatus(userId, adminId);
            const response = {
                success: true,
                message: 'Statut VIP modifié avec succès'
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error toggling VIP status:', error);
            const response = {
                success: false,
                message: 'Erreur lors de la modification du statut VIP'
            };
            res.status(500).json(response);
        }
    }
    async getRecentModerations(req, res) {
        try {
            const recentModerations = await this.adminService.getRecentModerations();
            const response = {
                success: true,
                data: recentModerations
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error getting recent moderations:', error);
            const response = {
                success: false,
                message: 'Erreur lors de la récupération des actions récentes'
            };
            res.status(500).json(response);
        }
    }
}
exports.AdminController = AdminController;
