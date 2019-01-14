import bluebird from 'bluebird';
import size from 'lodash/size';

class CacheForDev {
    constructor(logger) {
        this.logger = logger;
        this.cache = {};
        this.getAsync = this.getAsync.bind(this);
        this.setAsync = this.setAsync.bind(this);
    }

    getAsync(key) {
        this.logger.log('warn', 'Redis not connected!, You are using your local machine memory for caching');
        if (this.cache[key]) {
            return bluebird.resolve(this.cache[key]);
        }
        return bluebird.reject(new Error('No Data'));
    }

    setAsync(key, value) {
        this.logger.log('warn', 'Redis not connected!, You are using your local machine memory for caching');

        if (size(this.cache) > 1000) this.cache = {};

        this.cache[key] = value;
        return bluebird.resolve(this.cache[key]);
    }
}

export default function createDevCache(logger) {
    return new CacheForDev(logger);
}
