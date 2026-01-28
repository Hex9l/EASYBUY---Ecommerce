import React from 'react'
import banner from '../assets/banner.jpg'
import bannerMobile from '../assets/banner-mobile.jpg'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import { Link, useNavigate } from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const handleRedirectProductListpage = (id, cat) => {
    console.log(id, cat)
    const subcategory = subCategoryData.find(sub => {
      const filterData = sub.category.some(c => {
        return c._id == id
      })

      return filterData ? true : null
    })
    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory?.name || "")}-${subcategory?._id || ""}`

    navigate(url)
    console.log(url)
  }


  return (
    <section className='bg-white'>
      <div className='container mx-auto'>
        <div
          className={`w-full h-full min-h-32 md:min-h-48 bg-blue-100 rounded cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-green-200/50 group ${!banner && "animate-pulse my-2"}`}

        >
          <img
            src={banner}
            className='w-full h-full hidden lg:block group-hover:scale-[1.02] transition-transform duration-700'
            alt='banner'
            onClick={() => {
              const paanCorner = categoryData.find(c => c.name.toLowerCase().includes("paan corner"));
              if (paanCorner) {
                handleRedirectProductListpage(paanCorner._id, paanCorner.name);
              }
            }}
          />
          <img
            src={bannerMobile}
            className='w-full h-full lg:hidden group-hover:scale-[1.02] transition-transform duration-700 object-cover min-h-[130px]'
            alt='banner'
          />
        </div>
      </div>

      <div className='container mx-auto px-2 md:px-4 my-2 grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2'>
        {
          loadingCategory ? (
            new Array(12).fill(null).map((c, index) => {
              return (
                <div key={index + "loadingcategory"} className='bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse'>
                  <div className='bg-blue-100 min-h-24 rounded'></div>
                  <div className='bg-blue-100 h-8 rounded'></div>
                </div>
              )
            })
          ) : (
            categoryData.map((cat, index) => {
              return (
                <div key={cat._id + "displayCategory"} className='w-full h-full cursor-pointer group bg-gray-50 group-hover:bg-white rounded-3xl p-3 shadow-sm group-hover:shadow-xl border border-gray-100 group-hover:border-green-100 transition-all duration-300 transform group-hover:-translate-y-1 flex flex-col items-center justify-center gap-2' onClick={() => handleRedirectProductListpage(cat._id, cat.name)}>
                  <div className='w-full h-16 md:h-20 lg:h-24 overflow-hidden flex items-center justify-center'>
                    <img
                      src={cat.image}
                      className='w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300'
                      alt={cat.name}
                    />
                  </div>
                  <p className='text-center text-xs lg:text-sm font-medium text-gray-600 group-hover:text-green-700 capitalize leading-tight transition-colors duration-300 tracking-wide'>{cat.name}</p>
                </div>
              )
            })

          )
        }
      </div>

      {/***display category product */}
      {
        categoryData?.map((c, index) => {
          return (
            <CategoryWiseProductDisplay
              key={c?._id + "CategorywiseProduct"}
              id={c?._id}
              name={c?.name}
            />
          )
        })
      }
    </section>
  )
}

export default Home
