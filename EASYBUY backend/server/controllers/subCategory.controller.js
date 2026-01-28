import SubCategory from "../model/subCategory.model.js";

/* CREATE */
export const AddSubCategoryController = async (request, response) => {
  try {
    const { name, image, category } = request.body;

    if (!name || !image || !category || category.length === 0) {
      return response.status(400).json({
        message: "Provide name, image and category",
        error: true,
        success: false
      });
    }

    const createSubCategory = new SubCategory({
      name,
      image,
      category
    });

    const save = await createSubCategory.save();

    return response.json({
      message: "Sub Category Created",
      data: save,
      error: false,
      success: true
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false
    });
  }
};

/* READ */
export const getSubCategoryController = async (request, response) => {
  try {
    const data = await SubCategory
      .find()
      .sort({ createdAt: -1 })
      .populate("category");

    return response.json({
      message: "Sub Category data",
      data,
      error: false,
      success: true
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false
    });
  }
};

/* UPDATE */
export const updateSubCategoryController = async (request, response) => {
  try {
    const { _id, name, image, category } = request.body;

    const checkSub = await SubCategory.findById(_id);

    if (!checkSub) {
      return response.status(404).json({
        message: "Sub Category not found",
        error: true,
        success: false
      });
    }

    const updateSubCategory = await SubCategory.findByIdAndUpdate(
      _id,
      { name, image, category },
      { new: true }
    );

    return response.json({
      message: "Updated Successfully",
      data: updateSubCategory,
      error: false,
      success: true
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false
    });
  }
};

/* DELETE */
export const deleteSubCategoryController = async (request, response) => {
  try {
    const { _id } = request.body;

    const deleteSub = await SubCategory.findByIdAndDelete(_id);

    return response.json({
      message: "Deleted Successfully",
      data: deleteSub,
      error: false,
      success: true
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false
    });
  }
};
