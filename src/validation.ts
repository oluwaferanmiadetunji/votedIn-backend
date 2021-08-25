import Joi from 'joi';

const SendVerificationCode = {
	body: Joi.object().keys({
		name: Joi.string().required(),
		matricNumber: Joi.string().required(),
		phoneNumber: Joi.string().required(),
		gender: Joi.string().required(),
	}),
};

const VerifyAccount = {
	body: Joi.object().keys({
		code: Joi.string().required(),
		phoneNumber: Joi.string().required(),
	}),
};

const LoginAccount = {
	body: Joi.object().keys({
		matricNumber: Joi.string().required(),
	}),
};

const Verify = {
	body: Joi.object().keys({
		code: Joi.string().required(),
		matricNumber: Joi.string().required(),
	}),
};

export default { SendVerificationCode, VerifyAccount, LoginAccount, Verify };
