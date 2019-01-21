async function trailersController(params, req, res) {
    const { logger, movieInfoAdapter, trailerAdapter } = params;

    const movieInfoUrl = req.query.url;
    try {
        const imdbId = await movieInfoAdapter.getMovieId(movieInfoUrl);
        const trailers = await trailerAdapter.getVideoClips(imdbId);

        if (trailers !== null) {
            return res.status(200).json(trailers);
        }
        return res.status(404).send('Trailers not found!');
    } catch (err) {
        logger.log('error', 'Movie information not found!');
        return res.status(404).send('Movie information not found!');
    }
}

export default function create(params) {
    return trailersController.bind(null, params);
}
