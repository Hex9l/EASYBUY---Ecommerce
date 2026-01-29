import React, { useEffect, useState } from 'react'
import UploadSubCategoryModel from '../components/UploadSubCategoryModel'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import { HiPencil } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import EditSubCategory from '../components/EditSubCategory'
import ConfirmDelete from '../components/ConfirmDelete'
import toast from 'react-hot-toast'
import { SummaryApi } from '../common/SummaryApi'
import ViewImage from '../components/ViewImage'

const SubCategoryPage = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [ImageURL, setImageURL] = useState("")
  const [openEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState({
    _id: ""
  })
  const [deleteSubCategory, setDeleteSubCategory] = useState({
    _id: ""
  })
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false)
  const [search, setSearch] = useState("")

  const fetchSubCategory = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getSubCategory
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
    fetchSubCategory()
  }, [])

  const handleDeleteSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteSubCategory,
        data: deleteSubCategory
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        fetchSubCategory()
        setOpenDeleteConfirmBox(false)
        setDeleteSubCategory({ _id: "" })
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    (item.category && item.category.some(cat => cat.name.toLowerCase().includes(search.toLowerCase())))
  )

  return (
    <section className='min-h-full'>
      {/* Top Header Card */}
      <div className='sticky top-24 lg:top-20 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 mb-6 transition-colors duration-300'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
          <div>
            <h2 className='text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight'>Sub Category</h2>
            <p className='text-gray-500 dark:text-gray-400 mt-1 font-medium'>Manage your store's sub-categories and their associations.</p>
          </div>
          <button
            onClick={() => setOpenAddSubCategory(true)}
            className='bg-green-600 hover:bg-green-700 text-white px-8 py-3.5 rounded-2xl transition-all shadow-lg shadow-green-100 dark:shadow-none active:scale-95 font-bold flex items-center gap-2'
          >
            <span>Add Sub Category</span>
          </button>
        </div>

        <div className='mt-8 flex flex-col sm:flex-row items-center gap-4'>
          <div className='relative w-full max-w-md'>
            <input
              type='text'
              placeholder='Search sub category or category...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900/30 focus:border-green-500 transition-all font-medium text-gray-800 dark:text-gray-200'
            />
            <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className='text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl'>
            Total: {filteredData.length}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300'>
        {loading ? (
          <div className='flex flex-col justify-center items-center py-32 gap-4'>
            <div className='animate-spin rounded-full h-14 w-14 border-4 border-gray-100 dark:border-gray-700 border-t-green-600'></div>
            <p className='text-gray-500 dark:text-gray-400 font-bold animate-pulse'>Loading subcategories...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-32 text-center px-4'>
            <div className='bg-gray-50 dark:bg-gray-700 p-8 rounded-full mb-6'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-200 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>No results found</h3>
            <p className='text-gray-500 dark:text-gray-400 max-w-xs mt-2 font-medium'>
              {search ? `We couldn't find anything matching "${search}"` : "Your subcategory list is empty. Start by adding one!"}
            </p>
            {!search && (
              <button
                onClick={() => setOpenAddSubCategory(true)}
                className='mt-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3.5 rounded-2xl hover:bg-black dark:hover:bg-gray-200 transition-all font-bold shadow-xl shadow-gray-200 dark:shadow-none active:scale-95'
              >
                Create New Subcategory
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className='hidden lg:block overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50/50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700'>
                  <tr>
                    <th className='px-8 py-5 text-left text-[11px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-[2px]'>Sr.No</th>
                    <th className='px-8 py-5 text-left text-[11px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-[2px]'>Sub Category Name</th>
                    <th className='px-8 py-5 text-center text-[11px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-[2px]'>Preview</th>
                    <th className='px-8 py-5 text-left text-[11px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-[2px]'>Category</th>
                    <th className='px-8 py-5 text-center text-[11px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-[2px]'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-50 dark:divide-gray-700/50'>
                  {filteredData.map((subCategory, index) => (
                    <tr
                      key={subCategory._id}
                      className='hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors'
                    >
                      <td className='px-8 py-5 whitespace-nowrap text-sm font-bold text-gray-400 dark:text-gray-500'>
                        {index + 1}
                      </td>
                      <td className='px-8 py-5 whitespace-nowrap'>
                        <div className='text-base font-bold text-green-700 dark:text-green-400'>{subCategory.name}</div>
                      </td>
                      <td className='px-8 py-5 whitespace-nowrap'>
                        <div className='flex justify-center'>
                          <div className='h-16 w-16 rounded-2xl bg-gray-50 dark:bg-gray-700 border border-green-100 dark:border-gray-600 flex items-center justify-center p-1.5 shadow-sm'>
                            <img
                              src={subCategory.image}
                              alt={subCategory.name}
                              className='h-full w-full object-contain cursor-pointer hover:scale-110 transition-transform duration-300 mix-blend-multiply dark:mix-blend-normal'
                              onClick={() => setImageURL(subCategory.image)}
                            />
                          </div>
                        </div>
                      </td>
                      <td className='px-8 py-5'>
                        <div className='flex flex-wrap gap-2'>
                          {subCategory.category && subCategory.category.length > 0 ? (
                            subCategory.category.map((cat) => (
                              <span
                                key={cat._id}
                                className='inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800 shadow-sm'
                              >
                                {cat.name}
                              </span>
                            ))
                          ) : (
                            <span className='text-sm font-medium text-gray-300 dark:text-gray-600 italic'>Uncategorized</span>
                          )}
                        </div>
                      </td>
                      <td className='px-8 py-5 whitespace-nowrap'>
                        <div className='flex items-center justify-center gap-4'>
                          <button
                            onClick={() => {
                              setOpenEdit(true)
                              setEditData(subCategory)
                            }}
                            className='h-10 w-10 flex items-center justify-center bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 rounded-full shadow hover:shadow-lg transition-all active:scale-95 border border-gray-100 dark:border-gray-600'
                            title='Edit'
                          >
                            <HiPencil size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setOpenDeleteConfirmBox(true)
                              setDeleteSubCategory(subCategory)
                            }}
                            className='h-10 w-10 flex items-center justify-center bg-white dark:bg-gray-700 text-red-500 dark:text-red-400 rounded-full shadow hover:shadow-lg transition-all active:scale-95 border border-gray-100 dark:border-gray-600'
                            title='Delete'
                          >
                            <MdDelete size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4 p-4'>
              {filteredData.map((subCategory, index) => (
                <div
                  key={subCategory._id}
                  className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 flex flex-col gap-4 hover:shadow-md transition-shadow'
                >
                  <div className='flex items-center gap-4'>
                    <div className='h-20 w-20 shrink-0 rounded-2xl bg-gray-50 dark:bg-gray-700 border border-green-100 dark:border-gray-600 flex items-center justify-center p-2 shadow-sm'>
                      <img
                        src={subCategory.image}
                        alt={subCategory.name}
                        className='h-full w-full object-contain cursor-pointer mix-blend-multiply dark:mix-blend-normal'
                        onClick={() => setImageURL(subCategory.image)}
                      />
                    </div>
                    <div className='flex flex-col gap-1'>
                      <h3 className='text-lg font-bold text-green-700 dark:text-green-400'>{subCategory.name}</h3>
                      <div className='flex flex-wrap gap-1.5'>
                        {subCategory.category && subCategory.category.length > 0 ? (
                          subCategory.category.map((cat) => (
                            <span
                              key={cat._id}
                              className='inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800'
                            >
                              {cat.name}
                            </span>
                          ))
                        ) : (
                          <span className='text-xs font-medium text-gray-300 dark:text-gray-600'>Uncategorized</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center justify-between border-t border-gray-50 dark:border-gray-700 pt-3 mt-auto'>
                    <span className='text-xs font-bold text-gray-400 dark:text-gray-500'>#{index + 1}</span>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => {
                          setOpenEdit(true)
                          setEditData(subCategory)
                        }}
                        className='flex items-center gap-1.5 bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 px-4 py-2 rounded-xl text-sm font-bold active:scale-95 transition-transform'
                      >
                        <HiPencil size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setOpenDeleteConfirmBox(true)
                          setDeleteSubCategory(subCategory)
                        }}
                        className='flex items-center gap-1.5 bg-red-50 dark:bg-red-900/10 text-red-500 dark:text-red-400 px-4 py-2 rounded-xl text-sm font-bold active:scale-95 transition-transform'
                      >
                        <MdDelete size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modals & Overlays */}
      {openAddSubCategory && (
        <UploadSubCategoryModel
          close={() => setOpenAddSubCategory(false)}
          fetchData={fetchSubCategory}
        />
      )}

      {ImageURL && (
        <ViewImage url={ImageURL} close={() => setImageURL("")} />
      )}

      {openEdit && (
        <EditSubCategory
          data={editData}
          close={() => setOpenEdit(false)}
          fetchData={fetchSubCategory}
        />
      )}

      {openDeleteConfirmBox && (
        <ConfirmDelete
          cancel={() => setOpenDeleteConfirmBox(false)}
          close={() => setOpenDeleteConfirmBox(false)}
          confirm={handleDeleteSubCategory}
        />
      )}
    </section>
  )
}

export default SubCategoryPage
