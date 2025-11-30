
import express, { Request, Response } from 'express';
import itemRoutes from './routes/itemRoutes';
import authRoutes from './routes/authRoutes';
import { authMiddleware } from './middlewares/authMiddleware';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './utils/logger';
import logger from './utils/logger';
import session from 'express-session';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use(session({
    secret: 'your_secret_key', // Replace with a strong, secret key
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

app.get('/health-check', (req: Request, res: Response) => {
    logger.info('Health check endpoint called');
    res.send('Hello World!');
});

// Public auth routes
app.use('/api/auth', authRoutes);

// Protected item routes (allow JWT or Google OAuth)
app.use('/api/items', authMiddleware, itemRoutes);

app.use(errorHandler);

export default app;
