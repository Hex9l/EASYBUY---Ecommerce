import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    orderId: {
        type: String,
        required: [true, "provide orderId"],
        unique: true,
    },
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
    },
    product_details: {
        name: String,
        Image: Array,
    },
    paymentId: {
        type: String,
        required: "",
    },
    payment_status: {
        type: String,
        default: "",
    },
    delevery_address: {
        type: mongoose.Schema.ObjectId,
        ref: "Address",
    },
    subTotalAmt: {
        type: Number,
        default: 0,
    },
    totalAmt: {
        type: Number,
        default: 0,
    },
    invoice_receipt: {
        type: String,
        default: "",
    }
}, {
    timestamps: true,

})

const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;