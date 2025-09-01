import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  _id: '',
  name: '',
  email: '',
  avatar: '',
  mobile: '',
  verify_email: "",
  last_login_date: '',
  status: "",
  address_details: [],
  shopping_cart: [],
  orderHistory: [],
  role: "",
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialValue,
  reducers: {
    setUserDetails: (state, action) => {
      const data = action.payload?.data || action.payload;
      state._id = data._id;
      state.name = data.name;
      state.email = data.email;
      state.avatar = data.avatar;
      state.mobile = data.mobile;
      state.verify_email = data.verify_email;
      state.last_login_date = data.last_login_date;
      state.status = data.status;
      state.address_details = data.address_details || [];
      state.shopping_cart = data.shopping_cart || [];
      state.orderHistory = data.orderHistory || [];
      state.role = data.role;
    },

    updateAvatar: (state, action) => {
      state.avatar = action.payload;
    },

    logOut: () => {
      return initialValue; // clean reset
    }
  }
});

export const { setUserDetails, logOut, updateAvatar } = userSlice.actions;
export default userSlice.reducer;
