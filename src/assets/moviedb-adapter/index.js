import find from 'lodash/find';

class MovieDbAdapter {
    constructor(logger, serviceClient, imdbKey, redisClient) {
        this.logger = logger;
        this.serviceClient = serviceClient;
        this.redisClient = redisClient;
        this.imdbKey = imdbKey;
        this.getMovieInfo = this.getMovieInfo.bind(this);
        this.getVideoClipId = this.getVideoClipId.bind(this);
    }

    getTrailerVideoKey(videos) {
        const trailer = find(videos, video => (video.type === 'Trailer' && video.key != null));
        let videoKey = trailer ? trailer.key : null;

        if (videoKey === null) {
            const teaser = find(videos, video => (video.type === 'Teaser' && video.key != null));
            videoKey = teaser ? teaser.key : null;
        }

        return videoKey;
    }

    async getMovieInfo(movieDbUrl) {
        const movieInfo = await this.serviceClient.execute({
            url: movieDbUrl,
            method: 'get'
        })
            .catch(() => {
                this.logger.log('error', 'Error while getting movie information from moviedb.com');
                throw new Error('Error while getting movie information from moviedb.com');
            });

        return movieInfo;
    }

    async getVideoClipId(imdbId) {
        let videoKey = await this.redisClient.getAsync(`IMDBID_FOR_MOVIE_${imdbId}`)
            .catch((err) => {
                this.logger.log('error', err);
            });

        if (videoKey) {
            this.logger.log('info', `The videoKey provided from redis cache - ${videoKey}`);
            return videoKey;
        }

        const movieDbUrl = `https://api.themoviedb.org/3/movie/${imdbId}?api_key=${this.imdbKey}&append_to_response=videos`;

        const movieInfo = await this.getMovieInfo(movieDbUrl)
            .catch(() => {
                this.logger.log('error', 'Error while getting movie id');
                throw new Error('Error while getting movie id');
            });

        videoKey = this.getTrailerVideoKey(movieInfo.body.videos.results);
        if (videoKey) {
            this.redisClient.setAsync(`IMDBID_FOR_MOVIE_${imdbId}`, videoKey);
        }
        return videoKey;
    }
}

export default function create(params) {
    const {
        logger,
        serviceClient,
        redisClient,
        config
    } = params;

    return new MovieDbAdapter(logger, serviceClient, config.imdb.key, redisClient);
}
