"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ModerationLogController_1 = require("../controllers/ModerationLogController");
const ModerationLogService_1 = require("../services/ModerationLogService");
const ModerationLogRepository_1 = require("../repositories/ModerationLogRepository");
const db_1 = __importDefault(require("../config/db"));
const router = express_1.default.Router();
const repository = new ModerationLogRepository_1.ModerationLogRepository(db_1.default);
const service = new ModerationLogService_1.ModerationLogService(repository);
const controller = new ModerationLogController_1.ModerationLogController(service);
router.get('/', (req, res) => controller.findAll(req, res));
router.get('/:id', (req, res) => controller.findById(req, res));
router.post('/', (req, res) => controller.create(req, res));
router.put('/:id', (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));
// Admin routes
router.get('/admin/recent', (req, res) => controller.findRecent(req, res));
exports.default = router;
