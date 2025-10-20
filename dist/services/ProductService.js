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
    async findAll(categoryId) {
        return this.productRepository.findAll(categoryId);
    }
    async update(id, data) {
        return this.productRepository.update(id, data);
    }
    async delete(id) {
        return this.productRepository.delete(id);
    }
    async getPendingProducts() {
        return this.productRepository.findPendingProducts();
    }
    async getAdminStats() {
        return this.productRepository.getAdminStats();
    }
    async approveProduct(id, moderatorId) {
        return this.productRepository.approveProduct(id, moderatorId);
    }
    async rejectProduct(id, moderatorId, reason) {
        return this.productRepository.rejectProduct(id, moderatorId, reason);
    }
}
exports.ProductService = ProductService;
