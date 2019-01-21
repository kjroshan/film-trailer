import TrailerController from './controller';

export default function provideRouterDetails(params) {
    return {
        routePath: '/',
        controller: TrailerController(params)
    };
}
