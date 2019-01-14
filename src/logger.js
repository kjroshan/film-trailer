import winston from 'winston';
import fs from 'fs';
import path from 'path';


const logDir = 'logs';

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    ),
    defaultMeta: {
        service: 'user-service'
    },
    transports: [
        new winston.transports.File({
            filename: path.join(logDir, '/error.log'),
            level: 'error'
        }),
        new winston.transports.File({
            filename: path.join(logDir, '/application.log')
        })
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        colorize: 'all',
        format: winston.format.simple()
    }));
}

export default logger;
