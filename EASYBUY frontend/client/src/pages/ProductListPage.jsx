import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import { SummaryApi } from '../common/SummaryApi'
import { Link, useParams } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from '../components/Loading'
import CardProduct from '../components/CardProduct'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'

const ProductListPage = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const params = useParams()
  const allSubCategory = useSelector(state => state.product.allSubCategory)
  const [displaySubCategory, setDisplaySubCategory] = useState([])

  // ===============================
  // PARAM PARSING
  // ===============================
  const categoryParam = params?.category
  const subCategoryParam = params?.subCategory

  const categoryId = categoryParam?.split('-').pop()
  const subCategoryId = subCategoryParam?.split('-').pop()

  const subCategoryName = subCategoryParam
    ?.split('-')
    ?.slice(0, -1)
    ?.join(' ')

  // ===============================
  // FETCH PRODUCTS
  // ===============================
  const fetchProductData = async () => {
    if (!categoryId || !subCategoryId) return

    try {
      setLoading(true)
      const res = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: { categoryId, subCategoryId, page, limit: 10 }
      })

      if (res?.data?.success) {
        setData(res.data.data)
      }
    } catch (err) {
      AxiosToastError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
    fetchProductData()
  }, [params.category, params.subCategory])

  // ===============================
  // FILTER SUB CATEGORY
  // ===============================
  useEffect(() => {
    const filtered = allSubCategory.filter(sc =>
      sc.category?.some(c => c._id === categoryId)
    )
    setDisplaySubCategory(filtered)
  }, [categoryId, allSubCategory])

  return (
    <section className="w-full bg-[#f8f8f8] dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="container mx-auto flex max-w-[1280px] bg-white dark:bg-gray-900 min-h-[calc(100vh-80px)] lg:border-x border-gray-100 dark:border-gray-800">

        {/* ================= LEFT SIDEBAR ================= */}
        <aside className="w-[90px] md:w-[120px] lg:w-[180px] shrink-0 border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-y-auto sticky top-[72px] lg:top-[80px] h-[calc(100vh-72px)] lg:h-[calc(100vh-80px)] scrollbarCustom">

          {displaySubCategory.map(sc => {
            const link = `/${valideURLConvert(sc.category[0]?.name)}-${sc.category[0]?._id}/${valideURLConvert(sc.name)}-${sc._id}`
            const active = sc._id === subCategoryId

            return (
              <Link
                key={sc._id}
                to={link}
                className={`relative flex flex-col items-center gap-2 py-4 px-2 transition-all duration-200 group
                  ${active ? 'bg-green-50 dark:bg-green-900/20 border-r-[4px] border-[#0c831f]' : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-r-[4px] border-transparent'}
                `}
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 transition-transform duration-300 p-1 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 ${active ? 'scale-105 border-green-200 dark:border-green-700' : 'group-hover:border-gray-300 dark:group-hover:border-gray-600'}`}>
                  <img
                    src={sc.image}
                    alt={sc.name}
                    className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                  />
                </div>

                <p className={`text-[9px] md:text-[10px] lg:text-[12px] text-center leading-tight line-clamp-2 w-full
                  ${active ? 'font-bold text-[#0c831f] dark:text-[#0c831f]' : 'font-medium text-gray-600 dark:text-gray-400'}
                `}>
                  {sc.name}
                </p>
              </Link>
            )
          })}
        </aside>

        {/* ================= RIGHT CONTENT ================= */}
        <main className="flex-1 bg-white dark:bg-gray-900">

          {/* HEADER */}
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-10 px-4 lg:px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center shadow-sm lg:shadow-none sticky top-[72px] lg:top-0">
            <h2 className="font-extrabold text-sm lg:text-base capitalize text-gray-800 dark:text-gray-100 tracking-tight">
              Buy {subCategoryName} Online
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[10px] lg:text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-md">
                {data.length} ITEMS
              </span>
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="p-4 lg:p-6 min-h-screen">
            <div className="grid grid-cols-2 min-[480px]:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-y-6 gap-x-4 lg:gap-x-6">
              {data.map((p, i) => (
                <div key={p._id + i} className="flex justify-center">
                  <CardProduct data={p} />
                </div>
              ))}
            </div>

            {loading && (
              <div className="flex justify-center py-24">
                <Loading />
              </div>
            )}

            {!loading && data.length === 0 && (
              <div className="flex flex-col items-center justify-center py-40 text-gray-400 dark:text-gray-500">
                <div className="w-20 h-20 opacity-20 mb-4 text-gray-300 dark:text-gray-600">
                  <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-14h2v6h-2zm0 8h2v2h-2z" /></svg>
                </div>
                <p className="text-lg font-bold text-gray-700 dark:text-gray-300">No products available</p>
                <p className="text-sm mt-1">We couldn't find any items in this category.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </section>
  )
}

export default ProductListPage
