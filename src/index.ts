import express from 'express';
import cors from 'cors'
import path from 'path';
import router from './routes';

const app = express();

app.use(cors({
  origin: [
    'https://photoljay-frontend.onrender.com',
    'https://photoljay.com',
    'http://localhost:4200',
    'http://localhost:3007'
  ], // Allow both production and development origins
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

app.use('/api', router);

const PORT = process.env.PORT || 3007;

app.listen(PORT, () => {
  console.log(`Server running on port :  http://localhost:${PORT}`);
});
