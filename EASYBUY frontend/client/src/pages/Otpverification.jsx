import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Axios from '../utils/Axios';
import { SummaryApi } from '../common/SummaryApi';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Otpverification = () => {
  const [data, setData] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate();
  const inputRef = useRef([]);
  const location = useLocation();

  useEffect(() => {
    if (!location.state?.email) {
      toast.error("No email provided for OTP verification.");
      navigate("/forgot-password");
      return;
    }
  }, [location.state?.email, navigate]);

  const validValue = data.every(value => value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.verify_forgot_password_otp,
        data: {
          otp: data.join(""),
          email: location.state?.email
        }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setData(["", "", "", "", "", ""]);
        navigate("/reset-password", {
          state: {
            data: response.data,
            email: location.state?.email
          }
        })
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
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-100 dark:bg-green-900/20 rounded-full blur-3xl opacity-50 animate-pulse delay-700" />

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
              Verify OTP
            </motion.h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              We've sent a 6-digit code to <br />
              <span className="font-semibold text-gray-700 dark:text-gray-300">{location.state?.email}</span>
            </p>
          </div>

          {/* Form */}
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="flex justify-between gap-1 sm:gap-2">
              {data.map((item, index) => (
                <motion.input
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  type="text"
                  id={`otp-${index}`}
                  ref={(ref) => {
                    inputRef.current[index] = ref;
                    return ref;
                  }}
                  maxLength="1"
                  value={item}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!/^\d*$/.test(value)) return;

                    const newData = [...data];
                    newData[index] = value.slice(-1);
                    setData(newData);

                    if (value && index < 5) {
                      inputRef.current[index + 1]?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !data[index] && index > 0) {
                      inputRef.current[index - 1]?.focus();
                    }
                  }}
                  className="w-10 h-12 sm:w-14 sm:h-16 text-xl sm:text-2xl font-bold text-center bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all duration-300 text-green-600 dark:text-green-400"
                />
              ))}
            </div>

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
              Verify OTP
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Didn't receive the code?{" "}
              <button
                onClick={() => navigate("/forgot-password")}
                className="text-green-600 dark:text-green-400 font-bold hover:underline transition-all"
              >
                Resend
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Otpverification;
