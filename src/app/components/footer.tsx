
'use client';

import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import {
  FiArrowUpRight,
  FiArrowUp,
  FiGithub,
  FiLinkedin,
} from 'react-icons/fi';

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
      className={`relative overflow-hidden border-t transition-colors duration-500 ${
        lightMode
          ? 'border-black/[0.08] bg-[#E8DAB2] text-gray-950'
          : 'border-white/[0.07] bg-[#0b0b0d] text-white'
      }`}
    >
      {/* =================================
          SUBTLE BACKGROUND GRID
      ================================== */}
      <div
        className={`pointer-events-none absolute inset-0 opacity-[0.025] ${
          lightMode ? 'text-black' : 'text-white'
        }`}
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* =================================
          AMBIENT GLOW
      ================================== */}
      <div
        className={`pointer-events-none absolute bottom-[-180px] left-1/2 h-[420px] w-[620px] -translate-x-1/2 rounded-full blur-3xl ${
          lightMode
            ? 'bg-yellow-400/[0.035]'
            : 'bg-yellow-400/[0.025]'
        }`}
      />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">

        {/* =================================
            CLOSING STATEMENT
        ================================== */}
        <div className="relative py-20 sm:py-24 md:py-28">

          {/* Top meta */}
          <div className="mb-12 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-yellow-400" />

              <span
                className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${
                  lightMode
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`}
              >
                Let&apos;s build
              </span>
            </div>

            <span
              className={`hidden text-[10px] uppercase tracking-[0.18em] sm:block ${
                lightMode
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}
            >
              2026
            </span>
          </div>

          {/* Main closing message */}
          <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">

            <div className="max-w-3xl">
              <h2
                className={`text-4xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-5xl md:text-6xl lg:text-[4.5rem] ${
                  lightMode
                    ? 'text-gray-950'
                    : 'text-white'
                }`}
              >
                Good products
                <br />

                <span className="text-yellow-400">
                  start with good ideas.
                </span>
              </h2>

              <p
                className={`mt-7 max-w-lg text-sm leading-7 sm:text-base ${
                  lightMode
                    ? 'text-gray-500'
                    : 'text-gray-500'
                }`}
              >
                Engineering, design, and product thinking —
                brought together to build things that matter.
              </p>
            </div>

            {/* Back to top */}
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className={`group flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full border transition-all duration-300 hover:-translate-y-1 ${
                lightMode
                  ? 'border-black/10 text-gray-500 hover:border-yellow-400 hover:bg-yellow-400 hover:text-gray-950'
                  : 'border-white/10 text-gray-500 hover:border-yellow-400 hover:bg-yellow-400 hover:text-gray-950'
              }`}
            >
              <FiArrowUp
                size={17}
                className="mb-1 transition-transform duration-300 group-hover:-translate-y-1"
              />

              <span className="text-[8px] font-semibold uppercase tracking-[0.16em]">
                Back top
              </span>
            </button>
          </div>
        </div>

        {/* =================================
            FOOTER NAV
        ================================== */}
        <div
          className={`border-t py-7 ${
            lightMode
              ? 'border-black/[0.08]'
              : 'border-white/[0.07]'
          }`}
        >
          <div className="grid gap-8 sm:grid-cols-[1fr_auto_auto] sm:items-center">

            {/* Identity */}
            <div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                    lightMode
                      ? 'text-gray-950'
                      : 'text-white'
                  }`}
                >
                  Adeshina Adedokun
                </span>

                <span className="h-1 w-1 rounded-full bg-yellow-400" />
              </div>

              <p
                className={`mt-2 text-[10px] ${
                  lightMode
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`}
              >
                Software Engineer · Product · Design
              </p>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-5">

              <a
                href="https://www.linkedin.com/in/tripleaay"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className={`group flex items-center gap-1.5 text-[10px] transition-colors duration-200 ${
                  lightMode
                    ? 'text-gray-400 hover:text-yellow-500'
                    : 'text-gray-600 hover:text-yellow-400'
                }`}
              >
                LinkedIn

                <FiArrowUpRight
                  size={10}
                  className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>

              <a
                href="https://github.com/tripleAay"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className={`group flex items-center gap-1.5 text-[10px] transition-colors duration-200 ${
                  lightMode
                    ? 'text-gray-400 hover:text-yellow-500'
                    : 'text-gray-600 hover:text-yellow-400'
                }`}
              >
                GitHub

                <FiArrowUpRight
                  size={10}
                  className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>

            {/* Location / copyright */}
            <div className="sm:text-right">
              <p
                className={`text-[10px] uppercase tracking-[0.16em] ${
                  lightMode
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`}
              >
                Lagos · Nigeria
              </p>

              <p
                className={`mt-1 text-[9px] ${
                  lightMode
                    ? 'text-gray-300'
                    : 'text-gray-700'
                }`}
              >
                © {new Date().getFullYear()} All rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* =================================
            FINAL MICRO BAR
        ================================== */}
        <div className="flex items-center justify-between py-4">

          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-40" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-green-400" />
            </span>

            <span
              className={`text-[8px] uppercase tracking-[0.18em] ${
                lightMode
                  ? 'text-gray-400'
                  : 'text-gray-700'
              }`}
            >
              Available for selected projects
            </span>
          </div>

          <span
            className={`text-[8px] uppercase tracking-[0.18em] ${
              lightMode
                ? 'text-gray-300'
                : 'text-gray-700'
            }`}
          >
            Built with intention.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

