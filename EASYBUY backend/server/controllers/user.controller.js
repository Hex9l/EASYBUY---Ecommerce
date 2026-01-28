import sendEmail from '../config/sendEmail.js';
import bcrypt from 'bcryptjs';
import verifyEmailTemplate from '../utils/verifyEmailTemplet.js';

import generatedAccessToken from '../utils/generatedAccessToken.js';
import generatedRefreshToken from '../utils/generatedRefreshToken.js';
import uploadImageCloudinary from '../utils/uploadimageCloudinary.js';
import generatedOtp from '../utils/generatedOtp.js';
import forgotPasswordTemplet from '../utils/forgotPasswordTemplet.js';
import jwt from 'jsonwebtoken';
import UserModel from '../model/user.model.js';


// register user controller
export async function registerUserController(request, response) {

    try {
        const { name, email, password } = request?.body;


        if (!name || !email || !password) {
            return response.status(400).json({
                message: 'Name, Email, and Password are required',
                error: true,
                success: false,
            });
        }

        const user = await UserModel.findOne({ email });
        if (user) {
            return response.status(500).json({
                message: 'Email already registered',
                error: true,
                success: false,
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const payload = {
            name,
            email,
            password: hashedPassword,
        };

        const newUser = new UserModel(payload);
        const save = await newUser.save();

        const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;

        console.log('Verification URL:', verifyEmailUrl);

        const verifyEmail = await sendEmail({
            sendto: email,
            subject: 'Verify email from EASYBUY',
            html: verifyEmailTemplate({
                name,
                url: verifyEmailUrl
            })
        });

        console.log('Email sent successfully:', verifyEmail);

        return response.json({
            message: 'User registered successfully, please verify your email !',
            error: false,
            success: true,
            data: save,
        });

    } catch (error) {
        console.error('Error in registerUserController:', error);
        console.log('Error in registerUserController:', error);
        response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

// verify user controller
export async function verifyUserController(request, response) {
    try {
        const { code } = request.body;

        const user = await UserModel.findOne({ _id: code, });

        if (!user) {
            return response.status(400).json({
                message: 'invalid verification code',
                error: true,
                success: false,
            });
        }

        const updatedUser = await UserModel.updateOne({ _id: code }, { verify_email: true });

        return response.json({
            message: 'Email verified successfully',
            error: false,
            success: true,

        })


    } catch (error) {
        console.error('Error in verifyUserController:', error);
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

// LOGIN CONTROLLER
export async function loginController(request, response) {

    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).json({
                message: 'Email and password are required',
                error: true,
                success: false,
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: 'User not registered',
                error: true,
                success: false,
            });
        }

        if (user.status !== 'active') {
            return response.status(400).json({
                message: 'User account is not active',
                error: true,
                success: false,
            })

        }

        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return response.status(400).json({
                message: 'Invalid password',
                error: true,
                success: false,
            });
        }

        const accessToken = await generatedAccessToken(user._id);
        const refreshToken = await generatedRefreshToken(user._id);

        const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
            refresh_token: refreshToken,
            last_login_date: new Date(),
        })

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'lax' is better for localhost http
        };

        response.cookie('accessToken', accessToken, cookieOptions)
        response.cookie('refreshToken', refreshToken, cookieOptions)

        return response.json({
            message: 'Login successful',
            error: false,
            success: true,
            data: {
                accessToken,
                refreshToken,
            },
        });

    } catch (error) {
        console.error('Error in loginController:', error);
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

// LOGOUT CONTROLLER
export async function logoutController(request, response) {
    try {

        const Userid = request.Userid;

        if (!Userid) {
            return response.status(400).json({
                message: 'User ID is required',
                error: true,
                success: false,
            });
        }

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        };

        response.clearCookie('accessToken', cookieOptions);
        response.clearCookie('refreshToken', cookieOptions);


        const removeRefreshToken = await UserModel.findByIdAndUpdate(Userid, { refresh_token: "" });

        if (!removeRefreshToken) {
            return response.status(400).json({
                message: 'Failed to clear refresh token',
                error: true,
                success: false,
            });
        }

        return response.json({
            message: 'Logout successful',
            error: false,
            success: true,
        });

    } catch (error) {
        console.error('Error in logoutController:', error);
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

// Upload user avatar controller
export async function uploadUserAvatarController(request, response) {
    try {
        const Userid = request.Userid; // coming from auth middleware
        const image = request.file;    // coming from multer middleware

        if (!Userid) {
            return response.status(400).json({
                message: "User ID not found",
                error: true,
                success: false,
            });
        }

        if (!image) {
            return response.status(400).json({
                message: "No image file provided",
                error: true,
                success: false,
            });
        }

        // Upload image to Cloudinary
        const upload = await uploadImageCloudinary(image);

        if (!upload || !upload.url) {
            return response.status(500).json({
                message: "Image upload failed",
                error: true,
                success: false,
            });
        }

        // Update user avatar in DB and return updated doc
        const updateUser = await UserModel.findByIdAndUpdate(
            Userid,
            { avatar: upload.url },
            { new: true } // ensures we get updated doc
        );

        if (!updateUser) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

        return response.json({
            message: "Image uploaded successfully",
            success: true,
            error: false,
            data: {
                _id: updateUser._id,
                avatar: updateUser.avatar,
            },
        });

    } catch (error) {
        console.log("Error in uploadUserAvatarController:", error);
        return response.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false,
        });
    }
}



// update user details controller

export async function updateUserDetailsController(request, response) {
    try {
        const Userid = request.Userid; // coming from auth middleware
        const { name, email, mobile, password } = request.body;

        const updateFields = {};

        if (name) updateFields.name = name;
        if (email) {
            const existingUser = await UserModel.findOne({ email });
            if (existingUser && existingUser._id.toString() !== Userid) {
                return response.status(400).json({
                    message: "Email already in use",
                    error: true,
                    success: false
                });
            }
            updateFields.email = email;
        }
        if (mobile) updateFields.mobile = mobile;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateFields.password = hashedPassword;
        }

        // 🔹 Use findByIdAndUpdate to get updated document
        const updatedUser = await UserModel.findByIdAndUpdate(
            Userid,
            { $set: updateFields },
            { new: true, select: "-password" } // exclude password from response
        );

        if (!updatedUser) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

        return response.json({
            message: "User details updated successfully",
            error: false,
            success: true,
            data: updatedUser,
        });

    } catch (error) {
        console.error("Error in updateUserDetailsController:", error);
        return response.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false,
        });
    }
}

// forgot password not login controller
export async function forgotPasswordController(request, response) {
    try {
        const { email } = request.body;

        if (!email) {
            return response.status(400).json({
                message: 'Email is required',
                error: true,
                success: false,
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: 'User not registered',
                error: true,
                success: false,
            });
        }

        const otp = generatedOtp()
        const expireTime = new Date(Date.now() + 60 * 60 * 1000) // 1 hour 

        const update = await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expiry: expireTime,
        })

        await sendEmail({
            sendto: email,
            subject: 'Reset(Forgot) Password OTP from EASYBUY',
            html: forgotPasswordTemplet({
                name: user.name,
                otp: otp,
            })
        })

        return response.json({
            message: 'please, check your email for the OTP',
            error: false,
            success: true,
        });

    } catch (error) {
        console.error('Error in forgotPasswordController:', error);
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

// verify forgot password otp controller
export async function verifyForgotPasswordOtpController(request, response) {
    try {

        const { email, otp } = request.body;

        if (!email || !otp) {
            return response.status(400).json({
                message: 'Email and OTP are required',
                error: true,
                success: false,
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: 'User not registered',
                error: true,
                success: false,
            });
        }

        const currentTime = new Date();

        if (user.forgot_password_expiry < currentTime) {
            return response.status(400).json({
                message: 'otp expired, please request a new one',
                error: true,
                success: false,
            });
        }

        if (user.forgot_password_otp !== otp) {
            return response.status(400).json({
                message: 'Invalid OTP',
                error: true,
                success: false,
            });
        }

        // if otp is not expired
        //otp === user.forgot_password_otp

        const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
            forgot_password_otp: null,
            forgot_password_expiry: null,
        });

        return response.json({
            message: 'OTP verified successfully',
            error: false,
            success: true,
        })
    }

    catch (error) {
        console.error('Error in verifyForgotPasswordOtpController:', error);
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

// reset password controller
export async function resetPasswordController(request, response) {
    try {
        const { email, newPassword, confirmPassword } = request.body;

        if (!email || !newPassword || !confirmPassword) {
            return response.status(400).json({
                message: 'Email, new_password and confirm_password are required',
                error: true,
                success: false,
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: 'User not registered',
                error: true,
                success: false,
            });
        }


        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                message: 'New password and confirm password do not match',
                error: true,
                success: false,
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const update = await UserModel.findOneAndUpdate(user._id, {
            password: hashedPassword,
        })

        return response.json({
            message: 'Password reset successfully',
            error: false,
            success: true,
        });

    }
    catch (error) {
        console.error('Error in resetPasswordController:', error);
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

//refresh token controller
export async function refreshTokenController(request, response) {
    try {
        const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split(' ')[1];

        if (!refreshToken) {
            return response.status(401).json({
                message: 'Refresh token is missing',
                error: true,
                success: false,
            });
        }

        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)

        if (!verifyToken) {
            return response.status(401).json({
                message: 'Invalid refresh token',
                error: true,
                success: false,
            });
        }

        console.log('Decoded refresh token:', verifyToken);

        const userId = verifyToken?.Id;

        const newaccessToken = await generatedAccessToken();

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        };

        response.cookie('accessToken', newaccessToken, cookieOptions);
        return response.json({
            message: 'New access token generated successfully',
            error: false,
            success: true,
            data: {
                accessToken: newaccessToken,
            },
        })

    } catch (error) {
        console.error('Error in refreshTokenController:', error);
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

// get login user details controller
export async function getLoginUserDetailsController(request, response) {
    try {
        const Userid = request.Userid; // coming from auth middleware

        if (!Userid) {
            return response.status(400).json({
                message: 'User ID is required',
                error: true,
                success: false,
            });
        }

        const user = await UserModel.findById(Userid)
            .select('-password -refresh_token');

        if (!user) {
            return response.status(404).json({
                message: 'User not found',
                error: true,
                success: false,
            });
        }

        return response.json({
            message: 'User details fetched successfully',
            error: false,
            success: true,
            data: user,
        });

    } catch (error) {
        console.error('Error in getLoginUserDetailsController:', error);
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}


