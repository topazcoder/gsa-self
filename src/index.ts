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

app.listen(config.port, () => {
    console.log(`Server is running on ${config.nodeEnv} mode on port ${config.port}`);
});

app.addListener('error', (err) => {
    console.error('Server error:', err);
});
