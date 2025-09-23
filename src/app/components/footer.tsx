'use client'; // Required for Next.js client-side component
import React, { useContext } from 'react';
import { motion, Variants } from 'framer-motion';
import { ThemeContext } from '../contexts/ThemeContext';

const Footer = () => {
  const { lightMode } = useContext(ThemeContext);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0, 0, 0.58, 1] },
    },
  };

  const iconVariants = {
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.footer
      className={`w-full py-8 border-t transition-colors duration-500
        ${lightMode ? 'bg-black border-gray-800' : 'bg-black border-gray-800'}
      `}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
        {/* Personal Branding */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p className="text-sm md:text-base font-medium text-white">
            Designed & Built by{' '}
            <motion.span
              className="text-yellow-400 font-semibold"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Shina Adedokun
            </motion.span>{' '}
            © {new Date().getFullYear()}
          </p>
        </div>

        {/* Social Links */}
        <div className="flex space-x-6">
          <motion.a
            href="https://www.linkedin.com/in/tripleaay"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-yellow-400 transition-all duration-300"
            variants={iconVariants}
            whileHover={{
              scale: 1.2,
              rotate: 5,
              textShadow: '0px 0px 6px rgba(250, 204, 21, 0.8)',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4.98 3.5C4.98 4.33 4.3 5 3.5 5S2 4.33 2 3.5 2.67 2 3.5 2 4.98 2.67 4.98 3.5zM2 8h3v12H2V8zm6.5 0h2.8v1.6h.04c.4-.7 1.3-1.6 2.7-1.6 2.9 0 3.4 1.9 3.4 4.4V20h-3v-6c0-1.4 0-3.2-2-3.2-2.1 0-2.4 1.5-2.4 3V20h-3V8z" />
            </svg>
            <span className="sr-only">LinkedIn</span>
          </motion.a>

          <motion.a
            href="https://github.com/tripleAay"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-yellow-400 transition-all duration-300"
            variants={iconVariants}
            whileHover={{
              scale: 1.2,
              rotate: 5,
              textShadow: '0px 0px 6px rgba(250, 204, 21, 0.8)',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 .5C5.6.5.5 5.6.5 12a11.5 11.5 0 008 11c.6.1.8-.3.8-.6v-2.3c-3.3.7-4-1.5-4-1.5-.6-1.6-1.4-2-1.4-2-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1 .1 2.6.1 3.2-.1v-2.2c-2.5-.3-5-1.2-5-5.5a4.2 4.2 0 011.1-3 3.8 3.8 0 01.1-3s1-.2 3.3 1.2a11.1 11.1 0 016 0C16.8 4.5 18 4.7 18 4.7a3.7 3.7 0 01.1 3 4.2 4.2 0 011.1 3c0 4.3-2.5 5.2-5 5.5v2.2c.6.2 2.2.2 3.2.1 0 0 .6 0 1.8-1.2 0 0 1.2-.1.1.8 0 0-.8.4-1.4 2 0 0-.6 2.2-4 1.5v2.3c0 .4.2.8.8.6a11.5 11.5 0 008-11C23.5 5.6 18.4.5 12 .5z" />
            </svg>
            <span className="sr-only">GitHub</span>
          </motion.a>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
