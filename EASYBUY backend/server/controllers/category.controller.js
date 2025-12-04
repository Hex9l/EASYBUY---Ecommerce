import CategoryModel from "../model/category.model.js";



export const AddCategoryController = async (req, res) => {
  try {
    const { name, image } = req.body;

    // ✅ 1. Validate input
    if (!name?.trim() || !image?.trim()) {
      return res.status(400).json({
        message: "Both name and image are required",
        error: true,
        success: false,
      });
    }

    // ✅ 2. Prevent duplicate category name (optional but good)
    const existingCategory = await CategoryModel.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.status(409).json({
        message: "Category name already exists",
        error: true,
        success: false,
      });
    }

    // ✅ 3. Create and save new category
    const newCategory = new CategoryModel({
      name: name.trim(),
      image: image.trim(),
    });

    const savedCategory = await newCategory.save();

    // ✅ 4. Success response
    return res.status(201).json({
      message: "Category added successfully",
      category: savedCategory,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("AddCategoryController Error:", error);

    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};


export const GetCategoryController = async (req, res) => {
  try {
    const data = await CategoryModel.find({});
    return res.status(200).json({
      message: "Categories fetched successfully",
      error: false,
      success: true,
      data,   // <-- here
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}
