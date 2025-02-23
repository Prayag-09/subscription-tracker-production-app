import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const connectDB = async () => {
    try {
        const MONGO_URL = process.env.MONGO_URL;
        if (!MONGO_URL) {
            console.error('❌ Database URL is missing in environment variables.');
            process.exit(1);
        }
        await mongoose.connect(MONGO_URL);
        console.log('✅ Successfully connected to the database');
    }
    catch (error) {
        console.error('❌ Error connecting to the database:', error);
        process.exit(1);
    }
};
export default connectDB;
