import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function promote() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        // Use a dynamic import or define the schema here since we might have issues importing the model directly
        const UserSchema = new mongoose.Schema({
            name: String,
            role: String
        });
        const User = mongoose.model('UserTemp', UserSchema, 'users');

        const users = await User.find({ name: /Henil/i });
        console.log("Found users matching 'Henil':", users.map(u => ({ name: u.name, role: u.role, _id: u._id })));

        if (users.length > 0) {
            const result = await User.updateMany({ name: /Henil/i }, { role: "ADMIN" });
            console.log("Promotion successful:", result);
        } else {
            console.log("No user found with name Henil");
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err);
    }
}

promote();
