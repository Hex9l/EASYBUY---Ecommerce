
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
        const UserSchema = new mongoose.Schema({}, { strict: false });
        const User = mongoose.model('UserTemp3', UserSchema, 'users');
        const allUsers = await User.find({});
        console.log("All Users:", JSON.stringify(allUsers.map(u => ({ name: u.name, email: u.email, role: u.role })), null, 2));
        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err);
    }
}

listUsers();
