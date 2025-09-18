'use client'; // Mark as Client Component for interactivity

import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import Link from 'next/link';
import Head from 'next/head';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lightMode, toggleTheme } = useContext(ThemeContext);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
    }
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>Shina Adedokun | Web Developer Portfolio</title>
        <meta
          name="description"
          content="Portfolio of Shina Adedokun, a skilled web developer showcasing projects, skills, and contact information."
        />
        <meta name="keywords" content="web developer, portfolio, Shina Adedokun, front-end, full-stack, React, Next.js" />
        <meta name="author" content="Shina Adedokun" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://yourwebsite.com" /> {/* Replace with your website URL */}
      </Head>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ease-in-out ${lightMode
          ? 'bg-gray-900 text-white shadow-lg'
          : 'bg-white text-gray-900 shadow-md'
          }`}
        role="banner"
      >
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          {/* Logo */}
          <button
            onClick={scrollToTop}
            className="text-2xl font-bold tracking-tight hover:text-yellow-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            aria-label="Go to homepage"
          >
            Shina Adedokun
          </button>

          {/* Navigation Links (Desktop) */}
          <nav
            className="hidden md:flex space-x-8"
            role="navigation"
            aria-label="Main navigation"
          >
            {['about', 'portfolio', 'contact'].map((section) => (
              <Link
                key={section}
                href={`/#${section}`}
                scroll={false} // prevents Next.js from auto-jumping
              >
                <span
                  onClick={() => scrollToSection(section)} // keeps smooth scroll
                  className={`text-lg font-medium transition-colors duration-200 cursor-pointer ${lightMode
                    ? 'text-gray-300 hover:text-yellow-400 focus:text-yellow-400'
                    : 'text-gray-700 hover:text-yellow-600 focus:text-yellow-600'
                    }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </span>
              </Link>
            ))}
          </nav>

          {/* Search and Theme Toggle */}
          <div className="flex items-center space-x-4">
            {/* Search Box */}
            <div className="relative hidden md:block">
              <input
                type="search"
                placeholder="Search portfolio..."
                className={`rounded-full px-4 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${lightMode
                  ? 'bg-gray-800 text-gray-200 placeholder-gray-400'
                  : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                  }`}
                aria-label="Search portfolio"
              />
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                aria-label="Submit search"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${lightMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-200 text-gray-900'
                }`}
              aria-label={`Switch to ${lightMode ? 'dark' : 'light'} mode`}
            >
              {lightMode ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-md p-2"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <nav
          className={`md:hidden bg-gray-800 text-white transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}
          role="navigation"
          aria-label="Mobile navigation"
        >
          {['about', 'portfolio', 'contact'].map((section) => (
            <Link
              key={section}
              href={`/#${section}`}
              scroll={false}
            >
              <span
                onClick={() => scrollToSection(section)}
                className="block w-full text-left py-3 px-6 text-lg font-medium hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </span>
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
};

export default Header;