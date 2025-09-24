'use client';

import React, { useContext } from 'react';
import Image from 'next/image';
import { ThemeContext } from '../contexts/ThemeContext';

const SkillsSection = () => {
  const { lightMode } = useContext(ThemeContext);

  const skillCategories = [
    {
      title: 'Core Development',
      skills: [
        { name: 'TypeScript', logo: 'https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-icon.svg' },
        { name: 'JavaScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
        { name: 'React.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
        { name: 'Next.js', logo: 'https://cdn.worldvectorlogo.com/logos/nextjs-2.svg' },
        { name: 'Node.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
        { name: 'Express.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
        { name: 'MongoDB', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
        { name: 'Firebase', logo: 'https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg' },
      ],
    },
    {
      title: 'Frontend & Styling',
      skills: [
        { name: 'Tailwind CSS', logo: 'https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg' },
        { name: 'HTML5', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
        { name: 'CSS3', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
        { name: 'Framer Motion', logo: 'https://cdn.worldvectorlogo.com/logos/framer.svg' },
      ],
    },
    {
      title: 'Creative & Branding',
      skills: [
        { name: 'Adobe Photoshop', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg' },
        { name: 'Adobe Illustrator', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg' },
        { name: 'CorelDRAW', logo: 'https://img.icons8.com/color/512/coreldraw.png' },
        { name: 'Adobe Premiere Pro', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/premierepro/premierepro-original.svg' },
        { name: 'Brand Design', logo: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/512/external-branding-marketing-agency-flaticons-lineal-color-flat-icons.png' },
        { name: 'Storytelling', logo: 'https://img.icons8.com/external-flat-juicy-fish/512/external-storytelling-online-marketing-flat-flat-juicy-fish.png' },
      ],
    },
    {
      title: 'Tools & Platforms',
      skills: [
        { name: 'GitHub', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
        { name: 'Git', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
        { name: 'Figma', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
        { name: 'WordPress', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg' },
        { name: 'Shopify', logo: 'https://cdn.worldvectorlogo.com/logos/shopify.svg' },
      ],
    },
  ];

  return (
    <section
      id="skills"
      className={`min-h-screen flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden transition-all duration-500 ${
        lightMode ? 'bg-gray-900' : 'bg-gray-100'
      }`}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 blur-3xl opacity-20 bg-grey-400"></div>

      <h2
        className={`relative z-10 text-5xl font-extrabold mb-16 text-center tracking-tight ${
          lightMode ? 'text-white' : 'text-gray-800'
        }`}
      >
        ⚡ My Superpowers
      </h2>

      <div className="space-y-20 w-full max-w-7xl relative z-10">
        {skillCategories.map((category, index) => (
          <div key={index}>
            <h3
              className={`text-2xl md:text-3xl font-bold mb-10 text-center ${
                lightMode ? 'text-yellow-400' : 'text-gray-700'
              }`}
            >
              {category.title}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10 items-center justify-center">
              {category.skills.map((skill, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center gap-4 p-6 rounded-2xl shadow-xl backdrop-blur-md transform hover:scale-110 hover:-rotate-1 transition duration-500 ${
                    lightMode
                      ? 'bg-gray-800/80 hover:shadow-yellow-400/40'
                      : 'bg-white/70 hover:shadow-lg'
                  }`}
                >
                  <Image
                    src={skill.logo}
                    alt={`${skill.name} logo`}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain drop-shadow-md"
                  />
                  <p
                    className={`text-lg font-semibold tracking-wide ${
                      lightMode ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    {skill.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;
