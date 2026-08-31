
'use client';

import { useContext } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faCode,
  faPhone,
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
      className={`relative flex min-h-[86vh] items-center overflow-hidden transition-colors duration-500 ${
        lightMode
          ? 'bg-gray-50 text-gray-950'
          : 'bg-gray-950 text-white'
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

      {/* Subtle radial glow */}
      <div
        className={`pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-500 ${
          lightMode
            ? 'bg-yellow-400/[0.035]'
            : 'bg-yellow-400/[0.025]'
        }`}
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 lg:px-10 lg:py-20">

        {/* =================================
            TOP META LINE
        ================================== */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-yellow-400" />

            <span
              className={`text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors duration-500 ${
                lightMode
                  ? 'text-gray-500'
                  : 'text-gray-400'
              }`}
            >
              Software Engineer
            </span>
          </div>

          <span
            className={`hidden text-[10px] font-medium tracking-wide transition-colors duration-500 sm:block ${
              lightMode
                ? 'text-gray-400'
                : 'text-gray-500'
            }`}
          >
            Lagos · Nigeria
          </span>
        </div>

        {/* =================================
            MAIN HERO GRID
        ================================== */}
        <div className="grid items-center gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16">

          {/* =================================
              CONTENT
          ================================== */}
          <div className="max-w-xl">

            {/* Eyebrow */}
            <div
              className={`mb-5 flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.18em] transition-colors duration-500 ${
                lightMode
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}
            >
              <span className="h-1 w-1 rounded-full bg-yellow-400" />
              Product · Engineering · Design
            </div>

            {/* Heading */}
            <h1
              id="hero-title"
              className={`text-[2.7rem] font-semibold leading-[1.02] tracking-[-0.045em] transition-colors duration-500 sm:text-5xl lg:text-[4.15rem] ${
                lightMode
                  ? 'text-gray-950'
                  : 'text-white'
              }`}
            >
              Adeshina
              <br />

              <span className="text-yellow-400">
                Adedokun.
              </span>
            </h1>

            {/* Main statement */}
            <p
              className={`mt-6 max-w-lg text-[15px] leading-7 transition-colors duration-500 sm:text-base ${
                lightMode
                  ? 'text-gray-700'
                  : 'text-gray-300'
              }`}
            >
              I design and build digital products, from the
              interface to the infrastructure.
            </p>

            {/* Supporting statement */}
            <p
              className={`mt-2 max-w-md text-[13px] leading-6 transition-colors duration-500 ${
                lightMode
                  ? 'text-gray-500'
                  : 'text-gray-500'
              }`}
            >
              Full-stack engineering, product development and
              thoughtful digital experiences.
            </p>

            {/* =================================
                ACTIONS
            ================================== */}
            <div className="mt-7 flex items-center gap-5">

              <button
                onClick={scrollToProjects}
                className="group inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-2.5 text-[13px] font-semibold text-gray-950 transition-all duration-200 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
              >
                View my work

                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-[10px] transition-transform duration-200 group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={scrollToContact}
                className={`group inline-flex items-center gap-2 text-[13px] font-semibold transition-colors duration-300 ${
                  lightMode
                    ? 'text-gray-700 hover:text-yellow-500'
                    : 'text-gray-300 hover:text-yellow-400'
                }`}
              >
                Let&apos;s talk

                <span className="h-px w-4 bg-current transition-all duration-200 group-hover:w-7" />
              </button>

            </div>

            {/* =================================
                TECHNOLOGIES
            ================================== */}
            <div
              className={`mt-10 flex flex-wrap items-center gap-3 text-[10px] transition-colors duration-500 ${
                lightMode
                  ? 'text-gray-400'
                  : 'text-gray-500'
              }`}
            >
              <FontAwesomeIcon
                icon={faCode}
                className="text-yellow-400"
              />

              <span>React</span>
              <span>·</span>
              <span>Next.js</span>
              <span>·</span>
              <span>Node.js</span>
              <span>·</span>
              <span>TypeScript</span>
            </div>
          </div>

          {/* =================================
              IMAGE
          ================================== */}
          <div className="relative mx-auto w-full max-w-[320px] lg:ml-auto">

            {/* Availability */}
            <div
              className={`absolute -top-5 right-0 z-20 flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.12em] transition-colors duration-500 ${
                lightMode
                  ? 'text-gray-500'
                  : 'text-gray-400'
              }`}
            >
              <span className="relative flex h-2 w-2 items-center justify-center">
                <span className="absolute h-full w-full animate-ping rounded-full bg-green-400 opacity-30" />

                <span className="availability-blink relative h-1.5 w-1.5 rounded-full bg-green-400" />
              </span>

              Available for work
            </div>

            {/* Portrait */}
            <div
              className={`relative aspect-[4/5] overflow-hidden rounded-lg transition-all duration-500 ${
                lightMode
                  ? 'ring-1 ring-black/10'
                  : 'ring-1 ring-white/10'
              }`}
            >
              <Image
                src={picB}
                alt="Adeshina Adedokun"
                fill
                priority
                sizes="(max-width: 1024px) 75vw, 320px"
                className="object-cover object-center transition-transform duration-700 hover:scale-[1.01]"
              />

              {/* Image gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              {/* Image edge detail */}
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
            </div>

            {/* Image caption */}
            <div className="mt-3 flex items-center justify-between">
              <span
                className={`text-[9px] uppercase tracking-[0.16em] transition-colors duration-500 ${
                  lightMode
                    ? 'text-gray-400'
                    : 'text-gray-500'
                }`}
              >
                Product · Engineering
              </span>

              <span
                className={`text-[9px] transition-colors duration-500 ${
                  lightMode
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`}
              >
                01
              </span>
            </div>
          </div>
        </div>

        {/* =================================
            BOTTOM BAR
        ================================== */}
        <div
          className={`mt-12 flex items-center justify-between border-t pt-4 transition-colors duration-500 ${
            lightMode
              ? 'border-black/10'
              : 'border-white/10'
          }`}
        >

          {/* Social links */}
          <div className="flex items-center gap-5">

            {/* X */}
            <a
              href="https://x.com/Aaytriple"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Adeshina Adedokun on X"
              className={`text-xs transition-colors duration-300 ${
                lightMode
                  ? 'text-gray-400 hover:text-yellow-500'
                  : 'text-gray-500 hover:text-yellow-400'
              }`}
            >
              <FontAwesomeIcon icon={faTwitter} />
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/tripleaay"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Adeshina Adedokun on LinkedIn"
              className={`text-xs transition-colors duration-300 ${
                lightMode
                  ? 'text-gray-400 hover:text-yellow-500'
                  : 'text-gray-500 hover:text-yellow-400'
              }`}
            >
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/2349167740076"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact Adeshina Adedokun on WhatsApp"
              className={`text-xs transition-colors duration-300 ${
                lightMode
                  ? 'text-gray-400 hover:text-yellow-500'
                  : 'text-gray-500 hover:text-yellow-400'
              }`}
            >
              <FontAwesomeIcon icon={faWhatsapp} />
            </a>

            {/* Phone */}
            <a
              href="tel:+2349167740076"
              aria-label="Call Adeshina Adedokun"
              className={`text-xs transition-colors duration-300 ${
                lightMode
                  ? 'text-gray-400 hover:text-yellow-500'
                  : 'text-gray-500 hover:text-yellow-400'
              }`}
            >
              <FontAwesomeIcon icon={faPhone} />
            </a>

          </div>

          {/* Explore */}
          <button
            onClick={scrollToProjects}
            className={`hidden items-center gap-2 text-[9px] font-medium uppercase tracking-[0.16em] transition-colors duration-300 sm:flex ${
              lightMode
                ? 'text-gray-400 hover:text-yellow-500'
                : 'text-gray-500 hover:text-yellow-400'
            }`}
          >
            Explore

            <FontAwesomeIcon
              icon={faArrowRight}
              className="text-[8px] transition-transform duration-200 group-hover:translate-x-1"
            />
          </button>

        </div>
      </div>
    </section>
  );
};

export default Hero;

