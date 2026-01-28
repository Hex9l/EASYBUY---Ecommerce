import React from 'react'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import { pricewithDiscount } from '../utils/PriceWithDiscount'

import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import AddToCartButton from './AddToCartButton'
import { IoMdTimer } from "react-icons/io";

const CardProduct = ({ data }) => {
  const url = `/product/${valideURLConvert(data.name)}-${data._id}`

  return (
    <Link to={url} className='group flex flex-col gap-2.5 rounded-2xl cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-all duration-300 w-full min-w-[150px] max-w-[150px] lg:min-w-[180px] lg:max-w-[180px] p-3 flex-grow' >
      {/* Product Image Section */}
      <div className='relative h-32 lg:h-36 w-full rounded-xl overflow-hidden flex items-center justify-center bg-gray-50/50 group-hover:bg-gray-100 transition-colors duration-500'>
        <img
          src={data.image[0]}
          className='w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500'
          alt={data.name}
        />
        {Boolean(data.discount) && (
          <div className='absolute top-0 left-0 rounded-br-xl text-[9px] lg:text-[10px] w-fit px-2 py-1 font-bold tracking-tight text-white bg-[#00b050] shadow-sm uppercase'>
            {data.discount}% OFF
          </div>
        )}
      </div>

      <div className='px-0.5 flex flex-col gap-2 flex-grow'>
        {/* Delivery Time Badge */}
        <div className='flex items-center gap-1 bg-gray-100/70 rounded-md px-1.5 py-0.5 w-fit'>
          <IoMdTimer className='text-gray-600' size={13} />
          <span className='text-[9px] lg:text-[10px] font-bold text-gray-700 tracking-tight'>8 MINS</span>
        </div>

        {/* Product Name */}
        <div className='font-bold text-gray-800 text-[13px] lg:text-[14px] line-clamp-2 leading-snug min-h-[36px]'>
          {data.name}
        </div>

        {/* Product Unit */}
        <div className='text-gray-400 text-[11px] lg:text-xs font-medium'>
          {data.unit}
        </div>
      </div>

      {/* Price and Add button Section */}
      <div className='px-0.5 flex items-center justify-between gap-2 mt-auto pb-0.5'>
        <div className='flex flex-col gap-0.5'>
          <div className='font-bold text-gray-900 text-xs lg:text-[13px]'>
            {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
          </div>
          {data.discount > 0 && (
            <div className='text-[9px] lg:text-[10px] text-gray-400 line-through font-medium'>
              {DisplayPriceInRupees(data.price)}
            </div>
          )}
        </div>

        <div
          className='shrink-0'
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {data.stock == 0 ? (
            <div className='text-[10px] lg:text-xs font-extrabold text-red-500 bg-red-50 px-2 py-1 rounded-lg border border-red-100 uppercase'>
              SOLD OUT
            </div>
          ) : (
            <AddToCartButton data={data} />
          )}
        </div>
      </div>
    </Link>
  )
}

export default CardProduct
