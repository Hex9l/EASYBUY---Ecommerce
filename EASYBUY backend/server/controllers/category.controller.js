// import CategoryModel from "../model/category.model.js";



// export const AddCategoryController = async (req, res) => {
//   try {
//     const { name, image } = req.body;

//     // ✅ 1. Validate input
//     if (!name?.trim() || !image?.trim()) {
//       return res.status(400).json({
//         message: "Both name and image are required",
//         error: true,
//         success: false,
//       });
//     }

//     // ✅ 2. Prevent duplicate category name (optional but good)
//     const existingCategory = await CategoryModel.findOne({ name: name.trim() });
//     if (existingCategory) {
//       return res.status(409).json({
//         message: "Category name already exists",
//         error: true,
//         success: false,
//       });
//     }

//     // ✅ 3. Create and save new category
//     const newCategory = new CategoryModel({
//       name: name.trim(),
//       image: image.trim(),
//     });

//     const savedCategory = await newCategory.save();

//     // ✅ 4. Success response
//     return res.status(201).json({
//       message: "Category added successfully",
//       category: savedCategory,
//       error: false,
//       success: true,
//     });
//   } catch (error) {
//     console.error("AddCategoryController Error:", error);

//     return res.status(500).json({
//       message: error.message || "Internal server error",
//       error: true,
//       success: false,
//     });
//   }
// };


// export const GetCategoryController = async (req, res) => {
//   try {
//     const data = await CategoryModel.find({});
//     return res.status(200).json({
//       message: "Categories fetched successfully",
//       error: false,
//       success: true,
//       data,   // <-- here
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message || "Internal server error",
//       error: true,
//       success: false,
//     });
//   }
// }

// export const updateCategoryController = async(req,res)=>{
//     try {
//       const {categoryId,name,image} = req.body;

//       const update = await CategoryModel.updateOne({
//         _id:categoryId
//       },{
//         name,
//         image
//       })
//       return res.status(200).json({
//         message: "Category updated successfully",
//         error: false,
//         success: true,
//          data : update   // <-- here
//       });
//     } catch (error) {
//       return res.status(500).json({
//         message: error.message || "Internal server error",
//         error: true,
//         success: false,
//       });
//     }
// }


import CategoryModel from "../model/category.model.js";
import SubCategoryModel from "../model/subCategory.model.js";
import ProductModel from "../model/product.model.js";

/* ---------------- ADD CATEGORY ---------------- */

export const AddCategoryController = async (req, res) => {
  try {
    const { name, image } = req.body;

    console.log("AddCategoryController Request Body:", req.body); // DEBUG LOG

    // Validation
    if (!name?.trim() || !image?.trim()) {
      console.log("Validation Failed: Missing name or image"); // DEBUG LOG
      return res.status(400).json({
        message: "Both name and image are required",
        error: true,
        success: false,
      });
    }

    // Duplicate check
    const existingCategory = await CategoryModel.findOne({
      name: name.trim(),
    });

    if (existingCategory) {
      console.log("Duplicate Category Found:", existingCategory); // DEBUG LOG
      return res.status(409).json({
        message: "Category name already exists",
        error: true,
        success: false,
      });
    }

    const newCategory = new CategoryModel({
      name: name.trim(),
      image: image.trim(),
    });


    const savedCategory = await newCategory.save();

    return res.status(201).json({
      message: "Category added successfully",
      data: savedCategory,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("AddCategoryController Error:", error); // DEBUG LOG
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

/* ---------------- GET CATEGORY ---------------- */
export const GetCategoryController = async (req, res) => {
  try {
    const data = await CategoryModel.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Categories fetched successfully",
      error: false,
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

/* ---------------- UPDATE CATEGORY ---------------- */
export const updateCategoryController = async (req, res) => {
  try {
    const { categoryId, name, image } = req.body;

    if (!categoryId) {
      return res.status(400).json({
        message: "Category ID is required",
        error: true,
        success: false,
      });
    }

    const update = await CategoryModel.updateOne(
      { _id: categoryId },
      { name, image }
    );

    return res.status(200).json({
      message: "Category updated successfully",
      error: false,
      success: true,
      data: update,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

/* ---------------- DELETE CATEGORY ---------------- */
export const deleteCategoryController = async (req, res) => {
  try {
    const { categoryId } = req.body;

    if (!categoryId) {
      return res.status(400).json({
        message: "Category ID is required",
        error: true,
        success: false,
      });
    }

    // Check subcategory usage
    const subCategoryCount = await SubCategoryModel.countDocuments({
      category: { $in: [categoryId] },
    });

    // Check product usage
    const productCount = await ProductModel.countDocuments({
      category: { $in: [categoryId] },
    });

    if (subCategoryCount > 0 || productCount > 0) {
      return res.status(400).json({
        message: "Category is already in use, cannot delete",
        error: true,
        success: false,
      });
    }

    const deleted = await CategoryModel.deleteOne({ _id: categoryId });

    return res.status(200).json({
      message: "Category deleted successfully",
      data: deleted,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};
