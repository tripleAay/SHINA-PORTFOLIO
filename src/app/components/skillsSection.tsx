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
        { name: 'Photoshop', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg' },
      ],
    },
  ];

  return (
    <section
      id="skills"
      className={`min-h-screen flex flex-col items-center justify-center px-6 py-12 transition-all duration-300 ease-in-out ${
        lightMode ? 'bg-gray-900' : 'bg-[#FFFBFC]'
      }`}
    >
      <h2
        className={`transition-all duration-300 ease-in-out text-4xl font-bold mb-12 text-center hover:underline cursor-pointer ${
          lightMode ? 'text-white hover:text-yellow-500' : 'text-gray-800 hover:text-gray-600'
        }`}
      >
        My Skills
      </h2>

      <div className="space-y-16 w-full max-w-6xl">
        {skillCategories.map((category, index) => (
          <div key={index}>
            <h3
              className={`text-2xl font-semibold mb-8 text-center ${
                lightMode ? 'text-yellow-400' : 'text-gray-700'
              }`}
            >
              {category.title}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10 items-center justify-center">
              {category.skills.map((skill, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center gap-4 p-6 rounded-xl shadow-lg transform hover:scale-110 transition duration-300 ${
                    lightMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
                  }`}
                >
                  <Image
                    src={skill.logo}
                    alt={`${skill.name} logo`}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain"
                  />
                  <p
                    className={`text-lg font-medium ${
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
