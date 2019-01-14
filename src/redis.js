import redis from 'redis';
import bluebird from 'bluebird';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || '6379';
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || null;

const client = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
    db: 'TrailerApplicationCache',
    tls: { rejectUnauthorized: false },
    retry_strategy(options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            console.log('There seems to be issue with redis connection', options.error);
            return new Error('The server refused the connection', options.error);
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            return new Error('Retry time exhausted', options.error);
        }
        if (options.attempt > 10) {
            return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
    },
});

client.on('connect', () => {
    console.log('Redis client connected');
});


export default client;
