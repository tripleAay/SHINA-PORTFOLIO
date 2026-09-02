
'use client';

import { useContext } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUpRightFromSquare,
  faCode,
  faLayerGroup,
  faPuzzlePiece,
} from '@fortawesome/free-solid-svg-icons';

import { ThemeContext } from '../contexts/ThemeContext';

const ease = [0.16, 1, 0.3, 1] as const;

const skillGroups = [
  {
    number: '01',
    title: 'Engineering',
    description: 'Building the systems behind modern web products.',
    icon: faCode,
    skills: [
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
      'Firebase',
      'Supabase',
    ],
  },
  {
    number: '02',
    title: 'Product',
    description: 'Turning ideas into reliable, usable digital products.',
    icon: faPuzzlePiece,
    skills: [
      'APIs',
      'Architecture',
      'Authentication',
      'Payments',
      'Responsive UI',
    ],
  },
  {
    number: '03',
    title: 'Design',
    description: 'Designing experiences with clarity and visual intent.',
    icon: faLayerGroup,
    skills: [
      'UI/UX',
      'Figma',
      'Brand Design',
      'Adobe Creative Suite',
    ],
  },
];

const SkillsSection = () => {
  const { lightMode } = useContext(ThemeContext);

  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className={`relative overflow-hidden transition-colors duration-700 ${
        lightMode
          ? 'bg-[#D9CAB3] text-gray-950'
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
        transition={{ duration: 1 }}
        className={`pointer-events-none absolute inset-0 ${
          lightMode
            ? 'text-black/[0.018]'
            : 'text-white/[0.018]'
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
          scale: 0.8,
        }}
        whileInView={{
          opacity: 1,
          scale: 1,
        }}
        viewport={{ once: true }}
        transition={{
          duration: 1.4,
          ease,
        }}
        className={`pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${
          lightMode
            ? 'bg-yellow-400/[0.018]'
            : 'bg-yellow-400/[0.018]'
        }`}
      />

      {/* =====================================================
          MAIN
      ====================================================== */}

      <div className="relative mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">

        {/* ===================================================
            HEADER
        ==================================================== */}

        <motion.div
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
            margin: '-80px',
          }}
          transition={{
            duration: 0.6,
            ease,
          }}
          className={`flex flex-col gap-5 border-b pb-7 sm:flex-row sm:items-end sm:justify-between ${
            lightMode
              ? 'border-black/[0.1]'
              : 'border-white/[0.08]'
          }`}
        >
          <div>
            {/* Section label */}

            <div className="mb-4 flex items-center gap-3">
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: 28 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  ease,
                }}
                className="h-px bg-yellow-400"
              />

              <span
                className={`font-mono text-[9px] font-medium uppercase tracking-[0.24em] ${
                  lightMode
                    ? 'text-gray-500'
                    : 'text-gray-500'
                }`}
              >
                Capabilities
              </span>
            </div>

            {/* Title */}

            <h2
              id="skills-title"
              className={`text-3xl font-semibold tracking-[-0.045em] sm:text-4xl md:text-[2.7rem] ${
                lightMode
                  ? 'text-gray-950'
                  : 'text-white'
              }`}
            >
              What I work with
              <span className="text-yellow-500 sm:text-yellow-400">
                .
              </span>
            </h2>
          </div>

          {/* Header metadata */}

          <div
            className={`flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.18em] ${
              lightMode
                ? 'text-gray-500'
                : 'text-gray-600'
            }`}
          >
            <span>Stack</span>

            <span
              className={`h-px w-6 ${
                lightMode
                  ? 'bg-black/10'
                  : 'bg-white/10'
              }`}
            />

            <span>03 areas</span>
          </div>
        </motion.div>

        {/* ===================================================
            SKILL GROUPS
        ==================================================== */}

        <div>
          {skillGroups.map((group, groupIndex) => (
            <motion.div
              key={group.number}
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
                margin: '-70px',
              }}
              transition={{
                duration: 0.65,
                delay: groupIndex * 0.08,
                ease,
              }}
              className={`group relative border-b ${
                lightMode
                  ? 'border-black/[0.1]'
                  : 'border-white/[0.08]'
              }`}
            >
              {/* =================================================
                  ROW
              ================================================== */}

              <div className="grid gap-6 py-8 md:grid-cols-[64px_220px_1fr] md:items-start md:gap-8 lg:py-9">

                {/* =================================================
                    NUMBER
                ================================================== */}

                <div className="flex items-center gap-3 md:block">
                  <span
                    className={`font-mono text-[10px] tracking-[0.16em] transition-colors duration-300 ${
                      lightMode
                        ? 'text-gray-500 group-hover:text-yellow-600'
                        : 'text-gray-600 group-hover:text-yellow-400'
                    }`}
                  >
                    {group.number}
                  </span>

                  <motion.span
                    initial={{ width: 0 }}
                    whileInView={{ width: 18 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: 0.15 + groupIndex * 0.08,
                      ease,
                    }}
                    className="hidden h-px bg-yellow-400 md:mt-4 md:block"
                  />
                </div>

                {/* =================================================
                    CATEGORY
                ================================================== */}

                <div>
                  <div className="flex items-center gap-3">
                    {/* Icon */}

                    <motion.div
                      whileHover={{
                        scale: 1.08,
                        rotate: -4,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                        lightMode
                          ? 'bg-black/[0.035] group-hover:bg-yellow-400/15'
                          : 'bg-white/[0.04] group-hover:bg-yellow-400/10'
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={group.icon}
                        className={`text-[10px] transition-colors duration-300 ${
                          lightMode
                            ? 'text-gray-500 group-hover:text-yellow-600'
                            : 'text-gray-500 group-hover:text-yellow-400'
                        }`}
                      />
                    </motion.div>

                    <h3
                      className={`text-lg font-semibold tracking-[-0.02em] transition-colors duration-300 ${
                        lightMode
                          ? 'text-gray-950 group-hover:text-yellow-700'
                          : 'text-gray-100 group-hover:text-yellow-400'
                      }`}
                    >
                      {group.title}
                    </h3>
                  </div>

                  <p
                    className={`mt-3 max-w-[210px] text-[11px] leading-5 transition-colors duration-300 ${
                      lightMode
                        ? 'text-gray-500'
                        : 'text-gray-600'
                    }`}
                  >
                    {group.description}
                  </p>
                </div>

                {/* =================================================
                    SKILLS
                ================================================== */}

                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill}
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration: 0.4,
                        delay:
                          0.18 +
                          groupIndex * 0.08 +
                          skillIndex * 0.045,
                        ease,
                      }}
                      whileHover={{
                        y: -2,
                      }}
                      className={`group/skill relative cursor-default overflow-hidden rounded-full border px-3.5 py-2 text-[11px] font-medium transition-all duration-300 ${
                        lightMode
                          ? 'border-black/[0.1] bg-black/[0.015] text-gray-600 hover:border-yellow-600/40 hover:bg-yellow-400/10 hover:text-gray-950'
                          : 'border-white/[0.09] bg-white/[0.015] text-gray-400 hover:border-yellow-400/30 hover:bg-yellow-400/[0.06] hover:text-gray-100'
                      }`}
                    >
                      {/* Hover sweep */}

                      <span
                        className={`absolute inset-0 -translate-x-full transition-transform duration-500 group-hover/skill:translate-x-0 ${
                          lightMode
                            ? 'bg-yellow-400/[0.06]'
                            : 'bg-yellow-400/[0.035]'
                        }`}
                      />

                      <span className="relative">
                        {skill}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* =================================================
                  HOVER EDGE
              ================================================== */}

              <motion.div
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{
                  duration: 0.35,
                  ease,
                }}
                className="absolute bottom-[-1px] left-0 h-px w-full origin-left bg-yellow-400"
              />
            </motion.div>
          ))}
        </div>

        {/* ===================================================
            BOTTOM SIGNAL
        ==================================================== */}

        <motion.div
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
          className="flex items-center justify-between pt-6"
        >
          <span
            className={`font-mono text-[9px] uppercase tracking-[0.18em] ${
              lightMode
                ? 'text-gray-500'
                : 'text-gray-600'
            }`}
          >
            Engineering · Product · Design
          </span>

          <motion.button
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
            className={`group hidden items-center gap-2 text-[10px] font-medium uppercase tracking-[0.15em] sm:flex ${
              lightMode
                ? 'text-gray-500'
                : 'text-gray-600'
            }`}
          >
            <span className="transition-colors duration-300 group-hover:text-yellow-500">
              Full-stack
            </span>

            <motion.span
              variants={{
                hover: {
                  x: 3,
                  y: -3,
                },
              }}
              transition={{
                duration: 0.2,
              }}
            >
              <FontAwesomeIcon
                icon={faArrowUpRightFromSquare}
                className="text-[8px]"
              />
            </motion.span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;

