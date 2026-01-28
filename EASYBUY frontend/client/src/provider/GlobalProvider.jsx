import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../utils/Axios";
import toast from "react-hot-toast";

import { handleAddItemCart, addItemLocal } from "../store/cartProduct";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";

import AxiosToastError from "../utils/AxiosToastError";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import { SummaryApi } from "../common/SummaryApi";

export const GlobalContext = createContext(null);
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();

  const cartItem = useSelector(state => state.cartItem.cart || []);
  const user = useSelector(state => state.user);

  const [totalPrice, setTotalPrice] = useState(0);
  const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0);
  const [totalQty, setTotalQty] = useState(0);

  /* ================= FETCH CART ================= */
  const fetchCartItem = useCallback(async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getCartItem,
      });

      if (response?.data?.success) {
        dispatch(handleAddItemCart(response.data.data));
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  /* ================= UPDATE CART QTY ================= */
  const updateCartItem = async (id, qty) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateCartItemQty,
        data: { _id: id, qty },
      });

      if (response?.data?.success && response.data.data) {
        // instant UI update (NO refetch)
        dispatch(addItemLocal(response.data.data));
      }

      return response.data;
    } catch (error) {
      AxiosToastError(error);
      return { success: false };
    }
  };

  /* ================= DELETE CART ITEM ================= */
  const deleteCartItem = async (cartId) => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteCartItem,
        data: { _id: cartId },
      });

      if (response?.data?.success) {
        toast.success(response.data.message);
        fetchCartItem();
      }
      return response.data;
    } catch (error) {
      AxiosToastError(error);
      return { success: false };
    }
  };

  /* ================= CALCULATE TOTALS ================= */
  useEffect(() => {
    let qty = 0;
    let discountedTotal = 0;
    let originalTotal = 0;

    cartItem.forEach(item => {
      qty += item.quantity;

      const discountedPrice = pricewithDiscount(
        item?.productId?.price,
        item?.productId?.discount
      );

      discountedTotal += discountedPrice * item.quantity;
      originalTotal += item?.productId?.price * item.quantity;
    });

    setTotalQty(qty);
    setTotalPrice(discountedTotal);
    setNotDiscountTotalPrice(originalTotal);
  }, [cartItem]);

  /* ================= FETCH ADDRESS ================= */
  const fetchAddress = useCallback(async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getAddress,
      });

      if (response?.data?.success) {
        dispatch(handleAddAddress(response.data.data));
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  /* ================= FETCH ORDER ================= */
  const fetchOrder = useCallback(async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getOrderItems,
      });

      if (response?.data?.success) {
        dispatch(setOrder(response.data.data));
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  /* ================= LOGOUT ================= */
  const handleLogoutOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(handleAddItemCart([]));
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    if (user?._id) {
      fetchCartItem();
      fetchAddress();
      fetchOrder();
    }
  }, [user?._id, fetchCartItem, fetchAddress, fetchOrder]);

  return (
    <GlobalContext.Provider
      value={{
        fetchCartItem,
        updateCartItem,
        deleteCartItem,
        fetchAddress,
        fetchOrder,
        totalPrice,
        notDiscountTotalPrice,
        totalQty,
        totalAmt: totalPrice + (totalPrice > 0 ? 5 : 0),
        handlingCharge: totalPrice > 0 ? 5 : 0,
        handleLogoutOut,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
