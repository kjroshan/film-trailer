import {createRoute} from '../../../api/routes';
import trailerLinksRouter from '../../../api/routes/trailer-links-router';

describe('Routes map', () => {
    test('Should return an object with trailer-links-router route', ()=> {
        expect.assertions(1);
        const router = createRoute(trailerLinksRouter({}));
        expect(typeof router).toMatch('function');
    });
});
