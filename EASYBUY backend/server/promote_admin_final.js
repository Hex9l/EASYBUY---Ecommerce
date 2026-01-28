
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
        await mongoose.connect(MONGODB_URI, { dbName: 'easybuy' });
        console.log("Connected to MongoDB (easybuy database)");

        const UserSchema = new mongoose.Schema({
            email: String,
            role: String
        });
        const User = mongoose.model('UserTemp5', UserSchema, 'users');

        const email = "henilpatel200425@gmail.com";
        const result = await User.updateOne({ email: email }, { role: "ADMIN" });
        console.log(`Promotion result for ${email}:`, result);

        // Also promote all just in case
        const allResult = await User.updateMany({}, { role: "ADMIN" });
        console.log("All users in 'easybuy' database promoted to ADMIN:", allResult);

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err);
    }
}

promote();
