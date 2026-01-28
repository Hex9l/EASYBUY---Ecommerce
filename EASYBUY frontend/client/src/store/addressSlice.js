import { createSlice } from "@reduxjs/toolkit";

// localStorage key for selected address
const SELECTED_ADDRESS_KEY = 'easybuy_selected_address';

// Helper function to load selected address from localStorage
const loadSelectedAddressFromStorage = () => {
    try {
        const savedAddress = localStorage.getItem(SELECTED_ADDRESS_KEY);
        return savedAddress ? savedAddress : "";
    } catch (error) {
        console.error("Failed to load selected address from localStorage:", error);
        return "";
    }
};

// Helper function to save selected address to localStorage
const saveSelectedAddressToStorage = (address) => {
    try {
        localStorage.setItem(SELECTED_ADDRESS_KEY, address);
    } catch (error) {
        console.error("Failed to save selected address to localStorage:", error);
    }
};

const initialValue = {
    addressList: [],
    selectedAddress: loadSelectedAddressFromStorage()
}

const addressSlice = createSlice({
    name: 'address',
    initialState: initialValue,
    reducers: {
        handleAddAddress: (state, action) => {
            state.addressList = [...action.payload]
        },
        setSelectedAddress: (state, action) => {
            state.selectedAddress = action.payload;
            // Persist to localStorage
            saveSelectedAddressToStorage(action.payload);
        }
    }
})

export const { handleAddAddress, setSelectedAddress } = addressSlice.actions

export default addressSlice.reducer