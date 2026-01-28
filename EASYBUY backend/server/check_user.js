
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function checkUser() {
    try {
        await mongoose.connect(MONGODB_URI, { dbName: 'easybuy' });
        console.log("Connected to MongoDB (easybuy)");

        const UserSchema = new mongoose.Schema({
            email: String,
            role: String,
            name: String
        }, { strict: false });
        const User = mongoose.model('UserCheck', UserSchema, 'users');

        const email = "henilpatel200425@gmail.com";
        const user = await User.findOne({ email: email });

        if (user) {
            console.log("User found:", JSON.stringify({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }, null, 2));
        } else {
            console.log("User NOT found with email:", email);
            const count = await User.countDocuments({});
            console.log("Total users in 'users' collection:", count);
            const samples = await User.find({}).limit(5);
            console.log("Sample users:", JSON.stringify(samples.map(u => ({ email: u.email, name: u.name })), null, 2));
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err);
    }
}

checkUser();
