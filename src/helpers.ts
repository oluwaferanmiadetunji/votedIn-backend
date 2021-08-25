import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Joi from 'joi';

const pick = (object: any, keys: any) => {
	return keys.reduce((obj: any, key: any) => {
		if (object && Object.prototype.hasOwnProperty.call(object, key)) {
			// eslint-disable-next-line no-param-reassign
			obj[key] = object[key];
		}
		return obj;
	}, {});
};

const requestBodyTrim = (req: Request, res: Response, next: NextFunction) => {
	Object.keys(req.body).map((value) =>
		typeof req.body[value] === 'string' ? (req.body[value] = req.body[value].trim()) : null,
	);
	next();
};

const catchAsync = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
	Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

class ApiError extends Error {
	statusCode: any;
	constructor(statusCode: any, message: any, stack = '') {
		super(message);
		this.statusCode = statusCode;
		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
	let error = err;
	if (!(error instanceof ApiError)) {
		const statusCode = error.statusCode || error instanceof mongoose.Error ? 400 : 500;
		const message = error.message;
		error = new ApiError(statusCode, message, err.stack);
	}
	next(error);
};

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
	let { statusCode, message } = err;

	res.locals.errorMessage = err.message;

	const response = {
		code: statusCode,
		message,
	};

	res.status(statusCode).send(response);
};

const validate = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
	const validSchema = pick(schema, ['params', 'query', 'body']);
	const object = pick(req, Object.keys(validSchema));
	const { value, error } = Joi.compile(validSchema)
		.prefs({ errors: { label: 'key' } })
		.validate(object);

	if (error) {
		const errorMessage = error.details.map((details) => details.message).join(', ');
		return next(new ApiError(400, errorMessage));
	}
	Object.assign(req, value);
	return next();
};

export { requestBodyTrim, errorHandler, catchAsync, ApiError, errorConverter, validate };
