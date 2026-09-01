'use client';

import { useContext } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faCode,
  faPhone,
  faTerminal,
} from '@fortawesome/free-solid-svg-icons';
import {
  faTwitter,
  faLinkedinIn,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';

import { ThemeContext } from '../contexts/ThemeContext';
import picB from '../assets/images/pic b.png';

const Hero = () => {
  const { lightMode } = useContext(ThemeContext);

  const scrollToContact = () => {
    document
      .getElementById('contact')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProjects = () => {
    document
      .getElementById('projects')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className={`relative flex min-h-[86vh] items-center overflow-hidden transition-colors duration-700 ${
        lightMode
          ? 'bg-[#EAEAEA] text-gray-950'
          : 'bg-[#0b0b0d] text-white'
      }`}
    >
      {/* =====================================================
          BACKGROUND GRID
      ====================================================== */}

      <div
        className={`pointer-events-none absolute inset-0 ${
          lightMode ? 'text-black/[0.035]' : 'text-white/[0.025]'
        }`}
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* =====================================================
          AMBIENT GLOW
      ====================================================== */}

      <div
        className={`pointer-events-none absolute left-[48%] top-[42%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-700 ${
          lightMode
            ? 'bg-yellow-400/[0.045]'
            : 'bg-yellow-400/[0.035]'
        }`}
      />

      {/* =====================================================
          DECORATIVE CODE MARK
      ====================================================== */}

      <div
        className={`pointer-events-none absolute bottom-20 right-10 hidden font-mono text-[10px] tracking-widest lg:block ${
          lightMode ? 'text-black/[0.08]' : 'text-white/[0.06]'
        }`}
      >
        &lt;/engineer&gt;
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:px-10 lg:pb-24 lg:pt-36">

        {/* ===================================================
            TOP META
        ==================================================== */}

        <div className="hero-fade-up mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="relative h-px w-8 overflow-hidden bg-yellow-400">
              <span className="absolute inset-y-0 left-0 w-3 animate-[slideLine_2s_ease-in-out_infinite] bg-gray-950/40" />
            </span>

            <span
              className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${
                lightMode ? 'text-gray-500' : 'text-gray-400'
              }`}
            >
              Software Engineer
            </span>
          </div>

          <span
            className={`hidden text-[10px] font-medium tracking-wide sm:block ${
              lightMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            Lagos · Nigeria
          </span>
        </div>

        {/* ===================================================
            MAIN GRID
        ==================================================== */}

        <div className="grid items-center gap-14 lg:grid-cols-[1.12fr_0.88fr] lg:gap-20">

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div className="max-w-2xl">

            {/* Developer eyebrow */}

            <div
              className={`hero-fade-up-delay-1 mb-6 flex items-center gap-2 font-mono text-[9px] font-medium uppercase tracking-[0.18em] ${
                lightMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <FontAwesomeIcon
                icon={faTerminal}
                className="text-[9px] text-yellow-400"
              />

              <span>product.engineering.design</span>

              <span className="ml-1 inline-block h-3 w-px animate-pulse bg-yellow-400" />
            </div>

            {/* =================================================
                HEADING
            ================================================= */}

            <h1
              id="hero-title"
              className={`hero-fade-up-delay-2 max-w-3xl text-[3.25rem] font-semibold leading-[0.94] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-[5.25rem] ${
                lightMode ? 'text-gray-950' : 'text-white'
              }`}
            >
              <span className="block overflow-hidden">
                <span className="hero-word-reveal inline-block">
                  Adeshina
                </span>
              </span>

              <span className="block overflow-hidden">
                <span className="hero-word-reveal hero-word-reveal-delay inline-block text-yellow-400">
                  Adedokun.
                </span>
              </span>
            </h1>

            {/* =================================================
                MAIN DESCRIPTION
            ================================================= */}

            <p
              className={`hero-fade-up-delay-3 mt-7 max-w-xl text-[15px] leading-7 sm:text-[17px] sm:leading-8 ${
                lightMode ? 'text-gray-700' : 'text-gray-300'
              }`}
            >
              I design and build digital products that connect
              thoughtful interfaces with reliable engineering.
            </p>

            <p
              className={`hero-fade-up-delay-3 mt-3 max-w-lg text-[13px] leading-6 ${
                lightMode ? 'text-gray-500' : 'text-gray-500'
              }`}
            >
              Full-stack development, product thinking and
              modern web experiences—from the first component
              to the production infrastructure.
            </p>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="hero-fade-up-delay-4 mt-8 flex flex-wrap items-center gap-6">

              {/* Primary */}

              <button
                onClick={scrollToProjects}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-yellow-400 px-6 py-3 text-[13px] font-semibold text-gray-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-[0_12px_30px_rgba(250,204,21,0.18)] focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
              >
                <span className="relative z-10">
                  View my work
                </span>

                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="relative z-10 text-[10px] transition-transform duration-300 group-hover:translate-x-1"
                />

                <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
              </button>

              {/* Secondary */}

              <button
                onClick={scrollToContact}
                className={`group inline-flex items-center gap-3 text-[13px] font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                  lightMode
                    ? 'text-gray-700 hover:text-yellow-500'
                    : 'text-gray-300 hover:text-yellow-400'
                }`}
              >
                Let's talk

                <span className="relative h-px w-5 overflow-hidden bg-current transition-all duration-300 group-hover:w-9">
                  <span className="absolute inset-y-0 left-0 w-full -translate-x-full bg-yellow-400 transition-transform duration-300 group-hover:translate-x-0" />
                </span>
              </button>
            </div>

            {/* =================================================
                TECH STACK
            ================================================= */}

            <div
              className={`hero-fade-up-delay-5 mt-11 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] ${
                lightMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              <FontAwesomeIcon
                icon={faCode}
                className="text-yellow-400"
              />

              <span className="transition-colors hover:text-yellow-400">
                React
              </span>

              <span>·</span>

              <span className="transition-colors hover:text-yellow-400">
                Next.js
              </span>

              <span>·</span>

              <span className="transition-colors hover:text-yellow-400">
                Node.js
              </span>

              <span>·</span>

              <span className="transition-colors hover:text-yellow-400">
                TypeScript
              </span>
            </div>
          </div>

          {/* =================================================
              RIGHT / IMAGE
          ================================================= */}

          <div className="hero-image-reveal relative mx-auto w-full max-w-[350px] lg:ml-auto">

            {/* Availability */}

            <div
              className={`absolute -top-7 right-0 z-20 flex items-center gap-2 font-mono text-[9px] font-medium uppercase tracking-[0.14em] ${
                lightMode ? 'text-gray-500' : 'text-gray-400'
              }`}
            >
              <span className="relative flex h-2 w-2 items-center justify-center">
                <span className="absolute h-full w-full animate-ping rounded-full bg-green-400 opacity-30" />

                <span className="relative h-1.5 w-1.5 rounded-full bg-green-400" />
              </span>

              Available for work
            </div>

            {/* Image wrapper */}

            <div className="relative">

              {/* Offset frame */}

              <div
                className={`absolute -bottom-3 -left-3 h-full w-full rounded-lg border ${
                  lightMode
                    ? 'border-black/[0.06]'
                    : 'border-white/[0.06]'
                }`}
              />

              {/* Yellow corner */}

              <div className="absolute -right-2 -top-2 z-10 h-8 w-8 border-r border-t border-yellow-400/70" />

              <div className="absolute -bottom-2 -left-2 z-10 h-8 w-8 border-b border-l border-yellow-400/70" />

              {/* Portrait */}

              <div
                className={`relative aspect-[4/5] overflow-hidden rounded-lg transition-all duration-500 hover:-translate-y-1 ${
                  lightMode
                    ? 'bg-[#dededc] ring-1 ring-black/10'
                    : 'bg-[#151517] ring-1 ring-white/10'
                }`}
              >
                <Image
                  src={picB}
                  alt="Adeshina Adedokun"
                  fill
                  priority
                  sizes="(max-width: 1024px) 80vw, 350px"
                  className="object-cover object-center transition-transform duration-1000 ease-out hover:scale-[1.025]"
                />

                {/* Image overlay */}

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-70" />

                {/* Subtle scan line */}

                <div className="pointer-events-none absolute inset-x-0 top-0 h-px animate-[scan_5s_linear_infinite] bg-yellow-400/30" />

                {/* Corner metadata */}

                <div className="absolute bottom-4 left-4 font-mono text-[8px] uppercase tracking-[0.15em] text-white/50">
                  SHINA / 001
                </div>

                <div className="absolute right-4 top-4 font-mono text-[8px] text-white/50">
                  DEV
                </div>

                {/* Edge */}

                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
              </div>
            </div>

            {/* =================================================
                IMAGE CAPTION
            ================================================= */}

            <div className="mt-4 flex items-center justify-between">

              <span
                className={`font-mono text-[9px] uppercase tracking-[0.16em] ${
                  lightMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                Product · Engineering
              </span>

              <span
                className={`font-mono text-[9px] ${
                  lightMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                01 / 04
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================
            BOTTOM BAR
        ==================================================== */}

        <div
          className={`hero-fade-up-delay-5 mt-14 flex items-center justify-between border-t pt-5 ${
            lightMode ? 'border-black/10' : 'border-white/10'
          }`}
        >

          {/* Social */}

          <div className="flex items-center gap-5">

            <a
              href="https://x.com/Aaytriple"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Adeshina Adedokun on X"
              className={`transition-all duration-300 hover:-translate-y-0.5 ${
                lightMode
                  ? 'text-gray-400 hover:text-yellow-500'
                  : 'text-gray-500 hover:text-yellow-400'
              }`}
            >
              <FontAwesomeIcon icon={faTwitter} />
            </a>

            <a
              href="https://www.linkedin.com/in/tripleaay"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Adeshina Adedokun on LinkedIn"
              className={`transition-all duration-300 hover:-translate-y-0.5 ${
                lightMode
                  ? 'text-gray-400 hover:text-yellow-500'
                  : 'text-gray-500 hover:text-yellow-400'
              }`}
            >
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>

            <a
              href="https://wa.me/2349167740076"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact Adeshina Adedokun on WhatsApp"
              className={`transition-all duration-300 hover:-translate-y-0.5 ${
                lightMode
                  ? 'text-gray-400 hover:text-yellow-500'
                  : 'text-gray-500 hover:text-yellow-400'
              }`}
            >
              <FontAwesomeIcon icon={faWhatsapp} />
            </a>

            <a
              href="tel:+2349167740076"
              aria-label="Call Adeshina Adedokun"
              className={`transition-all duration-300 hover:-translate-y-0.5 ${
                lightMode
                  ? 'text-gray-400 hover:text-yellow-500'
                  : 'text-gray-500 hover:text-yellow-400'
              }`}
            >
              <FontAwesomeIcon icon={faPhone} />
            </a>
          </div>

          {/* Scroll indicator */}

          <button
            onClick={scrollToProjects}
            className={`group hidden items-center gap-3 font-mono text-[9px] font-medium uppercase tracking-[0.16em] transition-colors duration-300 sm:flex ${
              lightMode
                ? 'text-gray-400 hover:text-yellow-500'
                : 'text-gray-500 hover:text-yellow-400'
            }`}
          >
            Explore

            <span className="relative flex h-5 w-px overflow-hidden bg-current">
              <span className="absolute left-0 top-0 h-2 w-full animate-[scrollLine_1.8s_ease-in-out_infinite] bg-yellow-400" />
            </span>
          </button>
        </div>
      </div>

      {/* =====================================================
          CUSTOM HERO ANIMATIONS
      ====================================================== */}

      <style jsx>{`
        @keyframes heroFadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes wordReveal {
          from {
            opacity: 0;
            transform: translateY(105%);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes imageReveal {
          from {
            opacity: 0;
            transform: translateX(30px) scale(0.97);
          }

          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes slideLine {
          0% {
            transform: translateX(-100%);
          }

          50% {
            transform: translateX(250%);
          }

          100% {
            transform: translateX(250%);
          }
        }

        @keyframes scan {
          0% {
            transform: translateY(0);
            opacity: 0;
          }

          20% {
            opacity: 1;
          }

          80% {
            opacity: 1;
          }

          100% {
            transform: translateY(400px);
            opacity: 0;
          }
        }

        @keyframes scrollLine {
          0% {
            transform: translateY(-100%);
          }

          50% {
            transform: translateY(180%);
          }

          100% {
            transform: translateY(180%);
          }
        }

        .hero-fade-up {
          animation: heroFadeUp 0.7s ease-out both;
        }

        .hero-fade-up-delay-1 {
          animation: heroFadeUp 0.7s 0.08s ease-out both;
        }

        .hero-fade-up-delay-2 {
          animation: heroFadeUp 0.7s 0.16s ease-out both;
        }

        .hero-fade-up-delay-3 {
          animation: heroFadeUp 0.7s 0.24s ease-out both;
        }

        .hero-fade-up-delay-4 {
          animation: heroFadeUp 0.7s 0.32s ease-out both;
        }

        .hero-fade-up-delay-5 {
          animation: heroFadeUp 0.7s 0.4s ease-out both;
        }

        .hero-word-reveal {
          animation: wordReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .hero-word-reveal-delay {
          animation-delay: 0.12s;
        }

        .hero-image-reveal {
          animation: imageReveal 1s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-fade-up,
          .hero-fade-up-delay-1,
          .hero-fade-up-delay-2,
          .hero-fade-up-delay-3,
          .hero-fade-up-delay-4,
          .hero-fade-up-delay-5,
          .hero-word-reveal,
          .hero-image-reveal {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;