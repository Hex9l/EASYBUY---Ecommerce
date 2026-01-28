
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function promoteAll() {
    try {
        await mongoose.connect(MONGODB_URI);
        const UserSchema = new mongoose.Schema({ role: String });
        const User = mongoose.model('UserTemp4', UserSchema, 'users');
        const result = await User.updateMany({}, { role: "ADMIN" });
        console.log("All users promoted to ADMIN:", result);
        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err);
    }
}

promoteAll();
