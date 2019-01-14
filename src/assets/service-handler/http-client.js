import http from 'request-promise';
import Promise from 'bluebird';
import get from 'lodash/get';
import defaults from 'lodash/defaults';
import isEmpty from 'lodash/isEmpty';
import includes from 'lodash/includes';

const TYPE_NAME = '[HTTP-ADAPTER-REQUEST]';
const methodTypes = ['get', 'post', 'put', 'delete', 'patch'];
const postMethodTypes = ['post', 'put', 'patch'];
const DEFAULT_SETTINGS = {
    logger: console
};

class HttpClient {
    constructor(settings) {
        const _settings = defaults(settings, DEFAULT_SETTINGS);
        this.logger = _settings.logger;
        this.execute = this.execute.bind(this);
    }

    execute(options) {
        const resolveWithFullResponse = true;
        const gzip = true;
        const {
            url,
            method,
            headers,
            query,
            body,
            json = true,
            encoding
        } = options;
        const methodType = method ? method.toLowerCase() : 'get';

        if (isEmpty(url)) {
            this.logger.log('error', `${TYPE_NAME} - options.url='${url}' is not valid.`);
            return Promise.reject(new Error(`'options.url=${url}' is not valid.`));
        }

        if (!includes(methodTypes, methodType)) {
            this.logger.log('error', `${TYPE_NAME} - Unsupported http method: '${methodType}'`);
            return Promise.reject(new Error(`Unsupported http method: '${methodType}'`));
        }

        if (isEmpty(body) && includes(postMethodTypes, methodType)) {
            this.logger.log('error', `${TYPE_NAME} - 'options.body' is required for http method: '${methodType}'`);
            return Promise.reject(new Error(`'options.body' is required for http method: '${methodType}''`));
        }

        return http({
            url,
            qs: query,
            headers,
            method: methodType,
            resolveWithFullResponse,
            gzip,
            body,
            json,
            encoding
        })
            .then((response) => {
                return Promise.resolve({
                    headers: response.headers,
                    body: response.body,
                    status: response.statusCode
                });
            })
            .catch((err) => {
                this.logger.log('error', err);

                return Promise.reject(new Error(JSON.stringify({
                    headers: get(err, 'response.headers'),
                    body: get(err, 'message'),
                    status: get(err, 'response.statusCode'),
                })));
            });
    }
}

export default function create(args) {
    return new HttpClient(args);
}
