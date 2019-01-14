export default function (err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    } if (res.status) {
        return res.status(err.status || 500).send(err.message || 'Internal Server Error');
    }

    return null;
}
