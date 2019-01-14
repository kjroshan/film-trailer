import bluebird from 'bluebird';

class CacheForDev {
    constructor() {
        this.cache = {};
        this.getAsync = this.getAsync.bind(this);
        this.setAsync = this.setAsync.bind(this);
    }

    getAsync(key) {
        if (this.cache[key]) {
            return bluebird.resolve(this.cache[key]);
        }
        return bluebird.reject(new Error('No Data'));
    }

    setAsync(key, value) {
        if (Object.keys(this.cache).length > 1000) this.cache = {};

        this.cache[key] = value;
        return bluebird.resolve(this.cache[key]);
    }
}

const cache = new CacheForDev();

export default cache;
