// src/App.jsx
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import './index.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import fetchUserDetails from "./utils/fetchUserDetails";
import { setUserDetails } from "./store/userSlice";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  // Normalize path to lowercase to avoid case sensitivity issues
  const currentPath = location.pathname.toLowerCase();

  // Paths where Footer and SearchBar should be hidden
  const authPages = [
    "/login",
    "/register",
    "/verification-otp",
    "/reset-password",
    "/forgot-password"
  ];

  const isAuthPage = authPages.includes(currentPath);

  // Fetch user details when the app loads
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

  return (
    <>
      {/* Pass showSearch prop to Header */}
      <Header showSearch={!isAuthPage} />

      {/* Page Content */}
      <main className="min-h-[80vh] ">
        <Outlet  />
      </main>

      {/* Footer (not shown on login/register pages) */}
      {!isAuthPage && <Footer />}

      {/* Toast Notifications */}
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={true}
        newestOnTop={false}
        rtl={false}
        pauseOnHover
        theme="colored"
        closeButton={false}
      />
    </>
  );
}

export default App;
