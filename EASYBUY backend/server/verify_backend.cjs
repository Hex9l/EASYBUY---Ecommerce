const axios = require('axios');
require('dotenv').config();
const FormData = require('form-data');
const fs = require('fs');

const baseURL = 'http://localhost:8000/api/user';
const randomStr = Math.random().toString(36).substring(7);
const email = `test_${randomStr}@example.com`;
const password = 'password123';
const name = 'Test User';

async function run() {
    try {
        console.log('1. Registering user...');
        const registerRes = await axios.post(`${baseURL}/register`, {
            name,
            email,
            password
        });
        console.log('User registered:', registerRes.data.success);

        // We assume verify email is not strictly enforced for login or we can skip it?
        // Wait, the controller says "Please verify your email".
        // But loginController checks: if (user.status !== 'active') ...
        // The registerController sends email but doesn't set status to inactive by default unless schema default is 'inactive'.
        // Let's check model default.
        // user.model.js: status default: "active". verify_email default: false.
        // Login controller doesn't seem to check verify_email, only status.
        // So we should be able to login.

        console.log('2. Logging in...');
        const loginRes = await axios.post(`${baseURL}/login`, {
            email,
            password
        });
        const { accessToken } = loginRes.data.data;
        console.log('Logged in. Access Token:', !!accessToken);

        /*
        console.log('3. Uploading Avatar...');
        const form = new FormData();
        // Create a dummy image buffer (1x1 pixel PNG)
        const dummyImage = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64');
        form.append('avatar', dummyImage, { filename: 'avatar.png', contentType: 'image/png' });

        const uploadRes = await axios.put(`${baseURL}/upload-avatar`, form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${accessToken}`,
                // Also need cookies if backend checks cookies usually?
                // auth middleware checks req.cookies?.accessToken OR req.headers?.authorization
            }
        });

        console.log('Upload response:', uploadRes.data);

        if (uploadRes.data.success) {
            console.log('SUCCESS: Avatar upload verified on backend.');
        } else {
            console.error('FAILURE: Avatar upload failed on backend.');
        }
        */

        console.log('4. Testing Update Profile (Email Uniqueness)...');
        // Create another user
        const otherEmail = `other_${randomStr}@example.com`;
        await axios.post(`${baseURL}/register`, { name: 'Other', email: otherEmail, password: 'password' });

        // Try to update current user to use otherEmail
        try {
            await axios.put(`${baseURL}/update-user`, { email: otherEmail }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            console.log('FAILURE: Should have blocked duplicate email.');
        } catch (err) {
            if (err.response && err.response.status === 400 && err.response.data.message === "Email already in use") {
                console.log('SUCCESS: Duplicate email blocked correctly.');
            } else {
                console.log('FAILURE: Unexpected error:', err.response?.data || err.message);
            }
        }

    } catch (error) {
        console.error('ERROR:', error.response ? error.response.data : error.message);
    }
}

run();
