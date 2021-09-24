import { Request, Response } from 'express';
import { catchAsync } from './helpers';
import UserModel from './user.model';
import AdminModel from './admin.model';
import { ApiError } from './helpers';
import { generateCode, sendSMS } from './helpers';
import bcrypt from 'bcryptjs';

export const SendVerificationCode = catchAsync(async (req: Request, res: Response) => {
	const { phoneNumber, matricNumber, name, gender } = req.body;

	if (await UserModel.isPhoneTaken(phoneNumber)) {
		throw new ApiError(400, 'Phone Number is already taken');
	}

	if (await UserModel.isMatricTaken(matricNumber)) {
		throw new ApiError(400, 'Matric Number is already taken');
	}

	const veriticationCode = generateCode();

	await sendSMS(phoneNumber, `Here's your verification code: ${veriticationCode}`);

	await UserModel.create({
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

	const user = await UserModel.findOne({ phoneNumber });

	if (!user) {
		throw new ApiError(404, 'Account not found!');
	}

	if (user.code != code) {
		throw new ApiError(401, 'Wrong verification code! Please check again');
	}

	Object.assign(user, { isVerified: true, code: '' });

	await user.save();

	return res.status(200).json({ message: 'Account successfully verified' });
});

export const Login = catchAsync(async (req: Request, res: Response) => {
	const { matricNumber } = req.body;

	const user = await UserModel.findOne({ matricNumber });

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

	const user = await UserModel.findOne({ matricNumber });

	if (!user) {
		throw new ApiError(404, 'Account not found!');
	}

	if (user.code != code) {
		throw new ApiError(400, 'Wrong verification code! Please check again');
	}

	Object.assign(user, { code: '' });

	await user.save();

	return res.status(200).json({ message: 'Account successfully verified', user });
});

export const AdminRegister = catchAsync(async (req: Request, res: Response) => {
	const { email, password } = req.body;

	if (await AdminModel.isEmailTaken(email)) {
		throw new ApiError(400, 'Email is already taken');
	}

	await AdminModel.create({
		email,
		password: await bcrypt.hash(password, 8),
	});

	return res.status(201).json({ message: 'A verification code has been sent to the phone number provided' });
});

export const AdminLogin = catchAsync(async (req: Request, res: Response) => {
	const { email, password } = req.body;

	if (await AdminModel.isPasswordMatch(password)) {
		throw new ApiError(400, 'Wrong credentials');
	}

	await AdminModel.create({
		email,
		password: await bcrypt.hash(password, 8),
	});

	return res.status(201).json({ message: 'A verification code has been sent to the phone number provided' });
});
