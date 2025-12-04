
import Axios from "axios";


export const baseURL = "http://localhost:8000";


Axios.defaults.baseURL = baseURL;
Axios.defaults.withCredentials = true;

export const SummaryApi = {

    register: {
        url: '/api/user/register',
        method: "POST",
    },
    login: {
        url: '/api/user/login',
        method: "POST",
    },
    forgotPassword: {
        url: '/api/user/forgot-password',
        method: "PUT",
    },
    verify_forgot_password_otp: {
        url: '/api/user/verify-forgot-password-otp',
        method: "PUT",
    },
    resetPassword: {
        url: '/api/user/reset-password',
        method: "PUT",
    },
    refreshToken: {
        url: '/api/user/refresh-token',
        method: "POST",
    },
    userDetails: {
        url: '/api/user/user-details',
        method: "GET",
    },
    logOut: {
        url: '/api/user/logout',
        method: "GET",
    },
    uploadAvatar: {
        url: '/api/user/upload-avatar',
        method: "PUT",
    },
    updateUserDetails: {
        url: '/api/user/update-user',
        method: "PUT",
    },
    addCategory: {
        url: '/api/category/add-category',
        method: "POST",     
    },
    uploadimage: {
        url: '/api/upload/upload-image',    
        method: "POST",
    },
    getCategory: {
        url: '/api/category/get-category',
        method: "GET",  
    },

}

