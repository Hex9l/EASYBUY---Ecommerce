
import { Link } from 'react-router-dom';
import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Divider from './Divider';
import Axios from '../utils/Axios';
import { SummaryApi } from '../common/SummaryApi';
import { logOut } from '../store/userSlice';
import { toast } from 'react-toastify';
import AxiosToastError from '../utils/AxiosToastError';
import { FiExternalLink } from "react-icons/fi";




const UserMenu = ({ close, closeIcon, dashboard = false }) => {
  const user = useSelector((state) => state?.user);
  const dispatch = useDispatch();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (close) close();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [close]);

  const handleLogout = async () => {
    try {
      const response = await Axios({ ...SummaryApi.logOut });
      if (response.data.success) {
        if (close) close();
        dispatch(logOut());
        localStorage.clear();
        toast.success(response.data.message);
        window.history.back();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleClose = () => {
    if (close) close();
  };

  return (
    <div ref={menuRef} className="grid items-center   gap-2   p-4 w-72 bg-white z-50">
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold">My Account</span>
        {closeIcon}
      </div>

      <div className=" font-semibold text-gray-700  ">
        <div className='flex items-center  gap-2'>
          <span className="max-w-52 truncate">{user.name || user.mobile}</span>
          <Link onClick={handleClose} to="/dashboard/profile" className="hover:text-yellow-800">
            <FiExternalLink />
          </Link>
        </div>

        <Divider />


      </div>



      <div className="grid text-sm gap-2">
   
        {dashboard && (
          <>
            <Link to="/dashboard/category" onClick={handleClose} className="pl-2 font-semibold text-gray-700 hover:text-black">
              Category
            </Link>
            <Link to="/dashboard/sub-category" onClick={handleClose} className="pl-2 font-semibold text-gray-700 hover:text-black">
              Sub Category
            </Link>
            <Link to="/dashboard/upload-product" onClick={handleClose} className="pl-2 font-semibold text-gray-700 hover:text-black">
              Upload Product
            </Link>
            <Link to="/dashboard/product" onClick={handleClose} className="pl-2 font-semibold text-gray-700 hover:text-black">
              Product
            </Link>

          </>
        )}

        <Link to="/dashboard/orders" onClick={handleClose} className="font-semibold text-gray-700 pl-2 hover:text-black">
          My order
        </Link>
        <Link to="/dashboard/address" onClick={handleClose} className="font-semibold text-gray-700 pl-2 hover:text-black">
          Save Address
        </Link>

        <button onClick={handleLogout} className="text-left pl-2 font-bold text-gray-700 hover:text-red-700">
          Log Out
        </button>
      </div>
    </div>
  );
};


export default UserMenu;