
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
// import fetch from 'node-fetch'; // Native fetch in Node 18+

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const SECRET_KEY_ACCESS_TOKEN = process.env.SECRET_KEY_ACCESS_TOKEN;

async function testBackend() {
    try {
        // 1. Connect to DB to get the User ID
        await mongoose.connect(MONGODB_URI, { dbName: 'easybuy' });
        console.log("Connected to MongoDB");

        const UserSchema = new mongoose.Schema({ email: String, role: String });
        const User = mongoose.model('UserTest', UserSchema, 'users');

        const email = "henilpatel200425@gmail.com";
        const user = await User.findOne({ email });

        if (!user) {
            console.error("User not found!");
            process.exit(1);
        }
        console.log(`User found: ${user._id} (${user.role})`);

        // 2. Generate Token manually (simulating login)
        const token = jwt.sign(
            { Id: user._id },
            SECRET_KEY_ACCESS_TOKEN,
            { expiresIn: '5h' }
        );
        console.log("Generated Token:", token);

        // 3. Make Request to Create Product
        const response = await fetch('http://localhost:8000/api/product/create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Simulating Bearer token
                'Content-Type': 'application/json',
                // 'Cookie': `accessToken=${token}` // Also try cookie if auth middleware checks it
            },
            body: JSON.stringify({
                name: "Test Product from Script",
                image: ["http://example.com/img.png"], // Dummy image
                category: ["6960..."], // Dummy ID, might fail validation but should pass Admin check first
                subCategory: ["6960..."],
                unit: "kg",
                stock: 10,
                price: 100,
                discount: 10,
                description: "Test",
                more_details: {}
            })
        });

        console.log(`Response Status: ${response.status}`);
        const data = await response.json();
        console.log("Response Body:", JSON.stringify(data, null, 2));

        await mongoose.disconnect();

    } catch (err) {
        console.error("Error:", err);
    }
}

testBackend();
