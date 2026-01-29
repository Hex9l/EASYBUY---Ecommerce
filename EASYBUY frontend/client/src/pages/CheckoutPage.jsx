import React, { useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import AddAddress from '../components/AddAddress'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import { SummaryApi } from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { motion, AnimatePresence } from 'framer-motion'
import { FaMapMarkerAlt, FaPhoneAlt, FaPlus, FaCheckCircle, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa'
import PaymentMethods from '../components/PaymentMethods'

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, totalAmt, handlingCharge, fetchCartItem, fetchOrder } = useGlobalContext()
  const [openAddress, setOpenAddress] = useState(false)
  const addressList = useSelector(state => state.addresses.addressList)
  const [selectAddress, setSelectAddress] = useState(0)
  const cartItemsList = useSelector(state => state.cartItem.cart)
  const navigate = useNavigate()
  const [showPayment, setShowPayment] = useState(false)

  const handleCashOnDelivery = async () => {
    try {
      if (!addressList[selectAddress]) {
        toast.error("Please select address")
        return
      }

      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalAmt,
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        if (fetchCartItem) {
          fetchCartItem()
        }
        if (fetchOrder) {
          fetchOrder()
        }
        navigate('/success', {
          state: {
            text: "Order"
          }
        })
      }

    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleOnlinePayment = async () => {
    setShowPayment(true)
  }

  return (
    <section className='bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-132px)] py-8 transition-colors duration-300'>
      <div className='container mx-auto px-4'>
        {showPayment ? (
          <PaymentMethods
            selectedAddress={addressList[selectAddress]}
            onBack={() => setShowPayment(false)}
          />
        ) : (
          <div className='flex flex-col lg:flex-row gap-8 items-start'>

            {/* Left Side - Address Selection */}
            <div className='flex-1 w-full'>
              <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2'>
                <FaMapMarkerAlt className='text-green-600' />
                Choose delivery address
              </h2>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <AnimatePresence>
                  {addressList.map((address, index) => (
                    <motion.label
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={address._id || index}
                      htmlFor={"address" + index}
                      className={`relative group cursor-pointer border-2 rounded-2xl p-5 transition-all duration-300 ${selectAddress == index
                        ? 'border-green-600 bg-green-50/30 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-green-200 dark:hover:border-green-800 hover:shadow-md'
                        } ${!address.status && "hidden"}`}
                    >
                      <input
                        id={"address" + index}
                        type='radio'
                        value={index}
                        onChange={(e) => setSelectAddress(e.target.value)}
                        name='address'
                        className='hidden'
                        checked={selectAddress == index}
                      />

                      <div className='flex justify-between items-start mb-3'>
                        <div className='p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors'>
                          <FaMapMarkerAlt className={selectAddress == index ? 'text-green-600' : 'text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400'} />
                        </div>
                        {selectAddress == index && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className='text-green-600'
                          >
                            <FaCheckCircle size={20} />
                          </motion.div>
                        )}
                      </div>

                      <div className='space-y-1'>
                        <p className='font-semibold text-gray-800 dark:text-gray-100 leading-tight'>{address.address_line}</p>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{address.city}, {address.state}</p>
                        <p className='text-sm text-gray-600 dark:text-gray-400 font-medium'>{address.country} - {address.pincode}</p>
                        <div className='flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700'>
                          <FaPhoneAlt size={12} className='text-gray-400 dark:text-gray-500' />
                          <p className='text-sm text-gray-700 dark:text-gray-300 font-medium'>{address.mobile}</p>
                        </div>
                      </div>

                      {selectAddress == index && (
                        <motion.div
                          layoutId="active-border"
                          className="absolute inset-0 border-2 border-green-600 rounded-2xl pointer-events-none"
                        />
                      )}
                    </motion.label>
                  ))}
                </AnimatePresence>

                {/* Add Address Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setOpenAddress(true)}
                  className='h-full min-h-[160px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl flex flex-col justify-center items-center gap-3 cursor-pointer bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-green-500 dark:hover:border-green-500 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300'
                >
                  <div className='w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-700 flex justify-center items-center'>
                    <FaPlus size={20} />
                  </div>
                  <span className='font-semibold'>Add new address</span>
                </motion.div>
              </div>
            </div>

            {/* Right Side - Summary */}
            <div className='w-full lg:max-w-md'>
              <div className='bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-30 transition-colors duration-300'>
                <div className='p-6 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700'>
                  <h3 className='text-xl font-bold text-gray-800 dark:text-gray-100'>Order Summary</h3>
                </div>

                <div className='p-6 space-y-4'>
                  <div className='space-y-3'>
                    <div className='flex justify-between items-center text-gray-600 dark:text-gray-400'>
                      <span>Items total ({totalQty})</span>
                      <div className='flex items-center gap-2'>
                        <span className='line-through text-xs text-gray-400 dark:text-gray-500'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                        <span className='font-medium text-gray-900 dark:text-white'>{DisplayPriceInRupees(totalPrice)}</span>
                      </div>
                    </div>
                    <div className='flex justify-between items-center text-gray-600 dark:text-gray-400'>
                      <span>Delivery Charge</span>
                      <span className='text-green-600 dark:text-green-400 font-bold uppercase text-xs tracking-wider'>Free</span>
                    </div>
                    <div className='flex justify-between items-center text-gray-600 dark:text-gray-400'>
                      <span>Handling Charge</span>
                      <p className='text-gray-900 dark:text-white'>{DisplayPriceInRupees(handlingCharge)}</p>
                    </div>
                  </div>

                  <div className='pt-4 border-t border-gray-100 dark:border-gray-700'>
                    <div className='flex justify-between items-center'>
                      <span className='text-lg font-bold text-gray-800 dark:text-gray-100'>Grand total</span>
                      <span className='text-2xl font-black text-green-600 dark:text-green-500'>{DisplayPriceInRupees(totalAmt)}</span>
                    </div>
                  </div>

                  <div className='pt-6 space-y-3'>
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className='w-full py-4 bg-green-600 hover:bg-green-700 dark:hover:bg-green-500 rounded-2xl text-white font-bold shadow-lg shadow-green-200 dark:shadow-green-900/30 transition-all flex items-center justify-center gap-2'
                      onClick={handleOnlinePayment}
                    >
                      <FaCreditCard />
                      Pay Online
                    </motion.button>

                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className='w-full py-4 border-2 border-green-600 rounded-2xl text-green-600 dark:text-green-400 font-bold hover:bg-green-50 dark:hover:bg-green-900/20 transition-all flex items-center justify-center gap-2'
                      onClick={handleCashOnDelivery}
                    >
                      <FaMoneyBillWave />
                      Cash on Delivery
                    </motion.button>
                  </div>
                  <p className='text-center text-xs text-gray-400 dark:text-gray-500 mt-4'>
                    By placing this order, you agree to our Terms and Conditions
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {openAddress && (
        <AddAddress close={() => setOpenAddress(false)} />
      )}
    </section>
  )
}

export default CheckoutPage
