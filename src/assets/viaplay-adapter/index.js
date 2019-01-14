import find from 'lodash/find';
import has from 'lodash/has';

class ViaplayAdapter {
    constructor(logger, serviceClient, redisClient) {
        this.logger = logger;
        this.redisClient = redisClient;
        this.serviceClient = serviceClient;
        this.getMovieInfo = this.getMovieInfo.bind(this);
        this.getMovieId = this.getMovieId.bind(this);
    }

    searchForIMDBInfo(blocks) {
        let imdbid;

        find(blocks, (block) => {
            if (has(block, '_embedded.viaplay:product.content.imdb.id')) {
                imdbid = block._embedded['viaplay:product'].content.imdb.id;
                return true;
            }
            if (has(block, '_embedded.viaplay:products')) {
                const resultProduct = find(block._embedded['viaplay:products'], (product) => {
                    if (has(product, 'content.imdb.id')) {
                        imdbid = product.content.imdb.id;
                        return true;
                    }
                    return false;
                });
                if (resultProduct) return true;
            }
            return false;
        });

        return imdbid;
    }

    async getMovieInfo(movieInfoUrl) {
        const movieInfo = await this.serviceClient.execute({
            url: movieInfoUrl,
            method: 'get'
        })
            .catch(() => {
                this.logger.log('error', 'Error while getting movie information');
                throw new Error('Error while getting movie information');
            });
        return movieInfo;
    }

    async getMovieId(movieInfoUrl) {
        let movieId = await this.redisClient.getAsync(movieInfoUrl)
            .catch(() => {
                this.logger.log('info', `Redis could not find the value in cache for the key: ${movieInfoUrl}`);
            });

        if (movieId) {
            this.logger.log('info', `Movie ID provided from redis cache - ${movieId}`);
            return movieId;
        }

        const movieInfo = await this.getMovieInfo(movieInfoUrl)
            .catch(() => {
                this.logger.log('error', 'Error while getting movie id');
                throw new Error('Error while getting movie id');
            });

        movieId = this.searchForIMDBInfo(movieInfo.body._embedded['viaplay:blocks']);
        if (movieId) {
            this.redisClient.setAsync(movieInfoUrl, movieId);
        }
        return movieId;
    }
}

export default function create(params) {
    const {
        logger,
        serviceClient,
        redisClient
    } = params;

    return new ViaplayAdapter(logger, serviceClient, redisClient);
}
