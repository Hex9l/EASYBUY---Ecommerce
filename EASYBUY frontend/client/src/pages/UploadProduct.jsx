import React, { useState } from 'react'
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
import { SummaryApi } from '../common/SummaryApi';
import uploadImage from '../utils/uploadImage';
import SelectionDropdown from '../components/SelectionDropdown';

const UploadProduct = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {},
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
    const imageUrl = response.imageUrl

    setData((preve) => {
      return {
        ...preve,
        image: [...preve.image, imageUrl]
      }
    })
    setImageLoading(false)

  }

  const handleDeleteImage = async (index) => {
    data.image.splice(index, 1)
    setData((preve) => {
      return {
        ...preve
      }
    })
  }

  const handleRemoveCategory = async (index) => {
    data.category.splice(index, 1)
    setData((preve) => {
      return {
        ...preve
      }
    })
  }
  const handleRemoveSubCategory = async (index) => {
    data.subCategory.splice(index, 1)
    setData((preve) => {
      return {
        ...preve
      }
    })
  }

  const handleAddField = () => {
    if(!fieldName.trim()){
      return 
    }
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
    console.log("data", data)

    try {
      const response = await Axios({
        ...SummaryApi.createProduct,
        data: data
      })
      const { data: responseData } = response

      if (responseData.success) {
        successAlert(responseData.message)
        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
        })

      }
    } catch (error) {
      AxiosToastError(error)
    }


  }

  // useEffect(()=>{
  //   successAlert("Upload successfully")
  // },[])
  return (
    <section className='min-h-full'>
      {/* Top Header Card */}
      <div className='sticky top-24 lg:top-20 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 mb-6 flex items-center justify-between transition-colors duration-300'>
        <h2 className='font-bold text-xl lg:text-2xl text-gray-800 dark:text-gray-100'>Upload Product</h2>
      </div>

      <div className='bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm transition-colors duration-300'>
        <form className='grid gap-8' onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='grid gap-2'>
              <label htmlFor='name' className='font-bold text-gray-700 dark:text-gray-300 ml-1'>Product Name</label>
              <input
                id='name'
                type='text'
                placeholder='e.g. Fresh Organic Apples'
                name='name'
                value={data.name}
                onChange={handleChange}
                required
                className='bg-gray-50 dark:bg-gray-700/50 p-4 outline-none border-2 border-transparent focus:border-[#00b050] focus:ring-4 focus:ring-[#00b050]/10 rounded-2xl transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 text-gray-800 dark:text-gray-200'
              />
            </div>

            <div className='grid gap-2'>
              <label htmlFor='unit' className='font-bold text-gray-700 dark:text-gray-300 ml-1'>Unit / Weight</label>
              <input
                id='unit'
                type='text'
                placeholder='e.g. 1kg, 500ml, 1 packet'
                name='unit'
                value={data.unit}
                onChange={handleChange}
                required
                className='bg-gray-50 dark:bg-gray-700/50 p-4 outline-none border-2 border-transparent focus:border-[#00b050] focus:ring-4 focus:ring-[#00b050]/10 rounded-2xl transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 text-gray-800 dark:text-gray-200'
              />
            </div>
          </div>

          <div className='grid gap-2'>
            <label htmlFor='description' className='font-bold text-gray-700 dark:text-gray-300 ml-1'>Description</label>
            <textarea
              id='description'
              placeholder='Describe your product details...'
              name='description'
              value={data.description}
              onChange={handleChange}
              required
              rows={4}
              className='bg-gray-50 dark:bg-gray-700/50 p-4 outline-none border-2 border-transparent focus:border-[#00b050] focus:ring-4 focus:ring-[#00b050]/10 rounded-2xl transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 text-gray-800 dark:text-gray-200 resize-none'
            />
          </div>

          <div>
            <p className='font-bold text-gray-700 dark:text-gray-300 ml-1 mb-2'>Product Images</p>
            <div className='flex flex-wrap gap-4'>
              <label htmlFor='productImage' className='w-32 h-32 bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-3xl flex justify-center items-center cursor-pointer hover:border-[#00b050] dark:hover:border-[#00b050] hover:bg-[#00b050]/5 dark:hover:bg-[#00b050]/10 transition-all group'>
                <div className='text-center flex flex-col items-center gap-1'>
                  {imageLoading ? <Loading /> : (
                    <>
                      <FaCloudUploadAlt size={32} className='text-gray-400 dark:text-gray-500 group-hover:text-[#00b050]' />
                      <p className='text-[10px] font-bold text-gray-400 dark:text-gray-500 group-hover:text-[#00b050]'>ADD IMAGE</p>
                    </>
                  )}
                </div>
                <input type='file' id='productImage' className='hidden' accept='image/*' onChange={handleUploadImage} />
              </label>

              {data.image.map((img, index) => (
                <div key={img + index} className='w-32 h-32 bg-white dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 rounded-3xl relative group overflow-hidden shadow-sm'>
                  <img src={img} alt={img} className='w-full h-full object-scale-down cursor-pointer' onClick={() => setViewImageURL(img)} />
                  <button
                    type='button'
                    onClick={() => handleDeleteImage(index)}
                    className='absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity'
                  >
                    <MdDelete size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='grid gap-2'>
              <label className='font-bold text-gray-700 dark:text-gray-300 ml-1'>Category</label>
              <SelectionDropdown
                placeholder="Select Category"
                options={allCategory}
                onChange={(value) => {
                  const category = allCategory.find(el => el._id === value)
                  if (data.category.some(c => c._id === value)) return
                  setData(preve => ({ ...preve, category: [...preve.category, category] }))
                }}
              />
              <div className='flex flex-wrap gap-2 mt-2'>
                {data.category.map((c, index) => (
                  <div key={c._id + index} className='flex items-center gap-2 bg-[#00b050]/10 dark:bg-[#00b050]/20 text-[#00b050] dark:text-green-400 font-bold text-xs px-3 py-1.5 rounded-xl border border-[#00b050]/20 dark:border-[#00b050]/30'>
                    <p>{c.name}</p>
                    <button type='button' className='hover:text-red-500 transition-colors' onClick={() => handleRemoveCategory(index)}>
                      <IoClose size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className='grid gap-2'>
              <label className='font-bold text-gray-700 dark:text-gray-300 ml-1'>Sub Category</label>
              <SelectionDropdown
                placeholder="Select Sub Category"
                options={allSubCategory}
                onChange={(value) => {
                  const subCategory = allSubCategory.find(el => el._id === value)
                  if (data.subCategory.some(c => c._id === value)) return
                  setData(preve => ({ ...preve, subCategory: [...preve.subCategory, subCategory] }))
                }}
              />
              <div className='flex flex-wrap gap-2 mt-2'>
                {data.subCategory.map((c, index) => (
                  <div key={c._id + index} className='flex items-center gap-2 bg-[#00b050]/10 dark:bg-[#00b050]/20 text-[#00b050] dark:text-green-400 font-bold text-xs px-3 py-1.5 rounded-xl border border-[#00b050]/20 dark:border-[#00b050]/30'>
                    <p>{c.name}</p>
                    <button type='button' className='hover:text-red-500 transition-colors' onClick={() => handleRemoveSubCategory(index)}>
                      <IoClose size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='grid gap-2'>
              <label htmlFor='stock' className='font-bold text-gray-700 dark:text-gray-300 ml-1'>Stock Quantity</label>
              <input
                id='stock' type='number' placeholder='0' name='stock' value={data.stock} onChange={handleChange} required
                className='bg-gray-50 dark:bg-gray-700/50 p-4 outline-none border-2 border-transparent focus:border-[#00b050] focus:ring-4 focus:ring-[#00b050]/10 rounded-2xl transition-all text-gray-800 dark:text-gray-200 placeholder:text-gray-300 dark:placeholder:text-gray-600'
              />
            </div>

            <div className='grid gap-2'>
              <label htmlFor='price' className='font-bold text-gray-700 dark:text-gray-300 ml-1'>Base Price (₹)</label>
              <input
                id='price' type='number' placeholder='0.00' name='price' value={data.price} onChange={handleChange} required
                className='bg-gray-50 dark:bg-gray-700/50 p-4 outline-none border-2 border-transparent focus:border-[#00b050] focus:ring-4 focus:ring-[#00b050]/10 rounded-2xl transition-all text-gray-800 dark:text-gray-200 placeholder:text-gray-300 dark:placeholder:text-gray-600'
              />
            </div>

            <div className='grid gap-2'>
              <label htmlFor='discount' className='font-bold text-gray-700 dark:text-gray-300 ml-1'>Discount (%)</label>
              <input
                id='discount' type='number' placeholder='0' name='discount' value={data.discount} onChange={handleChange} required
                className='bg-gray-50 dark:bg-gray-700/50 p-4 outline-none border-2 border-transparent focus:border-[#00b050] focus:ring-4 focus:ring-[#00b050]/10 rounded-2xl transition-all text-gray-800 dark:text-gray-200 placeholder:text-gray-300 dark:placeholder:text-gray-600'
              />
            </div>
          </div>

          <div className='space-y-6'>
            {Object.keys(data.more_details).map((k, index) => (
              <div key={k + index} className='grid gap-2 relative'>
                <div className='flex justify-between items-center'>
                    <label htmlFor={k} className='font-bold text-gray-700 dark:text-gray-300 ml-1'>{k}</label>
                    <button 
                        type='button' 
                        onClick={() => {
                            const newDetails = { ...data.more_details }
                            delete newDetails[k]
                            setData(prev => ({ ...prev, more_details: newDetails }))
                        }}
                        className='text-red-500 hover:text-red-700 transition-colors p-1'
                    >
                        <IoClose size={20}/>
                    </button>
                </div>
                <input
                  id={k} type='text' value={data.more_details[k]} required
                  onChange={(e) => {
                    const value = e.target.value
                    setData(preve => ({ ...preve, more_details: { ...preve.more_details, [k]: value } }))
                  }}
                  className='bg-gray-50 dark:bg-gray-700/50 p-4 outline-none border-2 border-transparent focus:border-[#00b050] focus:ring-4 focus:ring-[#00b050]/10 rounded-2xl transition-all text-gray-800 dark:text-gray-200'
                />
              </div>
            ))}
          </div>

          <div className='flex gap-4 pt-4'>
            {/* <button
              type='button'
              onClick={() => setOpenAddField(true)}
              className='flex-1 py-4 px-6 border-2 border-[#00b050] text-[#00b050] font-bold rounded-2xl hover:bg-[#00b050]/5 transition-all'
            >
              + Add More Details
            </button> */}

            <button
              className='flex-[2] bg-[#00b050] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#00b050]/20 hover:bg-[#00b060] transition-all'
            >
              Publish Product
            </button>
          </div>
        </form>
      </div>

      {
        ViewImageURL && (
          <ViewImage url={ViewImageURL} close={() => setViewImageURL("")} />
        )
      }

      {
        openAddField && (
          <AddFieldComponent
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            submit={handleAddField}
            close={() => setOpenAddField(false)}
          />
        )
      }
    </section>
  )
}

export default UploadProduct
