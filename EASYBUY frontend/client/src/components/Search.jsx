import React, { useEffect, useState } from 'react'
import { FaSearch } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { MdArrowBackIos } from "react-icons/md";
import useMobile from '../hooks/useMobile';


const Search = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false);
  const isMobile = useMobile();
  



  useEffect(() => {
    const issearch = location.pathname === "/search";
    setIsSearchPage(issearch);
  }, [location]);


  const redirectToSearchPage = () => {
    navigate("/search");
  }



  return (
    <div className='w-full bg-gray-100 min-w-[300px] lg:min-w-[420px] lg:h-12 h-9  rounded-lg flex items-center text-neutral-500 border border-gray-300  focus-within:border-gray-400 '>

      <div>

        {
          (isSearchPage && isMobile) ? (
            <Link to={"/"} className='flex items-center  h-full p-4'>
              <MdArrowBackIos className='text-2xl text-neutral-500 bg-gray-100 rounded-full shadow-md w-9 h-5 pl-2' />
            </Link>
          ) : (<button className=' flex items-center  h-full p-4 '>
            <FaSearch className='text-2xl text-neutral-500 w-4  ' />
          </button>
          )
        }

      </div>



      <div className=' flex items-center   '>
        {
          !isSearchPage ? (
            // not in search page
            <div onClick={redirectToSearchPage}>
              <TypeAnimation
                sequence={[
                  // Same substring at the start will only be typed out once, initially
                  'Search  " milk "',
                  1000, // wait 1s before replacing "Mice" with "Hamsters"
                  'Search  " eggs "',
                  1000,
                  'Search  " meat "',
                  1000,
                  'Search  " whey protein "',
                  1000
                ]}
                wrapper="span"
                speed={50}

                repeat={Infinity}
              />
            </div>
          ) : (
            // when i was in search page
            <div className='w-full h-full flex items-center justify-center '>
              <input
                type="text"
                placeholder='Search... any item'
                className='bg-trnsparent w-full h-full outline-none'
              />
            </div>

          )
        }
      </div>




    </div>
  )
}

export default Search
