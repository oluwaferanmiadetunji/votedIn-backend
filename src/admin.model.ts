const mongoose = require('mongoose');
import validator from 'validator';
import bcrypt from 'bcryptjs';

const adminSchema = mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			validate(value: string) {
				if (!validator.isEmail(value)) {
					throw new Error('Invalid email');
				}
			},
		},
		password: {
			type: String,
			required: true,
			trim: true,
			minlength: 8,
			validate(value: string) {
				if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
					throw new Error('Password must contain at least one letter and one number');
				}
			},
		},
	},
	{
		timestamps: true,
	},
);

adminSchema.statics.isEmailTaken = async function (email: string, excludeUserId: string) {
	const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
	return !!user;
};

adminSchema.methods.isPasswordMatch = async function (password: string) {
	return bcrypt.compare(password, this.user.password);
};

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
