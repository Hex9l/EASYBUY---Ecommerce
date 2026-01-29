import React from 'react'
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from 'react-redux'
import AddToCartButton from './AddToCartButton'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import imageEmpty from '../assets/empty_cart.webp'
import toast from 'react-hot-toast'
import { IoMdTimer } from "react-icons/io";

const DisplayCartItem = ({ close }) => {
    const { totalPrice, totalQty, totalAmt, handlingCharge } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state.user)
    const navigate = useNavigate()

    const redirectToCheckoutPage = () => {
        if (user?._id) {
            navigate("/checkout")
            if (close) {
                close()
            }
            return
        }
        toast.error("Please Login to continue")
    }

    const handleClose = () => {
        if (close) {
            close()
        } else {
            navigate(-1)
        }
    }

    return (
        <section  onClick={close} className= 'fixed inset-0 bg-black/60 z-50 flex justify-end transition-opacity duration-300 '>
            <div className='bg-white dark:bg-gray-800 w-full max-w-sm h-full flex flex-col shadow-2xl animate-slide-in transition-colors duration-300'>
                {/* Header */}
                <div className='flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10'>
                    <div className='flex items-center gap-3'>
                        <h2 className='font-bold text-lg text-gray-800 dark:text-gray-100'>My Cart</h2>
                        <span className='bg-green-100 dark:bg-green-900/30 text-[#0c831f] dark:text-green-400 text-xs font-bold px-2 py-0.5 rounded-full'>{totalQty} items</span>
                    </div>
                    <button onClick={handleClose} className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'>
                        {/* <IoClose size={24} /> */}
                    </button>
                </div>

                <div className='flex-1 overflow-y-auto p-4 flex flex-col gap-5 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent pb-32'>
                    {cartItem[0] ? (
                        <>
                            {/* Delivery Info */}
                            <div className='bg-green-50 dark:bg-green-900/10 p-4 rounded-xl flex items-center gap-4 border border-green-100 dark:border-green-800/30'>
                                <div className='p-2.5 bg-white dark:bg-gray-800 rounded-full text-[#0c831f] dark:text-green-500 shadow-sm'>
                                    <IoMdTimer size={20} />
                                </div>
                                <div>
                                    <h3 className='font-bold text-gray-800 dark:text-gray-200 text-sm'>Delivery in 8 minutes</h3>
                                    <p className='text-xs text-gray-600 dark:text-gray-400 font-medium'>Superfast delivery to your location</p>
                                </div>
                            </div>

                            {/* Cart Items */}
                            <div className='flex flex-col gap-4'>
                                {cartItem.map((item) => {
                                    if (!item?.productId) return null
                                    return (
                                        <div key={item?._id + "cartItemDisplay"} className='flex items-start gap-3 bg-white dark:bg-gray-800'>
                                            <div className='w-22 h-22 shrink-0 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden p-2 flex items-center justify-center bg-gray-50/50 dark:bg-gray-700/50'>
                                                <img
                                                    src={item?.productId?.image[0]}
                                                    className='w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal'
                                                    alt={item?.productId?.name}
                                                />
                                            </div>
                                            <div className='flex-1 min-w-0 flex flex-col gap-1'>
                                                <p className='text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 leading-snug'>{item?.productId?.name}</p>
                                                <p className='text-xs text-gray-400 dark:text-gray-500 font-medium'>{item?.productId?.unit}</p>

                                                <div className='flex items-center justify-between mt-auto pt-2'>
                                                    <p className='font-bold text-gray-900 dark:text-gray-100'>
                                                        {DisplayPriceInRupees(pricewithDiscount(item?.productId?.price, item?.productId?.discount))}
                                                    </p>
                                                    <div className='w-18 mr-4'>
                                                        <AddToCartButton data={item?.productId} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Bill Details */}
                            <div className='bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700'>
                                <h3 className='font-bold text-sm text-gray-800 dark:text-gray-200 mb-3'>Bill Details</h3>
                                <div className='flex flex-col gap-2.5 text-xs text-gray-600 dark:text-gray-400 font-medium'>
                                    <div className='flex justify-between'>
                                        <p>Item Total</p>
                                        <p>{DisplayPriceInRupees(totalPrice)}</p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p>Delivery Charge</p>
                                        <p className='text-[#0c831f] dark:text-green-400 font-bold'>Free</p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p>Handling Charge</p>
                                        <p>{DisplayPriceInRupees(handlingCharge)}</p>
                                    </div>
                                    <div className='border-t border-gray-200 dark:border-gray-600 my-1'></div>
                                    <div className='flex justify-between text-sm font-bold text-gray-900 dark:text-white'>
                                        <p>Grand Total</p>
                                        <p>{DisplayPriceInRupees(totalAmt)}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className='flex flex-col items-center justify-center h-full pt-10 text-center opacity-80'>
                            <img src={imageEmpty} className='w-48 h-48 object-contain mb-6 drop-shadow-sm' alt="Empty Cart" />
                            <h3 className='font-bold text-xl text-gray-800 dark:text-gray-200 mb-2'>Your cart is empty</h3>
                            <p className='text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-[200px]'>Add items to your cart to get them delivered in minutes!</p>
                            <Link onClick={handleClose} to={"/"} className='bg-[#0c831f] px-8 py-3 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200 dark:shadow-green-900/30 hover:shadow-green-300'>
                                Browse Products
                            </Link>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cartItem[0] && (
                    <div className='p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]'>
                        {user?._id ? (
                            <button
                                onClick={redirectToCheckoutPage}
                                className='group relative w-full bg-[#0c831f] text-white py-3.5 px-4 rounded-xl font-bold flex items-center justify-between shadow-lg shadow-green-200 dark:shadow-green-900/30 hover:shadow-green-300 hover:bg-green-700 active:scale-[0.99] transition-all'
                            >
                                <div className='flex flex-col items-start leading-none'>
                                    <span className='text-[15px]'>{DisplayPriceInRupees(totalAmt)}</span>
                                    <span className='text-[10px] font-medium opacity-90 uppercase tracking-wide mt-0.5'>Total</span>
                                </div>
                                <div className='flex items-center gap-2 text-[15px]'>
                                    Proceed to Pay
                                    <FaCaretRight className='text-white/90 group-hover:translate-x-0.5 transition-transform' />
                                </div>
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    if(close) close()
                                    navigate("/login")
                                }}
                                className='group relative w-full bg-[#0c831f] text-white py-3.5 px-4 rounded-xl font-bold flex items-center justify-between shadow-lg shadow-green-200 dark:shadow-green-900/30 hover:shadow-green-300 hover:bg-green-700 active:scale-[0.99] transition-all'
                            >
                                <div className='flex flex-col items-start leading-none'>
                                    <span className='text-[15px]'>{DisplayPriceInRupees(totalAmt)}</span>
                                    <span className='text-[10px] font-medium opacity-90 uppercase tracking-wide mt-0.5'>Total</span>
                                </div>
                                <div className='flex items-center gap-2 text-[15px]'>
                                    Login to Proceed
                                    <FaCaretRight className='text-white/90 group-hover:translate-x-0.5 transition-transform' />
                                </div>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}

export default DisplayCartItem
