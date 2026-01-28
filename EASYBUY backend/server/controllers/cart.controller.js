
import CartProductModel from "../model/cartproduct.model.js";
import UserModel from "../model/user.model.js";
import mongoose from "mongoose";


// ================= ADD TO CART =================
export const addToCartItemController = async (request, response) => {
  try {
    const userId = request.userId;
    const { productId, quantity } = request.body;

    if (!productId) {
      return response.status(400).json({
        message: "Provide productId",
        error: true,
        success: false,
      });
    }

    const qty = quantity || 1; // Default to 1 if not provided

    const checkItemCart = await CartProductModel.findOne({
      userId,
      productId,
    });

    if (checkItemCart) {
      // Item already exists - merge quantities
      const newQuantity = checkItemCart.quantity + qty;

      const updatedCartItem = await CartProductModel.findByIdAndUpdate(
        checkItemCart._id,
        { quantity: newQuantity },
        { new: true }
      ).populate("productId");

      return response.json({
        data: updatedCartItem,
        message: "Cart quantity updated",
        error: false,
        success: true,
      });
    }

    // Item doesn't exist - create new cart item
    const cartItem = new CartProductModel({
      userId,
      productId,
      quantity: qty,
    });

    const save = await cartItem.save();

    await UserModel.updateOne(
      { _id: userId },
      { $push: { shopping_cart: productId } }
    );

    const populatedCartItem = await CartProductModel.findById(save._id).populate("productId");


    return response.json({
      data: populatedCartItem,
      message: "Item added successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// ================= GET CART =================
export const getCartItemController = async (request, response) => {
  try {
    const userId = request.userId;

    const cartItem = await CartProductModel.find({
      userId,
    }).populate("productId");

    return response.json({
      data: cartItem,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// ================= UPDATE QTY =================
export const updateCartItemQtyController = async (request, response) => {
  try {
    const userId = request.userId;
    const { _id, qty } = request.body;

    if (!_id || qty === undefined) {
      return response.status(400).json({
        message: "Provide _id and qty",
        error: true,
        success: false,
      });
    }

    const updateCartItem = await CartProductModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(_id), userId: userId },
      { quantity: qty },
      { new: true }
    ).populate('productId');

    // Check if the update actually happened (matched a document)
    if (!updateCartItem) {
      return response.status(404).json({
        message: "Item not found in cart",
        error: true,
        success: false
      })
    }

    return response.json({
      message: "Cart updated",
      success: true,
      error: false,
      data: updateCartItem,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// ================= DELETE ITEM =================
export const deleteCartItemQtyController = async (request, response) => {
  try {
    const userId = request.userId;
    const { _id } = request.body;

    if (!_id) {
      return response.status(400).json({
        message: "Provide _id",
        error: true,
        success: false,
      });
    }

    const deleteCartItem = await CartProductModel.deleteOne({
      _id,
      userId,
    });

    return response.json({
      message: "Item removed from cart",
      error: false,
      success: true,
      data: deleteCartItem,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
