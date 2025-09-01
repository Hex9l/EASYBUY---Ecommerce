import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";


const Footer = () => {
  return (
    <footer className=' h-25 border-black  p-4 text-center   shadow-[0_-6px_6px_-4px_rgba(0,0,0,0.1)]'>
    
    <div className='container mx-auto  p-6  flex text-center  lg:flex-between lg:justify-between items-center justify-between gap-4 '>

       <p> ⓒ All Right Reserved 202442 </p>

       <div className='flex items-center justify-center gap-4 text-2xl '>
        <a href="" className='text-2xl text-blue-600 hover:text-blue-800'> 
          <FaFacebook/>
        </a>
        <a href="" className='text-2xl text-pink-800 hover:text-pink-600'>
          <FaInstagram/>
        </a>
        <a href=""  className='text-2xl text-blue-600 hover:text-blue-800'>
          <FaLinkedin/>
        </a>

       </div>
    </div>
    </footer>
  )
}

export default Footer
