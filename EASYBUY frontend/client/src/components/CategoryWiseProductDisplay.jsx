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
        <section className='container mx-auto pb-6'>
            <div className='px-4 pt-6 pb-4 flex items-center justify-between'>
                <h3 className='font-bold text-xl md:text-2xl text-neutral-800 capitalize'>{name}</h3>
                <Link
                    to={handleRedirectProductListpage()}
                    className='text-green-600 hover:text-green-700 font-bold transition-all hover:translate-x-1 inline-flex items-center gap-1'
                >
                    See All
                </Link>
            </div>

            <div className='relative flex items-center group/carousel'>
                {/* Left Arrow */}
                <button
                    onClick={() => scroll('left')}
                    className={`
                        absolute left-4 z-20 
                        bg-white/90 backdrop-blur shadow-xl p-3 rounded-full 
                        transition-all duration-300 
                        hover:bg-green-600 hover:text-white 
                        hidden lg:flex items-center justify-center
                        border border-neutral-100
                        active:scale-95
                        ${showLeftArrow ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}
                    `}
                >
                    <FaAngleLeft size={22} />
                </button>

                <div
                    className='flex gap-4 md:gap-6 overflow-x-scroll scrollbar-none scroll-smooth px-4 py-2 w-full'
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
                        absolute right-4 z-20 
                        bg-white/90 backdrop-blur shadow-xl p-3 rounded-full 
                        transition-all duration-300 
                        hover:bg-green-600 hover:text-white 
                        hidden lg:flex items-center justify-center
                        border border-neutral-100
                        active:scale-95
                        ${showRightArrow ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}
                    `}
                >
                    <FaAngleRight size={22} />
                </button>
            </div>
        </section>
    )
}

export default CategoryWiseProductDisplay


