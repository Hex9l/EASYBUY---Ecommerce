import React, { useEffect, useState } from 'react'
import UploadCategoryModel from '../components/UploadCategoryModel'
import Loading from '../components/Loading';
import NoData from '../components/NoData';
import { SummaryApi } from '../common/SummaryApi';
import Axios from '../utils/Axios';

function CategoryPage() {

  const [openUploadCategory, setOpenUploadCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [openEdit,setOpenEdit] = useState()

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

  // Local fallback image (developer-provided path)
  const fallbackImage = "/mnt/data/8f83db83-e7b8-4286-96a1-f997eb60161c.png";

  return (
    <section className="w-full max-w-6xl mx-auto px-4">

      {/* Header */}
      <div className="
        p-4
        flex items-center justify-between 
        shadow-md 
        font-semibold 
        text-base 
        sm:text-lg 
        md:text-xl
        
      ">
        <h2>Category</h2>

        <button
          onClick={() => setOpenUploadCategory(true)}
          className="
            text-sm sm:text-base
            rounded-md py-1 px-3 
            bg-blue-500 text-white hover:bg-blue-600 
          "
        >
          Add Category
        </button>
      </div>

      {/* No Data */}
      {categoryData.length === 0 && !loading && (
        <div className="flex justify-center mt-8 px-4">
          <NoData />
        </div>
      )}

      {/* Categories grid */}


      <div className="flex flex-wrap justify-start gap-4 sm:gap-6 py-6">

        {categoryData?.length > 0 ? (
          categoryData.map((category) => (
            <div
              key={category._id || category.name}
              className="
          w-[46%] sm:w-40
          bg-white shadow-sm rounded-2xl
          flex flex-col
          transition-all duration-200
          hover:shadow-lg
        "
            >
              {/* Image Section (BIGGER & CLEAR) */}
              <div className="w-full flex items-center justify-center p-4">
                <img
                  src={category.image || fallbackImage}
                  alt={category.name || "category"}
                  className="
              object-contain
              rounded-xl
              max-h-40
              w-full
            "
                />
              </div>

              {/* Subtle Divider */}
              <div className="w-full h-px bg-gray-100"></div>

              {/* Action Buttons (NORMAL SIZE) */}
              <div className="w-full flex items-center justify-between px-4 py-3 gap-2">

                {/* Edit */}
                <button
                  className="
              text-green-600 text-sm font-medium
              px-3 py-1.5
              rounded-md
              hover:bg-green-50
              transition
            "
                >
                  Edit
                </button>

                {/* Delete */}
                <button
                  className="
              text-red-600 text-sm font-medium
              px-3 py-1.5
              rounded-md
              hover:bg-red-50
              transition
            "
                >
                  Delete
                </button>

              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center w-full text-lg">
            No categories found
          </p>
        )}

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
    </section>
  )
}

export default CategoryPage;
