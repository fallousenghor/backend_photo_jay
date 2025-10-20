import { PrismaClient } from '@prisma/client';
import { ModerationLogRepository } from '../repositories/ModerationLogRepository';
// import { ModerationLogRepository } from '../repositories/ModerationLogRepository';

export interface AdminStats {
  totalProducts: number;
  pendingProducts: number;
  approvedProducts: number;
  rejectedProducts: number;
  totalUsers: number;
  vipUsers: number;
  totalViews: number;
  totalModerations: number;
  recentModerations: Array<{
    id: number;
    productTitle: string;
    moderatorName: string;
    action: 'APPROVED' | 'REJECTED';
    date: Date;
    reason?: string;
  }>;
  approvalTrends: Array<{
    month: string;
    approvals: number;
    views: number;
  }>;
  viewTrends: Array<{
    month: string;
    views: number;
  }>;
}

export interface PendingProduct {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  user: {
    id: number;
    userName: string;
    email: string;
  };
  images: Array<{
    id: number;
    url: string;
  }>;
}

export interface ModerationAction {
  id: number;
  productTitle: string;
  moderatorName: string;
  action: 'APPROVED' | 'REJECTED';
  date: Date;
  reason?: string;
}

export interface ModerateProductParams {
  productId: number;
  moderatorId: number;
  action: 'APPROVED' | 'REJECTED';
  reason?: string;
}

export class AdminService {
  private prisma: PrismaClient;
  private moderationLogRepository: ModerationLogRepository;

  constructor() {
    this.prisma = new PrismaClient();
    this.moderationLogRepository = new ModerationLogRepository(this.prisma);
  }

  async getAdminStats(): Promise<AdminStats> {
    const [
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
    ] = await Promise.all([
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

  async getPendingProducts(): Promise<PendingProduct[]> {
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

  async getAllProducts(): Promise<any[]> {
    const products = await this.prisma.product.findMany({
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
      price: product.price,
      status: product.status,
      priority: product.priority,
      views: product.views,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      user: product.user,
      images: product.images
    }));
  }

  async moderateProduct(params: ModerateProductParams): Promise<void> {
    const { productId, moderatorId, action, reason } = params;

    await this.prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
        include: { user: true }
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

      // Send notification to product owner if rejected
      if (action === 'REJECTED') {
        const notificationMessage = reason
          ? `Votre produit "${product.title}" a été rejeté. Raison : ${reason}`
          : `Votre produit "${product.title}" a été rejeté par un modérateur.`;

        await tx.notification.create({
          data: {
            userId: product.userId,
            type: 'GENERAL',
            message: notificationMessage,
            isRead: false
          }
        });
      } else if (action === 'APPROVED') {
        // Send approval notification
        await tx.notification.create({
          data: {
            userId: product.userId,
            type: 'GENERAL',
            message: `Félicitations ! Votre produit "${product.title}" a été approuvé et est maintenant visible par tous les utilisateurs.`,
            isRead: false
          }
        });
      }
    });
  }

  private async getApprovalTrends(): Promise<Array<{ month: string; approvals: number; views: number }>> {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const trends = await this.prisma.$queryRaw<Array<{ month: string; approvals: number; views: number }>>`
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

  private async getViewTrends(): Promise<Array<{ month: string; views: number }>> {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const trends = await this.prisma.$queryRaw<Array<{ month: string; views: number }>>`
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

  async getVipUsers(): Promise<Array<{ id: number; userName: string; email: string; isVIP: boolean }>> {
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

  async toggleVipStatus(userId: number, adminId: number): Promise<void> {
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

  async toggleProductVipStatus(productId: number, adminId: number): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { priority: true, userId: true }
    });

    if (!product) {
      throw new Error('Produit non trouvé');
    }

    await this.prisma.product.update({
      where: { id: productId },
      data: { priority: !product.priority }
    });
  }

  async getRecentModerations(limit: number = 10): Promise<ModerationAction[]> {
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
      action: log.action as 'APPROVED' | 'REJECTED',
      date: log.createdAt,
      reason: log.reason || undefined
    }));
  }
}