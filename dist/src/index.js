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
// Configure CORS origins. Allow an explicit FRONTEND_URL from env (set this on Render/Vercel)
const defaultOrigins = [
    'https://photoljay-frontend.onrender.com',
    'https://photoljay.com',
    'http://localhost:4200',
    'http://localhost:3007'
];
const frontendUrl = process.env.FRONTEND_URL;
const allowedOrigins = frontendUrl ? Array.from(new Set([frontendUrl, ...defaultOrigins])) : defaultOrigins;
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow non-browser requests like curl/postman (no origin)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        return callback(new Error('CORS policy: Origin not allowed'));
    },
    credentials: true
}));
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../../uploads')));
app.use('/api', routes_1.default);
const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
    console.log(`Server running on port :  http://localhost:${PORT}`);
});
