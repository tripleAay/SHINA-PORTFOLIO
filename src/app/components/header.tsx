
'use client';

import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'Portfolio', label: 'Portfolio' },
  { id: 'contact', label: 'Contact' },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const { lightMode, toggleTheme } = useContext(ThemeContext);

  /* =========================
     SCROLL STATE
  ========================== */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const scrollPosition = window.scrollY + 140;

      for (const section of sections) {
        const element = document.getElementById(section.id);

        if (!element) continue;

        const top = element.offsetTop;
        const bottom = top + element.offsetHeight;

        if (scrollPosition >= top && scrollPosition < bottom) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /* =========================
     CLOSE MOBILE MENU
  ========================== */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /* =========================
     SCROLL TO SECTION
  ========================== */
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);

    if (!element) return;

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    setMobileMenuOpen(false);
  };

  /* =========================
     HOME
  ========================== */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div
        className={`mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full border px-3 transition-all duration-300 sm:px-4 ${
          scrolled
            ? lightMode
              ? 'border-gray-900/10 bg-yellow-400 shadow-sm backdrop-blur-xl'
              : 'border-white/10 bg-gray-950/85 shadow-black/10 backdrop-blur-xl'
            : lightMode
              ? 'border-gray-900/5 bg-yellow-400 backdrop-blur-md'
              : 'border-white/5 bg-gray-950/65 backdrop-blur-md'
        }`}
      >
        {/* Logo */}
        <button
          onClick={scrollToTop}
          aria-label="Go to homepage"
          className="group flex items-center gap-2.5 rounded-full px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold tracking-tight transition-colors ${
              lightMode
                ? 'bg-gray-950 text-white group-hover:bg-yellow-400 group-hover:text-gray-950'
                : 'bg-white text-gray-950 group-hover:bg-yellow-400'
            }`}
          >
            AA
          </span>

          <span
            className={`hidden text-xs font-semibold tracking-[-0.01em] sm:block ${
              lightMode ? 'text-gray-900' : 'text-white'
            }`}
          >
            Adeshina Adedokun
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 md:block"
          aria-label="Main navigation"
        >
          <div
            className={`flex items-center gap-1 rounded-full p-1 ${
              lightMode ? 'bg-gray-100/80' : 'bg-white/[0.04]'
            }`}
          >
            {sections.slice(1).map((section) => {
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`relative rounded-full px-4 py-2 text-[11px] font-medium transition-all duration-200 ${
                    isActive
                      ? lightMode
                        ? 'bg-white text-gray-950 shadow-sm'
                        : 'bg-white/10 text-white'
                      : lightMode
                        ? 'text-gray-500 hover:text-gray-950'
                        : 'text-gray-500 hover:text-gray-200'
                  }`}
                >
                  {section.label}

                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 h-0.5 w-1 -translate-x-1/2 rounded-full bg-yellow-400" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5">
          {/* Availability */}
          <button
            onClick={() => scrollToSection('contact')}
            className={`hidden items-center gap-2 rounded-full px-3 py-2 text-[10px] font-medium sm:flex ${
              lightMode
                ? 'text-gray-500 hover:text-gray-950'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="absolute h-full w-full animate-ping rounded-full bg-green-400/40" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-green-400" />
            </span>

            Available
          </button>

          {/* Theme */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${lightMode ? 'dark' : 'light'} mode`}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              lightMode
                ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'
                : 'text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {lightMode ? (
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          {/* Mobile Menu */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className={`flex h-9 w-9 items-center justify-center rounded-full md:hidden ${
              lightMode
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            {mobileMenuOpen ? (
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M6 6l12 12M18 6L6 18"
                />
              </svg>
            ) : (
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M5 8h14M5 16h14"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl border transition-all duration-300 md:hidden ${
          mobileMenuOpen
            ? 'max-h-80 opacity-100'
            : 'pointer-events-none max-h-0 opacity-0'
        } ${
          lightMode
            ? 'border-gray-900/10 bg-white/95 shadow-lg backdrop-blur-xl'
            : 'border-white/10 bg-gray-950/95 shadow-xl shadow-black/20 backdrop-blur-xl'
        }`}
      >
        <nav className="p-2" aria-label="Mobile navigation">
          {sections.map((section) => {
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                  isActive
                    ? lightMode
                      ? 'bg-gray-100 text-gray-950'
                      : 'bg-white/5 text-white'
                    : lightMode
                      ? 'text-gray-600 hover:bg-gray-50 hover:text-gray-950'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{section.label}</span>

                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                )}
              </button>
            );
          })}

          {/* Mobile Availability */}
          <div
            className={`mt-1 flex items-center gap-2 border-t px-4 py-3 text-[10px] ${
              lightMode
                ? 'border-gray-900/5 text-gray-500'
                : 'border-white/5 text-gray-500'
            }`}
          >
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="absolute h-full w-full animate-ping rounded-full bg-green-400/40" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-green-400" />
            </span>

            Available for selected opportunities
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
