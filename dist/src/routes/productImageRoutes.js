"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const ProductImageController_1 = require("../controllers/ProductImageController");
const ProductImageService_1 = require("../services/ProductImageService");
const ProductImageRepository_1 = require("../repositories/ProductImageRepository");
const router = express_1.default.Router();
const repository = new ProductImageRepository_1.ProductImageRepository();
const service = new ProductImageService_1.ProductImageService(repository);
const controller = new ProductImageController_1.ProductImageController(service);
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // Utiliser le répertoire temporaire du système pour le stockage temporaire
        cb(null, path_1.default.join(os_1.default.tmpdir()));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});
router.get('/', (req, res) => controller.findAll(req, res));
router.get('/:id', (req, res) => controller.findById(req, res));
router.post('/', upload.single('image'), (req, res) => controller.create(req, res));
router.put('/:id', (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));
exports.default = router;
