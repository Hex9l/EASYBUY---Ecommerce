import React, { useState, useEffect } from 'react';
import { FaEyeSlash, FaRegEye } from "react-icons/fa6";
import { useNavigate, Link } from 'react-router-dom';
import Axios from '../utils/Axios';

import { toast } from 'react-toastify';
import { SummaryApi } from '../common/SummaryApi';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const Login = () => {
  const [data, setData] = useState({
  
    email: '',
    password: '',
    
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showForm] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        ...SummaryApi.login,
        data : data
      });

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);
    
        const userDetails = await fetchUserDetails();
        dispatch(setUserDetails(userDetails.data))

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
    showForm && (
      <section className="w-full flex items-center justify-center px-2 sm:px-4 mt-8  ">
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
      Login in <span className="text-green-600">EASYBUY</span>
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

      {/* Password */}
      <div>
        <label htmlFor="password" className="block font-medium text-xs md:text-base mb-1">Password:</label>
        <div className="flex items-center gap-2">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
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
            name="password"
            value={data.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="cursor-pointer p-2 md:p-3 bg-gray-100 rounded-2xl md:rounded-3xl border border-gray-300 shadow-md"
          >
            {showPassword ? <FaRegEye /> : <FaEyeSlash />}
          </div>
        </div>
        <Link to={"/forgot-password"} className=' block text-right mt-1 mr-13 text-gray-500 text-xs sm:text-sm sm:mr-20 hover:underline  '>Forgot password ?</Link>
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
        Login
      </button>
    </form>

    {/* Login Link */}
    <p className="text-center text-[10px] md:text-sm mt-2 text-gray-600">
      Don't have an account...?
      <Link to={"/Register"} className="text-green-600 hover:underline font-bold"> Register</Link>
    </p>
  </div>
</section>


    )
  );
};

export default Login;
