import { connectRedis } from './config/redis';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { config } from './config/index';

mongoose.connect(process.env.MONGODB_URI || '', {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
})

// Connect to Redis before starting the app
connectRedis().catch((err) => {
    console.error('Failed to connect to Redis', err);
    process.exit(1);
});

app.listen(config.port, () => {
    console.log(`Server is running on ${config.nodeEnv} mode on port ${config.port}`);
});

// Note: Express apps typically use app.on('error'), but this is rarely needed unless you have custom error handling at the server level.
