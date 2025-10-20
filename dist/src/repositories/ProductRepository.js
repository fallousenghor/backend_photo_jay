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
            status: data.status ?? 'PENDING',
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
    async findAll(categoryId, status, ownerId) {
        return db_1.default.product.findMany({
            where: {
                ...(categoryId && { categoryId }),
                ...(status && { status }),
                ...(ownerId && { userId: ownerId })
            },
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
        if (data.status !== undefined)
            prismaData.status = data.status;
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
}
exports.ProductRepository = ProductRepository;
