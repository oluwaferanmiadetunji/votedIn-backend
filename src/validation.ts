import Joi from 'joi';

const SendVerificationCode = {
	body: Joi.object().keys({
		name: Joi.string().required(),
		matricNumber: Joi.string().required(),
		phoneNumber: Joi.string().required(),
		gender: Joi.string().required(),
	}),
};

export default { SendVerificationCode };
