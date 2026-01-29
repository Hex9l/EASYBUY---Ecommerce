import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaArrowLeft, FaDownload, FaCopy, FaChevronRight } from 'react-icons/fa'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { generateInvoice } from '../utils/generateInvoice'
import { motion } from 'framer-motion'

const OrderDetail = () => {
    const { orderId } = useParams()
    const navigate = useNavigate()
    const allOrders = useSelector(state => state.orders.order)

    // Filter items belonging to this orderId
    const orderItems = allOrders.filter(order => order.orderId === orderId)

    if (orderItems.length === 0) {
        return (
            <div className='min-h-screen flex flex-col items-center justify-center bg-white p-6'>
                <p className='text-gray-500 mb-4'>Order not found</p>
                <button
                    onClick={() => navigate(-1)}
                    className='text-green-600 font-bold'
                >
                    Go Back
                </button>
            </div>
        )
    }

    const firstItem = orderItems[0]
    const totalAmt = orderItems.reduce((sum, item) => sum + (item.totalAmt || 0), 0)
    const subTotalAmt = orderItems.reduce((sum, item) => sum + (item.subTotalAmt || 0), 0)

    // We can assume some values for now as they might not be in the DB
    const handlingCharge = 5

    const formattedDate = new Date(firstItem.createdAt).toLocaleDateString("en-GB", {
        day: 'numeric', month: 'short', year: '2-digit'
    })

    const formattedTime = new Date(firstItem.createdAt).toLocaleTimeString("en-GB", {
        hour: '2-digit', minute: '2-digit', hour12: true
    })

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        // Could add a toast notification here
    }

    const handleDownloadInvoice = () => {
        console.log('Download invoice clicked')
        console.log('Order Items:', orderItems)
        console.log('First Item:', firstItem)
        
        const invoiceData = {
            orderId,
            orderItems,
            totalAmt,
            subTotalAmt,
            handlingCharge,
            deliveryAddress: firstItem.delivery_address,
            paymentStatus: firstItem.payment_status,
            orderDate: formattedDate,
            orderTime: formattedTime
        }
        
        console.log('Invoice Data:', invoiceData)
        generateInvoice(invoiceData)
    }

    return (
        <div className='bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300'>
            {/* Header */}
            <div className='sticky top-0 z-20 bg-white dark:bg-gray-900 p-4 flex items-center gap-4 transition-colors duration-300'>
                <button
                    onClick={() => navigate(-1)}
                    className='w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                >
                    <FaArrowLeft />
                </button>
            </div>

            <div className='max-w-2xl mx-auto px-6 pb-20'>
                {/* Order Summary Title */}
                <div className='mb-6'>
                    <h1 className='text-2xl font-black text-gray-800 dark:text-gray-100'>Order summary</h1>
                    <p className='text-gray-500 dark:text-gray-400 text-sm'>Arrived at {formattedTime}</p>
                    <button 
                        onClick={handleDownloadInvoice}
                        className='flex items-center gap-1 text-green-600 dark:text-green-500 text-sm font-bold mt-1 hover:text-green-700 dark:hover:text-green-400 transition-colors'
                    >
                        Download Invoice <FaDownload className='text-[10px]' />
                    </button>
                </div>

                {/* Items Section */}
                <div className='mb-8'>
                    <h3 className='text-sm font-bold text-gray-800 dark:text-gray-200 mb-4'>{orderItems.length} items in this order</h3>
                    <div className='space-y-6'>
                        {orderItems.map((item, index) => (
                            <div key={index} className='flex items-center gap-4'>
                                <div className='w-16 h-16 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-2 flex items-center justify-center overflow-hidden'>
                                    <img
                                        src={item.product_details?.image[0] || "https://placehold.co/100?text=No+Image"}
                                        alt={item.product_details?.name}
                                        className='w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal'
                                    />
                                </div>
                                <div className='flex-1'>
                                    <h4 className='text-sm font-bold text-gray-800 dark:text-gray-100 line-clamp-1'>{item.product_details?.name}</h4>
                                    <p className='text-xs text-gray-400 dark:text-gray-500'>{item.quantity} items</p>
                                </div>
                                <div className='text-sm font-black text-gray-800 dark:text-gray-100'>
                                    {DisplayPriceInRupees(item.totalAmt)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='h-[1px] bg-gray-100 dark:bg-gray-800 w-full mb-8'></div>

                {/* Bill Details */}
                <div className='bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 mb-8'>
                    <h3 className='font-bold text-sm text-gray-800 dark:text-gray-200 mb-3'>Bill Details</h3>
                    <div className='flex flex-col gap-2.5 text-xs text-gray-600 dark:text-gray-400 font-medium'>
                        <div className='flex justify-between'>
                            <p>Item Total</p>
                            <p>{DisplayPriceInRupees(subTotalAmt)}</p>
                        </div>
                        <div className='flex justify-between'>
                            <p>Delivery Charge</p>
                            <p className='text-[#0c831f] dark:text-green-500 font-bold'>Free</p>
                        </div>
                        <div className='flex justify-between'>
                            <p>Handling Charge</p>
                            <p>{DisplayPriceInRupees(handlingCharge)}</p>
                        </div>
                        <div className='border-t border-gray-200 dark:border-gray-700 my-1'></div>
                        <div className='flex justify-between text-sm font-bold text-gray-900 dark:text-white'>
                            <p>Bill Total</p>
                            <p>{DisplayPriceInRupees(totalAmt + handlingCharge)}</p>
                        </div>
                    </div>
                </div>

                <div className='h-[1px] bg-gray-100 dark:bg-gray-800 w-full mb-8'></div>

                {/* Order Details Grid */}
                <div className='mb-8'>
                    <h3 className='text-base font-black text-gray-800 dark:text-gray-100 mb-4'>Order details</h3>
                    <div className='space-y-5'>
                        <div>
                            <p className='text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1'>Order id</p>
                            <div className='flex items-center gap-2'>
                                <span className='text-sm font-bold text-gray-800 dark:text-gray-200'>{orderId}</span>
                                <button onClick={() => copyToClipboard(orderId)} className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'>
                                    <FaCopy size={12} />
                                </button>
                            </div>
                        </div>

                        <div>
                            <p className='text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1'>Payment</p>
                            <p className='text-sm font-bold text-gray-800 dark:text-gray-200'>
                                {firstItem.payment_status === "CASH ON DELIVERY" ? "Cash on Delivery" : "Paid Online"}
                            </p>
                        </div>

                        <div>
                            <p className='text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1'>Deliver to</p>
                            <p className='text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed'>
                                {firstItem.delivery_address?.address_line || "Home Address"}, {firstItem.delivery_address?.city}, {firstItem.delivery_address?.state} - {firstItem.delivery_address?.pincode}
                            </p>
                        </div>

                        <div>
                            <p className='text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1'>Order placed</p>
                            <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>placed on {formattedDate}, {formattedTime}</p>
                        </div>
                    </div>
                </div>

                <div className='h-[1px] bg-gray-100 dark:bg-gray-800 w-full mb-8'></div>

                {/* Help Section */}
                <div>
                    <h3 className='text-base font-black text-gray-800 dark:text-gray-100 mb-4'>Need help with your order?</h3>
                    <button className='w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'>
                        <div className='flex items-center gap-4'>
                            <div className='w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-600'>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            </div>
                            <div className='text-left'>
                                <p className='text-sm font-black text-gray-800 dark:text-gray-100'>Chat with us</p>
                                <p className='text-xs text-gray-400 dark:text-gray-500'>About any issues related to your order</p>
                            </div>
                        </div>
                        <FaChevronRight className='text-green-600 dark:text-green-500' />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OrderDetail
