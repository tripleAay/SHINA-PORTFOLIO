'use client'; // ✅ Required for Next.js client-side component

import React, { useState, useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

// ✅ Define type for form fields
interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const { lightMode } = useContext(ThemeContext);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 🔹 Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 🔹 Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);

    setIsSubmitted(true);
    setFormData({ name: '', email: '', message: '' });

    // Auto-hide success message
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  // ✅ Animation Variants
  const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      ease: "easeOut" as const  // ✅ fix
    } 
  },
};


  const focusVariants = {
    focus: {
      scale: 1.02,
      boxShadow: '0 0 0 3px rgba(234,179,8,0.35)',
      transition: { duration: 0.25 },
    },
  };

  return (
    <section
      id="contact"
      className={`min-h-screen flex items-center justify-center px-6 py-12 transition-colors duration-500 ${
        lightMode ? 'bg-gray-50' : 'bg-gray-900'
      }`}
    >
      <motion.div
        className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 🔹 Header */}
        <header className="text-center mb-10">
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Get in Touch
          </motion.h2>
          <motion.p
            className="mt-3 text-lg text-gray-600 dark:text-gray-300 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Let’s collaborate to bring your ideas to life. Drop me a message below!
          </motion.p>
        </header>

        {/* 🔹 Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
              >
                Your Name
              </label>
              <motion.input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
                whileFocus="focus"
                variants={focusVariants}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
              >
                Email Address
              </label>
              <motion.input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
                whileFocus="focus"
                variants={focusVariants}
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
            >
              Your Message
            </label>
            <motion.textarea
              name="message"
              id="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message..."
              rows={5}
              required
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300 resize-none"
              whileFocus="focus"
              variants={focusVariants}
            />
          </div>

          {/* Submit */}
          <div className="text-center">
            <motion.button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-semibold rounded-lg shadow-md hover:from-yellow-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Send Message
            </motion.button>
          </div>
        </form>

        {/* 🔹 Confirmation Message */}
        <AnimatePresence>
          {isSubmitted && (
            <motion.p
              className="mt-6 text-center text-green-600 dark:text-green-400 font-semibold"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              ✅ Your message has been sent successfully!
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default ContactForm;
