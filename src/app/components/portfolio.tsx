'use client';

import React, { useState, useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { FiExternalLink, FiSearch } from 'react-icons/fi';
import Image from 'next/image';
import { motion } from 'framer-motion';

// ✅ Tile type
type Tile = {
  id: number;
  image: string;
  alt: string;
  link: string;
  title: string;
  description: string;
  category: string;
};

const Portfolio = () => {
  const { lightMode } = useContext(ThemeContext);

  const initialTiles: Tile[] = [
    {
      id: 1,
      image: 'https://via.placeholder.com/600x400',
      alt: 'Landing Page',
      link: '#',
      title: 'Landing Page Design',
      description: 'A clean and responsive landing page with modern UI elements.',
      category: 'Web',
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/600x400',
      alt: 'E-commerce Store',
      link: '#',
      title: 'E-commerce Store',
      description: 'Built with Next.js, Tailwind, and Stripe payment integration.',
      category: 'Web',
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/600x400',
      alt: 'Mobile App',
      link: '#',
      title: 'Mobile Banking App',
      description: 'Cross-platform banking app with authentication and transfers.',
      category: 'Mobile',
    },
    {
      id: 4,
      image: 'https://via.placeholder.com/600x400',
      alt: 'UI Design',
      link: '#',
      title: 'Dashboard UI Kit',
      description: 'High-fidelity UI design for admin dashboards.',
      category: 'Design',
    },
    {
      id: 5,
      image: 'https://via.placeholder.com/600x400',
      alt: 'Portfolio Site',
      link: '#',
      title: 'Portfolio Website',
      description: 'Personal portfolio with animations and dark mode.',
      category: 'Web',
    },
  ];

  const categories = ['All', 'Web', 'Mobile', 'Design'];

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedImage, setSelectedImage] = useState<Tile | null>(null);

  // ✅ Filter logic
  const filteredTiles =
    selectedCategory === 'All'
      ? initialTiles
      : initialTiles.filter((tile) => tile.category === selectedCategory);

  const handleImageClick = (tile: Tile) => setSelectedImage(tile);
  const closeModal = () => setSelectedImage(null);

  return (
    <section
      id="portfolio"
      className={`py-20 px-6 transition-colors ${
        lightMode ? 'bg-gray-900' : 'bg-[#FFFBFC]'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h2
          className={`text-center text-5xl font-extrabold mb-4 ${
            lightMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          My Work
        </h2>
        <p
          className={`text-center mb-12 text-lg ${
            lightMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          A curated collection of my recent projects — crafted with passion and precision.
        </p>

        {/* Filters */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-medium transition ${
                selectedCategory === cat
                  ? 'bg-yellow-500 text-gray-900 shadow-lg'
                  : lightMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredTiles.map((tile) => (
            <motion.div
              key={tile.id}
              layout
              whileHover={{ scale: 1.03 }}
              className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
            >
              {/* Image */}
              <Image
                src={tile.image}
                alt={tile.alt}
                width={600}
                height={400}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center gap-4">
                <button
                  onClick={() => handleImageClick(tile)}
                  className="p-3 bg-white text-gray-800 rounded-full shadow-md hover:bg-yellow-400 hover:text-gray-900 transition"
                >
                  <FiSearch size={20} />
                </button>
                <a
                  href={tile.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white text-gray-800 rounded-full shadow-md hover:bg-yellow-400 hover:text-gray-900 transition"
                >
                  <FiExternalLink size={20} />
                </a>
              </div>

              {/* Info */}
              <div
                className={`p-5 ${
                  lightMode ? 'bg-gray-800' : 'bg-white'
                } transition duration-300`}
              >
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    lightMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {tile.title}
                </h3>
                <p
                  className={`text-sm ${
                    lightMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {tile.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-6">
            <div className="relative max-w-4xl w-full">
              <Image
                src={selectedImage.image}
                alt={selectedImage.alt}
                width={1200}
                height={800}
                className="w-full max-h-[80vh] object-cover rounded-xl shadow-xl"
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white text-gray-800 p-2 rounded-full shadow-md hover:bg-yellow-400 hover:text-gray-900 transition"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
