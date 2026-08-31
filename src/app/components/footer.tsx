
'use client';

import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { FiArrowUpRight } from 'react-icons/fi';

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
      className={`transition-colors duration-500 ${
        lightMode
          ? 'border-gray-900/10 bg-white text-gray-950'
          : 'border-white/[0.07] bg-[#0b0b0d] text-white'
      } border-t`}
    >
      <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10">
        <div className="flex min-h-[64px] items-center justify-between gap-6">
          {/* Identity */}
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${
                lightMode ? 'text-gray-900' : 'text-white'
              }`}
            >
              Adeshina Adedokun
            </span>

            <span
              className={`hidden h-3 w-px sm:block ${
                lightMode ? 'bg-gray-900/10' : 'bg-white/10'
              }`}
            />

            <span
              className={`hidden text-[10px] sm:block ${
                lightMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Software Engineer
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-5">
            <a
              href="https://www.linkedin.com/in/tripleaay"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className={`text-[10px] transition-colors duration-200 ${
                lightMode
                  ? 'text-gray-400 hover:text-yellow-500'
                  : 'text-gray-600 hover:text-yellow-400'
              }`}
            >
              LinkedIn
            </a>

            <a
              href="https://github.com/tripleAay"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className={`text-[10px] transition-colors duration-200 ${
                lightMode
                  ? 'text-gray-400 hover:text-yellow-500'
                  : 'text-gray-600 hover:text-yellow-400'
              }`}
            >
              GitHub
            </a>

            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className={`group flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.15em] transition-colors duration-200 ${
                lightMode
                  ? 'text-gray-500 hover:text-yellow-500'
                  : 'text-gray-500 hover:text-yellow-400'
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

