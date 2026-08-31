
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
      className={`transition-colors duration-500 ${
        lightMode
          ? 'bg-white text-gray-950'
          : 'bg-[#0b0b0d] text-white'
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-8 md:py-32 lg:px-10">

        {/* Header */}
        <div className="flex items-end justify-between border-b border-current/10 pb-6">
          <div>
            <span
              className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${
                lightMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Skills
            </span>

            <h2
              id="skills-title"
              className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl"
            >
              What I work with<span className="text-yellow-400">.</span>
            </h2>
          </div>

          <span
            className={`hidden text-[10px] uppercase tracking-[0.18em] sm:block ${
              lightMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            01 — 03
          </span>
        </div>

        {/* Skills */}
        <div>
          {skillGroups.map((group) => (
            <div
              key={group.number}
              className={`grid gap-6 border-b py-10 md:grid-cols-[70px_180px_1fr] md:items-center ${
                lightMode
                  ? 'border-gray-900/[0.08]'
                  : 'border-white/[0.08]'
              }`}
            >
              {/* Number */}
              <span
                className={`text-[10px] tracking-[0.18em] ${
                  lightMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {group.number}
              </span>

              {/* Category */}
              <h3
                className={`text-lg font-medium tracking-tight ${
                  lightMode ? 'text-gray-950' : 'text-gray-100'
                }`}
              >
                {group.title}
              </h3>

              {/* Skills */}
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`text-sm ${
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
      </div>
    </section>
  );
};

export default SkillsSection;
