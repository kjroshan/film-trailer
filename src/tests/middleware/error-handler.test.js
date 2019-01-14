import errorHandler from '../../middleware/error-handler';


let req = {
    app: {get: ()=>{}},
    query: {
        url: 'http://mockurl'
    }
};

class Reponse {
    constructor(eventReceiver){
        this.locals = {error: {}};
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
        this.eventReceiver(arg);
    }
};

describe('Error Handler', () => {
    test('Should return the error message received', (done) => {
        const eventReceiver = (sendCalledWith) => {
            expect(sendCalledWith).toMatch('Resource Not Found');
            done();
        }
        const res = new Reponse(eventReceiver);
        const error = {
            status: 404,
            message: 'Resource Not Found'
        };
        errorHandler(error, req,res);
    });

    test('Should return Internal server error message ', (done) => {
        const eventReceiver = (sendCalledWith) => {
            expect(sendCalledWith).toMatch('Internal Server Error');
            done();
        }
        const res = new Reponse(eventReceiver);
        const error = {
            status: 404
        };
        errorHandler(error, req,res);
    });

    test('Should return Internal server error message when nothing is given ', (done) => {
        const eventReceiver = (sendCalledWith) => {
            expect(sendCalledWith).toMatch('Internal Server Error');
            done();
        }
        req.app.get = () => 'development';
        const res = new Reponse(eventReceiver);
        const error = {};
        errorHandler(error, req,res)
    });
})

