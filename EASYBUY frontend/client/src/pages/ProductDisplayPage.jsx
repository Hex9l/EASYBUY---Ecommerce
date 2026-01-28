import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SummaryApi } from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import Divider from '../components/Divider'
import image1 from '../assets/minute_delivery.png'
import image2 from '../assets/Best_Prices_Offers.png'
import image3 from '../assets/Wide_Assortment.png'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton'

const ProductDisplayPage = () => {
  const params = useParams()
  let productId = params?.product?.split("-")?.slice(-1)[0]
  const [data, setData] = useState({
    name: "",
    image: []
  })
  const [image, setImage] = useState(0)
  const [loading, setLoading] = useState(false)
  const imageContainer = useRef()

  const fetchProductDetails = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        setData(responseData.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductDetails()
  }, [params])

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100
  }
  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100
  }
  console.log("product data", data)
  return (
    <section className='container mx-auto p-4 lg:py-10 grid lg:grid-cols-2 gap-10'>
      <div className='flex flex-col gap-6'>
        <div className='bg-white lg:h-[600px] rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden flex items-center justify-center p-8 group'>
          <img
            src={data.image[image]}
            className='w-full h-full object-scale-down group-hover:scale-105 transition-transform duration-700'
            alt={data.name}
          />
        </div>

        <div className='grid relative px-2'>
          <div ref={imageContainer} className='flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none py-2'>
            {
              data.image.map((img, index) => {
                const isActive = index === image
                return (
                  <div
                    className={`w-24 h-24 shrink-0 cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 shadow-sm
                                ${isActive ? "border-[#00b050] scale-105 shadow-[#00b050]/20" : "border-gray-100 hover:border-gray-300"}
                              `}
                    key={img + index}
                    onClick={() => setImage(index)}
                  >
                    <img src={img} alt='min-product' className='w-full h-full object-scale-down p-2' />
                  </div>
                )
              })
            }
          </div>
          {data.image.length > 4 && (
            <div className='w-full -ml-3 h-full hidden lg:flex justify-between absolute items-center pointer-events-none'>
              <button onClick={handleScrollLeft} className='z-10 bg-white p-3 rounded-full shadow-xl pointer-events-auto hover:bg-gray-50 transition-colors'>
                <FaAngleLeft size={20} />
              </button>
              <button onClick={handleScrollRight} className='z-10 bg-white p-3 rounded-full shadow-xl pointer-events-auto hover:bg-gray-50 transition-colors'>
                <FaAngleRight size={20} />
              </button>
            </div>
          )}
        </div>

        <div className='mt-6 hidden lg:flex flex-col gap-8 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm'>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2'>
              <div className='w-1.5 h-6 bg-[#00b050] rounded-full'></div>
              <h3 className='font-bold text-xl text-gray-800 tracking-tight'>Product Description</h3>
            </div>
            <p className='text-gray-600 leading-relaxed text-lg'>{data.description}</p>
          </div>

          {data?.more_details && Object.keys(data?.more_details).length > 0 && (
            <div className='grid grid-cols-2 gap-6 pt-4 border-t border-gray-50'>
              {Object.keys(data.more_details).map((element, index) => (
                <div key={element + index}>
                  <p className='font-bold text-gray-400 uppercase text-xs tracking-widest mb-1'>{element}</p>
                  <p className='text-gray-800 font-bold text-lg'>{data.more_details[element]}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>


      <div className='flex flex-col gap-8 lg:pt-4'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-3'>
            <span className='bg-[#00b050]/10 text-[#00b050] font-extrabold text-[10px] tracking-widest px-3 py-1.5 rounded-full uppercase'>
              10 MINS DELIVERY
            </span>
            <span className='bg-gray-100 text-gray-500 font-bold text-[10px] tracking-widest px-3 py-1.5 rounded-full uppercase'>
              {data.unit}
            </span>
          </div>
          <h2 className='text-3xl lg:text-5xl font-extrabold text-gray-900 leading-tight tracking-tighter'>
            {data.name}
          </h2>
        </div>

        <div className='bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col gap-6'>
          <div className='flex flex-col gap-1'>
            <p className='font-bold text-gray-400 text-sm uppercase tracking-widest'>Select Price</p>
            <div className='flex items-center gap-6'>
              <div className='flex flex-col'>
                <span className='text-4xl lg:text-5xl font-black text-gray-900'>
                  {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
                </span>
                {data.discount > 0 && (
                  <div className='flex items-center gap-3 mt-1'>
                    <span className='text-xl text-gray-300 line-through font-bold'>
                      {DisplayPriceInRupees(data.price)}
                    </span>
                    <span className='bg-red-500 text-white text-xs font-black px-3 py-1 rounded-xl shadow-lg shadow-red-200'>
                      {data.discount}% OFF
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='w-full'>
            {data.stock === 0 ? (
              <div className='w-full py-5 bg-red-50 text-red-500 rounded-2xl font-black text-center border-2 border-red-100 tracking-widest'>
                CURRENTLY UNAVAILABLE
              </div>
            ) : (
              <div className='w-full h-16'>
                <AddToCartButton data={data} />
              </div>
            )}
          </div>
        </div>

        <div className='bg-gray-50/50 p-8 rounded-[3rem] border border-gray-100'>
          <h2 className='font-bold text-xl text-gray-800 mb-8 flex items-center gap-2'>
            Why shop from <span className='text-[#00b050]'>EasyBuy</span>?
          </h2>
          <div className='flex flex-col gap-8'>
            <div className='flex items-start gap-5'>
              <div className='w-16 h-16 shrink-0 bg-white rounded-2xl p-3 shadow-sm border border-gray-100'>
                <img src={image1} alt='superfast delivery' className='w-full h-full object-contain' />
              </div>
              <div className='flex flex-col gap-1 pt-1'>
                <div className='font-bold text-gray-800 text-lg leading-none'>Superfast Delivery</div>
                <p className='text-gray-500 text-sm leading-relaxed'>Get your order delivered in minutes from dark stores near you.</p>
              </div>
            </div>
            <div className='flex items-start gap-5'>
              <div className='w-16 h-16 shrink-0 bg-white rounded-2xl p-3 shadow-sm border border-gray-100'>
                <img src={image2} alt='Best prices offers' className='w-full h-full object-contain' />
              </div>
              <div className='flex flex-col gap-1 pt-1'>
                <div className='font-bold text-gray-800 text-lg leading-none'>Best Prices & Offers</div>
                <p className='text-gray-500 text-sm leading-relaxed'>Directly from manufacturers at the most competitive rates.</p>
              </div>
            </div>
            <div className='flex items-start gap-5'>
              <div className='w-16 h-16 shrink-0 bg-white rounded-2xl p-3 shadow-sm border border-gray-100'>
                <img src={image3} alt='Wide Assortment' className='w-full h-full object-contain' />
              </div>
              <div className='flex flex-col gap-1 pt-1'>
                <div className='font-bold text-gray-800 text-lg leading-none'>Wide Assortment</div>
                <p className='text-gray-500 text-sm leading-relaxed'>5,000+ products across all your daily essential categories.</p>
              </div>
            </div>
          </div>
        </div>

        <div className='lg:hidden p-6 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm'>
          <div className='flex flex-col gap-4'>
            <h3 className='font-bold text-xl text-gray-800 tracking-tight'>Description</h3>
            <p className='text-gray-600 leading-relaxed'>{data.description}</p>

            {data?.more_details && Object.keys(data?.more_details).length > 0 && (
              <div className='grid gap-4 mt-2 pt-4 border-t border-gray-50'>
                {Object.keys(data.more_details).map((element, index) => (
                  <div key={element + index} className='flex justify-between items-center text-sm'>
                    <p className='font-bold text-gray-400 uppercase tracking-widest'>{element}</p>
                    <p className='text-gray-800 font-bold'>{data.more_details[element]}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductDisplayPage
