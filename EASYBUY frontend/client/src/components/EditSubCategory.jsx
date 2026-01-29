import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/UploadImage';
import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';

import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { SummaryApi } from '../common/SummaryApi';
import SelectionDropdown from './SelectionDropdown';

const EditSubCategory = ({ close, data, fetchData }) => {
    const [subCategoryData, setSubCategoryData] = useState({
        _id: data._id,
        name: data.name,
        image: data.image,
        category: data.category || []
    })
    const allCategory = useSelector(state => state.product.allCategory)


    const handleChange = (e) => {
        const { name, value } = e.target

        setSubCategoryData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const handleUploadSubCategoryImage = async (e) => {
        const file = e.target.files[0]

        if (!file) {
            return
        }

        try {
            toast.loading("Uploading image...", { id: "upload" })
            const response = await uploadImage(file)
            if (response.success) {
                toast.success("Image uploaded", { id: "upload" })

                // Auto-set name from filename
                const fileName = file.name.split('.').slice(0, -1).join('.')
                const formattedName = fileName.replace(/[-_]/g, ' ')

                setSubCategoryData((preve) => {
                    return {
                        ...preve,
                        image: response.imageUrl,
                        name: formattedName // Auto-set name from filename
                    }
                })
            }
        } catch (error) {
            toast.error("Upload failed", { id: "upload" })
            AxiosToastError(error)
        }
    }

    const handleRemoveCategorySelected = (categoryId) => {
        setSubCategoryData((preve) => {
            return {
                ...preve,
                category: preve.category.filter(el => el._id !== categoryId)
            }
        })
    }

    const handleSubmitSubCategory = async (e) => {
        e.preventDefault()

        if (!subCategoryData.name || !subCategoryData.image || subCategoryData.category.length === 0) {
            toast.error("Please fill all fields")
            return
        }

        try {
            const response = await Axios({
                ...SummaryApi.updateSubCategory,
                data: subCategoryData
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                if (close) {
                    close()
                }
                if (fetchData) {
                    fetchData()
                }
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='fixed top-0 right-0 bottom-0 left-0 bg-black/60 z-50 animate-fadeIn flex items-center justify-center p-4 backdrop-blur-sm'>
            <div className='w-full max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl relative animate-in fade-in zoom-in duration-300 border border-white/20'>
                <div className='flex items-center justify-between mb-8'>
                    <h1 className='text-2xl font-bold text-gray-800 dark:text-gray-100'>Edit Sub Category</h1>
                    <button
                        onClick={close}
                        className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                    >
                        <IoClose size={28} />
                    </button>
                </div>

                <form className='grid gap-6' onSubmit={handleSubmitSubCategory}>
                    <div className='grid gap-2'>
                        <label htmlFor='name' className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Sub Category Name</label>
                        <input
                            id='name'
                            name='name'
                            placeholder='Enter sub category name'
                            value={subCategoryData.name}
                            onChange={handleChange}
                            className='p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900/30 rounded-2xl transition-all dark:text-gray-100'
                        />
                    </div>

                    <div className='grid gap-2'>
                        <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Image</label>
                        <div className='flex flex-col lg:flex-row items-center gap-6'>
                            <div className='border-2 border-dashed border-gray-200 dark:border-gray-600 h-40 w-full lg:w-40 bg-gray-50 dark:bg-gray-700/50 rounded-2xl flex items-center justify-center overflow-hidden group relative'>
                                {
                                    !subCategoryData.image ? (
                                        <div className='text-center p-4'>
                                            <p className='text-xs text-gray-400 dark:text-gray-500'>No Image Selected</p>
                                        </div>
                                    ) : (
                                        <img
                                            alt='subCategory'
                                            src={subCategoryData.image}
                                            className='w-full h-full object-cover transition-transform group-hover:scale-110'
                                        />
                                    )
                                }
                            </div>
                            <label htmlFor='uploadSubCategoryImage' className='cursor-pointer w-full lg:w-auto'>
                                <div className='px-6 py-3 border-2 border-green-600 dark:border-green-500 text-green-600 dark:text-green-500 font-bold rounded-2xl hover:bg-green-600 hover:text-white dark:hover:bg-green-500 dark:hover:text-white transition-all text-center'>
                                    Change Image
                                </div>
                                <input
                                    type='file'
                                    id='uploadSubCategoryImage'
                                    className='hidden'
                                    onChange={handleUploadSubCategoryImage}
                                />
                            </label>
                        </div>
                    </div>

                    <div className='grid gap-2'>
                        <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Select Category</label>
                        <div className='grid gap-3'>
                            <SelectionDropdown
                                placeholder="Choose a Category"
                                options={allCategory}
                                onChange={(value) => {
                                    if (!value) return
                                    const categoryDetails = allCategory.find(el => el._id == value)

                                    // Avoid duplicates
                                    if (subCategoryData.category.some(el => el._id === value)) return

                                    setSubCategoryData((preve) => {
                                        return {
                                            ...preve,
                                            category: [...preve.category, categoryDetails]
                                        }
                                    })
                                }}
                            />

                            <div className='flex flex-wrap gap-2 min-h-[40px]'>
                                {
                                    subCategoryData.category.map((cat) => (
                                        <div key={cat._id + "selectedValue"} className='bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-100 dark:border-green-800 px-3 py-1.5 rounded-xl flex items-center gap-2 animate-in slide-in-from-left-2 duration-200'>
                                            <span className='text-sm font-medium'>{cat.name}</span>
                                            <button
                                                type='button'
                                                className='hover:text-red-500 transition-colors'
                                                onClick={() => handleRemoveCategorySelected(cat._id)}
                                            >
                                                <IoClose size={18} />
                                            </button>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                    <button
                        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg
                            ${subCategoryData?.name && subCategoryData?.image && subCategoryData?.category.length > 0
                                ? "bg-green-600 text-white hover:bg-green-700 hover:shadow-green-200 dark:hover:shadow-none"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"}
                        `}
                    >
                        Update Sub Category
                    </button>
                </form>
            </div>
        </section>
    )
}

export default EditSubCategory

