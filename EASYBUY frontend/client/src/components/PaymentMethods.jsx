import React, { useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { useSelector } from 'react-redux'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import Axios from '../utils/Axios'
import { SummaryApi } from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { loadStripe } from '@stripe/stripe-js'
import { useNavigate } from 'react-router-dom'

const PaymentMethods = ({ selectedAddress, onBack }) => {
    const { notDiscountTotalPrice, totalPrice, totalQty, totalAmt, handlingCharge, fetchCartItem, fetchOrder } = useGlobalContext()
    const cartItemsList = useSelector(state => state.cartItem.cart)
    const [openSection, setOpenSection] = useState('cards') // 'wallets', 'cards', 'netbanking', 'upi', 'cash', 'paylater'
    const navigate = useNavigate()

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section)
    }

    const handlePayment = async () => {
        try {
            // Validation
            if (!selectedAddress) {
                toast.error("Please select a delivery address")
                return
            }

            // Case 1: Cash Request
            if (openSection === 'cash') {
                const response = await Axios({
                    ...SummaryApi.CashOnDeliveryOrder,
                    data: {
                        list_items: cartItemsList,
                        addressId: selectedAddress._id,
                        subTotalAmt: totalPrice,
                        totalAmt: totalAmt,
                    }
                })

                const { data: responseData } = response

                if (responseData.success) {
                    toast.success(responseData.message)
                    if (fetchCartItem) fetchCartItem()
                    if (fetchOrder) fetchOrder()
                    navigate('/success', {
                        state: {
                            text: "Order"
                        }
                    })
                }
                return // Stop here for Cash
            }

            // Case 2: Online Payment (Stripe)
            // Just defaulting to Stripe for other sections for now, or specific check
            // if (openSection === 'cards' || openSection === 'wallets'...) 

            toast.loading("Processing Payment...")
            const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
            const stripePromise = await loadStripe(stripePublicKey)

            const response = await Axios({
                ...SummaryApi.payment_url,
                data: {
                    list_items: cartItemsList,
                    addressId: selectedAddress?._id,
                    subTotalAmt: totalPrice,
                    totalAmt: totalAmt,
                }
            })

            const { data: responseData } = response

            stripePromise.redirectToCheckout({ sessionId: responseData.id })

        } catch (error) {
            AxiosToastError(error)
        }
    }

    const AccordionItem = ({ id, title, children }) => (
        <div className='border-b border-gray-100 dark:border-gray-700 last:border-none'>
            <button
                onClick={() => toggleSection(id)}
                className='w-full flex justify-between items-center p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left'
            >
                <span className='font-medium text-gray-700 dark:text-gray-200'>{title}</span>
                {openSection === id ? <FaChevronUp className='text-gray-400 dark:text-gray-500 size-3' /> : <FaChevronDown className='text-gray-400 dark:text-gray-500 size-3' />}
            </button>
            <AnimatePresence>
                {openSection === id && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className='overflow-hidden bg-gray-50 dark:bg-gray-900/50'
                    >
                        <div className='p-4 text-sm text-gray-600 dark:text-gray-400'>
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )

    return (
        <div className='flex flex-col lg:flex-row gap-8 w-full animate-fade-in'>
            {/* Left Side: Payment Methods */}
            <div className='flex-1'>
                <h2 className='text-xl font-bold text-gray-800 dark:text-white mb-4'>Select Payment Method</h2>

                <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300'>
                    <AccordionItem id='wallets' title='Wallets'>
                        <p>Link your PaytM, PhonePe, or Amazon Pay wallet.</p>
                        {/* Placeholder for wallet options */}
                    </AccordionItem>

                    <AccordionItem id='cards' title='Add credit or debit cards'>
                        <p className='mb-4'>Enter your card details securely.</p>
                        {/* Placeholder for card form */}
                        <div className='p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-center text-gray-400 dark:text-gray-500'>
                            Card Form Placeholder
                        </div>
                    </AccordionItem>

                    <AccordionItem id='netbanking' title='Netbanking'>
                        <p>Choose your bank to pay via Netbanking.</p>
                    </AccordionItem>

                    <AccordionItem id='upi' title='Add new UPI ID'>
                        <p>Enter your UPI ID (Google Pay, BHIM, etc.)</p>
                    </AccordionItem>

                    <AccordionItem id='cash' title='Cash'>
                        <p>Pay cash at the time of delivery.</p>
                    </AccordionItem>

                    <AccordionItem id='paylater' title='Pay Later'>
                        <p>Check eligibility for Pay Later options.</p>
                    </AccordionItem>
                </div>
            </div>

            {/* Right Side: Address & Cart Summary */}
            <div className='w-full lg:max-w-md space-y-4'>

                {/* Delivery Address Card */}
                {selectedAddress && (
                    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors duration-300'>
                        <h3 className='text-gray-500 dark:text-gray-400 font-medium mb-2 text-sm uppercase tracking-wider'>Delivery Address</h3>
                        <div className='text-sm text-gray-700 dark:text-gray-300'>
                            <p className='font-medium text-gray-900 dark:text-white'>{selectedAddress.address_line}</p>
                            <p>{selectedAddress.city}, {selectedAddress.state}</p>
                            <p>{selectedAddress.country} - {selectedAddress.pincode}</p>
                        </div>
                    </div>
                )}

                {/* My Cart Summary */}
                <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300'>
                    <div className='p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center'>
                        <h3 className='font-medium text-gray-700 dark:text-gray-200'>My Cart</h3>
                        <span className='text-sm text-gray-500 dark:text-gray-400'>{totalQty} items</span>
                    </div>

                    <div className='max-h-60 overflow-y-auto scrollbar-none'>
                        {cartItemsList.map((item) => (
                            <div key={item._id} className='flex gap-3 p-3 border-b border-gray-50 dark:border-gray-700 last:border-none hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'>
                                <div className='w-12 h-12 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg flex items-center justify-center p-1 shrink-0'>
                                    <img src={item?.productId?.image[0]} alt={item?.productId?.name} className='w-full h-full object-contain' />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='text-sm font-medium text-gray-800 dark:text-gray-200 truncate'>{item?.productId?.name}</p>
                                    <p className='text-xs text-gray-500 dark:text-gray-400'>{item?.productId?.unit}</p>
                                    <p className='text-sm font-semibold text-gray-900 dark:text-white'>{DisplayPriceInRupees(item?.productId?.price)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='p-4 bg-gray-50 dark:bg-gray-700/50'>
                        <button
                            onClick={handlePayment}
                            className='w-full py-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold rounded-lg transition-colors'
                        >
                            Pay Now
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default PaymentMethods
