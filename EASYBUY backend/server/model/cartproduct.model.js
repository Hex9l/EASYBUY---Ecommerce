import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
    },
    quantity: {
        type: Number,
        default: 1,
    },
    usrId:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
    }
},{
    timestamps: true,

})

const CartProductModel = mongoose.model("CartProduct", cartProductSchema);
export default CartProductModel;
