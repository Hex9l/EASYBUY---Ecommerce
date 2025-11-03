
import { Router } from 'express';
import { forgotPasswordController, getLoginUserDetailsController, loginController, logoutController, refreshTokenController, registerUserController, resetPasswordController, updateUserDetailsController, uploadUserAvatarController, verifyForgotPasswordOtpController, verifyUserController } from '../controllers/user.controller.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';

const userRouter = Router();

userRouter.post('/register', registerUserController);
userRouter.post('/verify-email', verifyUserController);
userRouter.post('/login', loginController);
userRouter.get('/logout', auth, logoutController);
userRouter.put('/upload-avatar', auth, upload.single('avatar'), uploadUserAvatarController);
userRouter.put('/update-user', auth, updateUserDetailsController);
userRouter.put('/forgot-password', forgotPasswordController);
userRouter.put('/verify-forgot-password-otp', verifyForgotPasswordOtpController );
userRouter.put('/reset-password',resetPasswordController);
userRouter.post('/refresh-token', refreshTokenController);
userRouter.get('/user-details', auth,getLoginUserDetailsController )


export default userRouter;


