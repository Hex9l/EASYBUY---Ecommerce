import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import Axios from "../utils/Axios";
import { SummaryApi } from "../common/SummaryApi";
import { updateAvatar } from "../store/userSlice";
import AxiosToastError from "../utils/AxiosToastError";

const UserProfileAvatarEdit = ({ close }) => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const modalRef = useRef(null);

    const handleUploadAvatarImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            setLoading(true);

            const response = await Axios({
                ...SummaryApi.uploadAvatar, // PUT /api/user/upload-avatar
                data: formData,
            });

            // ✅ Cloudinary URL must come from backend
            const avatarUrl = response?.data?.data?.avatar;

            if (avatarUrl) {
                dispatch(updateAvatar(avatarUrl));
            }

        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Close modal on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                close();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [close]);

    return (
        <section className="fixed inset-0 w-full h-full bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-[9999]">
            <div
                ref={modalRef}
                className="bg-white dark:bg-gray-800 m-10 rounded-xl shadow-lg py-10 w-full max-w-md flex flex-col items-center transition-colors duration-300"
            >
                <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                    Edit Profile Avatar
                </h2>

                {/* Avatar Preview */}
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-full overflow-hidden drop-shadow-lg transition-colors">
                    {user?.avatar ? (
                        <img
                            src={user.avatar}   // ✅ MUST be cloudinary URL
                            alt="User Avatar"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <FaUserCircle size={70} className="text-gray-500 dark:text-gray-400" />
                    )}
                </div>

                <label
                    htmlFor="uploadProfile"
                    className={`mt-5 px-5 py-2 rounded-full cursor-pointer text-white font-medium shadow-md transition-all ${loading
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                        }`}
                >
                    {loading ? "Uploading..." : "Upload"}

                    <input
                        type="file"
                        id="uploadProfile"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUploadAvatarImage}
                        disabled={loading}
                    />
                </label>
            </div>
        </section>
    );
};

export default UserProfileAvatarEdit;
