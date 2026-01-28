import React from 'react'
import { IoClose } from "react-icons/io5";

const ConfirmDelete = ({ close, cancel, confirm }) => {
    return (
        <section className='fixed bottom-10 right-10 z-50 p-4 transition-all duration-300 ease-in-out'>
            
            <div className='bg-white p-4 w-full max-w-sm rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] border border-gray-100 relative'>

                <div className='flex justify-between items-center gap-3 mb-3'>
                    <h1 className='font-bold text-gray-800'>Permanent Delete</h1>
                    
                </div>

                <p className='text-gray-600 mb-4 text-sm'>
                    Are you sure you want to delete this?
                </p>

                <div className='w-full flex items-center justify-end gap-3'>
                    <button
                        onClick={cancel}
                        className='px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-all text-sm font-medium'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirm}
                        className='px-3 py-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded text-sm font-medium'
                    >
                        Delete
                    </button>
                </div>
            </div>
        </section>
    )
}

export default ConfirmDelete
