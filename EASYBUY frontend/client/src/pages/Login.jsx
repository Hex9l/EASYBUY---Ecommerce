import React, { useState, useEffect } from 'react';
import { FaEyeSlash, FaRegEye } from "react-icons/fa6";
import { useNavigate, Link } from 'react-router-dom';
import Axios from '../utils/Axios';
import { motion, AnimatePresence } from 'framer-motion';

import { toast } from 'react-toastify';
import { SummaryApi } from '../common/SummaryApi';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import { syncGuestCart } from '../utils/syncGuestCart';
import { useGlobalContext } from '../provider/GlobalProvider';

const Login = () => {
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItem = useSelector(state => state.cartItem.cart || []);
  const { fetchCartItem } = useGlobalContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  const validValue = Object.values(data).every(value => value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.login,
        data: data
      });

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);

        const userDetails = await fetchUserDetails();
        dispatch(setUserDetails(userDetails.data))

        // Sync guest cart to backend
        const syncResult = await syncGuestCart(cartItem);
        if (syncResult.syncedCount > 0) {
          console.log(`Synced ${syncResult.syncedCount} guest cart items`);
        }

        // Fetch updated cart from backend
        if (fetchCartItem) {
          await fetchCartItem();
        }

        setData({
          email: '',
          password: '',
        })
        navigate("/");

      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <section className="min-h-[90vh] w-full flex items-center justify-center px-4 relative overflow-hidden bg-slate-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-100 dark:bg-green-900/20 rounded-full blur-3xl opacity-50 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 animate-pulse delay-700" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/40 dark:border-gray-700 p-4 md:p-8 rounded-[2.5rem] shadow-2xl shadow-green-900/10 dark:shadow-black/30">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold text-gray-800 dark:text-white"
            >
              Login in <span className="text-green-600">EASYBUY</span>
            </motion.h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Welcome back! Please enter your details.</p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full px-5 py-3.5 bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all duration-300 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-5 py-3.5 bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all duration-300 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors p-1"
                >
                  {showPassword ? <FaRegEye size={20} /> : <FaEyeSlash size={20} />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={!validValue}
              className={`
                w-full py-4 rounded-2xl font-bold text-white shadow-lg shadow-green-600/20 
                transition-all duration-300 flex items-center justify-center gap-2
                ${validValue
                  ? "bg-gradient-to-r from-green-600 to-green-500 hover:shadow-green-600/40"
                  : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"}
              `}
            >
              Sign In
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link to="/Register" className="text-green-600 font-bold hover:underline transition-all">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Login;

