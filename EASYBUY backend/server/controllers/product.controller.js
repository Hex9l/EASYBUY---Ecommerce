import ProductModel from "../model/product.model.js";
import mongoose from "mongoose"

export const createProductController = async (request, response) => {
    try {
        const {
            name,
            image,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details,
        } = request.body

        if (!name || !image[0] || !category[0] || !subCategory[0] || !unit || !price || !description) {
            return response.status(400).json({
                message: "Enter required fields",
                error: true,
                success: false
            })
        }

        const product = new ProductModel({
            name,
            image,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details,
        })
        const saveProduct = await product.save()

        return response.json({
            message: "Product Created Successfully",
            data: saveProduct,
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getProductController = async (request, response) => {
    try {

        let { page, limit, search } = request.body

        if (!page) {
            page = 1
        }

        if (!limit) {
            limit = 10
        }

        const query = search ? {
            $text: {
                $search: search
            }
        } : {}

        const skip = (page - 1) * limit

        const [data, totalCount] = await Promise.all([
            ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('category subCategory'),
            ProductModel.countDocuments(query)
        ])

        return response.json({
            message: "Product data",
            error: false,
            success: true,
            totalCount: totalCount,
            totalNoPage: Math.ceil(totalCount / limit),
            data: data
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getProductByCategory = async (request, response) => {
    try {
        const { id } = request.body

        if (!id) {
            return response.status(400).json({
                message: "provide category id",
                error: true,
                success: false
            })
        }

        const product = await ProductModel.find({
            category: { $in: id }
        }).limit(15)

        return response.json({
            message: "category product list",
            data: product,
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


export const getProductByCategoryAndSubCategory = async (request, response) => {
    try {
        console.log("BODY 👉", request.body)

        let { categoryId, subCategoryId, page = 1, limit = 8 } = request.body

        // ✅ ObjectId validation (MOST IMPORTANT)
        if (
            !mongoose.Types.ObjectId.isValid(categoryId) ||
            !mongoose.Types.ObjectId.isValid(subCategoryId)
        ) {
            return response.status(400).json({
                message: "Invalid categoryId or subCategoryId",
                error: true,
                success: false
            })
        }

        const skip = (page - 1) * limit

        const query = {
            category: categoryId,
            subCategory: subCategoryId
        }

        const [data, totalCount] = await Promise.all([
            ProductModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            ProductModel.countDocuments(query)
        ])

        return response.json({
            message: "Product list",
            data,
            totalCount,
            page,
            limit,
            success: true,
            error: false
        })

    } catch (error) {
        console.error("FILTER ERROR ❌", error)
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getProductDetails = async (request, response) => {
    try {
        const { productId } = request.body

        const product = await ProductModel.findOne({ _id: productId })


        return response.json({
            message: "product details",
            data: product,
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//update product
export const updateProductDetails = async (request, response) => {
    try {
        const { _id } = request.body

        if (!_id) {
            return response.status(400).json({
                message: "provide product _id",
                error: true,
                success: false
            })
        }

        const updateProduct = await ProductModel.updateOne({ _id: _id }, {
            ...request.body
        })

        return response.json({
            message: "updated successfully",
            data: updateProduct,
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//delete product
export const deleteProductDetails = async (request, response) => {
    try {
        const { _id } = request.body

        if (!_id) {
            return response.status(400).json({
                message: "provide _id ",
                error: true,
                success: false
            })
        }

        const deleteProduct = await ProductModel.deleteOne({ _id: _id })

        return response.json({
            message: "Delete successfully",
            error: false,
            success: true,
            data: deleteProduct
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//search product
export const searchProduct = async (request, response) => {
    try {
        let { search, page, limit } = request.body

        if (!page) {
            page = 1
        }
        if (!limit) {
            limit = 10
        }

        const skip = (page - 1) * limit

        // Handle empty search query - show random products
        if (!search || search.trim() === '') {
            const randomProducts = await ProductModel.aggregate([
                { $sample: { size: limit } }
            ]).then(products =>
                ProductModel.populate(products, { path: 'category subCategory' })
            )

            return response.json({
                message: "Random products",
                error: false,
                success: true,
                data: randomProducts,
                totalCount: randomProducts.length,
                totalPage: 1,
                page: 1,
                limit: limit,
                isRandom: true
            })
        }

        // Create case-insensitive regex for partial matching
        const searchRegex = new RegExp(search.trim(), 'i')

        // Build query to search multiple fields
        const query = {
            $or: [
                { name: searchRegex },
                { description: searchRegex },
                { unit: searchRegex }
            ]
        }

        // Execute search with population
        let [data, dataCount] = await Promise.all([
            ProductModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('category subCategory'),
            ProductModel.countDocuments(query)
        ])

        // Additional filtering: check if category/subcategory names match
        const searchLower = search.toLowerCase().trim()
        let filteredData = data.filter(product => {
            // Check if product name, description, or unit matches
            const nameMatch = product.name?.toLowerCase().includes(searchLower)
            const descMatch = product.description?.toLowerCase().includes(searchLower)
            const unitMatch = product.unit?.toLowerCase().includes(searchLower)

            // Check if any category name matches
            const categoryMatch = product.category?.some(cat =>
                cat.name?.toLowerCase().includes(searchLower)
            ) || false

            // Check if any subcategory name matches
            const subCategoryMatch = product.subCategory?.some(subCat =>
                subCat.name?.toLowerCase().includes(searchLower)
            ) || false

            return nameMatch || descMatch || unitMatch || categoryMatch || subCategoryMatch
        })

        let suggestion = null;

        // If no results found, try fuzzy search for typo correction
        if (filteredData.length === 0 && search.length >= 3) {
            // Get all product names for fuzzy matching
            const allProducts = await ProductModel.find({}).select('name').lean()
            const productNames = allProducts.map(p => p.name)

            // Find best fuzzy match using simple similarity check
            const findBestFuzzyMatch = (searchTerm, names) => {
                let bestMatch = null
                let bestScore = 0
                const searchLower = searchTerm.toLowerCase()

                for (const name of names) {
                    const nameLower = name.toLowerCase()
                    const words = nameLower.split(/\s+/)

                    for (const word of words) {
                        if (word.length < 3) continue

                        // Calculate simple similarity
                        const commonChars = searchLower.split('').filter(char => word.includes(char)).length
                        const score = commonChars / Math.max(searchLower.length, word.length)

                        // Check for common typos (swapped letters, missing letters, extra letters)
                        const distance = calculateEditDistance(searchLower, word)
                        const similarity = 1 - (distance / Math.max(searchLower.length, word.length))

                        if (similarity > 0.6 && similarity > bestScore) {
                            bestScore = similarity
                            bestMatch = word
                        }
                    }
                }

                return bestMatch
            }

            // Simple edit distance calculation (Levenshtein distance)
            const calculateEditDistance = (str1, str2) => {
                const len1 = str1.length
                const len2 = str2.length
                const matrix = []

                for (let i = 0; i <= len1; i++) matrix[i] = [i]
                for (let j = 0; j <= len2; j++) matrix[0][j] = j

                for (let i = 1; i <= len1; i++) {
                    for (let j = 1; j <= len2; j++) {
                        if (str1[i - 1] === str2[j - 1]) {
                            matrix[i][j] = matrix[i - 1][j - 1]
                        } else {
                            matrix[i][j] = Math.min(
                                matrix[i - 1][j - 1] + 1,
                                matrix[i][j - 1] + 1,
                                matrix[i - 1][j] + 1
                            )
                        }
                    }
                }

                return matrix[len1][len2]
            }

            const fuzzyMatch = findBestFuzzyMatch(search, productNames)

            if (fuzzyMatch && fuzzyMatch !== searchLower) {
                suggestion = fuzzyMatch

                // Search again with the suggested term
                const suggestedRegex = new RegExp(fuzzyMatch, 'i')
                const suggestedQuery = {
                    $or: [
                        { name: suggestedRegex },
                        { description: suggestedRegex },
                        { unit: suggestedRegex }
                    ]
                }

                const suggestedData = await ProductModel.find(suggestedQuery)
                    .sort({ createdAt: -1 })
                    .limit(limit)
                    .populate('category subCategory')

                filteredData = suggestedData
            }
        }

        return response.json({
            message: "Product data",
            error: false,
            success: true,
            data: filteredData,
            totalCount: filteredData.length,
            totalPage: Math.ceil(filteredData.length / limit),
            page: page,
            limit: limit,
            suggestion: suggestion, // Return spelling suggestion if found
            searchedFor: search // Original search term
        })


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// Get search suggestions (autocomplete)
export const searchSuggestions = async (request, response) => {
    try {
        const { search } = request.body

        // Return empty if search is too short
        if (!search || search.trim().length < 1) {
            return response.json({
                message: "Search query too short",
                error: false,
                success: true,
                data: []
            })
        }

        // Create case-insensitive regex for matching
        const searchRegex = new RegExp(search.trim(), 'i')

        // Search for products matching the query
        const suggestions = await ProductModel.find({
            $or: [
                { name: searchRegex },
                { description: searchRegex }
            ]
        })
            .select('name image')
            .limit(8)
            .lean()

        return response.json({
            message: "Search suggestions",
            error: false,
            success: true,
            data: suggestions
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}