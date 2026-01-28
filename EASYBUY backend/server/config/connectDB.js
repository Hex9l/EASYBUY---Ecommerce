import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
}




async function connectDB() {
    try {
        const secretUri = process.env.MONGODB_URI;
        // Log stripped URI to verify DB name (assuming standard format mongodb://.../dbname?...)
        const dbName = secretUri?.split('/')?.pop()?.split('?')[0];
        console.log(`Attempting to connect to MongoDB, database: ${dbName || 'unknown'}`);

        // Force connection to 'easybuy' database
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'easybuy'
        });
        console.log('MongoDB connected successfully to "easybuy" database');
    } catch (error) {
        console.log('MongoDB connection failed:', error);
        process.exit(1); // Exit the process with failure
    }
}

export default connectDB;
