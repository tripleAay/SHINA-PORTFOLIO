'use client';

import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

const SkillsSection = () => {
  const { lightMode } = useContext(ThemeContext);

  const skillGroups = [
    {
      number: '01',
      title: 'Engineering',
      description:
        'Building reliable, scalable web products from the frontend to the backend.',
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
      description:
        'Turning product requirements into thoughtful systems and intuitive experiences.',
      skills: [
        'Architecture',
        'APIs',
        'Authentication',
        'Payments',
        'Responsive UI',
      ],
    },
    {
      number: '03',
      title: 'Design',
      description:
        'Bringing product thinking and visual design together to create coherent brands and interfaces.',
      skills: [
        'UI/UX',
        'Brand Design',
        'Figma',
        'Adobe Creative Suite',
      ],
    },
  ];

  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className={`relative overflow-hidden transition-colors duration-300 ${
        lightMode
          ? 'bg-gray-950 text-white'
          : 'bg-gray-50 text-gray-950'
      }`}
    >
      {/* Extremely subtle background grid */}
      <div
        className={`pointer-events-none absolute inset-0 opacity-[0.018] ${
          lightMode ? 'text-white' : 'text-black'
        }`}
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 sm:px-8 lg:px-10 lg:py-32">

        {/* =========================
            SECTION INTRO
        ========================== */}
        <div className="max-w-2xl">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-7 bg-yellow-400" />

            <span
              className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${
                lightMode
                  ? 'text-gray-500'
                  : 'text-gray-400'
              }`}
            >
              Capabilities
            </span>
          </div>

          <h2
            id="skills-title"
            className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl lg:text-5xl"
          >
            I build across the
            <span className="text-yellow-400"> product.</span>
          </h2>

          <p
            className={`mt-5 max-w-xl text-sm leading-7 sm:text-base ${
              lightMode
                ? 'text-gray-400'
                : 'text-gray-500'
            }`}
          >
            From architecture and interfaces to visual identity,
            I bring engineering, product thinking and design into
            one workflow.
          </p>
        </div>

        {/* =========================
            CAPABILITY LIST
        ========================== */}
        <div className="mt-16 border-t border-current/10">
          {skillGroups.map((group) => (
            <div
              key={group.number}
              className={`group grid gap-8 border-b py-10 transition-colors duration-300 lg:grid-cols-[80px_0.8fr_1.2fr] lg:items-start ${
                lightMode
                  ? 'border-gray-900/10'
                  : 'border-white/10'
              }`}
            >
              {/* Number */}
              <span
                className={`text-[10px] font-medium tracking-[0.18em] ${
                  lightMode
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`}
              >
                {group.number}
              </span>

              {/* Title + description */}
              <div>
                <h3
                  className={`text-xl font-semibold tracking-[-0.02em] transition-colors duration-300 ${
                    lightMode
                      ? 'text-gray-950 group-hover:text-yellow-500'
                      : 'text-white group-hover:text-yellow-400'
                  }`}
                >
                  {group.title}
                </h3>

                <p
                  className={`mt-3 max-w-sm text-sm leading-6 ${
                    lightMode
                      ? 'text-gray-500'
                      : 'text-gray-500'
                  }`}
                >
                  {group.description}
                </p>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap content-start gap-x-2 gap-y-2">
                {group.skills.map((skill, index) => (
                  <span
                    key={skill}
                    className={`text-sm transition-colors duration-200 ${
                      lightMode
                        ? 'text-gray-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {skill}
                    {index < group.skills.length - 1 && (
                      <span
                        className={`ml-2 ${
                          lightMode
                            ? 'text-gray-300'
                            : 'text-gray-700'
                        }`}
                      >
                        ·
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* =========================
            BOTTOM NOTE
        ========================== */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p
            className={`text-[11px] leading-5 ${
              lightMode
                ? 'text-gray-400'
                : 'text-gray-600'
            }`}
          >
            A focused stack for building modern digital products.
          </p>

          <span
            className={`text-[10px] uppercase tracking-[0.18em] ${
              lightMode
                ? 'text-gray-400'
                : 'text-gray-600'
            }`}
          >
            Engineering · Product · Design
          </span>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;

