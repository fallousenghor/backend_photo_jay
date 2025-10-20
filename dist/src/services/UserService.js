"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const auth_1 = require("../utils/auth");
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(data) {
        const hashedPassword = await (0, auth_1.hashPassword)(data.password);
        return this.userRepository.create({ ...data, password: hashedPassword });
    }
    async findByEmail(email) {
        return this.userRepository.findByEmail(email);
    }
    async findById(id) {
        return this.userRepository.findById(id);
    }
    async login(email, password) {
        const user = await this.findByEmail(email);
        if (!user || !(await (0, auth_1.verifyPassword)(password, user.password))) {
            return null;
        }
        const token = (0, auth_1.generateToken)({ id: user.id, email: user.email, role: user.role });
        return { user, token };
    }
    async findAll() {
        return this.userRepository.findAll();
    }
    async update(id, data) {
        return this.userRepository.update(id, data);
    }
    async delete(id) {
        return this.userRepository.delete(id);
    }
}
exports.UserService = UserService;
