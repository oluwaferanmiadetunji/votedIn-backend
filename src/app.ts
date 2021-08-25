import express, { Express, Request, Response } from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import compression from 'compression';
import { connectDatabase } from './config/db';
import { requestBodyTrim, errorHandler } from './helpers';

// Routes
import Routes from './routes';

// Initialize express
const app: Express = express();

// Disable etag and x-powered-by to improve server performance
app.disable('etag').disable('x-powered-by');

// Express body parser middleware
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: false }));

// Express-Mongo-Sanitize middleware
app.use(mongoSanitize());

// Set security headers with helmet middleware
app.use(helmet());

// Prevent hpp param polution middleware
app.use(hpp());

// Use cors middleware
app.use(cors());

// Use compression middleware
app.use(compression());

// Use request body trim to trim all request body fields
app.use(requestBodyTrim);

connectDatabase();

// Index route
app.get('/', (req: Request, res: Response) => {
	return res.status(200).json({
		message: `visit https://dnar.io for more info`,
	});
});

// Mount routes
app.use('/', Routes);

// Use errorHandler middleware
app.use(errorHandler);

export default app;
