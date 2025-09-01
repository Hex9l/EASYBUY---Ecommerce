
import React, { useState, useRef, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import Axios from '../utils/Axios';
import { SummaryApi } from '../common/SummaryApi';
import { updateAvatar } from '../store/userSlice';
import AxiosToastError from '../utils/AxiosToastError';

const UserProfileAvatarEdit = ({ close }) => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const modalRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const handleUploadAvatarImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            setLoading(true);

            const response = await Axios({
                ...SummaryApi.uploadAvatar,
                data: formData,
            });

            console.log("Avatar uploaded successfully:", response.data);

            const { data: responseData } = response;
            dispatch(updateAvatar(responseData.data.avatar));

        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Close when clicking outside
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
                className="bg-white m-10 rounded-xl shadow-lg py-10 w-full max-w-md flex flex-col items-center relative"
            >
                <h2 className="text-xl font-semibold mb-6">Edit Profile Avatar</h2>

                {/* Avatar Preview */}
                <div className="w-20 h-20 bg-red-300 flex items-center justify-center rounded-full overflow-hidden drop-shadow-lg">
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <FaUserCircle size={70} />
                    )}
                </div>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="uploadProfile" className="cursor-pointer">
                        <div
                            className={`flex items-center justify-center px-5 py-2 mt-5 max-w-20 rounded-full ${
                                loading
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-blue-600 hover:bg-blue-700"
                            } text-white`}
                        >
                            <span className="text-sm">
                                {loading ? "Loading..." : "Upload"}
                            </span>
                        </div>

                        <input
                            onChange={handleUploadAvatarImage}
                            type="file"
                            id="uploadProfile"
                            accept="image/*"
                            className="hidden"
                            disabled={loading}
                        />
                    </label>
                </form>
            </div>
        </section>
    );
};

export default UserProfileAvatarEdit;
