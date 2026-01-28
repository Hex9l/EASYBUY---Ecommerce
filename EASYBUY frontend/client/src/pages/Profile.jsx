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
        const fetchedDetails = await fetchUserDetails();
        dispatch(setUserDetails(fetchedDetails));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-full'>
      {/* Header */}
      <div className='sticky top-24 lg:top-20 z-10 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 p-4 px-6 mb-8 rounded-2xl flex items-center justify-between'>
        <div>
          <h1 className='font-bold text-xl lg:text-2xl text-gray-800'>My Profile</h1>
          <p className='text-xs lg:text-sm text-gray-500 mt-1'>Update your personal information</p>
        </div>
      </div>

      <div className='max-w-2xl bg-white p-6 lg:p-8 rounded-3xl shadow-sm border border-gray-100'>
        {/* Avatar Section */}
        <div className='flex flex-col items-center mb-8'>
          <div className='relative group'>
            <div className='w-24 h-24 lg:w-32 lg:h-32 bg-gray-100 flex items-center justify-center rounded-full overflow-hidden border-4 border-white shadow-xl'>
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <FaUserCircle size={100} className='text-gray-300' />
              )}
            </div>
            <button
              onClick={() => setOpenProfilavatrEdit(true)}
              className='absolute bottom-1 right-1 bg-green-600 p-2.5 rounded-full text-white shadow-lg hover:bg-green-700 transition-all active:scale-95'
            >
              <MdEdit size={18} />
            </button>
          </div>
        </div>

        {openProfilavatrEdit && (
          <UserProfileAvatarEdit close={() => setOpenProfilavatrEdit(false)} />
        )}

        {/* Profile Form */}
        <form className='grid gap-6' onSubmit={handleSubmit}>
          <div className='grid gap-1.5'>
            <label htmlFor='name' className='text-sm font-bold text-gray-700 ml-1'>Full Name</label>
            <input
              type="text"
              id='name'
              value={userData.name}
              placeholder='Enter your name'
              className='h-12 border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500 focus:outline-none rounded-xl px-4 transition-all'
              onChange={handleOnChange}
              name='name'
              required
            />
          </div>

          <div className='grid gap-1.5'>
            <label htmlFor='email' className='text-sm font-bold text-gray-700 ml-1'>Email Address</label>
            <input
              type="email"
              id='email'
              value={userData.email}
              placeholder='Enter your email'
              className='h-12 border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500 focus:outline-none rounded-xl px-4 transition-all'
              onChange={handleOnChange}
              name='email'
              required
            />
          </div>

          <div className='grid gap-1.5'>
            <label htmlFor='mobile' className='text-sm font-bold text-gray-700 ml-1'>Mobile Number</label>
            <input
              type="text"
              id='mobile'
              value={userData.mobile}
              placeholder='Enter your mobile number'
              className='h-12 border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500 focus:outline-none rounded-xl px-4 transition-all'
              onChange={handleOnChange}
              name='mobile'
              required
            />
          </div>

          <button
            disabled={loading}
            className='bg-[#00b050] hover:bg-[#009040] text-white py-3.5 mt-4 w-full md:w-3/4 mx-auto rounded-2xl shadow-lg shadow-green-900/10 font-bold transition-all active:scale-[0.98] flex items-center justify-center'
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
