import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaUserCircle } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit';
import { SummaryApi } from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';

const Profile = () => {
  const user = useSelector((state) => state.user)
  const [openProfilavatrEdit, setOpenProfilavatrEdit] = useState(false);
  const [userData, setUserData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Set user data when user changes
  useEffect(() => {
    setUserData({
      name: user?.name || "",
      email: user?.email || "",
      mobile: user?.mobile || "",
    });
  }, [user]);

  // Handle input change
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      // console.log("debug ",SummaryApi.updateUserDetails)
      const response = await Axios({
        ...SummaryApi.updateUserDetails,
        data: userData,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        const userData = await fetchUserDetails();
        dispatch(setUserDetails(userData));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=' '>
      {/* Avatar Section */}
      <div className='w-20 h-20 bg-red-300 flex  items-center justify-center rounded-full overflow-hidden drop-shadow-lg'>
        {user?.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          <FaUserCircle size={70} />
        )}
      </div>

      <button
        onClick={() => setOpenProfilavatrEdit(true)}  // ✅ fixed
        className='min-w-20 text-sm bg-green-600 h-8 gap-2 items-center justify-center flex flex-row rounded-full mt-4 hover:bg-green-700'
      >
        <MdEdit size={20} className='text-white ' />
      </button>

      {openProfilavatrEdit && (
        <UserProfileAvatarEdit close={() => setOpenProfilavatrEdit(false)} />
      )}

      {/* Profile Form */}
      <form className='grid gap-4' onSubmit={handleSubmit}>
        <div className='grid mt-7'>
          <label htmlFor='name' className='text-sm font-semibold'>Name</label>
          <input
            type="text"
            value={userData.name}
            placeholder='Enter your name'
            className='h-10 border border-gray-200 focus:outline-none hover:bg-gray-100 rounded-md px-3 mt-1'
            onChange={handleOnChange}
            name='name'
            required
          />
        </div>

        <div className='grid'>
          <label htmlFor='email' className='text-sm font-semibold'>Email</label>
          <input
            type="email"
            value={userData.email}
            placeholder='Enter your email'
            className='h-10 border border-gray-300 focus:outline-none hover:bg-gray-100 rounded-md px-3 mt-1'
            onChange={handleOnChange}
            name='email'
            required
          />
        </div>

        <div className='grid'>
          <label htmlFor='mobile' className='text-sm font-semibold'>Mobile</label> {/* ✅ fixed */}
          <input
            type="text"
            value={userData.mobile}
            placeholder='Enter your mobile number'
            className='h-10 border border-gray-300 focus:outline-none hover:bg-gray-100 rounded-md px-3 mt-1'
            onChange={handleOnChange}
            name='mobile'
            required
          />
        </div>

        <button

          className='bg-yellow-400 text-white text-xs md:text-base py-2 md:py-3 mt-2 mx-auto w-1/2 transition-colors duration-200 rounded-2xl md:rounded-3xl shadow-md font-semibold hover:bg-yellow-500' >
          {loading ? "Loading..." : "Update Profile"}

        </button>
      </form>
    </div>
  );
};

export default Profile;
