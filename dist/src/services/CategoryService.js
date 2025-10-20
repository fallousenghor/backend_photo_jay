"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
class CategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async create(data) {
        return this.categoryRepository.create(data);
    }
    async findById(id) {
        return this.categoryRepository.findById(id);
    }
    async findAll() {
        return this.categoryRepository.findAll();
    }
    async update(id, data) {
        return this.categoryRepository.update(id, data);
    }
    async delete(id) {
        return this.categoryRepository.delete(id);
    }
}
exports.CategoryService = CategoryService;
