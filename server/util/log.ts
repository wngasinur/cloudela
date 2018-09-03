
import * as winston from 'winston';

const { combine, timestamp, label, prettyPrint } = winston.format;

export  const logger = winston.createLogger({
    level: 'info',
    // format: combine(timestamp()),
    transports: [
      //
      // - Write to all logs with level `info` and below to `combined.log`
      // - Write all logs error (and below) to `error.log`.
      //
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'output.log' })
    ]
});
