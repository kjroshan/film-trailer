import http from 'request-promise';
import get from 'lodash/get';

import httpClient from '../../../assets/service-handler/http-client';
jest.mock('request-promise');
const serviceClient = httpClient({});

describe('http service adapter', () => {
    test('should fetch data for get', () => {
        const resp = {body: [{name: 'Bob'}], "headers": undefined, "status": undefined};
        http.mockResolvedValue(resp);
        return serviceClient.execute({url: 'test.com'}).then(response => expect(response).toEqual(resp));
    });

    test('should call the catch block for error response', () => {
        const err = {};
        const resp = new Error('');
        http.mockResolvedValue(Promise.reject(new Error('')));
        return serviceClient.execute({url: 'test.com'}).catch(e => expect(e).not.toEqual(resp));
    });

    test('should fail without url', () => {
        let url;
        const expectedErrorObj = new Error(`'options.url=${url}' is not valid.`);
        return serviceClient.execute({}).catch(e => expect(e).toEqual(expectedErrorObj));
    });

    test('should fail for wrong method', () => {
        let url;
        const expectedErrorObj = new Error(`Unsupported http method: 'wrongmethod'`);
        return serviceClient.execute({url:'some.url', method:'wrongmethod'}).catch(e => expect(e).toEqual(expectedErrorObj));
    });
    test('should fail for post method without body', () => {
        let url;
        const expectedErrorObj = new Error(`'options.body' is required for http method: 'post''`);
        return serviceClient.execute({url:'some.url', method:'post'}).catch(e => expect(e).toEqual(expectedErrorObj));
    });
});