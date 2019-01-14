import http from 'request-promise';
import get from 'lodash/get';
import assign from 'lodash/assign';
import httpClient from '../../../../assets/service-handler/http-client';
import createViaplayAdater from '../../../../assets/viaplay-adapter';
import createmovieDbAdapter from '../../../../assets/moviedb-adapter';

import controller from '../../../../api/routes/trailer-links-router/controller';

// jest.mock('request-promise');

let req = {
    query: {
        url: 'http://mockurl'
    }
};

class Reponse {
    constructor(eventReceiver){
        this.locals = {};
        this.eventReceiver= eventReceiver;
        this.statusCalledWith= '';
        this.status = this.status.bind(this);
        this.send = this.send.bind(this);
    }
    status(arg) {
        this.statusCalledWith = arg;
        return this;
    }

    send(arg) {
        this.eventReceiver(arg.trailer);
    }
};

let mockData = {

};

let mockData1 = {
    body: {
        _embedded: {
            'viaplay:blocks': [
                {
                    _embedded: {
                        'viaplay:products': [
                            {
                                content: {
                                    imdb: {
                                        id: 'id1'
                                    }
                                }
                            }
                        ]
                    }
                }
            ]
        },
        videos: {
            results: [
                {
                    type: 'Trailer',
                    key: 'mockTrailerVideoKey'
                }
            ]
        }
    }
};

let mockData2 = {
    body: {
        _embedded: {
            'viaplay:blocks': [
                {
                    _embedded: {
                        'viaplay:products': [
                            {
                                content: {
                                    imdb: {
                                        id: 'id1'
                                    }
                                }
                            }
                        ]
                    }
                }
            ]
        },
        videos: {
            results: [
                {
                    type: 'Teaser',
                    key: 'mockTeaserVideoKey'
                }
            ]
        }
    }
};

let mockData3 = {
    body: {
        _embedded: {
            'viaplay:blocks': [
                {
                    _embedded: {
                        'viaplay:products': [
                            {
                                content: {
                                    imdb: {
                                        id: 'id1'
                                    }
                                }
                            }
                        ]
                    }
                }
            ]
        },
        videos: {
            results: [
                {
                    type: 'Not a Trailer or Teaser',
                    key: 'mockTeaserVideoKey'
                }
            ]
        }
    }
};

let mockData4 = {
    body: {
        _embedded: {
            'viaplay:blocks': [
                {
                    _embedded: {
                        'viaplay:product': {
                            content: {
                                imdb: {
                                    id: 'id1'
                                }
                            }
                        }
                    }
                }
            ]
        },
        videos: {
            results: [
                {
                    type: 'Teaser',
                    key: 'mockTeaserVideoKey'
                }
            ]
        }
    }
};

let mockData5 = {
    body: {
        _embedded: {
            'viaplay:blocks': [
                {
                    _embedded: {
                        'viaplay:products': {
                            content: {
                                imdb: {
                                    id: 'id1'
                                }
                            }
                        }
                    }
                },
                {
                    _embedded: {
                        'viaplay:products': {
                            content: {
                                imdb: {
                                    id: 'id1'
                                }
                            }
                        }
                    }
                }
            ]
        },
        videos: {
            results: [
                {
                    type: 'Teaser',
                    key: 'mockTeaserVideoKey'
                }
            ]
        }
    }
};

jest.mock('../../../../assets/service-handler/http-client', () => {
    return () => {
        return {
            execute: function({url}) {
                if(url === 'fail') return Promise.reject(new Error(''));
                return Promise.resolve(mockData);
            }
        };
    };
});

const serviceClient = httpClient();
const viaplayAdapter = createViaplayAdater({serviceClient});
const movieDbAdapter = createmovieDbAdapter({serviceClient, config: {imdb: {key: 'testkey'}}});
const controllerFunc = controller({movieInfoAdapter: viaplayAdapter, trailerAdapter: movieDbAdapter});

describe('trailerLinksRouter Controller', () => {
    test('Should return the trailer url', (done) => {
        const eventReceiver = (sendCalledWith) => {
            expect(sendCalledWith).toMatch('mockTrailerVideoKey');
            done();
        }
        const res = new Reponse(eventReceiver);

        mockData = mockData1;

        controllerFunc(req,res)
    });

    test('Should return the teaser url', (done) => {
        const eventReceiver = (sendCalledWith) => {
            expect(sendCalledWith).toMatch('mockTeaserVideoKey');
            done();
        }
        const res = new Reponse(eventReceiver);

        mockData = mockData2;

        controllerFunc(req,res)
    });

    test('Should return the teaser id for one product', (done) => {
        const eventReceiver = (sendCalledWith) => {
            expect(sendCalledWith).toMatch('mockTeaserVideoKey');
            done();
        }
        const res = new Reponse(eventReceiver);

        mockData = mockData4;

        controllerFunc(req,res)
    });

    test('Should return the teaser id for multiple products', (done) => {
        const eventReceiver = (sendCalledWith) => {
            expect(sendCalledWith).toMatch('mockTeaserVideoKey');
            done();
        }
        const res = new Reponse(eventReceiver);

        mockData = mockData5;

        controllerFunc(req,res)
    });
});
