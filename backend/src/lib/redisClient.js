// upstashClient.js
const  { Redis } = require('@upstash/redis');
const dotenv = require('dotenv');
dotenv.config();

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
})


module.exports = redis;
