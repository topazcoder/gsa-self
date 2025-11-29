
import express, { Request, Response } from 'express';
import itemRoutes from './routes/itemRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './utils/logger';
import logger from './utils/logger';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.get('/health-check', (req: Request, res: Response) => {
    logger.info('Health check endpoint called');
    res.send('Hello World!');
});
// Use itemRoutes for all /api/items endpoints
app.use('/api/items', itemRoutes);

app.use(errorHandler);

export default app;
