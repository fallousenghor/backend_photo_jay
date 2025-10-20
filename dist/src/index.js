"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        'https://photoljay-frontend.onrender.com',
        'https://photoljay.com',
        'http://localhost:4200',
        'http://localhost:3007'
    ], // Allow both production and development origins
    credentials: true
}));
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../../uploads')));
app.use('/api', routes_1.default);
const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
    console.log(`Server running on port :  http://localhost:${PORT}`);
});
