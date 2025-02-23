import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const authController = {
    signIn: async (req, res, next) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: 'User not found.' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: 'Invalid credentials.' });
            }
            const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
                expiresIn: '1d',
            });
            await session.commitTransaction();
            session.endSession();
            return res.status(200).json({ message: 'Sign-in successful', token });
        }
        catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error('Sign-in error:', error);
            next(error);
        }
    },
    signUp: async (req, res, next) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { username, email, password } = req.body;
            if (!username || !email || !password) {
                await session.abortTransaction();
                session.endSession();
                return res
                    .status(400)
                    .json({ message: 'Username, email, and password are required.' });
            }
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: 'User already exists.' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create([{ username, email, password: hashedPassword }], { session });
            const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, {
                expiresIn: '1d',
            });
            await session.commitTransaction();
            session.endSession();
            return res
                .status(201)
                .json({ message: 'User created successfully', token });
        }
        catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error('Sign-up error:', error);
            next(error);
        }
    },
    signOut: async (res) => {
        return res.status(200).json({ message: 'Sign-out successful.' });
    },
};
export default authController;
