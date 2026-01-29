import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaCheckCircle, FaShoppingBag, FaHome } from 'react-icons/fa'

const Success = () => {
    const location = useLocation()
    const successText = location?.state?.text || "Payment"

    return (
        <div className='min-h-[70vh] flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className='w-full max-w-lg bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-black/30 border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-8 text-center relative overflow-hidden transition-all duration-300'
            >
                {/* Background Decoration */}
                <div className='absolute top-0 left-0 w-full h-2 bg-green-500'></div>
                
                {/* Success Icon with Animation */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.2 
                    }}
                    className='relative'
                >
                    <div className='absolute inset-0 bg-green-100 dark:bg-green-900/40 rounded-full animate-ping opacity-25'></div>
                    <FaCheckCircle className='text-green-500 dark:text-green-400 text-8xl md:text-9xl relative z-10' />
                </motion.div>

                <div className='space-y-4'>
                    <motion.h1 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className='text-3xl md:text-4xl font-black text-gray-800 dark:text-gray-100'
                    >
                        {successText} Successful!
                    </motion.h1>
                    <motion.p 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className='text-gray-500 dark:text-gray-400 text-lg'
                    >
                        Thank you for your order. We've received your request and are processing it now.
                    </motion.p>
                </div>

                <div className='flex flex-col sm:flex-row gap-4 w-full mt-4'>
                    <motion.div 
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className='flex-1'
                    >
                        <Link 
                            to="/dashboard/myorders" 
                            className='flex items-center justify-center gap-2 w-full py-4 bg-gray-800 dark:bg-gray-700 text-white font-bold rounded-2xl hover:bg-gray-900 dark:hover:bg-gray-600 transition-all shadow-lg shadow-gray-200 dark:shadow-none'
                        >
                            <FaShoppingBag />
                            View Orders
                        </Link>
                    </motion.div>
                    
                    <motion.div 
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className='flex-1'
                    >
                        <Link 
                            to="/" 
                            className='flex items-center justify-center gap-2 w-full py-4 border-2 border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 font-bold rounded-2xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all shadow-lg shadow-green-50 dark:shadow-none'
                        >
                            <FaHome />
                            Back to Home
                        </Link>
                    </motion.div>
                </div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className='text-sm text-gray-400 dark:text-gray-500 mt-4'
                >
                    A confirmation email has been sent to your registered address.
                </motion.div>
            </motion.div>
        </div>
    )
}

export default Success
