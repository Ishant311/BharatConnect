const Redis = require('ioredis');
const dotenv = require('dotenv');
dotenv.config();

const redis = new Redis(process.env.REDIS_URL);
// else{
//     const redis = new Redis({
//         host: process.env.REDIS_HOST,
//         port: process.env.REDIS_PORT,
//     })
// 

redis.on('connect', () => {
    console.log('Redis connected');
});
redis.on('error', (err) => {
    console.error('Redis error:', err);
});

module.exports = redis;