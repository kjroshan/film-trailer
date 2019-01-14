// import createError from 'http-errors';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';

// import redisClient from './redis';
import redisClient from './devcache';

import logger from './logger';
import registerRoutes from './api/routes';
import errorHandler from './middleware/error-handler';
import config from './config.js';
import httpClient from './assets/service-handler/http-client';
import createViaplayAdater from './assets/viaplay-adapter';
import createmovieDbAdapter from './assets/moviedb-adapter';

const app = express();

const serviceClient = httpClient({ logger, redisClient });
const viaplayAdapter = createViaplayAdater({ logger, serviceClient, redisClient });
const movieDbAdapter = createmovieDbAdapter({
    logger, serviceClient, config, redisClient
});


app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    next();
});

registerRoutes(app, {
    config,
    logger,
    serviceClient,
    redisClient,
    movieInfoAdapter: viaplayAdapter,
    trailerAdapter: movieDbAdapter
});

app.use(errorHandler);

module.exports = app;
