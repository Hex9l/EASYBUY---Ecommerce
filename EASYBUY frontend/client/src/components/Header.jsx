

import React, { useEffect, useState, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/easybuy-logo.png'
import Search from './Search'
import { FaUserCircle } from "react-icons/fa";
import useMobile from '../hooks/useMobile';
import { FaShoppingCart, FaCaretDown, FaCaretUp } from "react-icons/fa";
import { useSelector } from 'react-redux';
import UserMenu from './userMenu';
import LocationPicker from './LocationPicker';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import ThemeToggle from './ThemeToggle';

function Header({ showSearch }) {
  const isMobile = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";

  const user = useSelector((state) => state?.user);
  const addressList = useSelector((state) => state?.addresses?.addressList);
  const selectedAddress = useSelector((state) => state?.addresses?.selectedAddress);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [openCartSection, setOpenCartSection] = useState(false);
  const { totalQty, totalPrice } = useGlobalContext();
  const navigate = useNavigate();

  // Memoize the address to prevent unnecessary re-renders
  const displayAddress = useMemo(() => {
    if (selectedAddress) return selectedAddress;

    if (addressList && addressList.length > 0) {
      const headerAddress = addressList[0];
      return `${headerAddress.city}, ${headerAddress.state}`;
    }
    return "Mumbai, India";
  }, [addressList, selectedAddress]);

  const handleCloseUserMenu = () => {
    setOpenUserMenu(false);
  };

  const handleMobileUser = () => {
    if (!user._id) {
      navigate('/login');
      return;
    }
    navigate('/user');
  };

  return (
    <header className="h-auto lg:h-24 shadow-sm lg:shadow-md sticky top-0 flex justify-center flex-col items-center bg-white dark:bg-gray-900 z-50 transition-all duration-300 border-b border-transparent dark:border-gray-800">
      {
        !(isMobile && isSearchPage) && (
          <div className='container flex items-center justify-between py-3 lg:py-2 gap-4'>
            {/* Logo */}
            <div className='flex items-center gap-4 md:gap-6 lg:gap-10 shrink-0'>
              <div className='flex items-center justify-start shrink-0'>
                <Link to={"/"} className='flex items-center justify-center p-1'>
                  <img src={logo} width={200} height={70} alt="EasyBuy" className='hidden lg:block object-contain transition-transform duration-300 hover:scale-105' />
                  <img src={logo} width={140} height={40} alt="EasyBuy" className='lg:hidden object-contain max-w-[140px]' />
                </Link>
              </div>

              {/* Delivery Info - Desktop */}
              <div className='hidden lg:flex flex-col gap-0.5 leading-tight shrink-0'>
                <p className='font-bold text-lg text-gray-900 dark:text-gray-100'>Delivery in 8 minutes</p>
                <div
                  className='flex items-center gap-1 cursor-pointer hover:text-gray-700 transition-colors'
                  onClick={() => setOpenAddressModal(true)} // Open Modal
                >
                  <span className='text-sm text-gray-600 dark:text-gray-400 truncate max-w-[150px]'>{displayAddress}</span>
                  <FaCaretDown className='text-gray-600 dark:text-gray-400 size-3' />
                </div>
              </div>
            </div>

            {/* search bar */}
            <div className='hidden lg:block flex-1 max-w-3xl'>
              {showSearch && <Search />}
            </div>

            {/* login and my cart */}
            <div className='flex items-center gap-2 md:gap-6'>

              {/* Theme Toggle Mobile/Desktop */}
              <div className=''>
                <ThemeToggle />
              </div>

              {/* Mobile User Icon */}
              <button className='text-neutral-500 dark:text-gray-300 lg:hidden' onClick={handleMobileUser}>
                <FaUserCircle size={26} />
              </button>

              {/* Mobile Cart Icon */}
              <button
                onClick={() => setOpenCartSection(true)}
                className='text-green-600 dark:text-green-500 lg:hidden relative'
              >
                <FaShoppingCart size={26} />
                {totalQty > 0 && (
                  <span className='absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-gray-800'>
                    {totalQty}
                  </span>
                )}
              </button>

              {/* Desktop Actions */}
              <div className='hidden lg:flex items-center gap-8'>
                {
                  user?._id ? (
                    <div className='relative'>
                      <div
                        className='flex items-center cursor-pointer gap-2 font-medium text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white'
                        onClick={() => setOpenUserMenu(!openUserMenu)}
                      >
                        <p>Account</p>
                        {openUserMenu ? (
                          <FaCaretUp className='mb-1 size-4' />
                        ) : (
                          <FaCaretDown className='mb-1 size-4' />
                        )}
                      </div>

                      {/* User Menu */}
                      {openUserMenu && (
                        <div className='absolute top-12 right-0 shadow-xl rounded-xl bg-white dark:bg-gray-800 w-60 border border-gray-100 dark:border-gray-700 p-2 z-50'>
                          <UserMenu close={handleCloseUserMenu} />
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link className='font-medium text-lg text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white' to="/login">Login</Link>
                  )
                }

                <button
                  onClick={() => setOpenCartSection(true)}
                  className='flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl shadow-sm transition-all active:scale-95'
                >
                  <div className='relative'>
                    <FaShoppingCart size={25} className='mt-1' />
                    {totalQty > 0 && (
                      <span className='absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-green-600'>
                        {totalQty}
                      </span>
                    )}
                  </div>
                  <div className='text-white font-bold text-base'>
                    {
                      totalQty > 0 ? (
                        <div className='flex flex-col items-start'>
                          <p className='text-xs font-semibold'>{totalQty} Items</p>
                          <p>{DisplayPriceInRupees(totalPrice)}</p>
                        </div>
                      ) : (
                        <p>My Cart</p>
                      )
                    }
                  </div>
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Mobile search bar */}
      <div className='container px-4 py-3 lg:hidden'>
        <Search />
      </div>

      {openAddressModal && <LocationPicker close={() => setOpenAddressModal(false)} />}
      {openCartSection && <DisplayCartItem close={() => setOpenCartSection(false)} />}
    </header>
  )
}

export default Header

