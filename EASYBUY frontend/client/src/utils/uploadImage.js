// frontend/src/utils/uploadimage.js
import Axios from "axios";
import { SummaryApi } from "../common/SummaryApi";

const uploadImage = async (image) => {
    try {
        const formData = new FormData();
        formData.append("image", image);

        const response = await Axios({
            ...SummaryApi.uploadimage,
            data: formData,
        });

        return response.data;
    } catch (error) {
        console.error("Upload image error:", error);
        throw error;
    }
};

export default uploadImage;
