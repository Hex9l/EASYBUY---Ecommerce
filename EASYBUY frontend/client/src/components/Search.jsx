import React, { useEffect, useState, useRef } from 'react'
import { FaSearch } from "react-icons/fa";
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { MdArrowBackIos } from "react-icons/md";
import useMobile from '../hooks/useMobile';
import Axios from '../utils/Axios';
import { SummaryApi } from '../common/SummaryApi';


const Search = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isSearchPage, setIsSearchPage] = useState(false);
  const isMobile = useMobile();
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);



  useEffect(() => {
    const issearch = location.pathname === "/search";
    setIsSearchPage(issearch);

    // If on search page, load query from URL
    if (issearch) {
      const query = searchParams.get('q') || '';
      setSearchInput(query);
    }
  }, [location, searchParams]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions with debouncing
  const fetchSuggestions = async (query) => {
    if (!query || query.trim().length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.searchSuggestions,
        data: { search: query.trim() }
      });

      if (response.data.success) {
        setSuggestions(response.data.data);
        setShowSuggestions(response.data.data.length > 0);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer for debouncing (300ms delay)
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    const trimmedSearch = searchInput.trim();
    if (trimmedSearch) {
      navigate(`/search?q=${encodeURIComponent(trimmedSearch)}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (productName) => {
    setSearchInput(productName);
    navigate(`/search?q=${encodeURIComponent(productName)}`);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    }
  };

  const redirectToSearchPage = () => {
    navigate("/search");
  }



  return (
    <div ref={searchRef} className='relative w-full bg-white min-w-[300px] lg:min-w-[320px] xl:min-w-[420px] lg:h-12 h-10 rounded-xl flex items-center text-neutral-500 border border-gray-200 shadow-sm focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-all duration-300'>

      <div>

        {
          (isSearchPage && isMobile) ? (
            <Link to={"/"} className='flex items-center  h-full p-4'>
              <MdArrowBackIos className='text-2xl text-neutral-500 bg-gray-100 rounded-full shadow-md w-9 h-5 pl-2' />
            </Link>
          ) : (<button className=' flex items-center  h-full p-4 ' onClick={isSearchPage ? handleSearchSubmit : undefined}>
            <FaSearch className='text-2xl text-neutral-500 w-4  ' />
          </button>
          )
        }

      </div>



      <div className=' flex items-center flex-1  '>
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
                value={searchInput}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                onFocus={() => searchInput && fetchSuggestions(searchInput)}
                className='bg-transparent w-full h-full outline-none'
                autoFocus
              />
            </div>

          )
        }
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && isSearchPage && (
        <div className='absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-[80vh] overflow-y-auto z-50 overflow-hidden'>
          <div className='py-2'>
            <p className='px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider'>
              Suggested Products
            </p>
            {suggestions.map((product, index) => {
              // Highlight matching text manually
              const parts = product.name.split(new RegExp(`(${searchInput})`, 'gi'));

              return (
                <div
                  key={product._id || index}
                  onClick={() => handleSuggestionClick(product.name)}
                  className='flex items-center gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors group'
                >
                  <div className='w-12 h-12 bg-gray-50 rounded-lg p-1 overflow-hidden shrink-0 border border-gray-100'>
                    {product.image && product.image[0] ? (
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        className='w-full h-full object-contain mix-blend-multiply'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center text-gray-300'>
                        <FaSearch />
                      </div>
                    )}
                  </div>

                  <div className='flex-1 min-w-0'>
                    <p className='text-sm text-gray-800 font-medium truncate group-hover:text-[#00b050] transition-colors'>
                      {parts.map((part, i) =>
                        part.toLowerCase() === searchInput.toLowerCase() ? (
                          <span key={i} className='font-bold text-black'>{part}</span>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )}
                    </p>
                    <p className='text-xs text-gray-400 truncate mt-0.5'>
                      In Categories
                    </p>
                  </div>

                  <div className='shrink-0 -rotate-45 text-gray-300 group-hover:text-[#00b050] transition-colors'>
                    <MdArrowBackIos className='rotate-180' />
                  </div>
                </div>
              );
            })}
          </div>

          <div
            onClick={handleSearchSubmit}
            className='bg-gray-50 border-t border-gray-100 p-3 text-center cursor-pointer hover:bg-gray-100 transition-colors'
          >
            <p className='text-sm text-[#00b050] font-semibold'>
              View all results for "{searchInput}"
            </p>
          </div>
        </div>
      )}


    </div>
  )
}

export default Search
