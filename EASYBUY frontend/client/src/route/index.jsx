import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";

import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Otpverification from "../pages/Otpverification";
import ResetPassword from "../pages/ResetPassword";
import UserMenuMobile from "../pages/UserMenuMobile";
import Dashboard from "../../layouts/Dashboard";
import Profile from "../pages/Profile";
import Address from "../pages/Address";
import MyOrder from "../pages/MyOrder";
import Login from "../pages/Login";
import CategoryPage from "../pages/CategoryPage";
import SubCategoryPage from "../pages/subCategoryPage";
import UploadProduct from "../pages/UploadProduct";
import Product from "../pages/Product";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: "search",
                element: <SearchPage />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "Register",
                element: <Register /> 
            },
            {
                path: "forgot-password",
                element: <ForgotPassword/>
            },
            {
                path: "verification-otp",
                element: <Otpverification/>
            },
            {
                path: "reset-password",
                element: <ResetPassword/>
            },
            {
                path: "user",
                element: <UserMenuMobile/>
            },
            {
                path: "dashboard",
                element: <Dashboard/>,
                children: [
                    {
                        path: "profile",
                        element: <Profile/>
                    },
                    {
                        path: "address",
                        element: <Address />
                    },
                    {
                        path: "orders",
                        element: <MyOrder />
                    },
                    {
                        path: "category",
                        element: <CategoryPage />
                    },
                    {
                        path: "sub-category",
                        element: <SubCategoryPage />
                    },
                    {
                        path: "upload-product",
                        element: <UploadProduct />
                    },
                    {
                        path: "product",
                        element: <Product />        
                    }
                ]
            },
           

        ]
    }
])

export default router;