import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/connectDB.js';
import OrderModel from '../model/order.model.js';

dotenv.config();

const run = async () => {
    try {
        await connectDB();

        console.log("Checking indexes on 'orders' collection...");
        // Check if collection exists first to avoid error on empty DB
        const collections = await mongoose.connection.db.listCollections({ name: 'orders' }).toArray();
        if (collections.length === 0) {
            console.log("Collection 'orders' does not exist yet. No index to drop.");
            process.exit(0);
        }

        const indexes = await OrderModel.collection.getIndexes();
        console.log("Current indexes:", indexes);

        if (indexes.orderId_1) {
            console.log("Found stale index 'orderId_1'. Dropping it...");
            await OrderModel.collection.dropIndex('orderId_1');
            console.log("Successfully dropped 'orderId_1' index.");
        } else {
            console.log("Index 'orderId_1' not found. It might have already been dropped.");
        }

        process.exit(0);
    } catch (error) {
        console.error("Error encountered:", error);
        // If error is "index not found", it's fine
        if (error.codeName === 'IndexNotFound') {
            console.log("Index not found (handled error).");
            process.exit(0);
        }
        process.exit(1);
    }
};

run();
