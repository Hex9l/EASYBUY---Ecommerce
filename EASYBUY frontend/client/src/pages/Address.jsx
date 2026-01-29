import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import AddAddress from '../components/AddAddress'
import { MdDelete, MdEdit, MdLocationOn, MdPhone, MdAdd } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import EditAddressDetails from '../components/EditAddressDetails';
import Axios from '../utils/Axios';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { useGlobalContext } from '../provider/GlobalProvider';
import { SummaryApi } from '../common/SummaryApi';

const Address = () => {
  const addressList = useSelector(state => state.addresses.addressList)
  const [openAddress, setOpenAddress] = useState(false)
  const [OpenEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState({})
  const { fetchAddress } = useGlobalContext()

  const handleDisableAddress = async (id, addressLine) => {
    // SweetAlert2 confirmation
    const result = await Swal.fire({
      title: 'Delete Address?',
      html: `Are you sure you want to delete<br/><strong>${addressLine}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data: {
          _id: id
        }
      })
      if (response.data.success) {
        toast.success("Address deleted successfully")
        if (fetchAddress) {
          fetchAddress()
        }
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <div className='min-h-full'>
      {/* Header */}
      <div className='sticky top-24 lg:top-20 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm px-4 lg:px-6 py-4 flex justify-between items-center mb-6 rounded-2xl border-b border-gray-100 dark:border-gray-800 transition-colors duration-300'>
        <h2 className='text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100'>My Addresses</h2>
        <button
          onClick={() => setOpenAddress(true)}
          className='flex items-center gap-2 bg-[#00b050] text-white px-4 lg:px-5 py-2 lg:py-2.5 rounded-xl hover:bg-[#00b060] transition-all shadow-lg shadow-[#00b050]/20 active:scale-95 text-sm lg:text-base font-bold'
        >
          <MdAdd size={20} />
          <span className='hidden sm:inline'>Add Address</span>
          <span className='sm:hidden'>Add</span>
        </button>
      </div>

      {/* Address Grid */}
      <div className=''>
        {addressList.length === 0 ? (
          // Empty State
          <div className='flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300'>
            <FaMapMarkerAlt size={60} className='text-gray-200 dark:text-gray-600 mb-4' />
            <h3 className='text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2'>No addresses saved</h3>
            <p className='text-gray-400 dark:text-gray-500 mb-6 text-sm text-center px-4'>Add your first address to get started with faster checkout</p>
            <button
              onClick={() => setOpenAddress(true)}
              className='bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all font-semibold shadow-md active:scale-95'
            >
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6'>
            {addressList.map((address, index) => {
              if (!address.status) return null;
              return (
                <div
                  key={index}
                  className='bg-white dark:bg-gray-800 rounded-2xl p-5 lg:p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 flex flex-col'
                >
                  {/* Address Content */}
                  <div className='flex gap-4 mb-4 flex-1'>
                    <div className='bg-green-50 dark:bg-green-900/20 p-3 rounded-xl h-fit'>
                      <MdLocationOn size={22} className='text-green-600 dark:text-green-500' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='font-bold text-gray-800 dark:text-gray-200 mb-1 text-base lg:text-lg truncate'>{address.address_line}</p>
                      <p className='text-gray-500 dark:text-gray-400 text-sm leading-relaxed'>{address.city}, {address.state}</p>
                      <p className='text-gray-500 dark:text-gray-400 text-sm leading-relaxed'>{address.country} - {address.pincode}</p>
                      <div className='flex items-center gap-2 mt-3 text-gray-400 dark:text-gray-500'>
                        <MdPhone size={14} />
                        <p className='text-xs lg:text-sm font-medium'>{address.mobile}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex gap-2 pt-4 border-t border-gray-50 dark:border-gray-700'>
                    <button
                      onClick={() => {
                        setOpenEdit(true)
                        setEditData(address)
                      }}
                      className='flex-1 flex items-center justify-center gap-1.5 bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-2 rounded-lg hover:bg-blue-100/50 dark:hover:bg-blue-900/30 transition-all text-sm font-bold border border-blue-100/20 dark:border-blue-800/30'
                    >
                      <MdEdit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDisableAddress(address._id, address.address_line)}
                      className='flex-1 flex items-center justify-center gap-1.5 bg-red-50/50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg hover:bg-red-100/50 dark:hover:bg-red-900/30 transition-all text-sm font-bold border border-red-100/20 dark:border-red-800/30'
                    >
                      <MdDelete size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}

            {/* Add New Card */}
            <div
              onClick={() => setOpenAddress(true)}
              className='bg-gray-50/30 dark:bg-gray-800/50 rounded-2xl p-6 border-2 border-dashed border-gray-200 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50/30 dark:hover:bg-green-900/10 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[200px] group'
            >
              <div className='bg-white dark:bg-gray-700 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 p-4 rounded-2xl mb-3 shadow-sm transition-all'>
                <MdAdd size={28} className='text-gray-300 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-all' />
              </div>
              <p className='text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 font-bold transition-all text-sm'>Add New Address</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
      {OpenEdit && <EditAddressDetails data={editData} close={() => setOpenEdit(false)} />}
    </div>
  )
}

export default Address
