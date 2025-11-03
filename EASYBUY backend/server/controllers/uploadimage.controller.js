import uploadImageCloudinary from "../utils/uploadimageCloudinary.js";

const uploadImageController = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: "No file provided",
        success: false,
      });
    }

    const uploadedImage = await uploadImageCloudinary(file);

    return res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: uploadedImage.secure_url, // ✅ use secure_url (not url)
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Upload failed",
      error: true,
      success: false,
    });
  }
};

export default uploadImageController;
