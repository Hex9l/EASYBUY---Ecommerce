
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function listUsers() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));

        const UserSchema = new mongoose.Schema({}, { strict: false });
        // Try both 'User' and 'users'
        const User = mongoose.model('UserTemp2', UserSchema, 'users');
        const allUsers = await User.find({}).limit(10);
        console.log("Sample Users from 'users' collection:", allUsers.map(u => ({ name: u.name, email: u.email, role: u.role, _id: u._id })));

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err);
    }
}

listUsers();
