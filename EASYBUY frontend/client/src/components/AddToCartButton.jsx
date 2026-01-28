import React, { useState } from "react"
import { useGlobalContext } from "../provider/GlobalProvider"
import { useSelector, useDispatch } from "react-redux"
import { FaMinus, FaPlus } from "react-icons/fa6"
import Axios from "../utils/Axios"
import { SummaryApi } from "../common/SummaryApi"
import {
  addItemLocal,
  updateItemQtyLocal,
  removeItemLocal
} from "../store/cartProduct"
import toast from "react-hot-toast"

const AddToCartButton = ({ data }) => {
  const dispatch = useDispatch()
  const { updateCartItem, deleteCartItem, fetchCartItem } = useGlobalContext()

  const cart = useSelector(state => state.cartItem.cart || [])
  const cartItem = cart.find(i => i.productId?._id === data?._id)

  const qty = cartItem?.quantity || 0
  const isTempItem = cartItem?._id?.startsWith("temp-")

  const [loading, setLoading] = useState(false)

  /* ================= ADD ================= */
  const handleAdd = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (loading) return

    if (data.stock < 1) {
      toast.error("Out of stock")
      return
    }

    setLoading(true)

    const tempId = `temp-${data._id}`

    // Optimistic add (Works for both guest & logged in)
    dispatch(addItemLocal({
      _id: tempId,
      productId: data, // Keep consistent with backend structure where productId is populated
      quantity: 1
    }))

    // If user is NOT logged in, stop here (Guest Cart)
    const user = JSON.parse(localStorage.getItem('user')) || null // or use selector if available
    // Better to use selector from prop or context, but for now assuming data is passed or context used.
    // Actually, AddToCartButton consumes useGlobalContext/useSelector but 'user' var isn't in scope here unless selected.
    // Let's rely on the failure of the API call or explicitly check user.

    // We can just try the API. If it fails due to 401, we might want to keep the local item? 
    // BUT the requirement is "product add in cart without login".
    // So if no auth token, Axios might fail or we strictly check user.

    try {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        toast.success("Added to cart (Guest)")
        setLoading(false)
        return
      }

      const res = await Axios({
        ...SummaryApi.addTocart,
        data: { productId: data._id }
      })

      if (res?.data?.success && res.data.data) {
        // Remove temp & add real item
        dispatch(removeItemLocal(tempId))
        dispatch(addItemLocal(res.data.data))
        toast.success(res.data.message || "Added to cart")
      } else {
        dispatch(removeItemLocal(tempId))
        toast.error(res?.data?.message || "Failed to add item")
      }
    } catch (error) {
      // If error is 401 (Unauth), we could strictly keep it local, but Axios interceptor might redirect.
      // For now, let's assume if token exists we try API, if not we keep local.
      dispatch(removeItemLocal(tempId))
      toast.error(error?.response?.data?.message || "Failed to add item")

      // Sync only if server says mismatch
      if (error?.response?.status === 400) {
        fetchCartItem()
      }
    } finally {
      setLoading(false)
    }
  }

  /* ================= INCREMENT ================= */
  const increment = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (loading || !cartItem) return

    const prevQty = qty
    const newQty = prevQty + 1

    if (qty + 1 > data.stock) {
      toast.error(`Only ${data.stock} quantity available`)
      return
    }

    setLoading(true)

    // Optimistic
    dispatch(updateItemQtyLocal({ _id: cartItem._id, qty: newQty }))

    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      setLoading(false)
      return
    }

    const res = await updateCartItem(cartItem._id, newQty)

    if (!res?.success) {
      dispatch(updateItemQtyLocal({ _id: cartItem._id, qty: prevQty }))
      toast.error(res?.message || "Failed to update quantity")

      if (res?.error) fetchCartItem()
    }

    setLoading(false)
  }

  /* ================= DECREMENT ================= */
  const decrement = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (loading || !cartItem) return

    const prevQty = qty
    setLoading(true)
    const accessToken = localStorage.getItem('accessToken')

    if (prevQty === 1) {
      // Optimistic remove
      dispatch(removeItemLocal(cartItem._id))

      if (!accessToken) {
        setLoading(false)
        return
      }

      const res = await deleteCartItem(cartItem._id)

      if (!res?.success) {
        // Restore item
        dispatch(addItemLocal(cartItem))
        toast.error(res?.message || "Failed to remove item")
      }
    } else {
      const newQty = prevQty - 1

      dispatch(updateItemQtyLocal({ _id: cartItem._id, qty: newQty }))

      if (!accessToken) {
        setLoading(false)
        return
      }

      const res = await updateCartItem(cartItem._id, newQty)

      if (!res?.success) {
        dispatch(updateItemQtyLocal({ _id: cartItem._id, qty: prevQty }))
        toast.error(res?.message || "Failed to update quantity")

        if (res?.error) fetchCartItem()
      }
    }

    setLoading(false)
  }

  return (
    <div
      className="w-full max-w-[110px] min-w-[65px]"
      onClick={e => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      {cartItem ? (
        /* Quantity Controller */
        <div className="flex h-7 items-center justify-between rounded-lg bg-[#0c831f] text-white shadow-md overflow-hidden">
          <button
            onClick={decrement}
            disabled={loading}
            className="flex h-full w-5 items-center justify-center border-r border-green-600/30 hover:bg-green-700 active:bg-green-800 disabled:opacity-60"
          >
            <FaMinus size={9} />
          </button>

          <span className="text-xs font-bold w-5 text-center">
            {qty}
          </span>

          <button
            onClick={increment}
            disabled={loading}
            className="flex h-full w-5 items-center justify-center border-l border-green-600/30 hover:bg-green-700 active:bg-green-800 disabled:opacity-60"
          >
            <FaPlus size={9} />
          </button>
        </div>
      ) : (
        /* ADD BUTTON */
        <button
          onClick={handleAdd}
          disabled={loading}
          className="h-7 w-full rounded-lg border-[1.5px] border-[#0c831f] text-[#0c831f] text-[12px] font-bold bg-white uppercase tracking-wider hover:bg-[#0c831f] hover:text-white transition-all shadow-md active:scale-95 disabled:opacity-70"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      )}
    </div>
  )
}

export default AddToCartButton
