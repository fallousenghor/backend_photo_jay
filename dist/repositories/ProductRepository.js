"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const db_1 = __importDefault(require("../config/db"));
class ProductRepository {
    async create(data) {
        const expiresAt = data.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
        const prismaData = {
            title: data.title,
            description: data.description,
            price: data.price,
            user: { connect: { id: data.userId } },
            category: data.categoryId ? { connect: { id: data.categoryId } } : undefined,
            isApproved: data.isApproved ?? false,
            priority: data.priority ?? false,
            views: data.views ?? 0,
            expiresAt,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return db_1.default.product.create({ data: prismaData });
    }
    async findById(id) {
        return db_1.default.product.findUnique({
            where: { id },
            include: {
                images: true,
                category: true,
                user: {
                    select: {
                        id: true,
                        userName: true,
                        email: true,
                        phoneNumber: true,
                        whatsappNumber: true,
                        shopLink: true
                    }
                }
            }
        });
    }
    async findAll(categoryId) {
        return db_1.default.product.findMany({
            where: categoryId ? { categoryId } : undefined,
            include: {
                images: true,
                category: true,
                user: {
                    select: {
                        id: true,
                        userName: true,
                        email: true,
                        phoneNumber: true,
                        whatsappNumber: true,
                        shopLink: true
                    }
                }
            }
        });
    }
    async update(id, data) {
        const prismaData = {};
        if (data.title !== undefined)
            prismaData.title = data.title;
        if (data.description !== undefined)
            prismaData.description = data.description;
        if (data.price !== undefined)
            prismaData.price = data.price;
        if (data.userId !== undefined)
            prismaData.user = { connect: { id: data.userId } };
        if (data.categoryId !== undefined)
            prismaData.category = data.categoryId ? { connect: { id: data.categoryId } } : { disconnect: true };
        if (data.isApproved !== undefined)
            prismaData.isApproved = data.isApproved;
        if (data.priority !== undefined)
            prismaData.priority = data.priority;
        if (data.views !== undefined)
            prismaData.views = data.views;
        if (data.expiresAt !== undefined)
            prismaData.expiresAt = data.expiresAt;
        return db_1.default.product.update({ where: { id }, data: prismaData });
    }
    async delete(id) {
        await db_1.default.product.delete({ where: { id } });
    }
    async findPendingProducts() {
        return db_1.default.product.findMany({
            where: { isApproved: false },
            include: {
                images: true,
                category: true,
                user: {
                    select: {
                        id: true,
                        userName: true,
                        email: true,
                        phoneNumber: true,
                        whatsappNumber: true,
                        shopLink: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getAdminStats() {
        const [totalProducts, pendingApprovals, approvedProducts, totalUsers, vipUsers] = await Promise.all([
            db_1.default.product.count(),
            db_1.default.product.count({ where: { isApproved: false } }),
            db_1.default.product.count({ where: { isApproved: true } }),
            db_1.default.user.count(),
            db_1.default.user.count({ where: { isVIP: true } })
        ]);
        return {
            totalProducts,
            pendingApprovals,
            approvedProducts,
            totalUsers,
            vipUsers
        };
    }
    async approveProduct(id, moderatorId) {
        // First update the product
        const product = await db_1.default.product.update({
            where: { id },
            data: { isApproved: true },
            include: {
                images: true,
                category: true,
                user: {
                    select: {
                        id: true,
                        userName: true,
                        email: true,
                        phoneNumber: true,
                        whatsappNumber: true,
                        shopLink: true
                    }
                }
            }
        });
        // Create moderation log
        await db_1.default.moderationLog.create({
            data: {
                productId: id,
                moderatorId,
                action: 'APPROVED'
            }
        });
        return product;
    }
    async rejectProduct(id, moderatorId, reason) {
        // First update the product
        const product = await db_1.default.product.update({
            where: { id },
            data: { isApproved: false },
            include: {
                images: true,
                category: true,
                user: {
                    select: {
                        id: true,
                        userName: true,
                        email: true,
                        phoneNumber: true,
                        whatsappNumber: true,
                        shopLink: true
                    }
                }
            }
        });
        // Create moderation log
        await db_1.default.moderationLog.create({
            data: {
                productId: id,
                moderatorId,
                action: 'REJECTED',
                reason
            }
        });
        return product;
    }
}
exports.ProductRepository = ProductRepository;
