import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import uploadImage from "../utils/UploadImage";
import axios from "axios";
import { SummaryApi } from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { toast } from "react-toastify";





function UploadCategoryModel({ close, fetchData }) {

  const [data, setData] = useState({
    name: "",
    image: ""
  });
  const [loading, setloading] = useState(false);
  // Add loading state for image upload specifically
  const [isImageUploading, setIsImageUploading] = useState(false);


  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Double check to prevent submission during upload
    if (isImageUploading) {
        toast.warning("Please wait for image upload to complete.");
        return;
    }


    try {
      setloading(true);

      console.log("Submitting Category Data:", { name: data.name, image: data.image }); // DEBUG LOG

      const response = await axios({
        ...SummaryApi.addCategory,
        data: { name: data.name, image: data.image },
        withCredentials: true,
      });

      const responseData = response.data;
      console.log("Add Category Response:", responseData); // DEBUG LOG

      if (responseData?.success) {
        toast.success(responseData?.message || "Category created successfully"); // ✅
        close();
        fetchData();
      } else {
        toast.error(responseData?.message || "Failed to create category"); // ✅
      }
    } catch (error) {
      AxiosToastError(error); // ✅
    } finally {
      setloading(false);
    }
  };



  const handleUploadCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Auto-set Category Name from filename (without extension) if empty
    const imageName = file.name.split('.').slice(0, -1).join('.');
    
    // Set loading state
    setIsImageUploading(true);
    
    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setData((prev) => ({
      ...prev,
      image: localPreview,
      // Only set name if it's currently empty to avoid overwriting user input
      name: prev.name ? prev.name : imageName 
    }));

    try {
      const response = await uploadImage(file);
      const uploadedUrl = response?.data?.url || response?.imageUrl || response?.data?.imageUrl; // Handle various response structures just in case, though based on controller it's imageUrl
      
      // Based on controller: return res.status(200).json({ ..., imageUrl: ... })
      // Based on uploadImage util: returns response.data directly.
      // So response should be { message, imageUrl, success, error }
      
      const verifiedUrl = response?.imageUrl;

      if (!verifiedUrl) {
         throw new Error("Upload URL not found in response");
      }

      setData((prev) => ({ ...prev, image: verifiedUrl }));
      // toast.success("Image uploaded successfully!"); // Optional: might be too noisy
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("Image upload failed");
    } finally {
        setIsImageUploading(false);
    }
  };


  // Disable if: 
  // 1. Name is empty
  // 2. Image is empty
  // 3. Main form loading is true
  // 4. Image is currently uploading
  const isDisabled = !data.name.trim() || !data.image.trim() || loading || isImageUploading;


  return (
    <section
      onClick={close}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-[3rem] shadow-2xl p-8 animate-scaleIn relative overflow-hidden border border-white/20"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50 dark:border-gray-700">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Add New Category</h2>
            <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">Create a new category for your store</p>
          </div>
          <button
            onClick={close}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 rounded-2xl transition-all"
          >
            <IoClose size={28} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Category Name */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleOnChange}
              placeholder="e.g. Fresh Vegetables"
              className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent focus:border-[#00b050] focus:bg-white dark:focus:bg-gray-700 focus:ring-4 focus:ring-[#00b050]/10 rounded-[1.5rem] outline-none transition-all font-bold text-gray-800 dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-500"
            />
          </div>

          {/* Category Image */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">
              Category Image
            </label>

            <div className="flex items-center gap-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-600 hover:border-[#00b050]/30 transition-colors group">
              <div className="w-28 h-28 shrink-0 rounded-[1.5rem] bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center overflow-hidden border border-gray-100 dark:border-gray-700 group-hover:scale-105 transition-transform duration-500">
                {data.image ? (
                  <img
                    src={data.image}
                    alt="category"
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-300 dark:text-gray-500 text-[10px] font-black">?</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-tight">
                    {data.image ? "Change existing image" : "Upload a clean, high-quality PNG or JPG image for this category"}
                </p>
                <label className="cursor-pointer group/btn">
                  <div className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center gap-2 ${
                    (loading || isImageUploading) 
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed" 
                    : "bg-white dark:bg-gray-800 text-[#00b050] border-2 border-[#00b050]/20 hover:border-[#00b050] hover:bg-[#00b050]/5 dark:hover:bg-[#00b050]/10"
                  }`}>
                    {isImageUploading ? "Uploading..." : "SELECT IMAGE"}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    disabled={loading || isImageUploading}
                    onChange={handleUploadCategoryImage}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={isDisabled}
            className={`w-full py-5 rounded-[1.5rem] font-black text-lg tracking-tight transition-all shadow-xl ${
              isDisabled
                ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed shadow-none"
                : "bg-[#00b050] text-white hover:bg-[#00b060] shadow-[#00b050]/30 dark:shadow-none active:scale-[0.98]"
            }`}
          >
            {loading ? "CREATING..." : "PUBLISH CATEGORY"}
          </button>
        </form>
      </div>
    </section>
  );

}

export default UploadCategoryModel;
