import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes.js';
import { errorMiddleware } from './middleware/error.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Too many requests, please try again later.' },
});

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api', limiter);

app.get('/', (_req, res) => res.send('BubingaChat API'));
app.use('/api/auth', authRoutes);
app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));