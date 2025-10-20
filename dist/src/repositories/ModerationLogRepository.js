"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModerationLogRepository = void 0;
class ModerationLogRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const prismaData = {
            product: { connect: { id: data.productId } },
            moderator: { connect: { id: data.moderatorId } },
            action: data.action,
            reason: data.reason,
            createdAt: new Date(),
        };
        return this.prisma.moderationLog.create({ data: prismaData });
    }
    async findById(id) {
        return this.prisma.moderationLog.findUnique({ where: { id } });
    }
    async findAll() {
        return this.prisma.moderationLog.findMany();
    }
    async findRecent(limit = 10) {
        return this.prisma.moderationLog.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                product: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                moderator: {
                    select: {
                        id: true,
                        userName: true
                    }
                }
            }
        });
    }
    async update(id, data) {
        const prismaData = {};
        if (data.productId !== undefined)
            prismaData.product = { connect: { id: data.productId } };
        if (data.moderatorId !== undefined)
            prismaData.moderator = { connect: { id: data.moderatorId } };
        if (data.action !== undefined)
            prismaData.action = data.action;
        if (data.reason !== undefined)
            prismaData.reason = data.reason;
        return this.prisma.moderationLog.update({ where: { id }, data: prismaData });
    }
    async delete(id) {
        await this.prisma.moderationLog.delete({ where: { id } });
    }
}
exports.ModerationLogRepository = ModerationLogRepository;
