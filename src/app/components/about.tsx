'use client';

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCode,
  faBrain,
  faLayerGroup,
} from '@fortawesome/free-solid-svg-icons';

import { ThemeContext } from '../contexts/ThemeContext';

const AboutIntro = () => {
  const { lightMode } = useContext(ThemeContext);

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className={`relative overflow-hidden transition-colors duration-700 ${
        lightMode
          ? 'bg-[#F4DBD8] text-gray-950 sm:bg-[#D9CAB3]/40'
          : 'bg-[#0b0b0d] text-white'
      }`}
    >
      {/* =====================================================
          BACKGROUND GRID
      ====================================================== */}

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 1,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={`pointer-events-none absolute inset-0 ${
          lightMode
            ? 'text-black/[0.018] sm:text-black/[0.025]'
            : 'text-white/[0.02]'
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

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9,
        }}
        whileInView={{
          opacity: 1,
          scale: 1,
        }}
        viewport={{ once: true }}
        transition={{
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={`pointer-events-none absolute left-1/2 top-[25%] h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-3xl ${
          lightMode
            ? 'bg-yellow-400/[0.008] sm:bg-yellow-400/[0.025]'
            : 'bg-yellow-400/[0.018]'
        }`}
      />

      {/* =====================================================
          MOBILE LIGHT ATMOSPHERE
      ====================================================== */}

      {lightMode && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.22),transparent_68%)] sm:hidden" />
      )}

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div className="relative mx-auto max-w-6xl px-6 py-24 sm:px-8 md:py-32 lg:px-10 lg:py-36">

        {/* ===================================================
            INTRO
        ==================================================== */}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            margin: '-100px',
          }}
          className="mx-auto max-w-4xl"
        >
          {/* =================================================
              LABEL
          ================================================== */}

          <motion.div
            variants={{
              hidden: {
                opacity: 0,
                x: -14,
              },
              visible: {
                opacity: 1,
                x: 0,
                transition: {
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
            className="mb-7 flex items-center gap-3"
          >
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: 32 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="h-px bg-yellow-400"
            />

            <span
              className={`font-mono text-[9px] font-medium uppercase tracking-[0.22em] ${
                lightMode
                  ? 'text-gray-500 sm:text-gray-400'
                  : 'text-gray-500'
              }`}
            >
              About me
            </span>

            <span
              className={`font-mono text-[9px] ${
                lightMode
                  ? 'text-gray-400 sm:text-gray-300'
                  : 'text-gray-700'
              }`}
            >
              / 01
            </span>
          </motion.div>

          {/* =================================================
              HEADLINE
          ================================================== */}

          <motion.h2
            id="about-title"
            initial={{
              opacity: 0,
              y: 24,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              margin: '-100px',
            }}
            transition={{
              duration: 0.85,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`max-w-4xl text-[2.8rem] font-semibold leading-[0.98] tracking-[-0.055em] sm:text-5xl md:text-6xl lg:text-[4.5rem] ${
              lightMode ? 'text-gray-950' : 'text-white'
            }`}
          >
            I build{' '}

            <motion.span
              initial={{
                opacity: 0,
                filter: 'blur(8px)',
              }}
              whileInView={{
                opacity: 1,
                filter: 'blur(0px)',
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: 0.25,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block text-yellow-500 sm:text-yellow-400"
            >
              systems,
            </motion.span>

            <br />

            <span
              className={
                lightMode
                  ? 'text-gray-800'
                  : 'text-gray-200'
              }
            >
              not just software.
            </span>
          </motion.h2>

          {/* =================================================
              POSITIONING
          ================================================== */}

          <motion.p
            initial={{
              opacity: 0,
              y: 16,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              margin: '-100px',
            }}
            transition={{
              duration: 0.7,
              delay: 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`mt-8 max-w-2xl text-[15px] leading-7 sm:text-[17px] sm:leading-8 ${
              lightMode
                ? 'text-gray-600'
                : 'text-gray-400'
            }`}
          >
            I am a software engineer, product builder, and brand
            designer working at the intersection of{' '}
            <span
              className={`font-medium ${
                lightMode
                  ? 'text-gray-900'
                  : 'text-gray-200'
              }`}
            >
              technology, design, and intelligent systems.
            </span>
          </motion.p>
        </motion.div>

        {/* ===================================================
            IDENTITY STRIP
        ==================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: '-80px',
          }}
          transition={{
            duration: 0.75,
            delay: 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mx-auto mt-16 max-w-4xl"
        >
          <div
            className={`grid border-y ${
              lightMode
                ? 'divide-black/[0.07] border-black/[0.08]'
                : 'divide-white/[0.07] border-white/[0.07]'
            } sm:grid-cols-3 sm:divide-x`}
          >
            {/* =================================================
                DESIGN
            ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                x: -14,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.55,
                delay: 0.25,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group flex items-center gap-4 py-6 sm:px-6 sm:py-7"
            >
              <motion.div
                whileHover={{
                  scale: 1.06,
                  rotate: -3,
                }}
                transition={{
                  duration: 0.2,
                }}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  lightMode
                    ? 'bg-black/[0.035]'
                    : 'bg-white/[0.04]'
                }`}
              >
                <FontAwesomeIcon
                  icon={faLayerGroup}
                  className="text-[11px] text-yellow-500 sm:text-yellow-400"
                />
              </motion.div>

              <div>
                <p
                  className={`text-xs font-semibold ${
                    lightMode
                      ? 'text-gray-900'
                      : 'text-gray-200'
                  }`}
                >
                  Design
                </p>

                <p
                  className={`mt-1 font-mono text-[8px] uppercase tracking-[0.16em] ${
                    lightMode
                      ? 'text-gray-500'
                      : 'text-gray-600'
                  }`}
                >
                  Where it started
                </p>
              </div>
            </motion.div>

            {/* =================================================
                ENGINEERING
            ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                y: 14,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.55,
                delay: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group flex items-center gap-4 border-t py-6 sm:border-t-0 sm:px-6 sm:py-7"
            >
              <motion.div
                whileHover={{
                  scale: 1.06,
                  rotate: 3,
                }}
                transition={{
                  duration: 0.2,
                }}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  lightMode
                    ? 'bg-black/[0.035]'
                    : 'bg-white/[0.04]'
                }`}
              >
                <FontAwesomeIcon
                  icon={faCode}
                  className="text-[11px] text-yellow-500 sm:text-yellow-400"
                />
              </motion.div>

              <div>
                <p
                  className={`text-xs font-semibold ${
                    lightMode
                      ? 'text-gray-900'
                      : 'text-gray-200'
                  }`}
                >
                  Engineering
                </p>

                <p
                  className={`mt-1 font-mono text-[8px] uppercase tracking-[0.16em] ${
                    lightMode
                      ? 'text-gray-500'
                      : 'text-gray-600'
                  }`}
                >
                  What I build
                </p>
              </div>
            </motion.div>

            {/* =================================================
                AI & SYSTEMS
            ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                x: 14,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.55,
                delay: 0.45,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group flex items-center gap-4 border-t py-6 sm:border-t-0 sm:px-6 sm:py-7"
            >
              <motion.div
                whileHover={{
                  scale: 1.06,
                  rotate: -3,
                }}
                transition={{
                  duration: 0.2,
                }}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  lightMode
                    ? 'bg-black/[0.035]'
                    : 'bg-white/[0.04]'
                }`}
              >
                <FontAwesomeIcon
                  icon={faBrain}
                  className="text-[11px] text-yellow-500 sm:text-yellow-400"
                />
              </motion.div>

              <div>
                <p
                  className={`text-xs font-semibold ${
                    lightMode
                      ? 'text-gray-900'
                      : 'text-gray-200'
                  }`}
                >
                  AI & Systems
                </p>

                <p
                  className={`mt-1 font-mono text-[8px] uppercase tracking-[0.16em] ${
                    lightMode
                      ? 'text-gray-500'
                      : 'text-gray-600'
                  }`}
                >
                  Where I&apos;m going
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutIntro;