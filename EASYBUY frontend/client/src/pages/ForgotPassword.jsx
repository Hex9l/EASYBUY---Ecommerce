import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Axios from '../utils/Axios';
import { SummaryApi } from '../common/SummaryApi.js';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [data, setData] = useState({
    email: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  const validValue = Object.values(data).every(value => value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.forgotPassword,
        data: data
      });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/verification-otp", { state: data });
        setData({ email: '' });
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
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/40 dark:border-white/10 p-4 md:p-8 rounded-[2.5rem] shadow-2xl shadow-green-900/10 dark:shadow-green-900/30 transition-colors duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold text-gray-800 dark:text-gray-100"
            >
              Forgot Password
            </motion.h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Enter your email and we'll send you an OTP.</p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                className="w-full px-5 py-3.5 bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all duration-300 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
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
              Send OTP
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Remember your password?{" "}
              <Link to="/login" className="text-green-600 dark:text-green-400 font-bold hover:underline transition-all">
                Login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ForgotPassword;

