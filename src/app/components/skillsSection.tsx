'use client';

import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

const SkillsSection = () => {
  const { lightMode } = useContext(ThemeContext);

  const skillGroups = [
    {
      number: '01',
      title: 'Engineering',
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
      skills: [
        'UI/UX',
        'Figma',
        'Brand Design',
        'Adobe Creative Suite',
      ],
    },
  ];

  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
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

        {/* =================================
            HEADER
        ================================== */}
        <div
          className={`flex items-end justify-between border-b pb-6 transition-colors duration-500 ${
            lightMode
              ? 'border-black/[0.08]'
              : 'border-white/[0.08]'
          }`}
        >
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-7 bg-yellow-400" />

              <span
                className={`text-[10px] font-semibold uppercase tracking-[0.24em] transition-colors duration-500 ${
                  lightMode
                    ? 'text-gray-400'
                    : 'text-gray-500'
                }`}
              >
                Skills
              </span>
            </div>

            <h2
              id="skills-title"
              className={`mt-3 text-3xl font-semibold tracking-[-0.04em] transition-colors duration-500 sm:text-4xl ${
                lightMode
                  ? 'text-gray-950'
                  : 'text-white'
              }`}
            >
              What I work with
              <span className="text-yellow-400">.</span>
            </h2>
          </div>

          <span
            className={`hidden text-[10px] uppercase tracking-[0.18em] transition-colors duration-500 sm:block ${
              lightMode
                ? 'text-gray-400'
                : 'text-gray-600'
            }`}
          >
            01 — 03
          </span>
        </div>

        {/* =================================
            SKILLS
        ================================== */}
        <div>
          {skillGroups.map((group) => (
            <div
              key={group.number}
              className={`grid gap-6 border-b py-10 transition-colors duration-500 md:grid-cols-[70px_180px_1fr] md:items-center ${
                lightMode
                  ? 'border-black/[0.08]'
                  : 'border-white/[0.08]'
              }`}
            >
              {/* Number */}
              <span
                className={`text-[10px] tracking-[0.18em] transition-colors duration-500 ${
                  lightMode
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`}
              >
                {group.number}
              </span>

              {/* Category */}
              <h3
                className={`text-lg font-medium tracking-tight transition-colors duration-500 ${
                  lightMode
                    ? 'text-gray-950'
                    : 'text-gray-100'
                }`}
              >
                {group.title}
              </h3>

              {/* Skills */}
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`text-sm transition-colors duration-300 ${
                      lightMode
                        ? 'text-gray-500'
                        : 'text-gray-400'
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* =================================
            FOOTNOTE
        ================================== */}
        <div
          className={`mt-8 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] transition-colors duration-500 ${
            lightMode
              ? 'text-gray-400'
              : 'text-gray-600'
          }`}
        >
          <span>Engineering · Product · Design</span>

          <span className="hidden sm:block">
            Full-stack capabilities
          </span>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;