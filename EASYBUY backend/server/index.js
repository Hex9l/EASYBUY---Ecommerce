import express from "express";

import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import http from "http";

import connectDB from "./config/connectDB.js";

import userRouter from "./route/user.route.js";
import categoryRouter from "./route/category.Route.js";
import uploadRouter from "./route/upload.router.js";
import subCategoryRouter from "./route/subCategory.route.js";
import productRouter from "./route/product.route.js";
import cartRouter from "./route/cart.route.js";
import addressRouter from "./route/address.route.js";
import orderRouter from "./route/order.route.js";

const app = express();

/* ==================================================
   STRIPE WEBHOOK (RAW BODY) – MUST BE FIRST
================================================== */
app.use(
  "/api/order/webhook",
  express.raw({ type: "application/json" })
);

/* ==================================================
   MIDDLEWARES
================================================== */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

/* ==================================================
   ROUTES
================================================== */
app.get("/", (req, res) => {
  res.status(200).json({
    message: "EASYBUY backend running 🚀",
  });
});

app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/subcategory", subCategoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

/* ==================================================
   SERVER + DB
================================================== */
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  });
