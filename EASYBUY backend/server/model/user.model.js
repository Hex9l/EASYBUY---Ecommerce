import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "provide name"],
    },
    email: {
        type: String,
        required: [true, "provide email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "provide password"],
    },
    avatar: {
        type: String,
        default: "",
    },
    mobile: {
        type: String,
        default: null,
    },
    refresh_token: {
        type: String,
        default: "",
    },
    verify_email: {
        type: Boolean,
        default: false,
    },
    last_login_date: {
        type: Date,
        default: "",
    },
    status: {
        type: String,
        enum: ["active", "inactive", "suspended"],
        default: "active",
    },
    address_details: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Address"
        }
    ],
    shopping_cart: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "cartProduct"
        }
    ],
    orederHistory: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Order"
        }
    ],
    forgot_password_otp: {
        type: String,
        default: null,
    },
    forgot_password_expiry: {
        type: Date,
        default: null,
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER",
    },
}, {
    timestamps: true,
})  

const UserModel = mongoose.model("User", userSchema);

export default UserModel;