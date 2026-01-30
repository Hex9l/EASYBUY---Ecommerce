
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
        // Only clear auth tokens, preserve user preferences like selected address
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
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
    <div ref={menuRef} className={`grid items-center gap-2 p-4 ${dashboard ? "w-full" : "w-72"} bg-white dark:bg-gray-800 z-50 transition-colors`}>
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-gray-900 dark:text-gray-100 pb-2">My Account</span>
        <div onClick={handleClose} className="cursor-pointer">
          {closeIcon}
        </div>
      </div>

      <div className="font-semibold text-gray-700 dark:text-gray-200">
        <div className='flex items-center gap-2'>
          <span className="max-w-52 truncate">
            {user?.name || user?.mobile}
            {user.role === "ADMIN" && <span className="text-red-500 text-xs font-medium ml-1">(Admin)</span>}
          </span>
          <Link onClick={handleClose} to="/dashboard/profile" className="hover:text-yellow-800 dark:hover:text-yellow-500">
            <FiExternalLink />
          </Link>
        </div>

        <Divider className="border-gray-100 dark:border-gray-700 my-2" />
      </div>

      <div className="grid text-sm gap-2">

        {dashboard && user.role === "ADMIN" && (
          <>
            <Link to="/dashboard/category" onClick={handleClose} className="pl-2 font-semibold text-gray-700 dark:text-gray-100 hover:text-black dark:hover:text-white transition-colors">
              Category
            </Link>
            <Link to="/dashboard/subcategory" onClick={handleClose} className="pl-2 font-semibold text-gray-700 dark:text-gray-100 hover:text-black dark:hover:text-white transition-colors">
              Sub Category
            </Link>
            <Link to="/dashboard/upload-product" onClick={handleClose} className="pl-2 font-semibold text-gray-700 dark:text-gray-100 hover:text-black dark:hover:text-white transition-colors">
              Upload Product
            </Link>
            <Link to="/dashboard/product" onClick={handleClose} className="pl-2 font-semibold text-gray-700 dark:text-gray-100 hover:text-black dark:hover:text-white transition-colors">
              Product
            </Link>
            <Divider className="border-gray-100 dark:border-gray-700 my-2" />
          </>
        )}

        <Link to="/dashboard/myorders" onClick={handleClose} className="font-semibold text-gray-700 dark:text-gray-300 pl-2 hover:text-black dark:hover:text-white transition-colors">
          My Orders
        </Link>
        <Link to="/dashboard/address" onClick={handleClose} className="font-semibold text-gray-700 dark:text-gray-300 pl-2 hover:text-black dark:hover:text-white transition-colors">
          Save Address
        </Link>

        <button onClick={handleLogout} className="text-left pl-2 font-bold text-gray-700 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-400 transition-colors mt-2">
          Log Out
        </button>
      </div>
    </div>
  );
};


export default UserMenu;