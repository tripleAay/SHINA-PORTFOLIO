
'use client';

import React, { useContext, useState } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { FiArrowUpRight, FiSearch, FiX } from 'react-icons/fi';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

type Tile = {
  id: number;
  image: string;
  alt: string;
  link: string;
  title: string;
  description: string;
  category: string;
};

const Portfolio: React.FC = () => {
  const { lightMode } = useContext(ThemeContext);

  const tiles: Tile[] = [
    {
      id: 1,
      image: 'https://via.placeholder.com/600x400',
      alt: 'Landing Page',
      link: '#',
      title: 'Landing Page Design',
      description:
        'A clean and responsive landing page with modern UI elements.',
      category: 'Web',
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/600x400',
      alt: 'E-commerce Store',
      link: '#',
      title: 'E-commerce Store',
      description:
        'Built with Next.js, Tailwind, and Stripe payment integration.',
      category: 'Web',
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/600x400',
      alt: 'Mobile App',
      link: '#',
      title: 'Mobile Banking App',
      description:
        'Cross-platform banking app with authentication and transfers.',
      category: 'Mobile',
    },
    {
      id: 4,
      image: 'https://via.placeholder.com/600x400',
      alt: 'UI Design',
      link: '#',
      title: 'Dashboard UI Kit',
      description:
        'High-fidelity UI design for admin dashboards.',
      category: 'Design',
    },
    {
      id: 5,
      image: 'https://via.placeholder.com/600x400',
      alt: 'Portfolio Site',
      link: '#',
      title: 'Portfolio Website',
      description:
        'Personal portfolio with animations and dark mode.',
      category: 'Web',
    },
  ];

  const categories = ['All', 'Web', 'Mobile', 'Design'];

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<Tile | null>(null);

  const filteredTiles =
    selectedCategory === 'All'
      ? tiles
      : tiles.filter(
          (tile) => tile.category === selectedCategory
        );

  return (
    <section
      id="portfolio"
      aria-labelledby="portfolio-title"
      className={`relative overflow-hidden transition-colors duration-500 ${
        lightMode
          ? 'bg-[#EAEAEA] text-gray-950'
          : 'bg-gray-950 text-white'
      }`}
    >
      {/* =========================================
          SUBTLE BACKGROUND
      ========================================== */}
      <div
        className={`pointer-events-none absolute inset-0 opacity-[0.018] ${
          lightMode ? 'text-black' : 'text-white'
        }`}
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '90px 90px',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-28 sm:px-8 lg:px-10 lg:py-36">

        {/* =========================================
            SECTION INTRO
        ========================================== */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">

          <div className="max-w-xl">

            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-7 bg-yellow-400" />

              <span
                className={`text-[10px] font-semibold uppercase tracking-[0.25em] ${
                  lightMode
                    ? 'text-gray-400'
                    : 'text-gray-500'
                }`}
              >
                Selected work
              </span>
            </div>

            <h2
              id="portfolio-title"
              className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-5xl"
            >
              Things I&apos;ve built.
            </h2>

            <p
              className={`mt-4 max-w-lg text-sm leading-7 sm:text-base ${
                lightMode
                  ? 'text-gray-500'
                  : 'text-gray-500'
              }`}
            >
              A selection of digital products, interfaces and
              experiences shaped through engineering and design.
            </p>
          </div>

          {/* Small project count */}
          <div
            className={`hidden pb-1 text-right md:block ${
              lightMode
                ? 'text-gray-400'
                : 'text-gray-600'
            }`}
          >
            <span className="text-2xl font-medium tracking-tight">
              {String(filteredTiles.length).padStart(2, '0')}
            </span>

            <span className="ml-2 text-[10px] uppercase tracking-[0.18em]">
              projects
            </span>
          </div>
        </div>

        {/* =========================================
            FILTERS
        ========================================== */}
        <div className="mt-14 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((category) => {
            const active = selectedCategory === category;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[10px] font-medium transition-all duration-200 ${
                  active
                    ? 'bg-yellow-400 text-gray-950'
                    : lightMode
                      ? 'text-gray-500 hover:bg-gray-100 hover:text-gray-950'
                      : 'text-gray-500 hover:bg-white/5 hover:text-gray-200'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* =========================================
            PROJECT GRID
        ========================================== */}
        <motion.div
          layout
          className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredTiles.map((tile) => (
              <motion.article
                key={tile.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group"
              >
                {/* =================================
                    IMAGE
                ================================== */}
                <div
                  className={`relative overflow-hidden rounded-lg ${
                    lightMode
                      ? 'bg-gray-100'
                      : 'bg-white/[0.03]'
                  }`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={tile.image}
                      alt={tile.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                    />

                    {/* Very light image treatment */}
                    <div className="pointer-events-none absolute inset-0 bg-black/[0.02]" />

                    {/* Hover action */}
                    <div className="absolute right-3 top-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
                      <button
                        onClick={() => setSelectedImage(tile)}
                        aria-label={`Preview ${tile.title}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-950 shadow-sm backdrop-blur-sm transition-transform duration-200 hover:scale-105"
                      >
                        <FiSearch size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* =================================
                    PROJECT INFORMATION
                ================================== */}
                <div className="mt-4">

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <h3
                        className={`text-sm font-semibold tracking-[-0.015em] ${
                          lightMode
                            ? 'text-gray-950'
                            : 'text-gray-100'
                        }`}
                      >
                        {tile.title}
                      </h3>

                      <p
                        className={`mt-2 max-w-sm text-xs leading-5 ${
                          lightMode
                            ? 'text-gray-500'
                            : 'text-gray-500'
                        }`}
                      >
                        {tile.description}
                      </p>
                    </div>

                    {/* External link */}
                    <a
                      href={tile.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${tile.title}`}
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                        lightMode
                          ? 'border-gray-900/10 text-gray-400 hover:border-gray-900/20 hover:bg-gray-950 hover:text-white'
                          : 'border-white/10 text-gray-500 hover:border-white/20 hover:bg-white hover:text-gray-950'
                      }`}
                    >
                      <FiArrowUpRight size={13} />
                    </a>
                  </div>

                  {/* Category */}
                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className={`h-1 w-1 rounded-full ${
                        lightMode
                          ? 'bg-yellow-500'
                          : 'bg-yellow-400'
                      }`}
                    />

                    <span
                      className={`text-[9px] font-medium uppercase tracking-[0.18em] ${
                        lightMode
                          ? 'text-gray-400'
                          : 'text-gray-600'
                      }`}
                    >
                      {tile.category}
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* =========================================
            BOTTOM STATEMENT
        ========================================== */}
        <div
          className={`mt-24 border-t pt-6 ${
            lightMode
              ? 'border-gray-900/[0.07]'
              : 'border-white/[0.07]'
          }`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <p
              className={`text-[10px] uppercase tracking-[0.18em] ${
                lightMode
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}
            >
              Selected work · 2024 — 2026
            </p>

            <p
              className={`text-[10px] ${
                lightMode
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}
            >
              More projects coming soon.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          IMAGE PREVIEW
      ========================================== */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative w-full max-w-4xl"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{
                duration: 0.25,
                ease: 'easeOut',
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={selectedImage.image}
                alt={selectedImage.alt}
                width={1200}
                height={800}
                className="max-h-[80vh] w-full rounded-lg object-contain"
              />

              <button
                onClick={() => setSelectedImage(null)}
                aria-label="Close preview"
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-950 shadow-lg transition-transform hover:scale-105"
              >
                <FiX size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio;

