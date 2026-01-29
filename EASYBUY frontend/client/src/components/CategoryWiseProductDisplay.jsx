import React, { useEffect, useRef, useState } from 'react'
import { Link, } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'

import CardLoading from './CardLoading'
import CardProduct from './CardProduct'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import { SummaryApi } from '../common/SummaryApi'
import { motion } from 'framer-motion'

const CategoryWiseProductDisplay = ({ id, name }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [showLeftArrow, setShowLeftArrow] = useState(false)
    const [showRightArrow, setShowRightArrow] = useState(false)
    const containerRef = useRef()
    const subCategoryData = useSelector(state => state.product.allSubCategory)
    const loadingCardNumber = new Array(6).fill(null)

    const fetchCategoryWiseProduct = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getProductByCategory,
                data: { id }
            })
            if (response.data.success) {
                setData(response.data.data)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategoryWiseProduct()
    }, [])

    const handleScrollState = () => {
        if (containerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
            setShowLeftArrow(scrollLeft > 2)
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5)
        }
    }

    useEffect(() => {
        handleScrollState()
        const container = containerRef.current
        if (container) {
            container.addEventListener('scroll', handleScrollState)
            window.addEventListener('resize', handleScrollState)
            return () => {
                container.removeEventListener('scroll', handleScrollState)
                window.removeEventListener('resize', handleScrollState)
            }
        }
    }, [data, loading])

    const scroll = (direction) => {
        if (containerRef.current) {
            const scrollAmount = 350
            containerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    const handleRedirectProductListpage = () => {
        const subcategory = subCategoryData.find(sub =>
            sub.category.some(c => c._id === id)
        )
        return `/${valideURLConvert(name)}-${id}/${valideURLConvert(subcategory?.name)}-${subcategory?._id}`
    }

    if (!loading && !data.length) return null

    return (
        <section className='container py-6'>
            <div className='flex items-center justify-between mb-4'>
                <h3 className='font-bold text-xl md:text-2xl text-gray-800 dark:text-gray-100 capitalize'>{name}</h3>
                <Link
                    to={handleRedirectProductListpage()}
                    className='text-green-600 hover:text-green-700 font-bold transition-all hover:translate-x-1 inline-flex items-center gap-1 text-sm md:text-base'
                >
                    See All
                </Link>
            </div>

            <div className='relative flex items-center group/carousel'>
                {/* Left Arrow */}
                <button
                    onClick={() => scroll('left')}
                    className={`
                        absolute -left-2 z-20 
                        bg-white dark:bg-gray-800 shadow-lg p-2 rounded-full 
                        transition-all duration-300 
                        hover:bg-green-600 dark:hover:bg-green-600 hover:text-white 
                        text-gray-600 dark:text-gray-300
                        hidden lg:flex items-center justify-center
                        border border-gray-100 dark:border-gray-700
                        active:scale-95
                        ${showLeftArrow ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}
                    `}
                >
                    <FaAngleLeft size={20} />
                </button>

                <div
                    className='flex gap-3 md:gap-5 overflow-x-auto scrollbar-none scroll-smooth pb-2 w-full px-1'
                    ref={containerRef}
                >
                    {loading ? (
                        loadingCardNumber.map((_, index) => (
                            <CardLoading key={"CategorywiseProductDisplayLoading" + index} />
                        ))
                    ) : (
                        data.map((p, index) => (
                            <motion.div
                                key={p._id + index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.03 }}
                                className="flex-shrink-0"
                            >
                                <CardProduct data={p} />
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={() => scroll('right')}
                    className={`
                        absolute -right-2 z-20 
                        bg-white dark:bg-gray-800 shadow-lg p-2 rounded-full 
                        transition-all duration-300 
                        hover:bg-green-600 dark:hover:bg-green-600 hover:text-white 
                        text-gray-600 dark:text-gray-300
                        hidden lg:flex items-center justify-center
                        border border-gray-100 dark:border-gray-700
                        active:scale-95
                        ${showRightArrow ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}
                    `}
                >
                    <FaAngleRight size={20} />
                </button>
            </div>
        </section>
    )
}

export default CategoryWiseProductDisplay


