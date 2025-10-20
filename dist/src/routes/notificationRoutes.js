"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const NotificationController_1 = require("../controllers/NotificationController");
const NotificationService_1 = require("../services/NotificationService");
const NotificationRepository_1 = require("../repositories/NotificationRepository");
const router = express_1.default.Router();
const repository = new NotificationRepository_1.NotificationRepository();
const service = new NotificationService_1.NotificationService(repository);
const controller = new NotificationController_1.NotificationController(service);
router.get('/', (req, res) => controller.findAll(req, res));
router.get('/:id', (req, res) => controller.findById(req, res));
router.post('/', (req, res) => controller.create(req, res));
router.put('/:id', (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));
exports.default = router;
