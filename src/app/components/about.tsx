
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
      text: 'Scalable web products, thoughtful architecture, and interfaces that feel effortless to use.',
    },
    {
      number: '02',
      title: 'Product',
      text: 'Turning ideas into practical digital experiences with clarity, speed, and purpose.',
    },
    {
      number: '03',
      title: 'Design',
      text: 'Brand systems and interfaces shaped by years of visual design experience.',
    },
  ];

  return (
    <section
      id="about"
      className={`relative overflow-hidden transition-colors duration-500 ${
        lightMode
          ? 'bg-white text-gray-900'
          : 'bg-[#0b0b0d] text-white'
      }`}
    >
      {/* Very subtle atmosphere */}
      <div
        className={`pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full blur-3xl ${
          lightMode
            ? 'bg-yellow-400/[0.035]'
            : 'bg-yellow-400/[0.025]'
        }`}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-28 sm:px-8 md:py-36 lg:px-10">
        
        {/* =========================
            SECTION INTRO
        ========================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-yellow-400" />

            <span
              className={`text-[10px] font-semibold uppercase tracking-[0.25em] ${
                lightMode
                  ? 'text-gray-500'
                  : 'text-gray-500'
              }`}
            >
              About
            </span>
          </div>

          <h2
            className={`max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl md:text-6xl ${
              lightMode ? 'text-gray-950' : 'text-white'
            }`}
          >
            I build digital products
            <span className="text-yellow-400"> with purpose.</span>
          </h2>

          <p
            className={`mt-7 max-w-2xl text-base leading-8 sm:text-lg ${
              lightMode
                ? 'text-gray-500'
                : 'text-gray-400'
            }`}
          >
            I&apos;m Adedokun Adeshina — a software engineer and brand
            designer with a journey that started in visual design and
            evolved into building digital products.
          </p>
        </motion.div>

        {/* =========================
            MAIN STORY
        ========================== */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-20 grid gap-12 lg:grid-cols-[1fr_0.7fr]"
        >
          {/* Story */}
          <div
            className={`max-w-2xl space-y-7 text-[15px] leading-8 ${
              lightMode
                ? 'text-gray-600'
                : 'text-gray-400'
            }`}
          >
            <p>
              My journey began in{' '}
              <span
                className={`font-medium ${
                  lightMode ? 'text-gray-950' : 'text-white'
                }`}
              >
                2013
              </span>{' '}
              as a brand designer at Ginimax Technology. That foundation
              taught me something I still carry into engineering today:
              technology is more powerful when people can understand,
              trust, and enjoy the experience around it.
            </p>

            <p>
              I went on to earn an{' '}
              <span
                className={`font-medium ${
                  lightMode ? 'text-gray-950' : 'text-white'
                }`}
              >
                HND in Computer Science
              </span>{' '}
              from The Polytechnic, Ibadan, and continued my studies in
              Computer Science at the National Open University.
            </p>

            <p>
              Today, I work across the space between{' '}
              <span className="font-medium text-yellow-400">
                engineering, design, and product thinking
              </span>
              . I build with modern web technologies, shape visual
              identities, and think deeply about how products should work
              for the people using them.
            </p>

            <p>
              Beyond client and product work, I lead{' '}
              <span
                className={`font-medium ${
                  lightMode ? 'text-gray-950' : 'text-white'
                }`}
              >
                Fynaro Tech
              </span>{' '}
              and{' '}
              <span
                className={`font-medium ${
                  lightMode ? 'text-gray-950' : 'text-white'
                }`}
              >
                dev2done
              </span>
              , while sharing ideas around technology, entrepreneurship,
              branding, and life through writing.
            </p>
          </div>

          {/* Positioning */}
          <div className="lg:pt-2">
            <div
              className={`border-l pl-6 ${
                lightMode
                  ? 'border-gray-200'
                  : 'border-white/[0.09]'
              }`}
            >
              <p
                className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${
                  lightMode
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`}
              >
                What I bring
              </p>

              <p
                className={`mt-5 text-xl font-medium leading-8 tracking-tight ${
                  lightMode
                    ? 'text-gray-900'
                    : 'text-gray-200'
                }`}
              >
                Technical depth with a designer&apos;s eye and a
                product-minded approach.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  'Web application development',
                  'Product & interface thinking',
                  'Brand systems & visual design',
                  'Technical leadership & collaboration',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />

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

        {/* =========================
            CAPABILITIES
        ========================== */}
        <div className="mt-28">
          <div
            className={`mb-8 h-px w-full ${
              lightMode
                ? 'bg-black/[0.06]'
                : 'bg-white/[0.07]'
            }`}
          />

          <div className="grid gap-px sm:grid-cols-3">
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
                className={`py-7 sm:px-6 ${
                  index !== 0
                    ? lightMode
                      ? 'border-t border-black/[0.06] sm:border-l sm:border-t-0'
                      : 'border-t border-white/[0.07] sm:border-l sm:border-t-0'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between">
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
                  className={`mt-6 text-lg font-semibold ${
                    lightMode
                      ? 'text-gray-950'
                      : 'text-white'
                  }`}
                >
                  {item.title}
                </h3>

                <p
                  className={`mt-3 max-w-xs text-sm leading-6 ${
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

        {/* =========================
            CLOSING STATEMENT
        ========================== */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-28 max-w-3xl"
        >
          <p
            className={`text-2xl font-medium leading-9 tracking-tight sm:text-3xl sm:leading-10 ${
              lightMode
                ? 'text-gray-900'
                : 'text-gray-200'
            }`}
          >
            I believe the best work happens when{' '}
            <span className="text-yellow-400">
              creativity, technology, and strategy
            </span>{' '}
            move in the same direction.
          </p>

          <p
            className={`mt-6 text-sm leading-7 ${
              lightMode
                ? 'text-gray-400'
                : 'text-gray-600'
            }`}
          >
            Build something useful. Make it beautiful. Give it a reason
            to exist.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

