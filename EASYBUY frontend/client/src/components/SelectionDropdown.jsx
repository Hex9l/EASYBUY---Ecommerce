import React, { useState, useEffect, useRef } from 'react';
import { IoClose, IoChevronDown, IoSearch, IoCheckmark } from "react-icons/io5";

const SelectionDropdown = ({ 
    options = [], 
    value = "", 
    onChange, 
    placeholder = "Select an option", 
    label = "",
    error = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [openUpwards, setOpenUpwards] = useState(false);
    const dropdownRef = useRef(null);

    const filteredOptions = options.filter(option => 
        option?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const dropdownHeight = 350; // Max expected height
            
            if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
                setOpenUpwards(true);
            } else {
                setOpenUpwards(false);
            }
        }
    }, [isOpen]);

    const handleSelect = (option) => {
        onChange(option._id);
        setIsOpen(false);
        setSearchTerm("");
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {label && <label className="text-sm font-semibold text-gray-700 mb-2 block">{label}</label>}
            
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full p-4 bg-white border-2 rounded-2xl transition-all cursor-pointer flex items-center justify-between
                    ${isOpen 
                        ? 'border-[#00b050] ring-[5px] ring-[#00b050]/20 shadow-lg' 
                        : 'border-[#00b050]/30 hover:border-[#00b050] hover:ring-[5px] hover:ring-[#00b050]/10'
                    }
                    ${error ? 'border-red-500 ring-4 ring-red-100' : ''}
                `}
            >
                <span className={`text-[15px] truncate ${!value ? 'text-gray-400' : 'text-gray-800 font-medium'}`}>
                    {value ? options.find(opt => opt._id === value)?.name : placeholder}
                </span>
                <div className="flex items-center gap-2">
                    {value && !isOpen && (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange("");
                            }}
                            className="p-1 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                        >
                            <IoClose size={16} />
                        </button>
                    )}
                    <IoChevronDown 
                        size={20} 
                        className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#00b050]' : ''}`} 
                    />
                </div>
            </div>

            {isOpen && (
                <div className={`
                    absolute z-[100] w-full bg-white border border-gray-100 rounded-3xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-200
                    ${openUpwards ? 'bottom-full mb-3 origin-bottom' : 'top-full mt-3 origin-top'}
                `}>
                    <div className="p-4 border-b border-gray-50 bg-white sticky top-0 z-10">
                        <div className="relative flex items-center group">
                            <IoSearch className={`absolute left-4 transition-colors ${searchTerm ? 'text-[#00b050]' : 'text-gray-400'}`} size={20} />
                            <input
                                type="text"
                                className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border-2 border-[#00b050]/20 rounded-2xl text-[15px] focus:outline-none focus:border-[#00b050] focus:ring-4 focus:ring-[#00b050]/10 transition-all placeholder:text-gray-400"
                                placeholder="Search categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                            />
                        </div>
                    </div>
                    
                    <div className="max-h-[280px] overflow-y-auto py-2 px-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option._id}
                                    onClick={() => handleSelect(option)}
                                    className={`
                                        px-4 py-3.5 rounded-2xl text-[15px] cursor-pointer transition-all flex items-center justify-between mb-0.5
                                        ${value === option._id 
                                            ? 'bg-secondary text-white font-semibold shadow-md shadow-secondary/20' 
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                                    `}
                                >
                                    <span className="truncate">{option.name}</span>
                                    {value === option._id && (
                                        <div className="flex items-center justify-center w-5 h-5 bg-white/20 rounded-full backdrop-blur-sm">
                                            <IoCheckmark size={14} className="text-white" />
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="py-12 text-center text-gray-400">
                                <IoSearch size={40} className="mx-auto mb-3 opacity-20" />
                                <p className="text-sm font-medium">No results found for "{searchTerm}"</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {error && <p className="text-xs text-red-500 mt-2 ml-2 font-semibold flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-red-500" />
                {error}
            </p>}
        </div>
    );
};

export default SelectionDropdown;
