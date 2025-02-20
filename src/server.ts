import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectDB';
// import authRoutes from './routes/auth.routes.ts';
// import userRoutes from './routes/user.routes.ts';
// import subscriptionRoutes from './routes/subscription.routes.ts';

const app = express();
dotenv.config();

app.use('/', (req, res) => {
	res.send('Welcome to Subscription Tracking API Platform');
});

connectDB();
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/user', userRoutes);
// app.use('/api/v1/subscribe', subscriptionRoutes);

app.use(express.json());
const PORT = process.env.PORT;
app.listen(PORT, () =>
	console.log(`Server Up and running at http://localhost:${PORT}`)
);
