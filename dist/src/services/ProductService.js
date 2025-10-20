"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
class ProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async create(data) {
        return this.productRepository.create(data);
    }
    async findById(id) {
        return this.productRepository.findById(id);
    }
    async findAll(categoryId, status, ownerId) {
        return this.productRepository.findAll(categoryId, status, ownerId);
    }
    async update(id, data) {
        return this.productRepository.update(id, data);
    }
    async delete(id) {
        return this.productRepository.delete(id);
    }
}
exports.ProductService = ProductService;
