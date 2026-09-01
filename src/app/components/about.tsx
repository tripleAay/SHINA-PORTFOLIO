'use client';

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faCode,
  faGraduationCap,
  faWandSparkles,
} from '@fortawesome/free-solid-svg-icons';

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

  const scrollToProjects = () => {
    document
      .getElementById('projects')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className={`relative overflow-hidden transition-colors duration-700 ${lightMode
          ? 'bg-[#D9CAB3]/40 text-gray-950'
          : 'bg-[#0b0b0d] text-white'
        }`}
    >
      {/* =====================================================
          BACKGROUND GRID
      ====================================================== */}

      <div
        className={`pointer-events-none absolute inset-0 ${lightMode ? 'text-black/[0.025]' : 'text-white/[0.02]'
          }`}
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* =====================================================
          SOFT AMBIENT GLOW
      ====================================================== */}

      <div
        className={`pointer-events-none absolute left-1/2 top-[30%] h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-3xl ${lightMode
            ? 'bg-yellow-400/[0.025]'
            : 'bg-yellow-400/[0.018]'
          }`}
      />

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div className="relative mx-auto max-w-6xl px-6 py-24 sm:px-8 md:py-32 lg:px-10 lg:py-36">

        {/* ===================================================
            INTRO
        ==================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mx-auto max-w-4xl"
        >
          {/* Section label */}

          <div className="mb-7 flex items-center gap-3">
            <span className="h-px w-8 bg-yellow-400" />

            <span
              className={`font-mono text-[9px] font-medium uppercase tracking-[0.22em] ${lightMode ? 'text-gray-400' : 'text-gray-500'
                }`}
            >
              About me
            </span>

            <span
              className={`font-mono text-[9px] ${lightMode ? 'text-gray-300' : 'text-gray-700'
                }`}
            >
              / 01
            </span>
          </div>

          {/* Main heading */}

          <h2
            id="about-title"
            className={`max-w-4xl text-[2.8rem] font-semibold leading-[0.98] tracking-[-0.055em] sm:text-5xl md:text-6xl lg:text-[4.5rem] ${lightMode ? 'text-gray-950' : 'text-white'
              }`}
          >
            I build with{' '}
            <span className="text-yellow-400">
              engineering
            </span>
            <br />

            <span
              className={
                lightMode
                  ? 'text-gray-800'
                  : 'text-gray-200'
              }
            >
              and think with intention.
            </span>
          </h2>

          {/* Positioning */}

          <p
            className={`mt-8 max-w-2xl text-[15px] leading-7 sm:text-[17px] sm:leading-8 ${lightMode ? 'text-gray-500' : 'text-gray-400'
              }`}
          >
            I work at the intersection of{' '}
            <span
              className={`font-medium ${lightMode
                  ? 'text-gray-900'
                  : 'text-gray-200'
                }`}
            >
              software, product, and design
            </span>
            , building digital experiences that are useful,
            thoughtful, and built to last.
          </p>
        </motion.div>

        {/* ===================================================
            STORY — PAST → PRESENT → FUTURE
        ==================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{
            duration: 0.75,
            delay: 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mx-auto mt-20 max-w-4xl"
        >
          <div
            className={`border-t pt-10 ${lightMode
                ? 'border-black/[0.07]'
                : 'border-white/[0.07]'
              }`}
          >
            <div className="grid gap-10 lg:grid-cols-[0.62fr_1.38fr] lg:gap-20">

              {/* Story marker */}

              <div>
                <div
                  className={`flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] ${lightMode
                      ? 'text-gray-400'
                      : 'text-gray-600'
                    }`}
                >
                  <FontAwesomeIcon
                    icon={faCode}
                    className="text-yellow-400"
                  />

                  The journey
                </div>

                <p
                  className={`mt-5 max-w-[220px] text-xs leading-6 ${lightMode
                      ? 'text-gray-400'
                      : 'text-gray-600'
                    }`}
                >
                  From visual design to software engineering —
                  and now toward deeper technical work.
                </p>

                <div
                  className={`mt-7 hidden h-px w-10 lg:block ${lightMode
                      ? 'bg-black/10'
                      : 'bg-white/10'
                    }`}
                />
              </div>

              {/* Story */}

              <div
                className={`max-w-2xl text-[15px] leading-8 ${lightMode
                    ? 'text-gray-600'
                    : 'text-gray-400'
                  }`}
              >
                <p>
                  I started my journey in{' '}
                  <span
                    className={`font-medium ${lightMode
                        ? 'text-gray-950'
                        : 'text-white'
                      }`}
                  >
                    2013
                  </span>{' '}
                  as a brand designer at Ginimax Technology.
                  Design taught me to pay attention to how people
                  experience things — not simply how they look.
                  That perspective became one of the foundations
                  of how I approach software today.
                </p>

                <p className="mt-6">
                  Over time, I moved from designing digital
                  experiences to building them. With an{' '}
                  <span
                    className={`font-medium ${lightMode
                        ? 'text-gray-950'
                        : 'text-white'
                      }`}
                  >
                    HND in Computer Science
                  </span>
                  , I went deeper into software engineering,
                  web development, and product thinking.
                </p>

                {/* 2026 milestone */}

                <div
                  className={`my-9 border-y py-7 ${lightMode
                      ? 'border-black/[0.07]'
                      : 'border-white/[0.07]'
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${lightMode
                          ? 'bg-black/[0.04]'
                          : 'bg-white/[0.04]'
                        }`}
                    >
                      <FontAwesomeIcon
                        icon={faGraduationCap}
                        className="text-[11px] text-yellow-400"
                      />
                    </div>

                    <div>
                      <div
                        className={`font-mono text-[9px] uppercase tracking-[0.18em] ${lightMode
                            ? 'text-gray-400'
                            : 'text-gray-600'
                          }`}
                      >
                        2026 · A new chapter
                      </div>

                      <p
                        className={`mt-2 text-[15px] leading-7 ${lightMode
                            ? 'text-gray-700'
                            : 'text-gray-300'
                          }`}
                      >
                        I completed my{' '}
                        <span
                          className={`font-medium ${lightMode
                              ? 'text-gray-950'
                              : 'text-white'
                            }`}
                        >
                          BSc in Computer Science
                        </span>{' '}
                        from the{' '}
                        <span
                          className={`font-medium ${lightMode
                              ? 'text-gray-950'
                              : 'text-white'
                            }`}
                        >
                          National Open University of Nigeria
                        </span>
                        .
                      </p>
                    </div>
                  </div>
                </div>

                {/* Present */}

                <p>
                  Today, that journey continues. I am currently an{' '}
                  <span
                    className={`font-medium ${lightMode
                        ? 'text-gray-950'
                        : 'text-white'
                      }`}
                  >
                    MSc student at the University of Ibadan
                  </span>
                  , while continuing to build real products,
                  solve practical engineering problems, and
                  deepen my understanding of computer science.
                </p>

                {/* Future */}

                <p className="mt-6">
                  I see where I am now as a bridge between the
                  engineer I have become and the engineer I am
                  becoming. The goal is not simply to write more
                  code — it is to{' '}
                  <span className="font-medium text-yellow-400">
                    think more deeply, build better systems,
                    and create technology with real value.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===================================================
            FUTURE SELF STATEMENT
        ==================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-70px' }}
          transition={{
            duration: 0.7,
            delay: 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mx-auto mt-20 max-w-4xl"
        >
          <div
            className={`relative border-l-2 pl-6 sm:pl-8 ${lightMode
                ? 'border-yellow-400/80'
                : 'border-yellow-400/70'
              }`}
          >
            <div className="flex items-center gap-3">
              <FontAwesomeIcon
                icon={faWandSparkles}
                className="text-[10px] text-yellow-400"
              />

              <span
                className={`font-mono text-[9px] uppercase tracking-[0.2em] ${lightMode
                    ? 'text-gray-400'
                    : 'text-gray-600'
                  }`}
              >
                Looking ahead
              </span>
            </div>

            <p
              className={`mt-5 max-w-3xl text-2xl font-medium leading-[1.3] tracking-[-0.03em] sm:text-3xl ${lightMode
                  ? 'text-gray-900'
                  : 'text-gray-200'
                }`}
            >
              I&apos;m becoming the kind of engineer who can{' '}
              <span className="text-yellow-400">
                think deeply,
              </span>{' '}
              build boldly, and make complex technology feel
              simple.
            </p>

            <p
              className={`mt-5 max-w-xl text-sm leading-6 ${lightMode
                  ? 'text-gray-500'
                  : 'text-gray-500'
                }`}
            >
              Curiosity keeps me learning. Engineering gives me
              the tools to build. Design keeps me focused on the
              people using what I create.
            </p>
          </div>
        </motion.div>

        {/* ===================================================
            CAPABILITIES
        ==================================================== */}

        <div className="mx-auto mt-24 max-w-4xl">

          {/* Header */}

          <div
            className={`mb-8 flex items-center justify-between border-t pt-6 ${lightMode
                ? 'border-black/[0.07]'
                : 'border-white/[0.07]'
              }`}
          >
            <span
              className={`font-mono text-[9px] uppercase tracking-[0.2em] ${lightMode
                  ? 'text-gray-400'
                  : 'text-gray-600'
                }`}
            >
              What I bring
            </span>

            <span
              className={`font-mono text-[9px] ${lightMode
                  ? 'text-gray-300'
                  : 'text-gray-700'
                }`}
            >
              01 — 03
            </span>
          </div>

          {/* Capability cards */}

          <div className="grid sm:grid-cols-3">
            {highlights.map((item, index) => (
              <motion.div
                key={item.number}
                initial={{
                  opacity: 0,
                  y: 14,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  margin: '-50px',
                }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`group relative py-6 sm:px-6 sm:py-7 ${index !== 0
                    ? lightMode
                      ? 'border-t border-black/[0.06] sm:border-l sm:border-t-0'
                      : 'border-t border-white/[0.07] sm:border-l sm:border-t-0'
                    : ''
                  }`}
              >
                {/* Number */}

                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-[9px] tracking-[0.18em] ${lightMode
                        ? 'text-gray-400'
                        : 'text-gray-600'
                      }`}
                  >
                    {item.number}
                  </span>

                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 transition-transform duration-300 group-hover:scale-[1.7]" />
                </div>

                {/* Title */}

                <h3
                  className={`mt-5 text-lg font-semibold tracking-tight transition-all duration-300 group-hover:translate-x-1 ${lightMode
                      ? 'text-gray-950'
                      : 'text-white'
                    }`}
                >
                  {item.title}
                </h3>

                {/* Description */}

                <p
                  className={`mt-2 max-w-xs text-sm leading-6 ${lightMode
                      ? 'text-gray-500'
                      : 'text-gray-500'
                    }`}
                >
                  {item.text}
                </p>

                {/* Hover line */}

                <span
                  className={`absolute bottom-0 left-6 h-px w-0 bg-yellow-400 transition-all duration-300 group-hover:w-10 ${index === 0 ? 'sm:left-0' : ''
                    }`}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ===================================================
            FINAL ACTION
        ==================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.65,
            delay: 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mx-auto mt-20 max-w-4xl"
        >
          <div
            className={`flex flex-col gap-6 border-t pt-7 sm:flex-row sm:items-center sm:justify-between ${lightMode
                ? 'border-black/[0.07]'
                : 'border-white/[0.07]'
              }`}
          >
            <div>
              <p
                className={`text-sm ${lightMode
                    ? 'text-gray-500'
                    : 'text-gray-500'
                  }`}
              >
                The journey is still being built.
              </p>

              <p
                className={`mt-1 text-xs ${lightMode
                    ? 'text-gray-400'
                    : 'text-gray-600'
                  }`}
              >
                Take a look at what I&apos;ve been building.
              </p>
            </div>

            <button
              onClick={scrollToProjects}
              className="group inline-flex w-fit items-center gap-3"
            >
              <span
                className={`text-[12px] font-semibold transition-colors duration-300 ${lightMode
                    ? 'text-gray-900 group-hover:text-yellow-500'
                    : 'text-gray-200 group-hover:text-yellow-400'
                  }`}
              >
                Explore my work
              </span>

              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 group-hover:translate-x-1 group-hover:bg-yellow-400 group-hover:text-gray-950 ${lightMode
                    ? 'border border-black/10'
                    : 'border border-white/10'
                  }`}
              >
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-[9px] transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;