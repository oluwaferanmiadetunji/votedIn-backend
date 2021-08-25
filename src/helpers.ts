import { Request, Response, NextFunction } from 'express';
import { ErrorResponse, FailureResponse } from './responses';

type ApplicationError = {
	value?: string;
	code?: any;
	status: number;
	message: string;
	name: string;
	stack?: string;
	errors?: any;
	constant?: any;
};

const requestBodyTrim = (req: Request, res: Response, next: NextFunction) => {
	Object.keys(req.body).map((value) =>
		typeof req.body[value] === 'string' ? (req.body[value] = req.body[value].trim()) : null,
	);
	next();
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): Response => {
	let error = { ...err } as ApplicationError;
	error.message = err.message;

	// Mongoose bad ObjectId
	if (error.name === 'CastError') {
		const message = `Resource not found`;
		error = new ErrorResponse(message, 404, error.constant);
	}

	// Mongoose duplicate key
	if (error.code === 11000) {
		const message = 'Duplicate field value entered';
		error = new ErrorResponse(message, 400, error.constant);
	}

	// Mongoose validation error
	if (error.name === 'ValidationError') {
		const message = Object.values(error.errors)
			.map((error: any) => error.message)
			.join();

		error = new ErrorResponse(message, 400, error.constant);
	}

	return res.status(error.status || 500).json(new FailureResponse(error.code, error.message));
};

export { requestBodyTrim, errorHandler };
