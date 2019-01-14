async function trailerLinksController(params, req, res) {
    const { logger, movieInfoAdapter, trailerAdapter } = params;

    const movieInfoUrl = req.query.url;
    try {
        const imdbId = await movieInfoAdapter.getMovieId(movieInfoUrl);
        const videoKey = await trailerAdapter.getVideoClipId(imdbId);

        if (videoKey !== null) {
            return res.status(200).send({
                trailer: videoKey
            });
        }
        return res.status(404).send('Trailer information not found!');
    } catch (err) {
        logger.log('error', 'Movie information not found!');
        return res.status(404).send('Movie information not found!');
    }
}

export default function create(params) {
    return trailerLinksController.bind(null, params);
}
