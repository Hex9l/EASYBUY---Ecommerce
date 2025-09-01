import React, { useState, useEffect } from 'react';
import { FaEyeSlash, FaRegEye } from "react-icons/fa6";
import { useNavigate, Link } from 'react-router-dom';
import Axios from '../utils/Axios';
import {SummaryApi} from '../common/SummaryApi.js';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [data, setData] = useState({

    email: '',


  });

  const [showForm] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (showForm) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [showForm]);

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
        navigate("/verification-otp",
          { state: data }
        );
        setData({
          email: '',
        })

      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    showForm && (
      <section className="w-full flex items-center justify-center px-2 sm:px-4 mt-8 ">
        <div
          className="
      bg-gray-200 
      w-full 
      max-w-[300px] sm:max-w-md md:max-w-lg lg:max-w-xl
      p-3 sm:p-6 md:p-8
      rounded-3xl shadow-lg
    "
        >
          {/* Title */}
          <p className="text-center  md:text-2xl font-semibold mb-4 md:mb-6">
            Forgot Password
          </p>

          {/* Form */}
          <form className="grid gap-3 md:gap-4" onSubmit={handleSubmit}>


            {/* Email */}
            <div>
              <label htmlFor="email" className="block font-medium text-xs md:text-base mb-1">Email:</label>
              <input
                type="email"
                id="email"
                className="
            w-full 
            p-2 md:p-3 
            text-xs md:text-base
            border border-gray-300 
            rounded-2xl md:rounded-3xl 
            shadow-md 
            focus:outline-none 
            bg-gray-100 focus:bg-white 
            placeholder-gray-400
          "
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>



            {/* Register Button */}
            <button
              className={`
          ${validValue ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"} 
          w-full 
          text-white 
          text-xs md:text-base
          py-2 md:py-3
          mt-3 md:mt-4
          rounded-2xl md:rounded-3xl
          shadow-md 
          font-semibold 
          transition duration-200
        `}
            >
              Send OTP
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-[10px] md:text-sm mt-2 text-gray-600">
            Already have an account...?
            <Link to={"/login"} className="text-green-600 hover:underline font-bold"> Login</Link>
          </p>
        </div>
      </section>


    )
  );
};

export default ForgotPassword; 
