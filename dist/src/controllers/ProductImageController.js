"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductImageController = void 0;
const zod_1 = require("zod");
const errorMessage_1 = require("../utils/messages/errorMessage");
const successCode_1 = require("../utils/codes/successCode");
const errorCode_1 = require("../utils/codes/errorCode");
const productImageValidator_1 = require("../validators/productImageValidator");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const CloudinaryService_1 = __importDefault(require("../services/CloudinaryService"));
// Configuration de multer avec des vérifications supplémentaires
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // Utiliser le répertoire temporaire du système
        const uploadPath = os_1.default.tmpdir();
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const safeFilename = file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname);
        cb(null, safeFilename);
    }
});
const fileFilter = (req, file, cb) => {
    // Accepter uniquement les images
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Only image files are allowed!'));
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limite à 5MB
    }
});
class ProductImageController {
    constructor(productImageService) {
        this.productImageService = productImageService;
    }
    async create(req, res) {
        try {
            const productId = zod_1.z.coerce.number().int().positive().parse(req.body.productId);
            if (!req.file) {
                res.status(errorCode_1.ErrorCode.BAD_REQUEST).json({ error: 'Image file is required' });
                return;
            }
            console.log('Starting image upload process...');
            // Upload to Cloudinary
            const cloudinaryResult = await CloudinaryService_1.default.uploadImage(req.file);
            console.log('Cloudinary upload result:', cloudinaryResult);
            const data = {
                productId,
                url: cloudinaryResult.url,
                publicId: cloudinaryResult.publicId
            };
            console.log('Preparing to save image data:', data);
            const productImage = await this.productImageService.create(data);
            console.log('Image saved to database:', productImage);
            res.status(successCode_1.SuccessCode.CREATED).json(productImage);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                res.status(errorCode_1.ErrorCode.BAD_REQUEST).json({ error: error.issues });
                return;
            }
            res.status(errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
    async findById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const productImage = await this.productImageService.findById(id);
            if (!productImage) {
                res.status(errorCode_1.ErrorCode.NOT_FOUND).json({ error: errorMessage_1.ERROR_MESSAGES.PRODUCT_IMAGE_NOT_FOUND });
                return;
            }
            res.status(successCode_1.SuccessCode.OK).json(productImage);
        }
        catch (error) {
            res.status(errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
    async findAll(req, res) {
        try {
            const productImages = await this.productImageService.findAll();
            res.status(successCode_1.SuccessCode.OK).json(productImages);
        }
        catch (error) {
            res.status(errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
    async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const data = productImageValidator_1.updateProductImageSchema.parse(req.body);
            const productImage = await this.productImageService.update(id, data);
            res.status(successCode_1.SuccessCode.OK).json(productImage);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                res.status(errorCode_1.ErrorCode.BAD_REQUEST).json({ error: error.issues });
                return;
            }
            res.status(errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
    async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            await this.productImageService.delete(id);
            res.status(successCode_1.SuccessCode.NO_CONTENT).send();
        }
        catch (error) {
            res.status(errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
}
exports.ProductImageController = ProductImageController;
