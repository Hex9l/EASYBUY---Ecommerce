

import React, { useState, useEffect, useRef } from 'react';
import { FaEyeSlash, FaRegEye } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Axios from '../utils/Axios';
import {SummaryApi} from '../common/SummaryApi';
import { toast } from 'react-toastify';

const Otpverification = () => {
  const [data, setData] = useState(["", "", "", "", "", ""]);
  const [showForm] = useState(true);
  const navigate = useNavigate();
  const inputRef = useRef([]);
  const location = useLocation();

  useEffect(() => {
    if (showForm) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => document.body.classList.remove("overflow-hidden");

  }, [showForm]);


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
        navigate("/reset-password",{
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
            OTP Verification
          </p>

          {/* Form */}
          <form className="grid gap-2 md:gap-4" onSubmit={handleSubmit}>


            {/* otp */}
            <div>
              <label htmlFor="otp" className="block font-medium text-xs md:text-base mb-1">Enter Your OTP :</label>
              <div className='grid grid-cols-6 gap-1 sm:gap-3 mt-4'>
                {
                  data.map((item, index) => {
                    return (
                      <input
                        key={index}
                        type="text"
                        id={`otp-${index}`}
                        ref={(ref) => {
                          inputRef.current[index] = ref;
                          return ref;
                        }}
                        className="
          w-full 
          p-2 md:p-3
          text-xs md:text-3xl text-center
          border border-gray-300 
          rounded-2xl md:rounded-3xl 
          shadow-md 
          focus:outline-none 
          bg-gray-100 focus:bg-white 
          placeholder-gray-400
        "
                        name={`otp-${index}`}
                        maxLength="1"
                        value={item}
                        onChange={(e) => {
                          const newData = [...data];
                          newData[index] = e.target.value;
                          setData(newData);

                          if (e.target.value) {
                            inputRef.current[index + 1]?.focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" && !e.target.value) {
                            inputRef.current[index - 1]?.focus();
                          }
                        }}
                      />
                    );
                  })
                }
              </div>

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
              Verify OTP
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

export default Otpverification; 
