'use client'; // ✅ Required for Next.js client-side component

import React, { useState, useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiUser, FiMessageCircle } from 'react-icons/fi';

// ✅ Type for form data
interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const { lightMode } = useContext(ThemeContext);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);

    setIsSubmitted(true);
    setFormData({ name: '', email: '', message: '' });

    setTimeout(() => setIsSubmitted(false), 4000);
  };

  return (
    <section
      id="contact"
      className={`min-h-screen flex items-center justify-center px-6 py-16 transition-colors duration-500 ${
        lightMode ? 'bg-gray-100' : 'bg-gray-100'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-3xl w-full bg-white/80 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl shadow-2xl p-10 md:p-14 border border-white/20"
      >
        {/* Header */}
        <header className="text-center mb-12">
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600 drop-shadow-sm">
            Let’s Talk
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Have an idea or project? I’d love to hear from you. Fill out the form and let’s connect.
          </p>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Name */}
            <div className="relative">
              <FiUser className="absolute top-3.5 left-3 text-gray-400 dark:text-gray-500" size={20} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/60 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-500 outline-none transition"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <FiMail className="absolute top-3.5 left-3 text-gray-400 dark:text-gray-500" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/60 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-500 outline-none transition"
              />
            </div>
          </div>

          {/* Message */}
          <div className="relative">
            <FiMessageCircle className="absolute top-3.5 left-3 text-gray-400 dark:text-gray-500" size={20} />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message..."
              rows={6}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/60 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-500 outline-none transition resize-none"
            />
          </div>

          {/* Submit */}
          <div className="text-center">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
            >
              Send Message
            </motion.button>
          </div>
        </form>

        {/* Confirmation */}
        <AnimatePresence>
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="mt-8 text-center"
            >
              <p className="text-green-600 dark:text-green-400 font-semibold text-lg">
                ✅ Thanks! Your message was sent successfully.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default ContactForm;
