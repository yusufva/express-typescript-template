import express, { Application, Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from "url";
import { dirname } from "path";
import morgan from 'morgan'; // Import morgan

// Import both the logger and the stream for morgan
import logger, { morganStream } from '@api/config/logger';
import { port, appName } from '@api/config/envars';
import indexRouter from '@api/routes/index';
import helloRouter from '@api/routes/hello';

// This logic remains the same for ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const app: Application = express();

// --- Standard Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// --- Logging Middleware ---
// Use morgan for standard HTTP request logging.
// The 'combined' format is a good standard for production.
app.use(morgan('combined', { stream: morganStream }));

/**
 * Custom middleware for detailed response body logging.
 * This should come after morgan but before your routes.
 */
const responseBodyLogger = (req: Request, res: Response, next: NextFunction): void => {
  const requestTime = new Date();

  const requestDetails = {
    method: req.method,
    url: req.url,
    body: req.body
  };

  // Keep a reference to the original res.send function
  const originalSend = res.send;

  // Monkey-patch res.send to intercept the response data
  res.send = function (data: any): Response {
    const executionTime = (new Date().getTime() - requestTime.getTime()) + 'ms';
    
    let responseBody: any;
    try {
      responseBody = JSON.parse(data);
    } catch (error) {
      responseBody = data;
    }

    const responseDetails = {
      statusCode: res.statusCode,
      body: responseBody
    };

    const log = {
      logType: 'RESPONSE_DETAIL',
      appName,
      requestTime: requestTime.toISOString(),
      executionTime,
      request: requestDetails,
      response: responseDetails
    };

    // Use a different log level or message to distinguish these detailed logs
    logger.debug(JSON.stringify(log));

    // Call the original res.send
    return originalSend.call(res, data);
  };
  
  next();
};

// Add your custom middleware
app.use(responseBodyLogger);

// --- Static Files & Routes ---
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter);
app.use('/users', helloRouter);

logger.info(`Server is preparing to listen on port ${port}`);

export default app;