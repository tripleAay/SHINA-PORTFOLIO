'use client';

import React, { useContext, useState } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowUpRight, FiCheck } from 'react-icons/fi';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const { lightMode } = useContext(ThemeContext);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('Form Submitted:', formData);

    setIsSubmitted(true);

    setFormData({
      name: '',
      email: '',
      message: '',
    });

    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className={`relative overflow-hidden transition-colors duration-500 ${
        lightMode
          ? 'bg-[#EAEAEA] text-gray-950'
          : 'bg-[#0b0b0d] text-white'
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

      <div className="relative mx-auto max-w-5xl px-6 py-28 sm:px-8 md:py-36 lg:px-10 lg:py-44">

        {/* =================================
            SECTION LABEL
        ================================== */}
        <div className="mb-16 flex items-center gap-3">
          <span className="h-px w-7 bg-yellow-400" />

          <span
            className={`text-[10px] font-semibold uppercase tracking-[0.24em] transition-colors duration-500 ${
              lightMode
                ? 'text-gray-400'
                : 'text-gray-500'
            }`}
          >
            Contact
          </span>
        </div>

        {/* =================================
            INTRO
        ================================== */}
        <div className="max-w-2xl">
          <motion.h2
            id="contact-title"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`text-4xl font-semibold leading-[1.05] tracking-[-0.045em] transition-colors duration-500 sm:text-5xl md:text-6xl ${
              lightMode
                ? 'text-gray-950'
                : 'text-white'
            }`}
          >
            Have something
            <br />
            <span className="text-yellow-400">
              worth building?
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{
              duration: 0.6,
              delay: 0.08,
              ease: 'easeOut',
            }}
            className={`mt-7 max-w-lg text-sm leading-7 transition-colors duration-500 sm:text-base ${
              lightMode
                ? 'text-gray-500'
                : 'text-gray-400'
            }`}
          >
            Tell me what you&apos;re working on. Let&apos;s see where it
            goes.
          </motion.p>
        </div>

        {/* =================================
            FORM
        ================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{
            duration: 0.7,
            delay: 0.15,
            ease: 'easeOut',
          }}
          className="mt-20 max-w-3xl"
        >
          <form onSubmit={handleSubmit} className="space-y-10">

            {/* Name + Email */}
            <div className="grid gap-10 sm:grid-cols-2">

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className={`mb-3 block text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors duration-500 ${
                    lightMode
                      ? 'text-gray-400'
                      : 'text-gray-500'
                  }`}
                >
                  Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  autoComplete="name"
                  className={`w-full border-0 border-b bg-transparent px-0 py-3 text-sm outline-none transition-colors placeholder:text-gray-500 focus:ring-0 ${
                    lightMode
                      ? 'border-black/10 text-gray-950 focus:border-yellow-500'
                      : 'border-white/10 text-white focus:border-yellow-400'
                  }`}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className={`mb-3 block text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors duration-500 ${
                    lightMode
                      ? 'text-gray-400'
                      : 'text-gray-500'
                  }`}
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className={`w-full border-0 border-b bg-transparent px-0 py-3 text-sm outline-none transition-colors placeholder:text-gray-500 focus:ring-0 ${
                    lightMode
                      ? 'border-black/10 text-gray-950 focus:border-yellow-500'
                      : 'border-white/10 text-white focus:border-yellow-400'
                  }`}
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className={`mb-3 block text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors duration-500 ${
                  lightMode
                    ? 'text-gray-400'
                    : 'text-gray-500'
                }`}
              >
                Message
              </label>

              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="What are you building?"
                rows={4}
                required
                className={`w-full resize-none border-0 border-b bg-transparent px-0 py-3 text-sm leading-7 outline-none transition-colors placeholder:text-gray-500 focus:ring-0 ${
                  lightMode
                    ? 'border-black/10 text-gray-950 focus:border-yellow-500'
                    : 'border-white/10 text-white focus:border-yellow-400'
                }`}
              />
            </div>

            {/* Action */}
            <div className="flex flex-col gap-5 pt-2 sm:flex-row sm:items-center sm:justify-between">

              {/* Availability */}
              <div
                className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] transition-colors duration-500 ${
                  lightMode
                    ? 'text-gray-400'
                    : 'text-gray-500'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-50" />

                  <span className="relative h-2 w-2 rounded-full bg-green-400" />
                </span>

                Available for selected projects
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex w-fit items-center gap-3 rounded-full bg-yellow-400 px-6 py-3 text-sm font-semibold text-gray-950 transition-colors hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
              >
                Send message

                <FiArrowUpRight
                  className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </motion.button>
            </div>
          </form>

          {/* =================================
              SUCCESS MESSAGE
          ================================== */}
          <AnimatePresence>
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-8 flex items-center gap-3 text-sm text-green-400"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-400/10">
                  <FiCheck />
                </span>

                Message received. I&apos;ll be in touch.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* =================================
            MINIMAL FOOTER
        ================================== */}
        <div
          className={`mt-28 flex items-center justify-between border-t pt-5 transition-colors duration-500 ${
            lightMode
              ? 'border-black/10'
              : 'border-white/[0.07]'
          }`}
        >
          <span
            className={`text-[10px] uppercase tracking-[0.18em] transition-colors duration-500 ${
              lightMode
                ? 'text-gray-400'
                : 'text-gray-600'
            }`}
          >
            Adeshina Adedokun
          </span>

          <span
            className={`text-[10px] transition-colors duration-500 ${
              lightMode
                ? 'text-gray-400'
                : 'text-gray-600'
            }`}
          >
            Lagos · Nigeria
          </span>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;