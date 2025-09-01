

import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import Search from './Search'
import { FaUserCircle } from "react-icons/fa";
import useMobile from '../hooks/useMobile';
import { FaShoppingCart, FaCaretDown, FaCaretUp } from "react-icons/fa";
import { useSelector } from 'react-redux';
import UserMenu from './userMenu';

function Header({ showSearch }) {
  const isMobile = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";

  const user = useSelector((state) => state?.user);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const navigate = useNavigate();

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

  // 👇 Handle auto-open/close Account menu on resize
  // useEffect(() => {
  //   if (!isMobile && user?._id) {
  //     // desktop
  //     // setOpenUserMenu(true);
  //   } else {
  //     // mobile
  //     setOpenUserMenu(false);
  //   }
  // }, [isMobile, user?._id]);

  return (
    <header className="h-33 lg:h-20 lg:shadow-md sticky top-0 flex justify-center flex-col items-center bg-white z-50">
      {
        !(isMobile && isSearchPage) && (
          <div className='container mx-auto flex items-center pt-0 lg:pt-5 justify-between p-4'>
            {/* Logo */}
            <div className='h-full ml-7'>
              <Link to={"/"} className='h-full flex items-center justify-center'>
                <img src={logo} width={150} alt="logo" className='hidden lg:block' />
                <img src={logo} width={120} alt="logo" className='lg:hidden' />
              </Link>
            </div>

            {/* search bar */}
            <div className='hidden lg:block'>
              {showSearch && <Search />}
            </div>

            {/* login and my cart */}
            <div>
              {/* usericon display in mobile version */}
              <button className='text-neutral-500 lg:hidden mr-5' onClick={handleMobileUser}>
                <FaUserCircle size={30} />
              </button>

              {/* desktop version */}
              <div className='hidden lg:flex items-center gap-8'>
                {
                  user?._id ? (
                    <div className='relative'>
                      <div
                        className='flex items-center cursor-pointer gap-2 font-semibold text-gray-700 hover:text-gray-900'
                        onClick={() => setOpenUserMenu(!openUserMenu)}
                      >
                        <p>Account</p>
                        {openUserMenu ? (
                          <FaCaretUp className='mb-1 size-5' />
                        ) : (
                          <FaCaretDown className='mb-1 size-5' />
                        )}
                      </div>

                      {/* User Menu */}
                      {openUserMenu && (
                        <div className='absolute top-15 right-0 shadow-lg rounded-md w-2xs'>
                          <UserMenu close={handleCloseUserMenu} />
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link className='font-semibold text-gray-700 hover:text-black' to="/login">Login</Link>
                  )
                }

                <button className='flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-md'>
                  <div className='text-white flex items-center animate-bounce mt-2.5'>
                    <FaShoppingCart size={30} />
                  </div>
                  <div className='text-white text-sm font-semibold'>
                    <p>My Cart</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Mobile search bar */}
      <div className='container mx-auto px-10 lg:hidden'>
        <Search />
      </div>
    </header>
  )
}

export default Header

