'use client';

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from '../contexts/ThemeContext';

const About = () => {
  const { lightMode } = useContext(ThemeContext);

  const highlights = [
    {
      number: '01',
      title: 'Engineering',
      text: 'Modern web applications built for performance, scale, and real-world use.',
    },
    {
      number: '02',
      title: 'Product',
      text: 'Clear digital experiences that turn ideas into useful products.',
    },
    {
      number: '03',
      title: 'Design',
      text: 'A designer’s eye applied to interfaces, brands, and product details.',
    },
  ];

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className={`relative overflow-hidden transition-colors duration-500 ${
        lightMode
          ? 'bg-[#EAEAEA] text-gray-950'
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

      {/* =================================
          SUBTLE RADIAL GLOW
      ================================== */}
      <div
        className={`pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-500 ${
          lightMode
            ? 'bg-yellow-400/[0.035]'
            : 'bg-yellow-400/[0.025]'
        }`}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 sm:px-8 md:py-32 lg:px-10">

        {/* =====================================
            HEADER
        ====================================== */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="max-w-4xl"
        >
          {/* Label */}
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-yellow-400" />

            <span
              className={`text-[10px] font-semibold uppercase tracking-[0.25em] transition-colors duration-500 ${
                lightMode
                  ? 'text-gray-400'
                  : 'text-gray-500'
              }`}
            >
              About me
            </span>
          </div>

          {/* Main heading */}
          <h2
            id="about-title"
            className={`max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.045em] transition-colors duration-500 sm:text-5xl md:text-6xl lg:text-[4.2rem] ${
              lightMode
                ? 'text-gray-950'
                : 'text-white'
            }`}
          >
            Engineer by craft.
            <br />

            <span className="text-yellow-400">
              Designer by instinct.
            </span>
          </h2>

          {/* Short positioning statement */}
          <p
            className={`mt-7 max-w-2xl text-base leading-8 transition-colors duration-500 sm:text-lg ${
              lightMode
                ? 'text-gray-500'
                : 'text-gray-400'
            }`}
          >
            I build digital products where technology, design, and
            business thinking meet.
          </p>
        </motion.div>

        {/* =====================================
            STORY + POSITIONING
        ====================================== */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="mt-20 grid gap-14 lg:grid-cols-[1.15fr_0.65fr] lg:gap-20"
        >
          {/* Story */}
          <div
            className={`max-w-2xl text-[15px] leading-8 transition-colors duration-500 ${
              lightMode
                ? 'text-gray-600'
                : 'text-gray-400'
            }`}
          >
            <p>
              My journey started in{' '}
              <span
                className={`font-medium ${
                  lightMode
                    ? 'text-gray-950'
                    : 'text-white'
                }`}
              >
                2013
              </span>{' '}
              as a brand designer at Ginimax Technology. That experience
              shaped how I think about software today: great technology
              should not only work well — it should also feel clear,
              intentional, and human.
            </p>

            <p className="mt-7">
              With an{' '}
              <span
                className={`font-medium ${
                  lightMode
                    ? 'text-gray-950'
                    : 'text-white'
                }`}
              >
                HND in Computer Science
              </span>{' '}
              and continued studies in Computer Science, I moved deeper
              into software engineering and product development.
            </p>

            <p className="mt-7">
              Today, I work across{' '}
              <span className="font-medium text-yellow-400">
                engineering, design, and product
              </span>
              — building web applications, shaping digital experiences,
              and helping ideas become products people can actually use.
            </p>
          </div>

          {/* Positioning card */}
          <div>
            <div
              className={`border-l pl-6 transition-colors duration-500 ${
                lightMode
                  ? 'border-gray-200'
                  : 'border-white/[0.09]'
              }`}
            >
              <span
                className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${
                  lightMode
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`}
              >
                My approach
              </span>

              <p
                className={`mt-5 text-xl font-medium leading-8 tracking-tight ${
                  lightMode
                    ? 'text-gray-900'
                    : 'text-gray-200'
                }`}
              >
                Build with intention. Design with clarity. Ship what
                matters.
              </p>

              <div className="mt-7 space-y-3">
                {[
                  'Full-stack development',
                  'Product & interface design',
                  'Brand & visual systems',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-400" />

                    <span
                      className={`text-sm ${
                        lightMode
                          ? 'text-gray-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* =====================================
            CAPABILITIES
        ====================================== */}
        <div className="mt-24">
          <div
            className={`mb-8 h-px w-full transition-colors duration-500 ${
              lightMode
                ? 'bg-black/[0.06]'
                : 'bg-white/[0.07]'
            }`}
          />

          <div className="grid sm:grid-cols-3">
            {highlights.map((item, index) => (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                className={`py-6 sm:px-6 sm:py-7 ${
                  index !== 0
                    ? lightMode
                      ? 'border-t border-black/[0.06] sm:border-l sm:border-t-0'
                      : 'border-t border-white/[0.07] sm:border-l sm:border-t-0'
                    : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-medium tracking-[0.18em] ${
                      lightMode
                        ? 'text-gray-400'
                        : 'text-gray-600'
                    }`}
                  >
                    {item.number}
                  </span>

                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                </div>

                <h3
                  className={`mt-5 text-lg font-semibold ${
                    lightMode
                      ? 'text-gray-950'
                      : 'text-white'
                  }`}
                >
                  {item.title}
                </h3>

                <p
                  className={`mt-2 max-w-xs text-sm leading-6 ${
                    lightMode
                      ? 'text-gray-500'
                      : 'text-gray-500'
                  }`}
                >
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* =====================================
            SMALL FOOTNOTE
        ====================================== */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className={`mt-20 border-t pt-6 transition-colors duration-500 ${
            lightMode
              ? 'border-black/[0.06]'
              : 'border-white/[0.07]'
          }`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p
              className={`text-[10px] uppercase tracking-[0.18em] ${
                lightMode
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}
            >
              Engineering · Design · Product
            </p>

            <p
              className={`text-[10px] uppercase tracking-[0.18em] ${
                lightMode
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}
            >
              Lagos · Nigeria
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;