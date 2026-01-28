import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";

import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Otpverification from "../pages/Otpverification";
import ResetPassword from "../pages/ResetPassword";
import UserMenuMobile from "../pages/UserMenuMobile";

import Profile from "../pages/Profile";
import Address from "../pages/Address";

import Login from "../pages/Login";
import CategoryPage from "../pages/CategoryPage";
import SubCategoryPage from "../pages/SubCategoryPage";
import UploadProduct from "../pages/UploadProduct";
import ProductAdmin from "../pages/ProductAdmin";
// import AdminPermision from "../components/RouteProtection/AdminPermision";
import MyOrders from "../pages/MyOrders";
import OrderDetail from "../pages/OrderDetail";
import ProductListPage from "../pages/ProductListPage";
import ProductDisplayPage from "../pages/ProductDisplayPage";
import CartMobile from "../pages/CartMobile";
import CheckoutPage from "../pages/CheckoutPage";
import Success from "../pages/Success";

import Cancel from "../pages/Cancel";
import Dashboard from "../layouts/Dashboard";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Faq from "../pages/Faq";
import Terms from "../pages/Terms";

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
                element: <ForgotPassword />
            },
            {
                path: "verification-otp",
                element: <Otpverification />
            },
            {
                path: "reset-password",
                element: <ResetPassword />
            },
            {
                path: "about",
                element: <About />
            },
            {
                path: "contact",
                element: <Contact />
            },
            {
                path: "faq",
                element: <Faq />
            },
            {
                path: "terms",
                element: <Terms />
            },
            {
                path: "user",
                element: <UserMenuMobile />
            },
            {
                path: "dashboard",
                element: <Dashboard />,
                children: [
                    {
                        path: "profile",
                        element: <Profile />
                    },
                    {
                        path: "address",
                        element: <Address />
                    },
                    {
                        path: "myorders",
                        element: <MyOrders />
                    },
                    {
                        path: "order-detail/:orderId",
                        element: <OrderDetail />
                    },
                    // {
                    //     path: 'category',
                    //     element: <AdminPermision><CategoryPage /></AdminPermision>
                    // },
                    // {
                    //     path: "subcategory",
                    //     element: <AdminPermision><SubCategoryPage /></AdminPermision>
                    // },
                    // {
                    //     path: 'upload-product',
                    //     element: <AdminPermision><UploadProduct /></AdminPermision>
                    // },
                    // {
                    //     path: 'product',
                    //     element: <AdminPermision><ProductAdmin /></AdminPermision>
                    // }

                    {
                        path: 'category',
                        element: <CategoryPage />
                    },
                    {
                        path: "subcategory",
                        element: <SubCategoryPage />
                    },
                    {
                        path: 'upload-product',
                        element: <UploadProduct />
                    },
                    {
                        path: 'product',
                        element: <ProductAdmin />
                    }
                ]
            },
            {
                path: ":category",
                children: [
                    {
                        path: ":subCategory",
                        element: <ProductListPage />
                    }
                ]
            },
            {
                path: "product/:product",
                element: <ProductDisplayPage />
            },
            {
                path: 'cart',
                element: <CartMobile />
            },
            {
                path: "checkout",
                element: <CheckoutPage />
            },
            {
                path: "success",
                element: <Success />
            },
            {
                path: 'cancel',
                element: <Cancel />
            }


        ]
    }
])

export default router;