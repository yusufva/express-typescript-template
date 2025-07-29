import winston from 'winston';
// Correctly import the DailyRotateFile transport class
import DailyRotateFile from 'winston-daily-rotate-file';

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize(),
    // The printf format is the final output format.
    winston.format.printf(info => `${info.timestamp} | ${info.level} | ${info.message}`)
  ),
  transports: [
    new DailyRotateFile({
      level: 'debug',
      filename: `logs/app-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      handleExceptions: true,
      maxSize: '5m',
      maxFiles: '5d',
    }),
    new winston.transports.Console({
      level: 'info',
      handleExceptions: true,
      // The invalid 'json' property is removed here. The format is handled above.
    }),
  ],
  exitOnError: false,
});

/**
 * A separate stream object with a `write` function that `morgan` can use.
 * It routes the morgan logs through our logger.
 */
export const morganStream = {
  write: (message: string) => {
    // The 'message' from morgan has a newline at the end, so we trim it.
    logger.info(message.trim());
  },
};

export default logger;