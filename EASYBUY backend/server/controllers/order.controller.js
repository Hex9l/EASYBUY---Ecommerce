import Stripe from "../config/stripe.js";
import CartProductModel from "../model/cartproduct.model.js";
import OrderModel from "../model/order.model.js";
import UserModel from "../model/user.model.js";
import mongoose from "mongoose";

/* ===============================
   CASH ON DELIVERY
================================ */
export async function CashOnDeliveryOrderController(req, res) {
  try {
    const userId = req.userId;
    const { list_items, totalAmt, addressId, subTotalAmt } = req.body;

    const cartItems = await CartProductModel.find({ userId: userId }).populate('productId');

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
        error: true,
        success: false
      });
    }

    const orderId = `ORD-${new mongoose.Types.ObjectId()}`;

    const payload = cartItems.map((el) => {
      const discountedPrice = pricewithDiscount(el.productId.price, el.productId.discount);
      return {
        userId,
        orderId: orderId,
        productId: el.productId._id,
        product_details: {
          name: el.productId.name,
          image: el.productId.image,
        },
        paymentId: "",
        payment_status: "CASH ON DELIVERY",
        delivery_address: addressId,
        subTotalAmt: discountedPrice * el.quantity,
        totalAmt: discountedPrice * el.quantity,
        quantity: el.quantity
      }
    });

    const generatedOrder = await OrderModel.insertMany(payload);

    await CartProductModel.deleteMany({ userId });
    await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });

    return res.json({
      message: "Order placed successfully",
      success: true,
      error: false,
      data: generatedOrder,
    });
  } catch (error) {
    console.error("COD Controller Error:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
}

/* ===============================
   PRICE UTILITY
================================ */
export const pricewithDiscount = (price, dis = 1) => {
  const discountAmount = Math.ceil((Number(price) * Number(dis)) / 100);
  return Number(price) - discountAmount;
};

/* ===============================
   STRIPE PAYMENT
================================ */
export async function paymentController(req, res) {
  try {
    const userId = req.userId;
    const { list_items, addressId } = req.body;

    const user = await UserModel.findById(userId);

    const line_items = list_items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.productId.name,
          images: [item.productId.image],
          metadata: {
            productId: item.productId._id.toString(),
          },
        },
        unit_amount:
          pricewithDiscount(
            item.productId.price,
            item.productId.discount
          ) * 100,
      },
      quantity: item.quantity,
    }));

    const session = await Stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      metadata: {
        userId: userId.toString(),
        addressId: addressId.toString(),
      },
      line_items,
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    return res.status(200).json(session);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
}

/* ===============================
   STRIPE WEBHOOK (SECURE)
================================ */
export async function webhookStripe(req, res) {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = Stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_ENDPOINT_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const lineItems =
      await Stripe.checkout.sessions.listLineItems(session.id);

    const orderPayload = [];

    for (const item of lineItems.data) {
      const product = await Stripe.products.retrieve(
        item.price.product
      );

      orderPayload.push({
        userId: session.metadata.userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: product.metadata.productId,
        product_details: {
          name: product.name,
          image: product.images,
        },
        paymentId: session.payment_intent,
        payment_status: session.payment_status,
        delivery_address: session.metadata.addressId,
        subTotalAmt: item.amount_total / 100,
        totalAmt: item.amount_total / 100,
        quantity: item.quantity
      });
    }

    await OrderModel.insertMany(orderPayload);

    await UserModel.findByIdAndUpdate(session.metadata.userId, {
      shopping_cart: [],
    });

    await CartProductModel.deleteMany({
      userId: session.metadata.userId,
    });
  }

  res.json({ received: true });
}

/* ===============================
   GET ORDERS
================================ */
export async function getOrderDetailsController(req, res) {
  try {
    const userId = req.userId;

    const orders = await OrderModel.find({ userId })
      .sort({ createdAt: -1 })
      .populate("delivery_address");

    return res.json({
      message: "Order list",
      data: orders,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
}
