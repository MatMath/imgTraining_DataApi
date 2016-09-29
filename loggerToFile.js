/*jshint esversion: 6 */
const winston = require('winston');
const fs = require('fs');
const logDir = 'log';
const env = process.env.NODE_ENV || 'development';
winston.level = process.env.LOG_LEVEL || 'info';
// 'error', 'warn', 'info', 'verbose', 'debug', 'silly'.

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const tsFormat = () => (new Date()).toLocaleTimeString();
const logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'info'
    }),
    new (winston.transports.File)({
      filename: `${logDir}/results_${new Date().getMonth()}-${new Date().getDate()}.log`,
      timestamp: tsFormat,
      level: env === 'development' ? 'debug' : 'info'
    })
  ]
});

module.exports = logger;
