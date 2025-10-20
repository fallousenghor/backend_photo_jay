import express from 'express';
import cors from 'cors'
import path from 'path';
import router from './routes';

const app = express();

// Configure CORS origins. Allow an explicit FRONTEND_URL from env (set this on Render/Vercel)
const defaultOrigins = [
  'https://photoljay-frontend.onrender.com',
  'https://photoljay.com',
  'https://frontend-photol-jay.vercel.app',
  'http://localhost:4200',
  'http://localhost:3007'
];
const frontendUrl = process.env.FRONTEND_URL;
const allowedOrigins = frontendUrl ? Array.from(new Set([frontendUrl, ...defaultOrigins])) : defaultOrigins;

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests like curl/postman (no origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: Origin not allowed'));
  },
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

app.use('/api', router);

const PORT = process.env.PORT || 3007;

app.listen(PORT, () => {
  console.log(`Server running on port :  http://localhost:${PORT}`);
});
