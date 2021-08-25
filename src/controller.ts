import { Request, Response } from 'express';
import { catchAsync } from './helpers';
import Model from './model';
import { ApiError } from './helpers';
import { generateCode, sendSMS } from './helpers';

export const SendVerificationCode = catchAsync(async (req: Request, res: Response) => {
	const { phoneNumber, matricNumber, name, gender } = req.body;

	if (await Model.isPhoneTaken(phoneNumber)) {
		throw new ApiError(400, 'Phone Number is already taken');
	}

	if (await Model.isMatricTaken(matricNumber)) {
		throw new ApiError(400, 'Matric Number is already taken');
	}

	const veriticationCode = generateCode();

	await sendSMS(phoneNumber, `Here's your verification code: ${veriticationCode}`);

	await Model.create({
		phoneNumber,
		matricNumber,
		name,
		gender,
		code: veriticationCode,
	});

	return res.status(201).json({ message: 'A verification code has been sent to the phone number provided' });
});

export const VerifyAccount = catchAsync(async (req: Request, res: Response) => {
	const { phoneNumber, code } = req.body;

	const user = await Model.findOne({ phoneNumber });

	if (!user) {
		throw new ApiError(404, 'Account not found!');
	}

	if (user.code != code) {
		throw new ApiError(400, 'Wrong verification code! Please check again');
	}

	Object.assign(user, { isVerified: true, code: '' });

	await user.save();

	return res.status(200).json({ message: 'Account successfully verified' });
});

export const Login = catchAsync(async (req: Request, res: Response) => {
	const { matricNumber } = req.body;

	const user = await Model.findOne({ matricNumber });

	if (!user) {
		throw new ApiError(404, 'Account not found!');
	}

	const veriticationCode = generateCode();

	await sendSMS(user.phoneNumber, `Here's your verification code: ${veriticationCode}`);

	Object.assign(user, { code: veriticationCode });

	await user.save();

	return res.status(200).json({
		message: 'A verification code has been sent to the phone number associated with the Matric Number provided',
	});
});

export const Verify = catchAsync(async (req: Request, res: Response) => {
	const { matricNumber, code } = req.body;

	const user = await Model.findOne({ matricNumber });

	if (!user) {
		throw new ApiError(404, 'Account not found!');
	}

	if (user.code != code) {
		throw new ApiError(400, 'Wrong verification code! Please check again');
	}

	Object.assign(user, { code: '' });

	await user.save();

	return res.status(200).json({ message: 'Account successfully verified' });
});
