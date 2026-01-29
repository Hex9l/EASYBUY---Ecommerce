import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Cancel = () => {
  return (
    <div className='min-h-[70vh] w-full flex items-center justify-center p-4 bg-slate-50 dark:bg-gray-900 transition-colors duration-300'>
      <div className='w-full max-w-md bg-red-50 dark:bg-red-900/20 p-8 rounded-3xl border border-red-100 dark:border-red-900/30 flex flex-col justify-center items-center gap-6 shadow-xl shadow-red-100/50 dark:shadow-none'>
        <div className='w-20 h-20 bg-red-100 dark:bg-red-800/30 rounded-full flex items-center justify-center mb-2'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <div className='text-center space-y-2'>
          <p className='text-red-800 dark:text-red-200 font-black text-2xl'>Order Cancelled</p>
          <p className='text-red-600/80 dark:text-red-300/80 text-sm'>Your payment was cancelled or failed. No charges were made.</p>
        </div>

        <Link
          to="/"
          className="w-full py-3.5 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-200 dark:shadow-none text-center"
        >
          Return to Home
        </Link>
      </div>
    </div>
  )
}

export default Cancel
