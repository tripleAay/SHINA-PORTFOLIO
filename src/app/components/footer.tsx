'use client';

import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { FiArrowUpRight, FiGlobe } from 'react-icons/fi';

const Footer = () => {
  const { lightMode } = useContext(ThemeContext);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer
      className={`border-t transition-colors duration-300 ${
        lightMode
          ? 'border-gray-800/70 bg-black text-white'
          : 'border-gray-200 bg-white text-gray-900'
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex h-[42px] items-center justify-between gap-4">

          {/* Brand */}
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              className={`truncate text-[9px] font-semibold uppercase tracking-[0.16em] ${
                lightMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              Shina Adedokun
            </span>

            <span
              className={`hidden h-2.5 w-px sm:block ${
                lightMode ? 'bg-gray-700' : 'bg-gray-300'
              }`}
            />

            <span
              className={`hidden text-[9px] sm:block ${
                lightMode ? 'text-gray-600' : 'text-gray-400'
              }`}
            >
              Software Engineer
            </span>
          </div>

          {/* Global signal */}
          <div
            className={`hidden items-center gap-1.5 md:flex text-[8px] uppercase tracking-[0.18em] ${
              lightMode ? 'text-gray-600' : 'text-gray-400'
            }`}
          >
            <FiGlobe
              size={10}
              className="text-yellow-400"
            />

            <span>Building for the world</span>
          </div>

          {/* Right */}
          <div className="flex shrink-0 items-center gap-4">

            <span
              className={`hidden text-[9px] sm:block ${
                lightMode ? 'text-gray-600' : 'text-gray-400'
              }`}
            >
              © {new Date().getFullYear()}
            </span>

            <a
              href="https://www.linkedin.com/in/tripleaay"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className={`text-[9px] transition-colors duration-200 ${
                lightMode
                  ? 'text-gray-600 hover:text-yellow-400'
                  : 'text-gray-400 hover:text-yellow-500'
              }`}
            >
              LinkedIn
            </a>

            <a
              href="https://github.com/tripleAay"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className={`text-[9px] transition-colors duration-200 ${
                lightMode
                  ? 'text-gray-600 hover:text-yellow-400'
                  : 'text-gray-400 hover:text-yellow-500'
              }`}
            >
              GitHub
            </a>

            {/* Back to top */}
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className={`group flex items-center gap-1 text-[8px] font-medium uppercase tracking-[0.15em] transition-colors duration-200 ${
                lightMode
                  ? 'text-gray-600 hover:text-yellow-400'
                  : 'text-gray-400 hover:text-yellow-500'
              }`}
            >
              Top

              <FiArrowUpRight
                size={10}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;