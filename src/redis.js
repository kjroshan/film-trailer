import redis from 'redis';
import Promise from 'bluebird';
import createDevCache from './devcache';

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || '6379';
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';

let redisIsConnected = false;

function initializeRedis(logger) {
    try {
        const client = redis.createClient({
            host: REDIS_HOST,
            port: REDIS_PORT,
            password: REDIS_PASSWORD,
            db: 'TrailerApplicationCache',
            tls: { rejectUnauthorized: false },
            retry_strategy(options) {
                if (options.error && options.error.code === 'ECONNREFUSED') {
                    logger.log('error', 'There seems to be issue with redis connection', options.error);
                    // return new Error('The server refused the connection', options.error);
                }
                if (options.total_retry_time > 1000 * 60 * 60) {
                    // return new Error('Retry time exhausted', options.error);
                }
                if (options.attempt > 10) {
                    return undefined;
                }
                return Math.min(options.attempt * 100, 3000);
            },
        });

        client.on('connect', () => {
            redisIsConnected = true;
            logger.log('info', 'Redis client connected');
        });

        client.on('error', (err) => {
            redisIsConnected = false;
            logger.log('error', 'Error connecting to redis', err);
        });

        return client;
    } catch (err) {
        logger.log('error', err);
        return null;
    }
}


function redisSwitcher(logger) {
    this.client = initializeRedis(logger);
    this.devCache = createDevCache(logger);

    this.getAsync = (...args) => {
        if (redisIsConnected) {
            logger.log('info', 'Redis Connection is up');
            return this.client.getAsync(...args);
        }
        return this.devCache.getAsync(...args);
    };
    this.setAsync = (...args) => {
        if (redisIsConnected) {
            return this.client.setAsync(...args);
        }
        return this.devCache.setAsync(...args);
    };
}

export default function createRedisStore(logger) {
    return new redisSwitcher(logger);
}
