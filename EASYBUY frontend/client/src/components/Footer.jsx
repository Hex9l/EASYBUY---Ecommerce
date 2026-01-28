import React from 'react'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Link } from 'react-router-dom';
import logo from '../assets/easybuy-logo.png'

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-white border-t border-gray-100 pt-12 pb-8'>
      <div className='container mx-auto px-4 lg:px-6'>
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12'>

          {/* Brand Section */}
          <div className='flex flex-col gap-4'>
            <Link to="/" className='block'>
              <img src={logo} alt="EasyBuy" className='w-40 object-contain' />
            </Link>
            <p className='text-gray-500 text-sm leading-relaxed max-w-sm'>
              Your one-stop destination for fresh groceries, daily essentials, and more. Delivered to your doorstep with speed and care.
            </p>
          </div>

          {/* Quick Links */}
          <div className='flex flex-col gap-4'>
            <h4 className='font-bold text-gray-800 text-base'>Useful Links</h4>
            <ul className='flex flex-col gap-2.5'>
              <li><Link to="/about" className='text-sm text-gray-500 hover:text-[#0c831f] transition-colors'>About Us</Link></li>
              <li><Link to="/contact" className='text-sm text-gray-500 hover:text-[#0c831f] transition-colors'>Contact Us</Link></li>
              <li><Link to="/faq" className='text-sm text-gray-500 hover:text-[#0c831f] transition-colors'>FAQ</Link></li>
              <li><Link to="/terms" className='text-sm text-gray-500 hover:text-[#0c831f] transition-colors'>Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Categories Section */}
          <div className='flex flex-col gap-4'>
            <h4 className='font-bold text-gray-800 text-base'>Top Categories</h4>
            <ul className='flex flex-col gap-2.5'>
              <li><Link to="/" className='text-sm text-gray-500 hover:text-[#0c831f] transition-colors'>Vegetables & Fruits</Link></li>
              <li><Link to="/" className='text-sm text-gray-500 hover:text-[#0c831f] transition-colors'>Dairy & Breakfast</Link></li>
              <li><Link to="/" className='text-sm text-gray-500 hover:text-[#0c831f] transition-colors'>Beverages</Link></li>
              <li><Link to="/" className='text-sm text-gray-500 hover:text-[#0c831f] transition-colors'>Personal Care</Link></li>
            </ul>
          </div>

          {/* Newsletter / Contact Section */}
          <div className='flex flex-col gap-4'>
            <h4 className='font-bold text-gray-800 text-base'>Contact Us</h4>
            <div className='flex flex-col gap-3'>
              <div className='flex flex-col'>
                <span className='text-xs font-bold text-gray-400 uppercase tracking-wider'>Customer Support</span>
                <p className='text-sm text-gray-600 font-medium'>support@easybuy.com</p>
              </div>
              <div className='flex flex-col'>
                <span className='text-xs font-bold text-gray-400 uppercase tracking-wider'>Helpline</span>
                <p className='text-sm text-gray-600 font-medium text-lg'>+91 8200800569</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-gray-100 pt-8 flex flex-col items-center text-center gap-3'>
          <div className='flex items-center gap-6 mb-2'>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className='text-gray-500 hover:text-black transition-colors text-xl'>
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className='text-gray-500 hover:text-black transition-colors text-xl'>
              <FaTwitter />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className='text-gray-500 hover:text-black transition-colors text-xl'>
              <FaFacebook />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className='text-gray-500 hover:text-black transition-colors text-xl'>
              <FaLinkedin />
            </a>
          </div>

          <p className='text-[13px] text-gray-400 font-medium'>
            © {currentYear} EasyBuy Marketplace Private Limited
          </p>
          <p className='text-[12px] text-gray-400 font-medium'>
            fssai lic no : 11224999000872
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
