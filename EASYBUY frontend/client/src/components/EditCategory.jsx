import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import uploadImage from "../utils/UploadImage";
import Axios from "../utils/Axios";
import { SummaryApi } from "../common/SummaryApi";
import { toast } from "react-toastify";
import AxiosToastError from "../utils/AxiosToastError";

const EditCategory = ({ close, fetchData, data }) => {
    const [dataCategory, setDataCategory] = useState({
        _id: data._id,
        name: data.name || "",
        image: data.image || "",
    });

    const [loading, setLoading] = useState(false);

    // ------------------- INPUT CHANGE -------------------
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setDataCategory((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ------------------- IMAGE UPLOAD -------------------
    const handleUploadCategoryImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // local preview
        const preview = URL.createObjectURL(file);
        setDataCategory((prev) => ({
            ...prev,
            image: preview,
        }));

        try {
            setLoading(true);
            const response = await uploadImage(file);
            if (response?.imageUrl) {
                setDataCategory((prev) => ({
                    ...prev,
                    image: response.imageUrl,
                }));
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    // ------------------- SUBMIT -------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!dataCategory.name || !dataCategory.image) {
            toast.error("All fields are required");
            return;
        }

        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.updateCategory,
                data: {
                    categoryId: dataCategory._id,
                    name: dataCategory.name,
                    image: dataCategory.image,
                },
            });

            if (response?.data?.success) {
                toast.success(response.data.message);
                close();
                fetchData();
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    // ------------------- UI -------------------
    return (
    <section
        onClick={close}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
    >
        <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-8 animate-scaleIn relative overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                <div className="flex flex-col">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight text-nowrap">Update Category</h2>
                    <p className="text-gray-400 text-sm font-medium">Modify category details</p>
                </div>
                <button
                    onClick={close}
                    className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-2xl transition-all"
                >
                    <IoClose size={28} />
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Category Name */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest px-1">
                        Category Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={dataCategory.name}
                        onChange={handleOnChange}
                        placeholder="e.g. Fresh Vegetables"
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#00b050] focus:bg-white focus:ring-4 focus:ring-[#00b050]/10 rounded-[1.5rem] outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300"
                    />
                </div>

                {/* Category Image */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest px-1">
                        Category Image
                    </label>

                    <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 hover:border-[#00b050]/30 transition-colors group">
                        <div className="w-28 h-28 shrink-0 rounded-[1.5rem] bg-white shadow-sm flex items-center justify-center overflow-hidden border border-gray-100 group-hover:scale-105 transition-transform duration-500">
                            {dataCategory.image ? (
                                <img
                                    src={dataCategory.image}
                                    alt="category"
                                    className="w-full h-full object-contain p-2"
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                                        <span className="text-gray-300 text-[10px] font-black">?</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-3">
                            <p className="text-sm text-gray-500 font-medium leading-tight">
                                {dataCategory.image ? "Change current image" : "Upload a clean, high-quality PNG or JPG image"}
                            </p>
                            <label className="cursor-pointer group/btn">
                                <div className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center gap-2 ${loading
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white text-[#00b050] border-2 border-[#00b050]/20 hover:border-[#00b050] hover:bg-[#00b050]/5"
                                    }`}>
                                    {loading ? "Uploading..." : "CHANGE IMAGE"}
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    disabled={loading}
                                    onChange={handleUploadCategoryImage}
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    disabled={loading || !dataCategory.name || !dataCategory.image}
                    className={`w-full py-5 rounded-[1.5rem] font-black text-lg tracking-tight transition-all shadow-xl ${loading || !dataCategory.name || !dataCategory.image
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                        : "bg-[#00b050] text-white hover:bg-[#00b060] shadow-[#00b050]/30 active:scale-[0.98]"
                        }`}
                >
                    {loading ? "UPDATING..." : "UPDATE CATEGORY"}
                </button>
            </form>
        </div>
    </section>
    );
};

export default EditCategory;
