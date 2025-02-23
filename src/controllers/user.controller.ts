import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model.js';
export const getUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const users = await User.find();

		res.status(200).json({ success: true, data: users });
	} catch (error) {
		next(error);
	}
};

export const getUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = await User.findById(req.params.id).select('-password');

		if (!user) {
			const error = new Error('User not found') as any;
			error.statusCode = 404;
			throw error;
		}

		res.status(200).json({ success: true, data: user });
	} catch (error) {
		next(error);
	}
};
