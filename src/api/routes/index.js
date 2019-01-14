import express from 'express';
import trailerLinksRouter from './trailer-links-router';

export function createRoute({ routePath, controller }) {
    const router = express.Router();
    router.get(routePath, controller);
    return router;
}

export default function registerRoutes(app, params) {
    app.use('/trailer-links', createRoute(trailerLinksRouter(params)));
}
