class ServerResponse {
	code: number;

	constructor(code: number) {
		this.code = code;
	}
}

class FailureResponse extends ServerResponse {
	code: number;
	error?: object | string | string[];
	message: string;

	constructor(code: number, message: string, error?: object | string | string[]) {
		super(code);

		this.code = code;
		this.message = message;
		this.error = error;
	}
}

class SuccessResponse extends ServerResponse {
	code: number;
	total?: number | object;
	count?: number;
	pagination?: object;
	data?: object | string | number;
	message: string;

	constructor(code: number, message: string, data?: object | number | string, dataControl?: any) {
		super(code);

		this.code = code;
		this.message = message;
		this.total = dataControl && dataControl.total ? dataControl.total : undefined;
		this.count = dataControl ? dataControl.count : undefined;
		this.pagination = dataControl ? dataControl.pagination : undefined;
		this.data = data;
	}
}

class TokenResponse extends ServerResponse {
	code: number;
	token: string;
	message: string;

	constructor(code: number, message: string, token: string) {
		super(code);

		this.code = code;
		this.message = message;
		this.token = token;
	}
}

class ErrorResponse extends Error {
	status: number;
	error: string;
	code: number;

	constructor(message: string, status: number, constant: number) {
		super(message);
		this.status = status;
		this.error = message;
		this.code = constant;
	}
}
export { SuccessResponse, FailureResponse, ErrorResponse, TokenResponse };
