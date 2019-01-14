import request from 'supertest';
import app from '../app';

app.listen(3000);

describe('Express App', () => {
    test('Should return youtube videoid: acQyrwQyCOk for the input ', (done) => {
        request(app)
            .get('/trailer-links?url=https://content.viaplay.se/pc-se/film/rysare')
            .expect(200, '{"trailer":"acQyrwQyCOk"}')
            .end((err) => {
            if (err) throw done(err);
            done();
        });
    });
    test('Should return error for the input', (done) => {
        request(app)
            .get('/trailer-links?url=https://content.viaplay.se/pc-se/film/rysare123')
            .expect(404, 'Movie information not found!')
            .end((err) => {
            if (err) throw done(err);
            done();
        });
    });

    test('Should return error for wrong API', (done) => {
        request(app)
            .get('/trailer-wrong')
            .expect(404, 'Not Found')
            .end((err) => {
            done();
        });
    });
});