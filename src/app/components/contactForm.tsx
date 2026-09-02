'use client';

import React, {
  useContext,
  useState,
} from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import {
  toast,
  ToastContainer,
} from 'react-toastify';
import { createClient } from '../lib/client';

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

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // Prevent accidental double submission
    if (isSubmitting) return;

    // Basic validation
    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!name || !email || !message) {
      toast.error(
        'Please complete all fields before sending.',
        {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: lightMode ? 'light' : 'dark',
        }
      );

      return;
    }

    setIsSubmitting(true);

    try {
      /*
       * IMPORTANT:
       * Create the Supabase browser client only when
       * the user submits the form.
       *
       * This prevents Supabase from being initialized
       * during Next.js/Vercel static prerendering.
       */
      const supabase = createClient();

      const { error: supabaseError } =
        await supabase
          .from('messages')
          .insert([
            {
              name,
              email,
              message,
            },
          ]);

      if (supabaseError) {
        console.error(
          'Supabase error:',
          supabaseError
        );

        toast.error(
          'Unable to send your message. Please try again.',
          {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: lightMode ? 'light' : 'dark',
          }
        );

        return;
      }

      toast.success(
        "Message received. I'll be in touch.",
        {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: lightMode ? 'light' : 'dark',
        }
      );

      // Clear form after successful submission
      setFormData({
        name: '',
        email: '',
        message: '',
      });
    } catch (error) {
      console.error(
        'Contact form error:',
        error
      );

      toast.error(
        'Something went wrong. Please try again.',
        {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: lightMode ? 'light' : 'dark',
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className={`relative overflow-hidden transition-colors duration-500 ${
        lightMode
          ? 'bg-[#D9CAB3]/40 text-gray-950'
          : 'bg-[#0b0b0d] text-white'
      }`}
    >
      {/* =================================
          TOAST NOTIFICATIONS
      ================================== */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme={lightMode ? 'light' : 'dark'}
      />

      {/* =================================
          SUBTLE BACKGROUND GRID
      ================================== */}
      <div
        className={`pointer-events-none absolute inset-0 opacity-[0.025] ${
          lightMode
            ? 'text-black'
            : 'text-white'
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
            initial={{
              opacity: 0,
              y: 18,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              margin: '-80px',
            }}
            transition={{
              duration: 0.6,
              ease: 'easeOut',
            }}
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
            initial={{
              opacity: 0,
              y: 12,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              margin: '-80px',
            }}
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
            Tell me what you&apos;re working on.
            Let&apos;s see where it goes.
          </motion.p>
        </div>

        {/* =================================
            FORM
        ================================== */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: '-60px',
          }}
          transition={{
            duration: 0.7,
            delay: 0.15,
            ease: 'easeOut',
          }}
          className="mt-20 max-w-3xl"
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-10"
          >
            {/* =================================
                NAME + EMAIL
            ================================== */}
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
                  disabled={isSubmitting}
                  className={`w-full border-0 border-b bg-transparent px-0 py-3 text-sm outline-none transition-colors placeholder:text-gray-500 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60 ${
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
                  disabled={isSubmitting}
                  className={`w-full border-0 border-b bg-transparent px-0 py-3 text-sm outline-none transition-colors placeholder:text-gray-500 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60 ${
                    lightMode
                      ? 'border-black/10 text-gray-950 focus:border-yellow-500'
                      : 'border-white/10 text-white focus:border-yellow-400'
                  }`}
                />
              </div>
            </div>

            {/* =================================
                MESSAGE
            ================================== */}
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
                disabled={isSubmitting}
                className={`w-full resize-none border-0 border-b bg-transparent px-0 py-3 text-sm leading-7 outline-none transition-colors placeholder:text-gray-500 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60 ${
                  lightMode
                    ? 'border-black/10 text-gray-950 focus:border-yellow-500'
                    : 'border-white/10 text-white focus:border-yellow-400'
                }`}
              />
            </div>

            {/* =================================
                ACTION
            ================================== */}
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
                disabled={isSubmitting}
                whileHover={
                  !isSubmitting
                    ? { y: -2 }
                    : {}
                }
                whileTap={
                  !isSubmitting
                    ? { scale: 0.98 }
                    : {}
                }
                className="group inline-flex w-fit items-center gap-3 rounded-full bg-yellow-400 px-6 py-3 text-sm font-semibold text-gray-950 transition-colors hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? 'Sending...'
                  : 'Send message'}

                {!isSubmitting && (
                  <FiArrowUpRight
                    className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                )}
              </motion.button>
            </div>
          </form>
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