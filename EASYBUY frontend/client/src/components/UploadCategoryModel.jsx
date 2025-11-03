import React, { useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import uploadImage from "../utils/uploadimage";

function UploadCategoryModel({ close }) {
  const [data, setData] = useState({ name: "", image: "" });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted data:", data);
  };
  const handleUploadCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Local preview
    const localPreview = URL.createObjectURL(file);
    setData((prev) => ({ ...prev, image: localPreview }));

    try {
      const response = await uploadImage(file);
      console.log("Upload response:", response);

      // Try to safely access the URL
      const uploadedUrl =
        response?.data?.url || response?.url || response?.data?.data?.url;

      if (!uploadedUrl) throw new Error("Upload URL not found in response");

      setData((prev) => ({ ...prev, image: uploadedUrl }));
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  // ✅ NEW: Disable button until both fields are filled
  const isDisabled = !data.name.trim() || !data.image.trim();




  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-3 sm:px-4">
      <div className="w-full max-w-sm sm:max-w-md bg-white p-4 sm:p-6 rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-2 mb-4">
          <h1 className="text-base sm:text-lg font-semibold text-gray-800">
            Add Category
          </h1>
          <button
            onClick={close}
            aria-label="Close"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <IoIosCloseCircle size={28} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Name */}
          <div className="grid gap-1.5">
            <label
              htmlFor="categoryName"
              className="text-sm font-medium text-gray-700"
            >
              Category Name
            </label>
            <input
              id="categoryName"
              name="name"
              type="text"
              placeholder="Enter category name"
              value={data.name}
              onChange={handleOnChange}
              required
              className="w-full p-2.5 sm:p-3 rounded-md border border-gray-300 bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm transition-all"
            />
          </div>

          {/* Category Image */}
          <div className="grid gap-1.5">
            <label
              htmlFor="categoryImage"
              className="text-sm font-medium text-gray-700"
            >
              Category Image
            </label>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <input
                id="categoryImage"
                type="file"
                accept="image/*"
                onChange={handleUploadCategoryImage}
                className="block  text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none file:mr-2 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
              />

              {data.image ? (
                <img
                  src={data.image}
                  alt="Preview"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-md object-cover border border-gray-300"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-md bg-gray-100 border border-gray-300 text-gray-400 text-xs">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isDisabled}   // ✅ added
            className={`w-full py-2.5 rounded-md text-white text-sm font-medium transition-colors ${isDisabled
              ? "bg-gray-400 cursor-not-allowed"   // ✅ gray when disabled
              : "bg-blue-600 hover:bg-blue-700"    // ✅ blue when active
              }`}
          >
            Upload Category
          </button>

        </form>
      </div>
    </section>
  );
}

export default UploadCategoryModel;
