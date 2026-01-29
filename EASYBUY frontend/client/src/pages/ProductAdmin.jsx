import React, { useEffect, useState } from 'react'
import { SummaryApi } from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import Loading from '../components/Loading'
import ProductCardAdmin from '../components/ProductCardAdmin'
import { IoSearchOutline } from "react-icons/io5";
import EditProductAdmin from '../components/EditProductAdmin'

const ProductAdmin = () => {
  const [productData, setProductData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPageCount, setTotalPageCount] = useState(1)
  const [search, setSearch] = useState("")

  const fetchProductData = async (isBackground = false) => {
    try {
      if (!isBackground) {
        setLoading(true)
      }
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page: page,
          limit: 12,
          search: search
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        setTotalPageCount(responseData.totalNoPage)
        setProductData(responseData.data)
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      if (!isBackground) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchProductData()
  }, [page])

  const handleNext = () => {
    if (page !== totalPageCount) {
      setPage(preve => preve + 1)
    }
  }
  const handlePrevious = () => {
    if (page > 1) {
      setPage(preve => preve - 1)
    }
  }

  const handleOnChange = (e) => {
    const { value } = e.target
    setSearch(value)
    setPage(1)
  }

  useEffect(() => {
    let flag = true

    const interval = setTimeout(() => {
      if (flag) {
        fetchProductData()
        flag = false
      }
    }, 300);

    return () => {
      clearTimeout(interval)
    }
  }, [search])

  return (
    <section className='min-h-full'>
      <div className='sticky top-24 lg:top-20 z-10 p-4 lg:p-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm border border-gray-100 dark:border-gray-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 mb-6 transition-colors duration-300'>
        <h2 className='font-bold text-xl lg:text-2xl text-gray-800 dark:text-gray-100'>Products</h2>
        <div className='h-full min-w-[280px] w-full md:w-auto bg-gray-50 dark:bg-gray-800 px-5 flex items-center gap-3 py-3 rounded-2xl border-2 border-gray-100 dark:border-gray-700 focus-within:border-[#00b050] focus-within:ring-4 focus-within:ring-[#00b050]/10 transition-all group'>
          <IoSearchOutline size={22} className='text-gray-400 dark:text-gray-500 group-focus-within:text-[#00b050] transition-colors' />
          <input
            type='text'
            placeholder='Search products...'
            className='h-full w-full outline-none bg-transparent text-[15px] placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-800 dark:text-gray-100'
            value={search}
            onChange={handleOnChange}
          />
        </div>
      </div>

      {loading && (
        <div className='flex justify-center py-20'>
          <Loading />
        </div>
      )}

      <div className='min-h-[60vh]'>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6'>
          {
            productData.map((p, index) => {
              return (
                <ProductCardAdmin key={p._id} data={p} fetchProductData={fetchProductData} />
              )
            })
          }
        </div>

        {!loading && productData.length === 0 && (
          <div className='flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500'>
            <IoSearchOutline size={50} className='opacity-20 mb-3' />
            <p className='text-lg font-medium'>No products found</p>
          </div>
        )}
      </div>

      <div className='flex items-center justify-between gap-4 my-10 border-t border-gray-100 dark:border-gray-800 pt-6'>
        <button
          onClick={handlePrevious}
          disabled={page === 1}
          className={`
              flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 font-semibold transition-all
              ${page === 1
              ? 'border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
              : 'border-[#00b050]/20 text-[#00b050] hover:bg-[#00b050] hover:text-white hover:border-[#00b050]'}
            `}
        >
          Previous
        </button>

        <div className='flex items-center gap-2'>
          <span className='text-sm text-gray-400 dark:text-gray-500 font-medium'>Page</span>
          <div className='bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700 font-bold text-gray-700 dark:text-gray-300 min-w-[60px] text-center'>
            {page} <span className='text-gray-300 dark:text-gray-600 mx-1 font-normal'>/</span> {totalPageCount}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={page === totalPageCount}
          className={`
              flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 font-semibold transition-all
              ${page === totalPageCount
              ? 'border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
              : 'border-[#00b050]/20 text-[#00b050] hover:bg-[#00b050] hover:text-white hover:border-[#00b050]'}
            `}
        >
          Next
        </button>
      </div>
    </section>
  )
}

export default ProductAdmin
