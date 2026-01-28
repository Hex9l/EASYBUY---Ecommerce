
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Header from "./components/Header";
import Footer from "./components/Footer";
import CartMobileLink from "./components/CartMobile";
import GlobalProvider from "./provider/GlobalProvider";

import "./index.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import fetchUserDetails from "./utils/fetchUserDetails";
import Axios from "./utils/Axios";

import { setUserDetails } from "./store/userSlice";
import {
  setAllCategory,
  setAllSubCategory,
  setLoadingCategory,
} from "./store/productSlice";
import { SummaryApi } from "./common/SummaryApi";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  // 🔹 Code-1 logic (UNCHANGED)
  const currentPath = location.pathname.toLowerCase();

  const authPages = [
    "/login",
    "/register",
    "/verification-otp",
    "/reset-password",
    "/forgot-password",
  ];

  const isAuthPage = authPages.includes(currentPath);

  // 🔹 Code-1 user fetch (UNCHANGED)
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await fetchUserDetails();
      if (userData) {
        dispatch(setUserDetails(userData));
      } else {
        console.warn("Failed to fetch user.");
      }
    };

    fetchUser();
  }, [dispatch]);

  // 🆕 Code-2: Fetch Category
  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true));

      const response = await Axios({
        ...SummaryApi.getCategory,
      });

      const { data } = response;
      if (data.success) {
        dispatch(
          setAllCategory(
            data.data.sort((a, b) => a.name.localeCompare(b.name))
          )
        );
      }
    } catch (error) {
      console.error("Category fetch error", error);
    } finally {
      dispatch(setLoadingCategory(false));
    }
  };

  // 🆕 Code-2: Fetch SubCategory
  const fetchSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getSubCategory,
      });

      const { data } = response;
      if (data.success) {
        dispatch(
          setAllSubCategory(
            data.data.sort((a, b) => a.name.localeCompare(b.name))
          )
        );
      }
    } catch (error) {
      console.error("SubCategory fetch error", error);
    }
  };

  // 🆕 Code-2 useEffect (ONLY for category data)
  useEffect(() => {
    fetchCategory();
    fetchSubCategory();
  }, []);

  return (
    <GlobalProvider>
      {/* 🔹 Code-1 Header logic (UNCHANGED) */}
      <Header showSearch={!isAuthPage} />

      <main className="min-h-[80vh]">
        <Outlet />
      </main>

      {/* 🔹 Code-1 Footer logic (UNCHANGED) */}
      {!isAuthPage && <Footer />}

      {/* 🆕 Code-2: Mobile Cart (hide on checkout) */}
      {location.pathname !== "/checkout" && <CartMobileLink />}

      {/* 🔹 Code-1 Toastify (UNCHANGED) */}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        pauseOnHover
        theme="colored"
        closeButton={false}
      />
    </GlobalProvider>
  );
}

export default App;
