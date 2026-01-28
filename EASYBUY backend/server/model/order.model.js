import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    orderId: {
        type: String,
        required: [true, "provide orderId"],
        unique: false,
    },
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
    },
    product_details: {
        name: String,
        image: Array,
    },
    paymentId: {
        type: String,
        default: "",
    },
    payment_status: {
        type: String,
        default: "",
    },
    delivery_address: {
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
    },
    quantity: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true,

})

const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;