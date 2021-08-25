import { Request, Response } from 'express';
import { catchAsync } from './helpers';
import Model from './model';
import { ApiError } from './helpers';
import twilio from './config/twilio';
// import cryptoRandomString from 'crypto-random-string';

export const SendVerificationCode = catchAsync(async (req: Request, res: Response) => {
	const { phoneNumber, matricNumber, name, gender } = req.body;

	if (await Model.isPhoneTaken(phoneNumber)) {
		throw new ApiError(400, 'Phone Number is already taken');
	}

	if (await Model.isMatricTaken(matricNumber)) {
		throw new ApiError(400, 'Matric Number is already taken');
	}

	// const veriticationCode = cryptoRandomString({ length: 6, type: 'numeric' });

	// console.log(veriticationCode);

	const response = await twilio.messages.create({
		// body: `Verification code to complete your registration for Votedin is: ${veriticationCode}`,

		body: `Verification code to complete your registration for Votedin is: `,
		from: phoneNumber,
		to: phoneNumber,
	});

	console.log(response);

	const user = await Model.create({
		phoneNumber,
		matricNumber,
		name,
		gender,
		// code: veriticationCode
	});
	return user;
});
