import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/user.model.js';
import { Request, Response, NextFunction } from 'express';
dotenv.config();

// Extend Request to include `user`
interface CustomRequest extends Request {
	user?: any; // Replace `any` with your actual user type
}

const authenticate = async (
	req: CustomRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const JWT_SECRET = process.env.JWT;
		if (!JWT_SECRET) {
			console.error('JWT_SECRET is missing in environment variables');
			return res.status(500).json({ message: 'Internal Server Error' });
		}

		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res
				.status(401)
				.json({ message: 'Unauthorized: No token provided' });
		}

		const token = authHeader.split(' ')[1];
		const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
		const user = await User.findById(decoded.userId);

		if (!user) {
			return res.status(401).json({ message: 'Unauthorized: Invalid token' });
		}

		req.user = user; // TypeScript now recognizes `req.user`
		next();
	} catch (error) {
		console.error('Authentication error:', error);
		return res
			.status(401)
			.json({ message: 'Unauthorized: Invalid or expired token' });
	}
};

export default authenticate;
