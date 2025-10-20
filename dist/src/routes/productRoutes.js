"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ProductController_1 = require("../controllers/ProductController");
const ProductService_1 = require("../services/ProductService");
const ProductRepository_1 = require("../repositories/ProductRepository");
const router = express_1.default.Router();
const repository = new ProductRepository_1.ProductRepository();
const service = new ProductService_1.ProductService(repository);
const controller = new ProductController_1.ProductController(service);
router.get('/', (req, res) => controller.findAll(req, res));
router.get('/:id', (req, res) => controller.findById(req, res));
router.post('/', (req, res) => controller.create(req, res));
router.put('/:id', (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));
exports.default = router;
