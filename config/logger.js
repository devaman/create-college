const winston = require('winston');
const { combine, timestamp, label, prettyPrint } = winston.format;
module.exports = winston.createLogger({
  levels: winston.config.syslog.levels,
  format: combine(
    timestamp(),
    prettyPrint()
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log` 
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});