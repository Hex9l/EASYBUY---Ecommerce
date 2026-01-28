import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-100 last:border-none">
            <button
                className="w-full flex items-center justify-between py-4 text-left focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={`font-semibold text-lg ${isOpen ? 'text-[#0c831f]' : 'text-gray-800'}`}>
                    {question}
                </span>
                <span className="text-gray-400">
                    {isOpen ? <FaMinus size={14} /> : <FaPlus size={14} />}
                </span>
            </button>
            {isOpen && (
                <div className="pb-4 text-gray-600 leading-relaxed">
                    {answer}
                </div>
            )}
        </div>
    );
};

const Faq = () => {
    const faqs = [
        {
            question: "How long does delivery take?",
            answer: "We aim to deliver all orders within 8 to 15 minutes of placing the order, depending on your location and store traffic."
        },
        {
            question: "Is there a minimum order value?",
            answer: "No, there is no minimum order value! However, a small delivery fee may apply for orders below a certain amount."
        },
        {
            question: "How can I pay for my order?",
            answer: "We accept all major credit/debit cards, UPI, Net Banking, and Wallets. Cash on Delivery is also available in select locations."
        },
        {
            question: "Can I track my order?",
            answer: "Yes, you can track your order in real-time from the 'My Orders' section in the app or website."
        },
        {
            question: "What if I receive a damaged item?",
            answer: "We have a no-questions-asked return policy for damaged or incorrect items. Please contact support immediately through the app for a quick resolution."
        }
    ];

    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto px-4 py-8 lg:py-12 max-w-3xl">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h1>

                <div className="bg-white border boundary-gray-200 rounded-xl p-6 shadow-sm">
                    {faqs.map((faq, index) => (
                        <FaqItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Faq;
