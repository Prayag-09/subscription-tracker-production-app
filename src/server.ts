import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';
import cookieParser from 'cookie-parser';
import subscriptionRoutes from './routes/subscription.routes.js';
import errorHandler from './middlewares/errorHandling.middleware.js';
const app = express();
dotenv.config();

connectDB();
app.use(arcjetMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/subscribe', subscriptionRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () =>
	console.log(`Server Up and running at http://localhost:${PORT}`)
);

app.use('/', (req, res) => {
	res.send('Welcome to Subscription Tracking API Platform');
});
