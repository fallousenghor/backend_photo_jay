"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModerationLogRepository = void 0;
const db_1 = __importDefault(require("../config/db"));
class ModerationLogRepository {
    async create(data) {
        const prismaData = {
            product: { connect: { id: data.productId } },
            moderator: { connect: { id: data.moderatorId } },
            action: data.action,
            reason: data.reason,
            createdAt: new Date(),
        };
        return db_1.default.moderationLog.create({ data: prismaData });
    }
    async findById(id) {
        return db_1.default.moderationLog.findUnique({ where: { id } });
    }
    async findAll() {
        return db_1.default.moderationLog.findMany();
    }
    async findRecent(limit = 10) {
        return db_1.default.moderationLog.findMany({
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
        return db_1.default.moderationLog.update({ where: { id }, data: prismaData });
    }
    async delete(id) {
        await db_1.default.moderationLog.delete({ where: { id } });
    }
}
exports.ModerationLogRepository = ModerationLogRepository;
