import React from 'react';
import { useTheme } from '../provider/ThemeProvider';
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full transition-all duration-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-md dark:hover:shadow-gray-900 overflow-hidden group border border-gray-200 dark:border-gray-700"
            aria-label="Toggle Dark Mode"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
            <div className='relative w-5 h-5 flex items-center justify-center overflow-hidden'>
                <BsSunFill
                    size={20}
                    className={`absolute transition-all duration-500 text-amber-500
                    ${theme === 'light' ? 'rotate-0 opacity-100 scale-100' : 'rotate-90 opacity-0 scale-0'}
                 `}
                />
                <BsMoonStarsFill
                    size={18}
                    className={`absolute transition-all duration-500 text-blue-400
                    ${theme === 'dark' ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-0'}
                 `}
                />
            </div>
        </button>
    );
};

export default ThemeToggle;
