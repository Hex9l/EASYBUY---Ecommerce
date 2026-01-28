import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import EditProductAdmin from './EditProductAdmin'
import CofirmBox from './CofirmBox'
import { IoClose } from 'react-icons/io5'

import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'
import { SummaryApi } from '../common/SummaryApi'

const ProductCardAdmin = ({ data, fetchProductData }) => {
  const [editOpen, setEditOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const handleDeleteCancel = () => {
    setOpenDelete(false)
  }

  const handleDelete = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data: {
          _id: data._id
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        if (fetchProductData) {
          fetchProductData(true)
        }
        setOpenDelete(false)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }
  return (
    <div className='w-full p-4 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group'>
      <div className='h-40 w-full mb-3 flex items-center justify-center bg-gray-50/50 rounded-2xl overflow-hidden'>
        <img
          src={data?.image[0]}
          alt={data?.name}
          className='w-full h-full object-scale-down group-hover:scale-110 transition-transform duration-500'
        />
      </div>
      <div className='px-1'>
        <p className='text-ellipsis line-clamp-2 font-bold text-gray-800 text-[15px] mb-1 leading-snug h-10'>
          {data?.name}
        </p>
        <p className='text-slate-400 text-xs font-medium bg-gray-50 w-fit px-2 py-0.5 rounded-full mb-4'>
          {data?.unit}
        </p>
        <div className='grid grid-cols-2 gap-3'>
          <button
            onClick={() => setEditOpen(true)}
            className='py-2 text-sm font-bold border-2 border-[#00b050]/20 bg-[#00b050]/5 text-[#00b050] hover:bg-[#00b050] hover:text-white hover:border-[#00b050] rounded-xl transition-all'
          >
            Edit
          </button>
          <button
            onClick={() => setOpenDelete(true)}
            className='py-2 text-sm font-bold border-2 border-red-100 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-xl transition-all'
          >
            Delete
          </button>
        </div>
      </div>

      {
        editOpen && (
          <EditProductAdmin fetchProductData={fetchProductData} data={data} close={() => setEditOpen(false)} />
        )
      }

      {
        openDelete && createPortal(
          <section className='fixed top-0 left-0 right-0 bottom-0 bg-black/60 backdrop-blur-sm z-[200] p-4 flex justify-center items-center animate-in fade-in duration-300'>
            <div className='bg-white p-8 w-full max-w-md rounded-[2.5rem] shadow-2xl scale-in-95 animate-in duration-300'>
              <div className='flex items-center justify-between gap-4 mb-6'>
                <h3 className='font-bold text-xl text-gray-800'>Delete Product</h3>
                <button onClick={() => setOpenDelete(false)} className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
                  <IoClose size={24} className='text-gray-400' />
                </button>
              </div>
              <div className='bg-red-50 p-6 rounded-3xl mb-6'>
                <p className='text-gray-700 font-medium'>
                  Are you sure you want to delete <span className='font-bold text-red-600'>"{data?.name}"</span>?
                  <br />
                  <span className='text-xs text-red-400 mt-2 block italic'>This action cannot be undone.</span>
                </p>
              </div>
              <div className='flex gap-4'>
                <button
                  onClick={handleDeleteCancel}
                  className='flex-1 py-3.5 rounded-2xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-all'
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className='flex-1 py-3.5 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg shadow-red-200 transition-all'
                >
                  Delete Now
                </button>
              </div>
            </div>
          </section>, document.body
        )
      }
    </div>
  )
}

export default ProductCardAdmin
