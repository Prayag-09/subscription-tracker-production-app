import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import { User } from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

const authController = {
	signIn: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { email, password } = req.body;

			const user = await User.findOne({ email });
			if (!user) {
				return res.status(400).json({ message: 'User not found.' });
			}

			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return res.status(400).json({ message: 'Invalid credentials.' });
			}

			const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
				expiresIn: '1d',
			});

			return res.status(200).json({ message: 'Sign-in successful', token });
		} catch (error) {
			console.error('Sign-in error:', error);
			next(error);
		}
	},

	signUp: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { username, email, password } = req.body;
			if (!username || !email || !password) {
				return res
					.status(400)
					.json({ message: 'Username, email, and password are required.' });
			}

			const existingUser = await User.findOne({ email });
			if (existingUser) {
				return res.status(400).json({ message: 'User already exists.' });
			}

			const hashedPassword = await bcrypt.hash(password, 10);

			const newUser = await User.create([
				{ username, email, password: hashedPassword },
			]);

			const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, {
				expiresIn: '1d',
			});
			return res
				.status(201)
				.json({ message: 'User created successfully', token });
		} catch (error) {
			console.error('Sign-up error:', error);
			next(error);
		}
	},

	signOut: async (res: Response) => {
		return res.status(200).json({ message: 'Sign-out successful.' });
	},
};

export default authController;
