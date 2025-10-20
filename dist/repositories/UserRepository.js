"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const db_1 = __importDefault(require("../config/db"));
class UserRepository {
    async create(data) {
        const prismaData = {
            userName: data.userName,
            email: data.email,
            password: data.password,
            role: data.role,
            isVIP: data.isVIP ?? false,
            phoneNumber: data.phoneNumber,
            whatsappNumber: data.whatsappNumber,
            shopLink: data.shopLink,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return db_1.default.user.create({ data: prismaData });
    }
    async findByEmail(email) {
        return db_1.default.user.findUnique({ where: { email } });
    }
    async findById(id) {
        return db_1.default.user.findUnique({ where: { id } });
    }
    async findAll() {
        return db_1.default.user.findMany();
    }
    async update(id, data) {
        const prismaData = {};
        if (data.userName !== undefined)
            prismaData.userName = data.userName;
        if (data.email !== undefined)
            prismaData.email = data.email;
        if (data.password !== undefined)
            prismaData.password = data.password;
        if (data.role !== undefined)
            prismaData.role = data.role;
        if (data.isVIP !== undefined)
            prismaData.isVIP = data.isVIP;
        if (data.phoneNumber !== undefined)
            prismaData.phoneNumber = data.phoneNumber;
        if (data.whatsappNumber !== undefined)
            prismaData.whatsappNumber = data.whatsappNumber;
        if (data.shopLink !== undefined)
            prismaData.shopLink = data.shopLink;
        return db_1.default.user.update({ where: { id }, data: prismaData });
    }
    async delete(id) {
        await db_1.default.user.delete({ where: { id } });
    }
}
exports.UserRepository = UserRepository;
