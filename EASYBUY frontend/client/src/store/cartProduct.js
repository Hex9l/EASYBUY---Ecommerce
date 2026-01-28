import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: []
}

const cartSlice = createSlice({
    name: "cartItem",
    initialState: initialState,
    reducers: {
        handleAddItemCart: (state, action) => {
            state.cart = [...action.payload]
        },
        addItemLocal: (state, action) => {
            // Check if item already exists (by real _id or productId)
            const existingIndex = state.cart.findIndex(item => 
                item._id === action.payload._id || 
                item.productId?._id === action.payload.productId?._id
            )
            
            if (existingIndex !== -1) {
                // Replace existing item
                state.cart[existingIndex] = action.payload
            } else {
                // Add new item
                state.cart = [...state.cart, action.payload]
            }
        },
        updateItemQtyLocal: (state, action) => {
            const { _id, qty } = action.payload
            state.cart = state.cart.map(item => {
                if (item._id === _id) {
                    return { ...item, quantity: qty }
                }
                return item
            })
        },
        removeItemLocal: (state, action) => {
            state.cart = state.cart.filter(item => item._id !== action.payload)
        }
    }
})

export const { handleAddItemCart, addItemLocal, updateItemQtyLocal, removeItemLocal } = cartSlice.actions

export default cartSlice.reducer