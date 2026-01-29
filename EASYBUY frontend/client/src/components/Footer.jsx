import React from 'react'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Link } from 'react-router-dom';
import logo from '../assets/easybuy-logo.png'

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pt-10 pb-8 transition-colors duration-300'>
      <div className='container'>
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-10'>

          {/* Brand Section */}
          <div className='flex flex-col gap-4 text-center sm:text-left items-center sm:items-start'>
            <Link to="/" className='block'>
              <img src={logo} alt="EasyBuy" className='w-36 lg:w-40 object-contain' />
            </Link>
            <p className='text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-[300px]'>
              Your one-stop destination for fresh groceries, daily essentials, and more. Delivered to your doorstep with speed and care.
            </p>
          </div>

          {/* Quick Links */}
          <div className='flex flex-col gap-4 text-center sm:text-left'>
            <h4 className='font-bold text-gray-800 dark:text-gray-100 text-lg'>Useful Links</h4>
            <ul className='flex flex-col gap-3'>
              <li><Link to="/about" className='text-sm text-gray-500 dark:text-gray-400 hover:text-[#0c831f] dark:hover:text-[#0c831f] transition-colors font-medium'>About Us</Link></li>
              <li><Link to="/contact" className='text-sm text-gray-500 dark:text-gray-400 hover:text-[#0c831f] dark:hover:text-[#0c831f] transition-colors font-medium'>Contact Us</Link></li>
              <li><Link to="/faq" className='text-sm text-gray-500 dark:text-gray-400 hover:text-[#0c831f] dark:hover:text-[#0c831f] transition-colors font-medium'>FAQ</Link></li>
              <li><Link to="/terms" className='text-sm text-gray-500 dark:text-gray-400 hover:text-[#0c831f] dark:hover:text-[#0c831f] transition-colors font-medium'>Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Categories Section */}
          <div className='flex flex-col gap-4 text-center sm:text-left'>
            <h4 className='font-bold text-gray-800 dark:text-gray-100 text-lg'>Top Categories</h4>
            <ul className='flex flex-col gap-3'>
              <li><Link to="/" className='text-sm text-gray-500 dark:text-gray-400 hover:text-[#0c831f] dark:hover:text-[#0c831f] transition-colors font-medium'>Vegetables & Fruits</Link></li>
              <li><Link to="/" className='text-sm text-gray-500 dark:text-gray-400 hover:text-[#0c831f] dark:hover:text-[#0c831f] transition-colors font-medium'>Dairy & Breakfast</Link></li>
              <li><Link to="/" className='text-sm text-gray-500 dark:text-gray-400 hover:text-[#0c831f] dark:hover:text-[#0c831f] transition-colors font-medium'>Beverages</Link></li>
              <li><Link to="/" className='text-sm text-gray-500 dark:text-gray-400 hover:text-[#0c831f] dark:hover:text-[#0c831f] transition-colors font-medium'>Personal Care</Link></li>
            </ul>
          </div>

          {/* Newsletter / Contact Section */}
          <div className='flex flex-col gap-4 text-center sm:text-left'>
            <h4 className='font-bold text-gray-800 dark:text-gray-100 text-lg'>Contact Us</h4>
            <div className='flex flex-col gap-4 items-center sm:items-start'>
              <div className='flex flex-col'>
                <span className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-1'>Customer Support</span>
                <p className='text-sm text-gray-700 dark:text-gray-300 font-semibold'>support@easybuy.com</p>
              </div>
              <div className='flex flex-col'>
                <span className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-1'>Helpline</span>
                <p className='text-sm text-gray-700 dark:text-gray-300 font-semibold text-lg'>+91 8200800569</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-gray-100 dark:border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-xs text-gray-400 font-medium text-center md:text-left'>
            © {currentYear} EasyBuy Marketplace Private Limited • FSSAI License No: 11224999000872
          </p>

          <div className='flex items-center gap-6'>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className='text-gray-400 hover:text-[#E1306C] transition-colors text-xl'>
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className='text-gray-400 hover:text-[#1DA1F2] transition-colors text-xl'>
              <FaTwitter />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className='text-gray-400 hover:text-[#1877F2] transition-colors text-xl'>
              <FaFacebook />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className='text-gray-400 hover:text-[#0077b5] transition-colors text-xl'>
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
