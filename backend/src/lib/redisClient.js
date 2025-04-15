// upstashClient.js
const {Redis} = require("ioredis")
require('dotenv').config();


const client = new Redis("rediss://default:AS4bAAIjcDE5NzYzODk0NzA3ZTQ0ODYxYTFlOWEyMjcyYmM2MDY5NXAxMA@funky-sawfly-11803.upstash.io:6379");



module.exports = client;
