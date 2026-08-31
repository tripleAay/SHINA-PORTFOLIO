
'use client';

import React, { useContext, useState } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowUpRight,
  FiCheck,
  FiMail,
} from 'react-icons/fi';

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
          ? 'bg-gray-950 text-white'
          : 'bg-gray-50 text-gray-950'
      }`}
    >
      {/* Extremely subtle background detail */}
      <div
        className={`pointer-events-none absolute inset-0 opacity-[0.018] ${
          lightMode ? 'text-white' : 'text-black'
        }`}
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '90px 90px',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 sm:px-8 lg:px-10 lg:py-32">

        {/* Small section marker */}
        <div className="mb-14 flex items-center gap-3">
          <span className="h-px w-8 bg-yellow-400" />

          <span
            className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${
              lightMode ? 'text-gray-500' : 'text-gray-400'
            }`}
          >
            Contact
          </span>
        </div>

        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">

          {/* =========================
              LEFT — INTRO
          ========================== */}
          <div className="max-w-md">

            <h2
              id="contact-title"
              className="text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl"
            >
              Let's build something
              <span className="text-yellow-400"> meaningful.</span>
            </h2>

            <p
              className={`mt-6 max-w-sm text-sm leading-7 sm:text-base ${
                lightMode
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}
            >
              Have a product idea, a website to build, or a problem
              worth solving? Tell me a little about it and I'll get
              back to you.
            </p>

            {/* Direct email */}
            <a
              href="mailto:hello@adeshinaadedokun.com"
              className={`group mt-8 inline-flex items-center gap-3 text-sm font-medium transition-colors ${
                lightMode
                  ? 'text-gray-300 hover:text-yellow-400'
                  : 'text-gray-700 hover:text-yellow-500'
              }`}
            >
              <FiMail className="text-yellow-400" />

              <span>hello@adeshinaadedokun.com</span>

              <FiArrowUpRight
                className="text-xs transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>

            {/* Availability */}
            <div
              className={`mt-10 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] ${
                lightMode
                  ? 'text-gray-600'
                  : 'text-gray-400'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-60" />
                <span className="relative h-2 w-2 rounded-full bg-green-400" />
              </span>

              Available for selected projects
            </div>
          </div>

          {/* =========================
              RIGHT — FORM
          ========================== */}
          <div className="w-full max-w-2xl lg:ml-auto">

            <form
              onSubmit={handleSubmit}
              className="space-y-8"
            >

              {/* Name + Email */}
              <div className="grid gap-8 sm:grid-cols-2">

                <div className="group">
                  <label
                    htmlFor="name"
                    className={`mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] ${
                      lightMode
                        ? 'text-gray-500'
                        : 'text-gray-400'
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
                    className={`w-full border-0 border-b bg-transparent px-0 py-3 text-sm outline-none transition-colors placeholder:text-gray-500 focus:ring-0 ${
                      lightMode
                        ? 'border-white/10 text-white focus:border-yellow-400'
                        : 'border-gray-900/10 text-gray-900 focus:border-yellow-500'
                    }`}
                  />
                </div>

                <div className="group">
                  <label
                    htmlFor="email"
                    className={`mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] ${
                      lightMode
                        ? 'text-gray-500'
                        : 'text-gray-400'
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
                    className={`w-full border-0 border-b bg-transparent px-0 py-3 text-sm outline-none transition-colors placeholder:text-gray-500 focus:ring-0 ${
                      lightMode
                        ? 'border-white/10 text-white focus:border-yellow-400'
                        : 'border-gray-900/10 text-gray-900 focus:border-yellow-500'
                    }`}
                  />
                </div>

              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className={`mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] ${
                    lightMode
                      ? 'text-gray-500'
                      : 'text-gray-400'
                  }`}
                >
                  Project details
                </label>

                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about what you're building..."
                  rows={5}
                  required
                  className={`w-full resize-none border-0 border-b bg-transparent px-0 py-3 text-sm leading-7 outline-none transition-colors placeholder:text-gray-500 focus:ring-0 ${
                    lightMode
                      ? 'border-white/10 text-white focus:border-yellow-400'
                      : 'border-gray-900/10 text-gray-900 focus:border-yellow-500'
                  }`}
                />
              </div>

              {/* Submit */}
              <div className="flex items-center justify-between pt-2">

                <p
                  className={`hidden text-[10px] leading-5 sm:block ${
                    lightMode
                      ? 'text-gray-600'
                      : 'text-gray-400'
                  }`}
                >
                  Usually responds within 1–2 business days.
                </p>

                <motion.button
                  type="submit"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group inline-flex items-center gap-3 rounded-full bg-yellow-400 px-6 py-3 text-sm font-semibold text-gray-950 transition-all duration-200 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                >
                  Send message

                  <FiArrowUpRight className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </motion.button>

              </div>
            </form>

            {/* Success state */}
            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -8,
                  }}
                  className={`mt-8 flex items-center gap-3 text-sm ${
                    lightMode
                      ? 'text-green-400'
                      : 'text-green-600'
                  }`}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-400/10">
                    <FiCheck />
                  </span>

                  Thanks — your message has been received.
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* Bottom rule */}
        <div
          className={`mt-24 border-t pt-5 ${
            lightMode
              ? 'border-white/10'
              : 'border-gray-900/10'
          }`}
        >
          <div className="flex items-center justify-between">

            <span
              className={`text-[10px] uppercase tracking-[0.18em] ${
                lightMode
                  ? 'text-gray-600'
                  : 'text-gray-400'
              }`}
            >
              Adeshina Adedokun
            </span>

            <span
              className={`text-[10px] ${
                lightMode
                  ? 'text-gray-600'
                  : 'text-gray-400'
              }`}
            >
              Lagos · Nigeria
            </span>

          </div>
        </div>

      </div>
    </section>
  );
};

export default ContactForm;

