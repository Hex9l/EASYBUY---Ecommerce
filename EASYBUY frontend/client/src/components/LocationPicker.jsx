import React, { useState, useEffect } from 'react';
import { IoMdClose, IoMdLocate } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedAddress } from '../store/addressSlice';
import toast from 'react-hot-toast';

const LocationPicker = ({ close }) => {
    const dispatch = useDispatch();
    const addressList = useSelector((state) => state.addresses.addressList);
    const [manualAddress, setManualAddress] = useState("");

    const handleDetectLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // In a real app, use Google Maps API to reverse geocode lat/lng
                    // const { latitude, longitude } = position.coords;
                    const detectedAddr = "Current Location"; // Placeholder
                    dispatch(setSelectedAddress(detectedAddr));
                    toast.success("Location detected successfully!");
                    close();
                },
                (error) => {
                    console.error(error)
                    toast.error("Failed to detect location. Please enable permissions.");
                }
            );
        } else {
            toast.error("Geolocation is not supported by your browser.");
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (!manualAddress.trim()) return;
        dispatch(setSelectedAddress(manualAddress));
        close();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fadeIn">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Select Location</h2>
                    <button onClick={close} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <IoMdClose size={24} className="text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col gap-6">

                    {/* Detect Location */}
                    <button
                        onClick={handleDetectLocation}
                        className="flex items-center gap-4 w-full p-4 border border-green-200 bg-green-50 rounded-xl hover:bg-green-100 transition-all group"
                    >
                        <div className="bg-white p-2 rounded-full shadow-sm text-green-600 group-hover:scale-110 transition-transform">
                            <IoMdLocate size={24} />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-green-700">Detect my location</p>
                            <p className="text-xs text-green-600">Using GPS</p>
                        </div>
                    </button>

                    {/* Saved Addresses */}
                    {addressList && addressList.filter(addr => addr.status).length > 0 && (
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-gray-400 mb-1">
                                <div className="h-px bg-gray-200 flex-1"></div>
                                <span className="text-xs font-medium tracking-wider">SAVED ADDRESSES</span>
                                <div className="h-px bg-gray-200 flex-1"></div>
                            </div>

                            <div className='flex flex-col gap-2 max-h-48 overflow-y-auto scrollbarCustom'>
                                {addressList.filter(addr => addr.status).map((addr, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            const addressStr = `${addr.address_line}, ${addr.city}, ${addr.state}`;
                                            dispatch(setSelectedAddress(addressStr));
                                            close();
                                        }}
                                        className='p-3 border border-gray-100 rounded-lg hover:bg-gray-50 hover:border-gray-300 cursor-pointer flex gap-3 items-center text-left transition-all'
                                    >
                                        <div className='bg-gray-100 p-2 rounded-full text-gray-500'>
                                            <IoMdLocate size={18} />
                                        </div>
                                        <div className='flex-1'>
                                            <p className='font-bold text-gray-800 text-sm line-clamp-1'>{addr.address_line}</p>
                                            <p className='text-xs text-gray-500'>{addr.city}, {addr.state}, {addr.pincode}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="flex items-center gap-4 text-gray-400">
                        <div className="h-px bg-gray-200 flex-1"></div>
                        <span className="text-sm font-medium">OR ENTER MANUALLY</span>
                        <div className="h-px bg-gray-200 flex-1"></div>
                    </div>

                    {/* Manual Entry */}
                    <form onSubmit={handleManualSubmit} className="flex flex-col gap-3">
                        <input
                            type="text"
                            placeholder="Enter pincode or city..."
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
                            value={manualAddress}
                            onChange={(e) => setManualAddress(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={!manualAddress}
                            className="bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Confirm Location
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default LocationPicker;
