"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
const db_1 = __importDefault(require("../config/db"));
class CategoryRepository {
    async create(data) {
        const prismaData = {
            name: data.name,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return db_1.default.category.create({ data: prismaData });
    }
    async findById(id) {
        return db_1.default.category.findUnique({ where: { id } });
    }
    async findAll() {
        return db_1.default.category.findMany();
    }
    async update(id, data) {
        const prismaData = {};
        if (data.name !== undefined)
            prismaData.name = data.name;
        return db_1.default.category.update({ where: { id }, data: prismaData });
    }
    async delete(id) {
        await db_1.default.category.delete({ where: { id } });
    }
}
exports.CategoryRepository = CategoryRepository;
