import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
    api_key: process.env.CLOUDINARY_API_KEY?.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
});

const uploadImageCloudinary = async (image) => {
    const buffer = image?.buffer;

    if (!buffer) {
        throw new Error("No image buffer found. Make sure multer memory storage is used.");
    }

    const uploadImage = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: "EASYBUY" }, (error, uploadResult) => {
            if (error) return reject(error);
            return resolve(uploadResult);
        }).end(buffer);
    })

    return uploadImage;
}

export default uploadImageCloudinary;

