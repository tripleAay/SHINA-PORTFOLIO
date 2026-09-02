
'use client';

import { useContext } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
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
    description: 'Modern web systems and applications.',
    icon: faCode,
    skills: [
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Node.js',
      'Supabase',
    ],
  },
  {
    number: '02',
    title: 'Product',
    description: 'Reliable systems built around real needs.',
    icon: faPuzzlePiece,
    skills: [
      'REST APIs',
      'System Architecture',
      'Authentication',
      'Payments',
      'Fintech',
      'E-commerce',
    ],
  },
  {
    number: '03',
    title: 'Design + AI',
    description: 'Interfaces, identity, and intelligent workflows.',
    icon: faLayerGroup,
    skills: [
      'UI/UX',
      'Figma',
      'Brand Design',
      'AI Integration',
      'Automation',
    ],
  },
];

const SkillsSection = () => {
  const { lightMode } = useContext(ThemeContext);

  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className={`relative overflow-hidden transition-colors duration-500 ${
        lightMode
          ? 'bg-[#EAEAEA] text-gray-950'
          : 'bg-[#0b0b0d] text-white'
      }`}
    >
      {/* Background grid */}

      <div
        className={`pointer-events-none absolute inset-0 ${
          lightMode
            ? 'text-black/[0.025]'
            : 'text-white/[0.018]'
        }`}
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Ambient glow */}

      <div
        className={`pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${
          lightMode
            ? 'bg-yellow-400/[0.035]'
            : 'bg-yellow-400/[0.025]'
        }`}
      />

      <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-18 lg:px-10 lg:py-20">

        {/* Header */}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: true,
            margin: '-60px',
          }}
          transition={{
            duration: 0.5,
            ease,
          }}
          className={`border-b pb-6 ${
            lightMode
              ? 'border-black/[0.10]'
              : 'border-white/[0.08]'
          }`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <div className="mb-3 flex items-center justify-center gap-3 sm:justify-start">
                <span className="h-px w-6 bg-yellow-400" />

                <span
                  className={`font-mono text-[9px] font-semibold uppercase tracking-[0.22em] ${
                    lightMode
                      ? 'text-[#514a41]'
                      : 'text-gray-500'
                  }`}
                >
                  Capabilities
                </span>
              </div>

              <h2
                id="skills-title"
                className={`text-center text-[2rem] font-semibold leading-none tracking-[-0.055em] sm:text-left sm:text-4xl md:text-[2.7rem] ${
                  lightMode
                    ? 'text-[#171513]'
                    : 'text-white'
                }`}
              >
                What I work with
                <span className="text-yellow-500">
                  .
                </span>
              </h2>
            </div>

            <span
              className={`hidden font-mono text-[9px] uppercase tracking-[0.18em] sm:block ${
                lightMode
                  ? 'text-[#71685d]'
                  : 'text-gray-600'
              }`}
            >
              Engineering · Product · Design
            </span>
          </div>
        </motion.div>

        {/* Skill groups */}

        <div>
          {skillGroups.map((group, index) => (
            <motion.article
              key={group.number}
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
                duration: 0.5,
                delay: index * 0.07,
                ease,
              }}
              className={`group relative border-b py-7 sm:py-8 ${
                lightMode
                  ? 'border-black/[0.10]'
                  : 'border-white/[0.08]'
              }`}
            >
              <div className="grid gap-5 md:grid-cols-[52px_240px_1fr] md:items-center md:gap-8">

                {/* Number */}

                <div className="flex items-center justify-center gap-2 md:justify-start">
                  <span
                    className={`font-mono text-[9px] tracking-[0.15em] transition-colors duration-300 ${
                      lightMode
                        ? 'text-[#71685d] group-hover:text-yellow-600'
                        : 'text-gray-600 group-hover:text-yellow-400'
                    }`}
                  >
                    {group.number}
                  </span>

                  <span className="h-px w-4 bg-yellow-400" />
                </div>

                {/* Category */}

                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center gap-3 md:justify-start">

                    <motion.div
                      whileHover={{
                        scale: 1.08,
                        rotate: -4,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                        lightMode
                          ? 'bg-black/[0.04] group-hover:bg-yellow-400/15'
                          : 'bg-white/[0.04] group-hover:bg-yellow-400/10'
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={group.icon}
                        className={`text-[10px] transition-colors duration-300 ${
                          lightMode
                            ? 'text-[#514a41] group-hover:text-yellow-600'
                            : 'text-gray-500 group-hover:text-yellow-400'
                        }`}
                      />
                    </motion.div>

                    <h3
                      className={`text-base font-semibold tracking-[-0.025em] transition-colors duration-300 sm:text-lg ${
                        lightMode
                          ? 'text-[#171513] group-hover:text-yellow-700'
                          : 'text-gray-100 group-hover:text-yellow-400'
                      }`}
                    >
                      {group.title}
                    </h3>
                  </div>

                  <p
                    className={`mt-1.5 text-[10px] leading-5 ${
                      lightMode
                        ? 'text-[#71685d]'
                        : 'text-gray-600'
                    }`}
                  >
                    {group.description}
                  </p>
                </div>

                {/* Skills */}

                <div className="flex flex-wrap justify-center gap-x-2 gap-y-2 md:justify-start">
                  {group.skills.map(
                    (skill, skillIndex) => (
                      <motion.span
                        key={skill}
                        initial={{
                          opacity: 0,
                          y: 5,
                        }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                        }}
                        viewport={{
                          once: true,
                        }}
                        transition={{
                          duration: 0.3,
                          delay:
                            index * 0.07 +
                            skillIndex * 0.035,
                          ease,
                        }}
                        whileHover={{
                          y: -2,
                        }}
                        className={`rounded-full border px-3 py-1.5 text-[9px] font-medium transition-all duration-300 ${
                          lightMode
                            ? 'border-black/[0.11] bg-white/30 text-[#514a41] hover:border-yellow-600/40 hover:bg-yellow-400/10 hover:text-[#171513]'
                            : 'border-white/[0.08] bg-white/[0.025] text-gray-400 hover:border-yellow-400/30 hover:bg-yellow-400/[0.05] hover:text-white'
                        }`}
                      >
                        {skill}
                      </motion.span>
                    )
                  )}
                </div>
              </div>

              {/* Hover line */}

              <motion.span
                initial={{
                  scaleX: 0,
                }}
                whileHover={{
                  scaleX: 1,
                }}
                transition={{
                  duration: 0.3,
                  ease,
                }}
                className="absolute bottom-[-1px] left-0 h-px w-full origin-left bg-yellow-400"
              />
            </motion.article>
          ))}
        </div>

        {/* Bottom signal */}

        <div
          className={`pt-5 text-center sm:text-left ${
            lightMode
              ? 'text-[#71685d]'
              : 'text-gray-600'
          }`}
        >
          <span className="font-mono text-[8px] uppercase tracking-[0.18em]">
            React · Next.js · TypeScript · Node.js
          </span>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;

