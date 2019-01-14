import TrailerLinksController from './controller';

export default function provideRouterDetails(params) {
    return {
        routePath: '/',
        controller: TrailerLinksController(params)
    };
}
