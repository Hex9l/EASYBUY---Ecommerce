import React from 'react';

const About = () => {
    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
            <div className="container mx-auto px-4 py-8 lg:py-12 max-w-4xl">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">About Us</h1>

                <section className="mb-8">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                        Welcome to <span className="font-bold text-black dark:text-white">EasyBuy</span>, your number one source for all things groceries and daily essentials. We're dedicated to allowing you to focus on the things that matter by taking care of your shopping needs with a focus on dependability, customer service, and uniqueness.
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                        Founded in 2024, EasyBuy has come a long way from its beginnings. When we first started out, our passion for "Fast and Fresh delivery" drove us to do tons of research so that EasyBuy can offer you the world's most advanced quick-commerce experience. We now serve customers all over the city and are thrilled that we're able to turn our passion into our own website.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Our Mission</h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        To simplify your daily life by delivering fresh, high-quality products to your doorstep in minutes. We believe that time is your most valuable asset, and we are here to help you save it.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Why Choose Us?</h2>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                        <li><strong>Superfast Delivery:</strong> Get your order delivered in minutes.</li>
                        <li><strong>Best Quality:</strong> We source directly from farmers and trusted partners.</li>
                        <li><strong>Wide Range:</strong> From fresh veggies to daily household items, we have it all.</li>
                        <li><strong>Customer First:</strong> Your satisfaction is our top priority.</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default About;
