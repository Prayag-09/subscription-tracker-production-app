import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
	{
		username: {
			type: String,
			require: [true, 'Username is mandatory'],
			trim: true,
			minLength: 3,
			maxLength: 20,
			unique: [true, 'Username already exist'],
		},
		email: {
			type: String,
			require: [true, 'Email is mandatory'],
			trim: true,
			minLength: 10,
			maxLength: 20,
			unique: [true, 'Email already exist'],
			match: [/\S+@\S+\.\S+/, 'Enter a valid email'],
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			minLength: 8,
		},
	},
	{ timestamps: true }
);
export const User = mongoose.model('User', userSchema);
