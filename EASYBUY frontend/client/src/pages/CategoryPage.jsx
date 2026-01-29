import React, { useEffect, useState } from 'react'
import UploadCategoryModel from '../components/UploadCategoryModel'
import Loading from '../components/Loading';
import NoData from '../components/NoData';
import { SummaryApi } from '../common/SummaryApi';
import Axios from '../utils/Axios';
import EditCategory from '../components/EditCategory'; // Imported
import ConfirmDelete from '../components/ConfirmDelete'; // Imported
import { toast } from 'react-toastify';
import AxiosToastError from '../utils/AxiosToastError';

function CategoryPage() {
  const [openUploadCategory, setOpenUploadCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);

  // State for Edit/Delete
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editData, setEditData] = useState({});
  const [deleteCategory, setDeleteCategory] = useState({ _id: "" });

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getCategory,
      });
      const { data: responseData } = response;

      if (responseData?.success) {
        setCategoryData(responseData.data || []);
      } else {
        setCategoryData([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategoryData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleDeleteCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteCategory,
        data: { categoryId: deleteCategory._id } // Send data body
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        fetchCategory();
        setOpenDelete(false);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  }

  // Local fallback image (developer-provided path)
  const fallbackImage = "/mnt/data/8f83db83-e7b8-4286-96a1-f997eb60161c.png";

  return (
    <section className='min-h-full'>
      <div className='sticky top-24 lg:top-20 z-10 p-4 lg:p-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-between mb-6 transition-colors duration-300'>
        <h2 className='font-bold text-xl lg:text-2xl text-gray-800 dark:text-gray-100'>Categories</h2>
        <button
          onClick={() => setOpenUploadCategory(true)}
          className='bg-[#00b050] text-white px-4 lg:px-6 py-2 lg:py-2.5 rounded-xl lg:rounded-2xl font-bold shadow-lg shadow-[#00b050]/20 hover:bg-[#00b060] transition-all active:scale-95 text-sm lg:text-base'
        >
          Add Category
        </button>
      </div>

      {categoryData.length === 0 && !loading && (
        <div className='min-h-[60vh] flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-[3rem] border border-gray-100 dark:border-gray-700 transition-colors duration-300'>
          <NoData />
        </div>
      )}

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6'>
        {categoryData.map((category) => (
          <div
            key={category._id}
            className='group bg-white dark:bg-gray-800 p-3 lg:p-4 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300'
          >
            <div className='h-24 lg:h-32 w-full mb-3 lg:mb-4 flex items-center justify-center bg-gray-50/50 dark:bg-gray-700/50 rounded-2xl lg:rounded-3xl overflow-hidden group-hover:bg-[#00b050]/5 dark:group-hover:bg-[#00b050]/10 transition-colors duration-500'>
              <img
                src={category.image || fallbackImage}
                alt={category.name}
                className='w-full h-full object-scale-down p-2 group-hover:scale-110 transition-transform duration-500'
              />
            </div>

            <div className='px-1 mb-3 lg:mb-4'>
              <h3 className='font-bold text-gray-800 dark:text-gray-200 text-center truncate text-sm lg:text-[15px]' title={category.name}>
                {category.name}
              </h3>
            </div>

            <div className='flex items-center gap-1.5 lg:gap-2'>
              <button
                onClick={() => {
                  setEditData(category);
                  setOpenEdit(true);
                }}
                className='flex-1 py-2 text-xs font-bold border-2 border-[#00b050]/20 bg-[#00b050]/5 dark:bg-[#00b050]/10 text-[#00b050] hover:bg-[#00b050] hover:text-white hover:border-[#00b050] rounded-xl transition-all'
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setDeleteCategory(category);
                  setOpenDelete(true);
                }}
                className='flex-1 py-2 text-xs font-bold border-2 border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-xl transition-all'
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center mt-10">
          <Loading />
        </div>
      )}

      {/* Upload Model */}
      {openUploadCategory && (
        <UploadCategoryModel fetchData={fetchCategory} close={() => setOpenUploadCategory(false)} />
      )}

      {/* Edit Model */}
      {openEdit && (
        <EditCategory
          data={editData}
          close={() => setOpenEdit(false)}
          fetchData={fetchCategory}
        />
      )}

      {/* Delete Confirmation */}
      {openDelete && (
        <ConfirmDelete
          close={() => setOpenDelete(false)}
          cancel={() => setOpenDelete(false)}
          confirm={handleDeleteCategory}
        />
      )}

    </section>
  )
}

export default CategoryPage;
