"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductImageRepository = void 0;
const db_1 = __importDefault(require("../config/db"));
class ProductImageRepository {
    async create(data) {
        const prismaData = {
            product: { connect: { id: data.productId } },
            url: data.url,
            publicId: data.publicId,
            createdAt: new Date(),
        };
        return db_1.default.productImage.create({ data: prismaData });
    }
    async findById(id) {
        return db_1.default.productImage.findUnique({ where: { id } });
    }
    async findAll() {
        return db_1.default.productImage.findMany();
    }
    async update(id, data) {
        const prismaData = {};
        if (data.productId !== undefined)
            prismaData.product = { connect: { id: data.productId } };
        if (data.url !== undefined)
            prismaData.url = data.url;
        if (data.publicId !== undefined)
            prismaData.publicId = data.publicId;
        return db_1.default.productImage.update({ where: { id }, data: prismaData });
    }
    async delete(id) {
        await db_1.default.productImage.delete({ where: { id } });
    }
}
exports.ProductImageRepository = ProductImageRepository;
