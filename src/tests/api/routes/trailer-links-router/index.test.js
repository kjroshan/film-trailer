import provideRouterDetails from '../../../../api/routes/trailer-links-router';

describe('Trailer Route Index', () => {
    test('Should return an object with a route string and a controler function', ()=> {
        expect.assertions(2);
        const routeInfo = provideRouterDetails({});
        expect(typeof routeInfo.routePath).toMatch('string');
        expect(typeof routeInfo.controller).toMatch('function');
    });
});
