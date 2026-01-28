import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import NoData from '../components/NoData'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { motion } from 'framer-motion'
import { FaCheck, FaChevronRight } from 'react-icons/fa'

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order)
  const navigate = useNavigate()

  console.log("All Orders:", orders)
  if (orders && orders.length > 0) {
    console.log("First Order Structure:", orders[0])
    console.log("Product Details:", orders[0]?.product_details)
    console.log("Image Field:", orders[0]?.product_details?.image)
  }

  if (!orders || orders.length === 0) {
    return <div className='min-h-[60vh] flex flex-col items-center justify-center'>
      <NoData />
      <p className='text-gray-500 mt-4'>No orders found. Start shopping!</p>
    </div>
  }

  // Group orders by orderId to handle multiple items per order
  const groupedOrders = orders.reduce((acc, order) => {
    const orderId = order.orderId
    if (!acc[orderId]) {
      acc[orderId] = {
        ...order,
        items: [order],
        totalAmt: (order.totalAmt || 0) + 5
      }
    } else {
      acc[orderId].items.push(order)
      // Update total if needed
      acc[orderId].totalAmt = acc[orderId].items.reduce((sum, item) => sum + (item.totalAmt || 0), 0) + 5
    }
    return acc
  }, {})

  const orderList = Object.values(groupedOrders)

  return (
    <div className='min-h-full pb-10'>
      <div className='sticky top-24 lg:top-20 z-10 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 p-4 px-6 mb-6 rounded-2xl'>
        <h1 className='font-bold text-xl lg:text-2xl text-gray-800'>My Orders</h1>
        <p className='text-xs lg:text-sm text-gray-500 mt-1'>View and track your order history</p>
      </div>

      <div className='max-w-4xl space-y-4'>
        {
          orderList.map((orderGroup, index) => {
            const formattedDate = new Date(orderGroup.createdAt).toLocaleDateString("en-GB", {
              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true
            })

            const statusText = orderGroup.payment_status === "CASH ON DELIVERY"
              ? "Arrived in 13 minutes"
              : "Order Placed"

            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={orderGroup.orderId}
                onClick={() => navigate(`/dashboard/order-detail/${orderGroup.orderId}`)}
                className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer'
              >
                {/* Order Header */}
                <div className='p-4 flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    {/* Status Icon */}
                    <div className='w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0'>
                      <FaCheck className='text-green-600 text-lg' />
                    </div>

                    {/* Order Info */}
                    <div>
                      <h3 className='font-bold text-gray-800 text-base'>{statusText}</h3>
                      <p className='text-sm text-gray-500'>
                        {DisplayPriceInRupees(orderGroup.totalAmt)} • {formattedDate}
                      </p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <FaChevronRight className='text-gray-400' />
                </div>

                {/* Product Images Grid */}
                <div className='px-4 pb-4'>
                  <div className='grid grid-cols-4 gap-3'>
                    {orderGroup.items.slice(0, 4).map((item, idx) => (
                      <div
                        key={idx}
                        className='aspect-square bg-gray-50 rounded-xl border border-gray-100 p-2 flex items-center justify-center overflow-hidden'
                      >
                        <img
                          src={
                            (item?.product_details?.image && item.product_details.image[0]) ||
                            (item?.product_details?.Image && item.product_details.Image[0]) ||
                            "https://placehold.co/100?text=No+Image"
                          }
                          alt={item?.product_details?.name || "Product"}
                          className='w-full h-full object-contain'
                          onError={(e) => { e.target.src = "https://placehold.co/100?text=Error" }}
                        />
                      </div>
                    ))}
                    {orderGroup.items.length > 4 && (
                      <div className='aspect-square bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center'>
                        <span className='text-gray-600 font-bold text-sm'>+{orderGroup.items.length - 4}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })
        }
      </div>
    </div>
  )
}

export default MyOrders
