import { Router } from 'express'
import auth from '../middleware/auth.js'
import { admin } from '../middleware/Admin.js'
import {
  createProductController,
  deleteProductDetails,
  getProductByCategory,
  getProductByCategoryAndSubCategory,
  getProductController,
  getProductDetails,
  searchProduct,
  searchSuggestions,
  updateProductDetails
} from '../controllers/product.controller.js'

const productRouter = Router()

productRouter.post("/create", auth, admin, createProductController)
productRouter.post('/get', getProductController)
productRouter.post("/get-product-by-category", getProductByCategory)

// ✅ CORRECT ROUTE (NO TYPO)
productRouter.post(
  '/get-product-by-category-and-subcategory',
  getProductByCategoryAndSubCategory
)

productRouter.post('/get-product-details', getProductDetails)

// update
productRouter.put('/update-product-details', auth, admin, updateProductDetails)

// delete
productRouter.delete('/delete-product', auth, admin, deleteProductDetails)

// search
productRouter.post('/search-product', searchProduct)

// search suggestions (autocomplete)
productRouter.post('/search-suggestions', searchSuggestions)

export default productRouter
