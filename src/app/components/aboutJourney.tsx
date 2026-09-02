
'use client';

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faCode,
  faGraduationCap,
  faBrain,
} from '@fortawesome/free-solid-svg-icons';

import { ThemeContext } from '../contexts/ThemeContext';

const ease = [0.16, 1, 0.3, 1] as const;

const reveal = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease,
    },
  },
};

const AboutJourney = () => {
  const { lightMode } = useContext(ThemeContext);

  const scrollToProjects = () => {
    document
      .getElementById('projects')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="journey"
      aria-label="My journey"
      className={`relative overflow-hidden transition-colors duration-700 ${
        lightMode
          ? 'bg-[#D9CAB3] text-[#171512]'
          : 'bg-[#0b0b0d] text-white'
      }`}
    >
      {/* =====================================================
          BACKGROUND GRID
          Extremely subtle so it never competes with content.
      ====================================================== */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1 }}
        className={`pointer-events-none absolute inset-0 ${
          lightMode
            ? 'text-black/[0.012]'
            : 'text-white/[0.012]'
        }`}
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* =====================================================
          VERY SUBTLE ATMOSPHERE
      ====================================================== */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.92,
        }}
        whileInView={{
          opacity: 1,
          scale: 1,
        }}
        viewport={{ once: true }}
        transition={{
          duration: 1.2,
          ease,
        }}
        className={`pointer-events-none absolute left-1/2 top-[30%] h-[380px] w-[380px] -translate-x-1/2 rounded-full blur-3xl ${
          lightMode
            ? 'bg-yellow-500/[0.012]'
            : 'bg-yellow-400/[0.008]'
        }`}
      />

      {/* =====================================================
          MAIN
      ====================================================== */}
      <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-24">

        {/* ===================================================
            HERO / JOURNEY INTRO
        ==================================================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            margin: '-80px',
          }}
          className="mx-auto max-w-4xl"
        >
          {/* Label */}
          <motion.div
            variants={{
              hidden: {
                opacity: 0,
                x: -12,
              },
              visible: {
                opacity: 1,
                x: 0,
                transition: {
                  duration: 0.45,
                  ease,
                },
              },
            }}
            className="mb-5 flex items-center gap-3"
          >
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: 30 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.55,
                ease,
              }}
              className="h-px bg-yellow-500"
            />

            <span
              className={`font-mono text-[9px] font-semibold uppercase tracking-[0.22em] ${
                lightMode
                  ? 'text-[#5E554A]'
                  : 'text-zinc-400'
              }`}
            >
              The journey
            </span>

            <span
              className={`font-mono text-[9px] ${
                lightMode
                  ? 'text-[#82776A]'
                  : 'text-zinc-600'
              }`}
            >
              / 01
            </span>
          </motion.div>

          {/* =================================================
              HEADLINE
          ================================================== */}
          <h2
            className={`max-w-4xl text-[2.65rem] font-semibold leading-[0.98] tracking-[-0.055em] sm:text-5xl md:text-6xl lg:text-[4.15rem] ${
              lightMode
                ? 'text-[#171512]'
                : 'text-white'
            }`}
          >
            <span className="block overflow-hidden">
              <motion.span
                initial={{
                  opacity: 0,
                  width: 0,
                }}
                whileInView={{
                  opacity: 1,
                  width: 'auto',
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: 0.1,
                  ease,
                }}
                className="inline-block"
              >
                From{' '}
                <span
                  className={
                    lightMode
                      ? 'text-[#B48600]'
                      : 'text-yellow-400'
                  }
                >
                  design
                </span>{' '}
                to engineering,
              </motion.span>
            </span>

            <motion.span
              initial={{
                opacity: 0,
                y: 12,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.65,
                delay: 0.7,
                ease,
              }}
              className={`mt-1 block ${
                lightMode
                  ? 'text-[#302C27]'
                  : 'text-zinc-200'
              }`}
            >
              with deeper questions ahead.
            </motion.span>
          </h2>

          {/* =================================================
              INTRO COPY
          ================================================== */}
          <motion.p
            initial={{
              opacity: 0,
              y: 12,
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
              duration: 0.55,
              delay: 0.9,
              ease,
            }}
            className={`mt-6 max-w-2xl text-justify text-[14px] leading-7 sm:text-left sm:text-[16px] sm:leading-8 ${
              lightMode
                ? 'text-[#4B443B]'
                : 'text-zinc-400'
            }`}
          >
            I started by shaping how things look and evolved into
            building how they work. Today, I work across software
            engineering, product development, and deeper computer
            science.
          </motion.p>
        </motion.div>

        {/* ===================================================
            JOURNEY CONTENT
        ==================================================== */}
        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: '-70px',
          }}
          transition={{
            duration: 0.6,
            delay: 0.1,
            ease,
          }}
          className="mx-auto mt-12 max-w-4xl"
        >
          <div
            className={`border-t ${
              lightMode
                ? 'border-black/[0.12]'
                : 'border-white/[0.07]'
            }`}
          >
            <div className="grid lg:grid-cols-[0.48fr_1.52fr] lg:gap-16">

              {/* =================================================
                  LEFT SIGNAL
              ================================================== */}
              <div className="py-6 lg:py-8">
                <motion.div
                  initial={{
                    opacity: 0,
                    x: -10,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    ease,
                  }}
                  className={`flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] ${
                    lightMode
                      ? 'text-[#5E554A]'
                      : 'text-zinc-500'
                  }`}
                >
                  <FontAwesomeIcon
                    icon={faCode}
                    className={
                      lightMode
                        ? 'text-[#B48600]'
                        : 'text-yellow-400'
                    }
                  />

                  Background
                </motion.div>

                <motion.p
                  initial={{
                    opacity: 0,
                  }}
                  whileInView={{
                    opacity: 1,
                  }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: 0.15,
                  }}
                  className={`mt-3 max-w-[220px] text-justify text-xs leading-6 sm:text-left ${
                    lightMode
                      ? 'text-[#554D43]'
                      : 'text-zinc-500'
                  }`}
                >
                  From visual communication to software systems,
                  with curiosity driving the transition.
                </motion.p>
              </div>

              {/* =================================================
                  RIGHT STORY
              ================================================== */}
              <div
                className={`py-6 text-justify text-[14px] leading-7 sm:py-8 sm:text-left sm:text-[15px] sm:leading-7 ${
                  lightMode
                    ? 'text-[#49423A]'
                    : 'text-zinc-400'
                }`}
              >
                {/* Story paragraph */}
                <motion.p
                  variants={reveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  In{' '}
                  <span
                    className={`font-semibold ${
                      lightMode
                        ? 'text-[#171512]'
                        : 'text-white'
                    }`}
                  >
                    2013
                  </span>
                  , I began as a brand designer at Ginimax
                  Technology. Design taught me to think about
                  clarity, perception, and how people experience
                  what they interact with.
                </motion.p>

                {/* Story paragraph */}
                <motion.p
                  variants={reveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.08,
                  }}
                  className="mt-4"
                >
                  That perspective eventually led me from
                  designing interfaces to building the systems
                  behind them. With an{' '}
                  <span
                    className={`font-medium ${
                      lightMode
                        ? 'text-[#171512]'
                        : 'text-white'
                    }`}
                  >
                    HND in Computer Science
                  </span>
                  , I moved deeper into software engineering,
                  web development, and product thinking.
                </motion.p>

                {/* =================================================
                    EDUCATION SIGNAL
                ================================================== */}
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.12,
                    ease,
                  }}
                  className={`my-6 border-y py-5 ${
                    lightMode
                      ? 'border-black/[0.11]'
                      : 'border-white/[0.07]'
                  }`}
                >
                  <div className="group flex items-start gap-4">

                    {/* Icon */}
                    <motion.div
                      whileHover={{
                        scale: 1.08,
                        y: -2,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                        lightMode
                          ? 'bg-black/[0.055] group-hover:bg-yellow-400/20'
                          : 'bg-white/[0.04] group-hover:bg-yellow-400/10'
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={faGraduationCap}
                        className={
                          lightMode
                            ? 'text-[10px] text-[#B48600]'
                            : 'text-[10px] text-yellow-400'
                        }
                      />
                    </motion.div>

                    <div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-mono text-[9px] uppercase tracking-[0.18em] ${
                            lightMode
                              ? 'text-[#665D51]'
                              : 'text-zinc-500'
                          }`}
                        >
                          2026
                        </span>

                        <span
                          className={`h-px w-5 ${
                            lightMode
                              ? 'bg-black/15'
                              : 'bg-white/10'
                          }`}
                        />

                        <span
                          className={`font-mono text-[9px] uppercase tracking-[0.18em] ${
                            lightMode
                              ? 'text-[#665D51]'
                              : 'text-zinc-500'
                          }`}
                        >
                          Education
                        </span>
                      </div>

                      <p
                        className={`mt-2 text-justify text-[13px] leading-6 sm:text-left ${
                          lightMode
                            ? 'text-[#413B34]'
                            : 'text-zinc-300'
                        }`}
                      >
                        Completed my{' '}
                        <strong
                          className={
                            lightMode
                              ? 'font-semibold text-[#171512]'
                              : 'font-semibold text-white'
                          }
                        >
                          BSc in Computer Science
                        </strong>{' '}
                        from the National Open University of
                        Nigeria and began postgraduate study in
                        Computer Science and AI at the{' '}
                        <strong
                          className={
                            lightMode
                              ? 'font-semibold text-[#171512]'
                              : 'font-semibold text-white'
                          }
                        >
                          University of Ibadan
                        </strong>
                        .
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Final story */}
                <motion.p
                  variants={reveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.08,
                  }}
                >
                  Now I am focused on going beyond making software
                  work — understanding the systems, intelligence,
                  and engineering principles behind increasingly
                  complex technology while continuing to build
                  products people can use.
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===================================================
            CURRENT DIRECTION
        ==================================================== */}
        <motion.div
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
            margin: '-60px',
          }}
          transition={{
            duration: 0.55,
            ease,
          }}
          className="mx-auto mt-10 max-w-4xl"
        >
          <div
            className={`group relative border-l-2 pl-5 sm:pl-6 ${
              lightMode
                ? 'border-[#B48600]/70'
                : 'border-yellow-400/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <FontAwesomeIcon
                icon={faBrain}
                className={
                  lightMode
                    ? 'text-[10px] text-[#B48600]'
                    : 'text-[10px] text-yellow-400'
                }
              />

              <span
                className={`font-mono text-[9px] uppercase tracking-[0.2em] ${
                  lightMode
                    ? 'text-[#665D51]'
                    : 'text-zinc-500'
                }`}
              >
                Current direction
              </span>
            </div>

            <motion.p
              initial={{
                opacity: 0,
                y: 8,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: 0.08,
                ease,
              }}
              className={`mt-3 max-w-3xl text-justify text-lg font-medium leading-[1.5] tracking-[-0.02em] sm:text-left sm:text-xl ${
                lightMode
                  ? 'text-[#24211D]'
                  : 'text-zinc-200'
              }`}
            >
              Building practical software while going deeper
              into the{' '}
              <span
                className={`relative inline-block ${
                  lightMode
                    ? 'text-[#A67B00]'
                    : 'text-yellow-400'
                }`}
              >
                systems and intelligence
                <span
                  className={`absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-500 group-hover:w-full ${
                    lightMode
                      ? 'bg-[#A67B00]'
                      : 'bg-yellow-400'
                  }`}
                />
              </span>{' '}
              behind it.
            </motion.p>
          </div>
        </motion.div>

        {/* ===================================================
            CTA
        ==================================================== */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
          }}
          className="mx-auto mt-10 max-w-4xl"
        >
          <div
            className={`flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between ${
              lightMode
                ? 'border-black/[0.11]'
                : 'border-white/[0.07]'
            }`}
          >
            <div>
              <p
                className={`text-xs ${
                  lightMode
                    ? 'text-[#4D463D]'
                    : 'text-zinc-400'
                }`}
              >
                Still building. Still learning.
              </p>

              <p
                className={`mt-1 text-[10px] ${
                  lightMode
                    ? 'text-[#6D6458]'
                    : 'text-zinc-600'
                }`}
              >
                The work tells the rest of the story.
              </p>
            </div>

            {/* =================================================
                CTA BUTTON
            ================================================== */}
            <motion.button
              onClick={scrollToProjects}
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              className="group inline-flex w-fit items-center gap-3"
            >
              <span
                className={`relative text-[12px] font-semibold ${
                  lightMode
                    ? 'text-[#24211D]'
                    : 'text-zinc-200'
                }`}
              >
                Explore my work

                <span
                  className={`absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 group-hover:w-full ${
                    lightMode
                      ? 'bg-[#A67B00]'
                      : 'bg-yellow-400'
                  }`}
                />
              </span>

              <motion.span
                variants={{
                  hover: {
                    x: 4,
                    backgroundColor: '#facc15',
                    color: '#09090b',
                  },
                }}
                transition={{
                  duration: 0.25,
                  ease,
                }}
                className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                  lightMode
                    ? 'border-black/15'
                    : 'border-white/10'
                }`}
              >
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-[9px]"
                />
              </motion.span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutJourney;

