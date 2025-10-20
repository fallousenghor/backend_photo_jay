"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CategoryController_1 = require("../controllers/CategoryController");
const CategoryService_1 = require("../services/CategoryService");
const CategoryRepository_1 = require("../repositories/CategoryRepository");
const router = express_1.default.Router();
const repository = new CategoryRepository_1.CategoryRepository();
const service = new CategoryService_1.CategoryService(repository);
const controller = new CategoryController_1.CategoryController(service);
router.get('/', (req, res) => controller.findAll(req, res));
router.get('/:id', (req, res) => controller.findById(req, res));
router.post('/', (req, res) => controller.create(req, res));
router.put('/:id', (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));
exports.default = router;
