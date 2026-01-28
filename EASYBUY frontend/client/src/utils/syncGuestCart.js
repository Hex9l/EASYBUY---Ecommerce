import Axios from "./Axios";
import { SummaryApi } from "../common/SummaryApi";

/**
 * Syncs guest cart items to the backend after user login
 * @param {Array} guestCartItems - Array of cart items from Redux store
 * @returns {Promise<{success: boolean, syncedCount: number, errors: Array}>}
 */
export const syncGuestCart = async (guestCartItems) => {
    if (!guestCartItems || guestCartItems.length === 0) {
        return { success: true, syncedCount: 0, errors: [] };
    }

    // Filter out items with temporary IDs (guest items)
    const itemsToSync = guestCartItems.filter(item =>
        item._id?.startsWith("temp-") && item.productId?._id
    );

    if (itemsToSync.length === 0) {
        return { success: true, syncedCount: 0, errors: [] };
    }

    const errors = [];
    const syncPromises = itemsToSync.map(async (item) => {
        try {
            const response = await Axios({
                ...SummaryApi.addTocart,
                data: {
                    productId: item.productId._id,
                    quantity: item.quantity || 1,
                },
            });

            if (!response?.data?.success) {
                errors.push({
                    productId: item.productId._id,
                    error: response?.data?.message || "Failed to sync item",
                });
                return null;
            }

            return response.data.data;
        } catch (error) {
            errors.push({
                productId: item.productId._id,
                error: error?.response?.data?.message || error.message || "Network error",
            });
            return null;
        }
    });

    const results = await Promise.all(syncPromises);
    const syncedCount = results.filter(r => r !== null).length;

    return {
        success: errors.length === 0,
        syncedCount,
        errors,
    };
};
