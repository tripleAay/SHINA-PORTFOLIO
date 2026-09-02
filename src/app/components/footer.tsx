
'use client';

import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import {
  FiArrowUpRight,
  FiArrowUp,
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
          ? 'border-black/[0.10] bg-[#E7DED0] text-[#171512]'
          : 'border-white/[0.08] bg-[#09090B] text-white'
      }`}
    >
      {/* =================================
          BACKGROUND GRID
      ================================== */}
      <div
        className={`pointer-events-none absolute inset-0 ${
          lightMode ? 'opacity-[0.035]' : 'opacity-[0.025]'
        }`}
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      {/* =================================
          AMBIENT LIGHT
      ================================== */}
      <div
        className={`pointer-events-none absolute left-1/2 top-[45%] h-[520px] w-[760px] -translate-x-1/2 rounded-full blur-3xl ${
          lightMode
            ? 'bg-yellow-400/[0.07]'
            : 'bg-yellow-400/[0.025]'
        }`}
      />

      {/* =================================
          TOP ACCENT
      ================================== */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-32 -translate-x-1/2 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-80" />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">

        {/* =================================
            CLOSING STATEMENT
        ================================== */}
        <div className="relative py-16 sm:py-20 md:py-24">

          {/* Top meta */}
          <div className="mb-10 flex items-center justify-between sm:mb-12">

            <div className="flex items-center gap-3">
              <span className="relative h-px w-8 overflow-hidden bg-yellow-400">
                <span className="absolute inset-y-0 left-0 w-1/2 bg-white/70 transition-transform duration-500 group-hover:translate-x-full" />
              </span>

              <span
                className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${
                  lightMode
                    ? 'text-[#655C50]'
                    : 'text-zinc-400'
                }`}
              >
                Let&apos;s build
              </span>
            </div>

            <span
              className={`hidden text-[10px] font-medium uppercase tracking-[0.18em] sm:block ${
                lightMode
                  ? 'text-[#766D61]'
                  : 'text-zinc-500'
              }`}
            >
              2026
            </span>
          </div>

          {/* Main content */}
          <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">

            <div className="max-w-3xl">

              {/* Eyebrow */}
              <div
                className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] ${
                  lightMode
                    ? 'border-black/[0.10] bg-white/30 text-[#554D42]'
                    : 'border-white/[0.10] bg-white/[0.03] text-zinc-400'
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                Software · Product · Design
              </div>

              {/* Main headline */}
              <h2
                className={`text-4xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-5xl md:text-6xl lg:text-[4.5rem] ${
                  lightMode
                    ? 'text-[#171512]'
                    : 'text-white'
                }`}
              >
                Good products
                <br />
                <span className="relative inline-block text-yellow-500">
                  start with good ideas.
                </span>
              </h2>

              {/* Description */}
              <p
                className={`mt-7 max-w-xl text-sm leading-7 sm:text-base ${
                  lightMode
                    ? 'text-[#5C554B]'
                    : 'text-zinc-400'
                }`}
              >
                Engineering, design, and product thinking;
                brought together to build things that matter.
              </p>
            </div>

            {/* =================================
                BACK TO TOP
            ================================== */}
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className={`group relative flex h-[84px] w-[84px] shrink-0 flex-col items-center justify-center overflow-hidden rounded-full border transition-all duration-500 hover:-translate-y-1.5 ${
                lightMode
                  ? 'border-black/[0.13] bg-white/35 text-[#514A40] hover:border-yellow-400 hover:bg-yellow-400 hover:text-[#171512] hover:shadow-[0_12px_35px_rgba(0,0,0,0.10)]'
                  : 'border-white/[0.12] bg-white/[0.03] text-zinc-400 hover:border-yellow-400 hover:bg-yellow-400 hover:text-zinc-950 hover:shadow-[0_12px_35px_rgba(250,204,21,0.10)]'
              }`}
            >
              {/* Hover fill */}
              <span className="absolute inset-0 -translate-y-full bg-yellow-400 transition-transform duration-500 ease-out group-hover:translate-y-0" />

              <span className="relative z-10 flex flex-col items-center">
                <FiArrowUp
                  size={17}
                  className="mb-1.5 transition-transform duration-500 group-hover:-translate-y-1"
                />

                <span className="text-[8px] font-bold uppercase tracking-[0.16em]">
                  Back top
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* =================================
            FOOTER NAVIGATION
        ================================== */}
        <div
          className={`border-t py-7 ${
            lightMode
              ? 'border-black/[0.10]'
              : 'border-white/[0.08]'
          }`}
        >
          <div className="grid gap-8 sm:grid-cols-[1fr_auto_auto] sm:items-center">

            {/* =================================
                IDENTITY
            ================================== */}
            <div className="group">
              <div className="flex items-center gap-3">

                <span
                  className={`text-[10px] font-bold uppercase tracking-[0.18em] transition-colors duration-300 ${
                    lightMode
                      ? 'text-[#24211D] group-hover:text-yellow-600'
                      : 'text-zinc-100 group-hover:text-yellow-400'
                  }`}
                >
                  Adeshina Adedokun
                </span>

                <span className="h-1 w-1 rounded-full bg-yellow-400 transition-transform duration-300 group-hover:scale-150" />
              </div>

              <p
                className={`mt-2 text-[10px] ${
                  lightMode
                    ? 'text-[#70675B]'
                    : 'text-zinc-500'
                }`}
              >
                Software Engineer · Product · Design
              </p>
            </div>

            {/* =================================
                SOCIAL LINKS
            ================================== */}
            <div className="flex items-center gap-2">

              <a
                href="https://www.linkedin.com/in/tripleaay03"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className={`group/link flex items-center gap-1.5 rounded-full border px-3 py-2 text-[10px] font-medium transition-all duration-300 ${
                  lightMode
                    ? 'border-black/[0.09] bg-white/20 text-[#514A40] hover:-translate-y-0.5 hover:border-black/[0.16] hover:bg-white/50 hover:text-[#171512]'
                    : 'border-white/[0.09] bg-white/[0.02] text-zinc-400 hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                LinkedIn

                <FiArrowUpRight
                  size={10}
                  className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                />
              </a>

              <a
                href="https://github.com/tripleAay"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className={`group/link flex items-center gap-1.5 rounded-full border px-3 py-2 text-[10px] font-medium transition-all duration-300 ${
                  lightMode
                    ? 'border-black/[0.09] bg-white/20 text-[#514A40] hover:-translate-y-0.5 hover:border-black/[0.16] hover:bg-white/50 hover:text-[#171512]'
                    : 'border-white/[0.09] bg-white/[0.02] text-zinc-400 hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                GitHub

                <FiArrowUpRight
                  size={10}
                  className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                />
              </a>
            </div>

            {/* =================================
                LOCATION
            ================================== */}
            <div className="sm:text-right">

              <p
                className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${
                  lightMode
                    ? 'text-[#5C554B]'
                    : 'text-zinc-400'
                }`}
              >
                Lagos · Nigeria
              </p>

              <p
                className={`mt-1 text-[9px] ${
                  lightMode
                    ? 'text-[#81786B]'
                    : 'text-zinc-600'
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
        <div
          className={`flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between ${
            lightMode
              ? 'text-[#6C6459]'
              : 'text-zinc-500'
          }`}
        >

          {/* Availability */}
          <div className="flex items-center gap-2.5">

            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-50" />
              <span className="relative h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.45)]" />
            </span>

            <span className="text-[8px] font-semibold uppercase tracking-[0.18em]">
              Available for selected projects
            </span>
          </div>

          {/* Closing detail */}
          <span
            className={`text-[8px] font-medium uppercase tracking-[0.18em] ${
              lightMode
                ? 'text-[#81786B]'
                : 'text-zinc-600'
            }`}
          >
            Built with intention.
          </span>
        </div>

        {/* =================================
            BOTTOM ACCENT
        ================================== */}
        <div
          className={`h-px w-full ${
            lightMode
              ? 'bg-black/[0.07]'
              : 'bg-white/[0.06]'
          }`}
        />
      </div>
    </footer>
  );
};

export default Footer;
