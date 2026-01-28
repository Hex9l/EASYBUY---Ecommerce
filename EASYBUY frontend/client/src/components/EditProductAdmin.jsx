import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { FaCloudUploadAlt } from "react-icons/fa";

import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux'
import { IoClose } from "react-icons/io5";
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';

import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';
import { useEffect } from 'react';
import uploadImage from '../utils/UploadImage';
import { SummaryApi } from '../common/SummaryApi';
import SelectionDropdown from './SelectionDropdown';

const EditProductAdmin = ({ close, data: propsData, fetchProductData }) => {
  const [data, setData] = useState({
    _id: propsData._id,
    name: propsData.name,
    image: propsData.image,
    category: propsData.category,
    subCategory: propsData.subCategory,
    unit: propsData.unit,
    stock: propsData.stock,
    price: propsData.price,
    discount: propsData.discount,
    description: propsData.description,
    more_details: propsData.more_details || {},
  })
  const [imageLoading, setImageLoading] = useState(false)
  const [ViewImageURL, setViewImageURL] = useState("")
  const allCategory = useSelector(state => state.product.allCategory)
  const [selectCategory, setSelectCategory] = useState("")
  const [selectSubCategory, setSelectSubCategory] = useState("")
  const allSubCategory = useSelector(state => state.product.allSubCategory)

  const [openAddField, setOpenAddField] = useState(false)
  const [fieldName, setFieldName] = useState("")


  const handleChange = (e) => {
    const { name, value } = e.target

    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]

    if (!file) {
      return
    }
    setImageLoading(true)
    const response = await uploadImage(file)
    const imageUrl = response.imageUrl // Correct extraction based on my previous fix to use response directly

    setData((preve) => {
      return {
        ...preve,
        image: [...preve.image, imageUrl]
      }
    })
    setImageLoading(false)

  }

  const handleDeleteImage = async (index) => {
    setData((preve) => {
      const newImage = [...preve.image]
      newImage.splice(index, 1)
      return {
        ...preve,
        image: newImage
      }
    })
  }

  const handleRemoveCategory = async (index) => {
    setData((preve) => {
      const newCategory = [...preve.category]
      newCategory.splice(index, 1)
      return {
        ...preve,
        category: newCategory
      }
    })
  }

  const handleRemoveSubCategory = async (index) => {
    setData((preve) => {
      const newSubCategory = [...preve.subCategory]
      newSubCategory.splice(index, 1)
      return {
        ...preve,
        subCategory: newSubCategory
      }
    })
  }

  const handleAddField = () => {
    setData((preve) => {
      return {
        ...preve,
        more_details: {
          ...preve.more_details,
          [fieldName]: ""
        }
      }
    })
    setFieldName("")
    setOpenAddField(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Sanitize data to send only IDs for category and subCategory as expected by backend ProductModel
    const payload = {
      ...data,
      category: data.category.map(c => c._id ? c._id : c),
      subCategory: data.subCategory.map(s => s._id ? s._id : s)
    }

    try {
      const response = await Axios({
        ...SummaryApi.updateProductDetails,
        data: payload
      })
      const { data: responseData } = response

      if (responseData.success) {
        successAlert(responseData.message)
        if (close) {
          close()
        }
        fetchProductData(true)
      }
    } catch (error) {
      AxiosToastError(error)
    }


  }

  return createPortal(
    <section className='fixed top-0 right-0 left-0 bottom-0 bg-black/60 backdrop-blur-sm z-[200] p-4 flex items-center justify-center animate-in fade-in duration-300'>
      <div className='bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 rounded-[3rem] shadow-2xl scale-in-95 animate-in duration-300 scrollbar-custom'>
        <div className='flex items-center justify-between mb-8 sticky top-0 bg-white/80 backdrop-blur-md py-2 z-10'>
          <h2 className='font-bold text-2xl text-gray-800'>Edit Product Details</h2>
          <button onClick={close} className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
            <IoClose size={28} className='text-gray-400' />
          </button>
        </div>

        <form className='grid gap-8' onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='grid gap-2'>
              <label htmlFor='edit-name' className='font-bold text-gray-700 ml-1'>Product Name</label>
              <input
                id='edit-name' type='text' placeholder='e.g. Fresh Organic Apples' name='name' value={data.name} onChange={handleChange} required
                className='bg-gray-50 p-4 outline-none border-2 border-transparent focus:border-[#00b050] focus:ring-4 focus:ring-[#00b050]/10 rounded-2xl transition-all placeholder:text-gray-300'
              />
            </div>

            <div className='grid gap-2'>
              <label htmlFor='edit-unit' className='font-bold text-gray-700 ml-1'>Unit / Weight</label>
              <input
                id='edit-unit' type='text' placeholder='e.g. 1kg, 500ml' name='unit' value={data.unit} onChange={handleChange} required
                className='bg-gray-50 p-4 outline-none border-2 border-transparent focus:border-[#00b050] focus:ring-4 focus:ring-[#00b050]/10 rounded-2xl transition-all placeholder:text-gray-300'
              />
            </div>
          </div>

          <div className='grid gap-2'>
            <label htmlFor='edit-description' className='font-bold text-gray-700 ml-1'>Description</label>
            <textarea
              id='edit-description' placeholder='Describe your product details...' name='description' value={data.description} onChange={handleChange} required rows={4}
              className='bg-gray-50 p-4 outline-none border-2 border-transparent focus:border-[#00b050] focus:ring-4 focus:ring-[#00b050]/10 rounded-2xl transition-all placeholder:text-gray-300 resize-none'
            />
          </div>

          <div>
            <p className='font-bold text-gray-700 ml-1 mb-2'>Product Images</p>
            <div className='flex flex-wrap gap-4'>
              <label htmlFor='editProductImage' className='w-32 h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex justify-center items-center cursor-pointer hover:border-[#00b050] hover:bg-[#00b050]/5 transition-all group'>
                <div className='text-center flex flex-col items-center gap-1'>
                  {imageLoading ? <Loading /> : (
                    <>
                      <FaCloudUploadAlt size={32} className='text-gray-400 group-hover:text-[#00b050]' />
                      <p className='text-[10px] font-bold text-gray-400 group-hover:text-[#00b050]'>ADD IMAGE</p>
                    </>
                  )}
                </div>
                <input type='file' id='editProductImage' className='hidden' accept='image/*' onChange={handleUploadImage} />
              </label>

              {data.image.map((img, index) => (
                <div key={img + index} className='w-32 h-32 bg-white border-2 border-gray-100 rounded-3xl relative group overflow-hidden shadow-sm'>
                  <img src={img} alt={img} className='w-full h-full object-scale-down cursor-pointer' onClick={() => setViewImageURL(img)} />
                  <button type='button' onClick={() => handleDeleteImage(index)} className='absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity'>
                    <MdDelete size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='grid gap-2'>
              <label className='font-bold text-gray-700 ml-1'>Category</label>
              <SelectionDropdown
                placeholder="Select Category" options={allCategory}
                onChange={(value) => {
                  const category = allCategory.find(el => el._id === value)
                  if (data.category.some(c => c._id === value)) return
                  setData(preve => ({ ...preve, category: [...preve.category, category] }))
                }}
              />
              <div className='flex flex-wrap gap-2 mt-2'>
                {data.category.map((c, index) => (
                  <div key={c._id + index} className='flex items-center gap-2 bg-[#00b050]/10 text-[#00b050] font-bold text-xs px-3 py-1.5 rounded-xl border border-[#00b050]/20'>
                    <p>{c.name}</p>
                    <button type='button' className='hover:text-red-500' onClick={() => handleRemoveCategory(index)}><IoClose size={16} /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className='grid gap-2'>
              <label className='font-bold text-gray-700 ml-1'>Sub Category</label>
              <SelectionDropdown
                placeholder="Select Sub Category" options={allSubCategory}
                onChange={(value) => {
                  const subCategory = allSubCategory.find(el => el._id === value)
                  if (data.subCategory.some(c => c._id === value)) return
                  setData(preve => ({ ...preve, subCategory: [...preve.subCategory, subCategory] }))
                }}
              />
              <div className='flex flex-wrap gap-2 mt-2'>
                {data.subCategory.map((c, index) => (
                  <div key={c._id + index} className='flex items-center gap-2 bg-[#00b050]/10 text-[#00b050] font-bold text-xs px-3 py-1.5 rounded-xl border border-[#00b050]/20'>
                    <p>{c.name}</p>
                    <button type='button' className='hover:text-red-500' onClick={() => handleRemoveSubCategory(index)}><IoClose size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='grid gap-2'>
              <label htmlFor='edit-stock' className='font-bold text-gray-700 ml-1'>Stock Quantity</label>
              <input
                id='edit-stock' type='number' placeholder='0' name='stock' value={data.stock} onChange={handleChange} required
                className='bg-gray-50 p-4 outline-none border-2 border-transparent focus:border-[#00b050] focus:ring-4 focus:ring-[#00b050]/10 rounded-2xl transition-all'
              />
            </div>
            <div className='grid gap-2'>
              <label htmlFor='edit-price' className='font-bold text-gray-700 ml-1'>Base Price (₹)</label>
              <input
                id='edit-price' type='number' placeholder='0.00' name='price' value={data.price} onChange={handleChange} required
                className='bg-gray-50 p-4 outline-none border-2 border-transparent focus:border-[#00b050] focus:ring-4 focus:ring-[#00b050]/10 rounded-2xl transition-all'
              />
            </div>
            <div className='grid gap-2'>
              <label htmlFor='edit-discount' className='font-bold text-gray-700 ml-1'>Discount (%)</label>
              <input
                id='edit-discount' type='number' placeholder='0' name='discount' value={data.discount} onChange={handleChange} required
                className='bg-gray-50 p-4 outline-none border-2 border-transparent focus:border-[#00b050] focus:ring-4 focus:ring-[#00b050]/10 rounded-2xl transition-all'
              />
            </div>
          </div>

          <div className='space-y-6'>
            {Object.keys(data.more_details).map((k, index) => (
              <div key={k + index} className='grid gap-2'>
                <label htmlFor={"edit-" + k} className='font-bold text-gray-700 ml-1'>{k}</label>
                <input
                  id={"edit-" + k} type='text' value={data.more_details[k]} required
                  onChange={(e) => {
                    const value = e.target.value
                    setData(preve => ({ ...preve, more_details: { ...preve.more_details, [k]: value } }))
                  }}
                  className='bg-gray-50 p-4 outline-none border-2 border-transparent focus:border-[#00b050] focus:ring-4 focus:ring-[#00b050]/10 rounded-2xl transition-all'
                />
              </div>
            ))}
          </div>

          <div className='flex gap-4 pt-6 pb-2'>
            <button
              type='button' onClick={() => setOpenAddField(true)}
              className='flex-1 py-4 px-6 border-2 border-[#00b050] text-[#00b050] font-bold rounded-2xl hover:bg-[#00b050]/5 transition-all'
            >
              + Add More Details
            </button>
            <button className='flex-[2] bg-[#00b050] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#00b050]/20 hover:bg-[#00b060] transition-all'>
              Update Product
            </button>
          </div>
        </form>
      </div>

      {ViewImageURL && <ViewImage url={ViewImageURL} close={() => setViewImageURL("")} />}
      {openAddField && <AddFieldComponent value={fieldName} onChange={(e) => setFieldName(e.target.value)} submit={handleAddField} close={() => setOpenAddField(false)} />}
    </section>, document.body
  )
}

export default EditProductAdmin


