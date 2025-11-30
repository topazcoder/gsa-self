import {createClient, RedisClientType} from 'redis';

const redisClient: RedisClientType = createClient ({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD || undefined
})

if (redisClient.isOpen) {
  console.log('Redis is connected');
} else {
  console.log('Redis is not connected');
}

const connectRedis = async () => {
    await redisClient.connect();
    console.log('Connected to Redis');
}
redisClient.on('error', (err) => console.log('Redis Client Error', err));

export { redisClient, connectRedis };