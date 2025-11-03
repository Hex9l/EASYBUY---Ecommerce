import CategoryModel from "../model/category.model.js";


export const AddCategoryController = async (req, res) => {
    try {
        const { name, Image } = req.body;

        if (!name || !Image) {
            return res.status(400).json({
                message: "Name and Image are required",
                error: true,
                success: false,
            });
        }

        const AddCategory = new CategoryModel({
            name,
            Image
        });

        const savedCategory = await AddCategory.save();

        if (!savedCategory) {
            return res.status(500).json({
                message: "Failed to add category",
                error: true,
                success: false,
            });
        }


        return res.json({
            message: "Category added successfully",
            category: savedCategory,
            error: false,
            success: true,
        });
        
    }
    catch (error) {
        res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}