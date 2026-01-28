import React, { useEffect, useState } from 'react'
import CardLoading from '../components/CardLoading'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import CardProduct from '../components/CardProduct'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useSearchParams, useNavigate } from 'react-router-dom'
import noDataImage from '../assets/nothing here yet.webp'
import { SummaryApi } from '../common/SummaryApi'

const SearchPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const loadingArrayCard = new Array(10).fill(null)
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [searchParams] = useSearchParams()
  const searchText = searchParams.get('q') || ''
  const [suggestion, setSuggestion] = useState(null)
  const [searchedFor, setSearchedFor] = useState('')
  const [isRandom, setIsRandom] = useState(false)
  const navigate = useNavigate()

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.searchProduct,
        data: {
          search: searchText,
          page: page,
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data)
        } else {
          setData((preve) => {
            return [
              ...preve,
              ...responseData.data
            ]
          })
        }
        setTotalPage(responseData.totalPage)
        setSuggestion(responseData.suggestion || null)
        setSearchedFor(responseData.searchedFor || searchText)
        setIsRandom(responseData.isRandom || false)
        console.log(responseData)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, searchText])

  const handleFetchMore = () => {
    if (totalPage > page) {
      setPage(preve => preve + 1)
    }
  }

  const handleSuggestionClick = () => {
    if (suggestion) {
      navigate(`/search?q=${encodeURIComponent(suggestion)}`)
      setSuggestion(null)
    }
  }

  return (
    <section className='bg-gray-50 min-h-screen font-sans'>
      <div className='container mx-auto p-4 max-w-7xl'>

        {/* Sticky Header with Glassmorphism */}
        <div className='sticky top-20 lg:top-24 z-20 bg-white/90 backdrop-blur-md px-6 py-4 rounded-xl shadow-sm border border-gray-100 mb-6 transition-all duration-300'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div>
              <h2 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
                {isRandom ? (
                  <>
                    <span className='w-1.5 h-6 bg-[#00b050] rounded-full inline-block'></span>
                    <span className='bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>Trending Products</span>
                  </>
                ) : (
                  <>Search Results</>
                )}
              </h2>
              <p className='text-sm text-gray-500 mt-1 pl-3.5'>
                {data.length} items found {isRandom && "for you to explore"}
              </p>
            </div>
          </div>

          {/* Did you mean suggestion - Modern Bubble Style */}
          {suggestion && (
            <div className='mt-4 inline-flex items-center gap-3 bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-100 animate-fade-in'>
              <span className='flex items-center justify-center w-5 h-5 bg-yellow-100 text-yellow-600 rounded-full text-xs font-bold'>!</span>
              <p className='text-sm text-gray-700'>
                Did you mean <span className='font-bold text-gray-900'>"{suggestion}"</span>?
                <span className='text-gray-400 mx-2 text-xs'>•</span>
                Showing results for "{searchedFor}"
              </p>
            </div>
          )}
        </div>

        <InfiniteScroll
          dataLength={data.length}
          hasMore={true}
          next={handleFetchMore}
          className='pb-10'
        >
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6'>
            {
              data.map((p, index) => {
                return (
                  <CardProduct data={p} key={p?._id + "searchProduct" + index} />
                )
              })
            }

            {/***loading data */}
            {
              loading && (
                loadingArrayCard.map((_, index) => {
                  return (
                    <CardLoading key={"loadingsearchpage" + index} />
                  )
                })
              )
            }
          </div>
        </InfiniteScroll>

        {
          //no data 
          !data[0] && !loading && (
            <div className='flex flex-col justify-center items-center w-full mx-auto py-20 bg-white rounded-xl mt-6 shadow-sm border border-gray-100 text-center px-4 max-w-2xl'>
              <div className='w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6'>
                <img
                  src={noDataImage}
                  className='w-16 opacity-60 mix-blend-multiply'
                  alt="No data"
                />
              </div>
              <h3 className='text-2xl font-bold text-gray-800 mb-2'>No matched products found</h3>
              <p className='text-gray-500 max-w-md mx-auto mb-8'>
                We couldn't find matches for <span className="font-semibold text-gray-700">"{searchText}"</span>.
                <br />Try checking for typos or searching with different keywords.
              </p>

              {suggestion && (
                <button
                  onClick={handleSuggestionClick}
                  className='inline-flex items-center gap-2 bg-[#00b050] text-white px-8 py-3 rounded-full font-medium shadow-lg shadow-green-500/20 hover:shadow-green-500/30 hover:-translate-y-0.5 transition-all duration-300'
                >
                  Search for "{suggestion}" instead
                </button>
              )}
            </div>
          )
        }
      </div>
    </section>
  )
}

export default SearchPage
