"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const client_1 = require("@prisma/client");
const ModerationLogRepository_1 = require("../repositories/ModerationLogRepository");
class AdminService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
        this.moderationLogRepository = new ModerationLogRepository_1.ModerationLogRepository(this.prisma);
    }
    async getAdminStats() {
        const [totalProducts, pendingProducts, approvedProducts, rejectedProducts, totalUsers, vipUsers, totalViews, totalModerations, recentModerations, approvalTrends, viewTrends] = await Promise.all([
            this.prisma.product.count(),
            this.prisma.product.count({ where: { status: 'PENDING' } }),
            this.prisma.product.count({ where: { status: 'APPROVED' } }),
            this.prisma.product.count({ where: { status: 'REJECTED' } }),
            this.prisma.user.count(),
            this.prisma.user.count({ where: { isVIP: true } }),
            this.prisma.product.aggregate({
                _sum: { views: true }
            }).then(result => result._sum.views || 0),
            this.prisma.moderationLog.count(),
            this.getRecentModerations(5),
            this.getApprovalTrends(),
            this.getViewTrends()
        ]);
        return {
            totalProducts,
            pendingProducts,
            approvedProducts,
            rejectedProducts,
            totalUsers,
            vipUsers,
            totalViews,
            totalModerations,
            recentModerations,
            approvalTrends,
            viewTrends
        };
    }
    async getPendingProducts() {
        const products = await this.prisma.product.findMany({
            where: { status: 'PENDING' },
            include: {
                user: {
                    select: {
                        id: true,
                        userName: true,
                        email: true
                    }
                },
                images: {
                    select: {
                        id: true,
                        url: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return products.map(product => ({
            id: product.id,
            title: product.title,
            description: product.description,
            createdAt: product.createdAt,
            user: product.user,
            images: product.images
        }));
    }
    async moderateProduct(params) {
        const { productId, moderatorId, action, reason } = params;
        await this.prisma.$transaction(async (tx) => {
            const product = await tx.product.findUnique({
                where: { id: productId }
            });
            if (!product) {
                throw new Error('Product not found');
            }
            // Update product status
            await tx.product.update({
                where: { id: productId },
                data: {
                    status: action
                }
            });
            // Create moderation log
            await this.moderationLogRepository.create({
                productId,
                moderatorId,
                action,
                reason
            });
            // TODO: Send notification to product owner
        });
    }
    async getApprovalTrends() {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const trends = await this.prisma.$queryRaw `
      SELECT
        TO_CHAR("createdAt", 'YYYY-MM') as month,
        COUNT(CASE WHEN "status" = 'APPROVED' THEN 1 END) as approvals,
        SUM("views") as views
      FROM "Product"
      WHERE "createdAt" >= ${sixMonthsAgo}
      GROUP BY TO_CHAR("createdAt", 'YYYY-MM')
      ORDER BY month DESC
      LIMIT 6
    `;
        return trends.map(trend => ({
            month: trend.month,
            approvals: Number(trend.approvals),
            views: Number(trend.views || 0)
        }));
    }
    async getViewTrends() {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const trends = await this.prisma.$queryRaw `
      SELECT
        TO_CHAR("createdAt", 'YYYY-MM') as month,
        SUM("views") as views
      FROM "Product"
      WHERE "createdAt" >= ${sixMonthsAgo}
      GROUP BY TO_CHAR("createdAt", 'YYYY-MM')
      ORDER BY month DESC
      LIMIT 6
    `;
        return trends.map(trend => ({
            month: trend.month,
            views: Number(trend.views || 0)
        }));
    }
    async getVipUsers() {
        return await this.prisma.user.findMany({
            where: { isVIP: true },
            select: {
                id: true,
                userName: true,
                email: true,
                isVIP: true
            }
        });
    }
    async toggleVipStatus(userId, adminId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { isVIP: true }
        });
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: { isVIP: !user.isVIP }
        });
    }
    async getRecentModerations(limit = 10) {
        const logs = await this.prisma.moderationLog.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                product: {
                    select: { title: true }
                },
                moderator: {
                    select: { userName: true }
                }
            }
        });
        return logs.map(log => ({
            id: log.id,
            productTitle: log.product.title,
            moderatorName: log.moderator.userName,
            action: log.action,
            date: log.createdAt,
            reason: log.reason || undefined
        }));
    }
}
exports.AdminService = AdminService;
