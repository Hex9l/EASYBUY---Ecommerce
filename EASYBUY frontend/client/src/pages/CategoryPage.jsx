



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
      <div className=" flex flex-wrap justify-start gap-4 sm:gap-6 py-6">

        {categoryData?.length > 0 ? (
          categoryData.map((category) => (
            <div
              key={category._id || category.name}
              className="
                w-[46%] sm:w-30
                bg-white shadow-md rounded-2xl  
                flex flex-col items-start
                cursor-pointer transition-all duration-200
                hover:shadow-xl
              "
            >
              {/* Image box: fixed height, center-aligned */}
              <div className="w-full  flex items-center justify-center overflow-hidden px-1">
                <img
                  src={category.image || fallbackImage}
                  alt={category.name || "category"}
                  // Use height-fill + auto width to minimize left-right white space
                  className="object-contain rounded-xl"
                />
              </div>

              
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center w-full text-xl"></p>
        )}

      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center mt-10">
          <Loading />
        </div>
      )}

      {/* Upload Modal */}
      {openUploadCategory && (
        <UploadCategoryModel fetchData={fetchCategory} close={() => setOpenUploadCategory(false)} />
      )}
    </section>
  )
}

export default CategoryPage;
