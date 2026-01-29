import React from 'react';

const Terms = () => {
    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
            <div className="container mx-auto px-4 py-8 lg:py-12 max-w-4xl">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">Terms & Conditions</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last Updated: October 2024</p>

                <div className="space-y-8 text-gray-600 dark:text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">1. Introduction</h2>
                        <p>
                            Welcome to EasyBuy. By accessing using our website and services, you agree to be bound by these Terms and Conditions. Please read them carefully.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">2. Use of Service</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>You must be at least 18 years old to use our services.</li>
                            <li>You agree to provide accurate and complete information during registration.</li>
                            <li>You are responsible for maintaining the confidentiality of your account.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">3. Orders and Delivery</h2>
                        <p>
                            We strive to deliver products within the estimated timeframes, but delays may occur due to unforeseen circumstances. We reserve the right to cancel orders at our discretion.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">4. Pricing and Payment</h2>
                        <p>
                            All prices are listed in INR and are subject to change without notice. Payment must be made at the time of order unless Cash on Delivery is selected.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">5. Intellectual Property</h2>
                        <p>
                            All content on this website, including text, graphics, logos, and software, is the property of EasyBuy and protected by copyright laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">6. Limitation of Liability</h2>
                        <p>
                            EasyBuy shall not be liable for any indirect, incidental, or consequential damages arising arising from the use of our services.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms;
