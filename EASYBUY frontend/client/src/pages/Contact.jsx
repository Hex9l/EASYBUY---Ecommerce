import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
            <div className="container mx-auto px-4 py-8 lg:py-12 max-w-4xl">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">Contact Us</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-10">
                    Have questions, feedback, or need assistance? We are here to help you! Reach out to us through any of the channels below.
                </p>

                <div className="grid md:grid-cols-2 gap-10">
                    {/* Contact Information */}
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-[#0c831f] dark:text-green-500">
                                <FaPhone size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 dark:text-gray-100">Phone</h3>
                                <p className="text-gray-600 dark:text-gray-300">+91 8200800569</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Mon-Sat 9am to 6pm</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400">
                                <FaEnvelope size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 dark:text-gray-100">Email</h3>
                                <p className="text-gray-600 dark:text-gray-300">support@easybuy.com</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Online support 24/7</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full text-amber-600 dark:text-amber-500">
                                <FaMapMarkerAlt size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 dark:text-gray-100">Office</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    nikol, <br />
                                    ahmedabad, Gujarat, 380001
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Simple Map or Form Placeholder */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Send us a message</h3>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                <input type="text" className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#0c831f] dark:focus:border-[#0c831f]" placeholder="Your Name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                <input type="email" className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#0c831f] dark:focus:border-[#0c831f]" placeholder="your@email.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                                <textarea className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#0c831f] dark:focus:border-[#0c831f] h-24" placeholder="How can we help?"></textarea>
                            </div>
                            <button className="w-full bg-[#0c831f] text-white font-bold py-2 rounded-lg hover:bg-[#096c19] transition-colors">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
