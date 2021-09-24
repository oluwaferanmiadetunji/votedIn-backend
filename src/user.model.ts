const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		matricNumber: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		phoneNumber: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		gender: {
			type: String,
			required: true,
			trim: true,
		},
		code: {
			type: String,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

userSchema.statics.isPhoneTaken = async function (phone: string, excludeUserId: string) {
	const user = await this.findOne({ phone, _id: { $ne: excludeUserId } });
	return !!user;
};

userSchema.statics.isMatricTaken = async function (matricNumber: string, excludeUserId: string) {
	const user = await this.findOne({ matricNumber, _id: { $ne: excludeUserId } });
	return !!user;
};

userSchema.methods.isCodeMatch = async function (token: string) {
	const user = this;
	return token === user.token;
};

const User = mongoose.model('User', userSchema);

export default User;
