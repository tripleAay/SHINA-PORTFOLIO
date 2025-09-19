'use client'; 
// Required for client-side interactivity in Next.js App Router
import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

const About = () => {
  const { lightMode } = useContext(ThemeContext);

  return (
    <div
      id="about"
      className={`transition-all duration-300 ease-in-out min-h-screen flex items-center justify-center px-6 ${
        lightMode ? 'bg-gray-900' : 'bg-[#FFFBFC]'
      }`}
    >
      <div className="max-w-4xl mx-auto text-gray-300">
        {/* About Me Header */}
        <h2
          className={`transition-all duration-300 ease-in-out text-4xl font-bold mb-6 text-center hover:underline cursor-pointer ${
            lightMode
              ? 'text-white hover:text-yellow-500'
              : 'text-gray-800 hover:text-gray-600'
          }`}
        >
          About Me
        </h2>

        {/* Content */}
        <p
          className={`transition-all duration-300 ease-in-out text-lg leading-relaxed mb-6 text-justify ${
            lightMode ? '' : 'text-gray-800'
          }`}
        >
          Hi, I’m <span className="font-semibold text-yellow-500">Adedokun Adeshina</span>, a{' '}
          <span className="font-semibold text-yellow-500">Fullstack Developer</span> and{' '}
          <span className="font-semibold text-yellow-500">Brand Designer</span> with a unique journey
          that began in <span className="font-semibold">2013</span> as a brand designer at Ginimax
          Technology. What started as a passion for visuals has grown into a career that blends{' '}
          <span className="italic text-yellow-500">design, technology, and entrepreneurship</span>.
        </p>

        <p
          className={`transition-all duration-300 ease-in-out text-lg leading-relaxed mb-6 text-justify ${
            lightMode ? '' : 'text-gray-800'
          }`}
        >
          I hold an <span className="font-semibold text-yellow-500">HND in Computer Science</span>{' '}
          from The Polytechnic, Ibadan, and I’m currently completing my{' '}
          <span className="font-semibold text-yellow-500">BSc in Computer Science</span> at the
          National Open University (graduating 2025). My solid technical background fuels my drive to
          build scalable web applications, while my design experience ensures every solution I
          deliver is visually compelling and brand-focused.
        </p>

        <p
          className={`transition-all duration-300 ease-in-out text-lg leading-relaxed mb-6 text-justify ${
            lightMode ? '' : 'text-gray-800'
          }`}
        >
          Today, I lead <span className="font-semibold text-yellow-500">Fynaro Tech</span>, a digital
          agency helping businesses establish strong online presences, and{' '}
          <span className="font-semibold text-yellow-500">dev2done</span>, a community for developers
          to sharpen their craft through real-world projects. Beyond code and design, I share my
          journey on <span className="font-semibold text-yellow-500">Medium</span> and my blog{' '}
          <span className="font-semibold text-yellow-500">Daddieshinor</span>, where I write about
          tech, entrepreneurship, branding, and life lessons.
        </p>

        <ul
          className={`transition-all duration-300 ease-in-out list-disc list-inside mb-6 space-y-2 text-justify ${
            lightMode ? '' : 'text-gray-800'
          }`}
        >
          <li>
            Scalable <span className="text-yellow-500">web development</span> with React, Next.js, and
            modern stacks.
          </li>
          <li>
            Purpose-driven <span className="text-yellow-500">brand design</span> that tells stories
            and builds trust.
          </li>
          <li>
            <span className="text-yellow-500">Community leadership</span> through mentorship, dev
            communities, and team projects.
          </li>
          <li>
            <span className="text-yellow-500">Storytelling</span> through writing, design, and
            technology to inspire growth.
          </li>
        </ul>

        <p
          className={`transition-all duration-300 ease-in-out text-lg leading-relaxed mb-6 text-justify ${
            lightMode ? '' : 'text-gray-800'
          }`}
        >
          I believe in merging <span className="italic text-yellow-500">creativity, technology, and
          strategy</span> to empower brands and individuals. Whether I’m coding, designing, writing,
          or leading a team, my mission is simple: to build solutions that last and stories that
          matter.
        </p>

        <p className="text-lg leading-relaxed text-center font-semibold text-yellow-500 mb-4">
          Let’s connect, collaborate, and create something extraordinary.
        </p>
      </div>
    </div>
  );
};

export default About;
