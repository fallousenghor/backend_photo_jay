"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductImageService = void 0;
class ProductImageService {
    constructor(productImageRepository) {
        this.productImageRepository = productImageRepository;
    }
    async create(data) {
        return this.productImageRepository.create(data);
    }
    async findById(id) {
        return this.productImageRepository.findById(id);
    }
    async findAll() {
        return this.productImageRepository.findAll();
    }
    async update(id, data) {
        return this.productImageRepository.update(id, data);
    }
    async delete(id) {
        return this.productImageRepository.delete(id);
    }
}
exports.ProductImageService = ProductImageService;
