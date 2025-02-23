import Subscription from '../models/subscription.model.js';
import { workflowClient } from '../config/upstash.js';
import { Request, Response, NextFunction } from 'express';
import dotnev from 'dotenv';

dotnev.config();

const SERVER_URL = process.env.SERVER_URL;

export const createSubscription = async (req : Request, res : Response, next : NextFunction) => {
	try {
		const subscription = await Subscription.create({
			...req.body,
			user: req.user._id,
		});

		const { workflowRunId } = await workflowClient.trigger({
			url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
			body: {
				subscriptionId: subscription.id,
			},
			headers: {
				'content-type': 'application/json',
			},
			retries: 0,
		});

		res
			.status(201)
			.json({ success: true, data: { subscription, workflowRunId } });
	} catch (e) {
		next(e);
	}
};

export const getUserSubscriptions = async (req : Request, res : Response, next : NextFunction) => {
	try {
		if (req.user.id !== req.params.id) {
			const error = new Error('You are not the owner of this account');
			// error.status = 401;
			throw error;
		}

		const subscriptions = await Subscription.find({ user: req.params.id });

		res.status(200).json({ success: true, data: subscriptions });
	} catch (e) {
		next(e);
	}
};
