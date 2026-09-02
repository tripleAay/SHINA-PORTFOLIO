'use client';

import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';

import { ThemeContext } from '../contexts/ThemeContext';
import { createClient } from '../lib/client';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ease = [0.16, 1, 0.3, 1] as const;

const ContactForm: React.FC = () => {
  const { lightMode } = useContext(ThemeContext);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const showToast = (
    type: 'success' | 'error',
    message: string
  ) => {
    const options = {
      position: 'top-right' as const,
      autoClose: type === 'success' ? 5000 : 7000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: lightMode ? 'light' : ('dark' as const),
    };

    if (type === 'success') {
      toast.success(message, options);
    } else {
      toast.error(message, options);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!name || !email || !message) {
      showToast(
        'error',
        'Please complete all fields before sending.'
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      showToast(
        'error',
        'Please enter a valid email address.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const { error: supabaseError } = await supabase
        .from('messages')
        .insert({
          name,
          email,
          message,
        });

      if (supabaseError) {
        const errorMessage =
          typeof supabaseError.message === 'string'
            ? supabaseError.message
            : '';

        const errorDetails =
          typeof supabaseError.details === 'string'
            ? supabaseError.details
            : '';

        const errorHint =
          typeof supabaseError.hint === 'string'
            ? supabaseError.hint
            : '';

        const errorCode =
          typeof supabaseError.code === 'string'
            ? supabaseError.code
            : '';

        const errorStatus =
          'status' in supabaseError &&
          typeof (
            supabaseError as {
              status?: unknown;
            }
          ).status === 'number'
            ? String(
                (
                  supabaseError as {
                    status?: number;
                  }
                ).status
              )
            : '';

        /*
         * Diagnostic information.
         *
         * This intentionally uses string concatenation instead
         * of nested template literals so there is no parsing
         * ambiguity in this section.
         */
        const diagnosticMessage = [
          '[Supabase contact form]',
          '',
          'Message: ' +
            (errorMessage || 'No message returned'),
          'Details: ' +
            (errorDetails || 'No details returned'),
          'Hint: ' +
            (errorHint || 'No hint returned'),
          'Code: ' +
            (errorCode || 'No code returned'),
          'Status: ' +
            (errorStatus || 'No status returned'),
        ].join('\n');

        console.log(diagnosticMessage);

        let userMessage =
          errorMessage ||
          'Unable to send your message. Please try again.';

        /*
         * Row Level Security
         */
        if (
          errorCode === '42501' ||
          errorMessage
            .toLowerCase()
            .includes('row-level security') ||
          errorMessage
            .toLowerCase()
            .includes('permission denied')
        ) {
          userMessage =
            'Your message could not be sent because the contact form permissions need to be configured in Supabase.';
        }

        /*
         * Missing column / schema mismatch
         */
        if (
          errorCode === 'PGRST204' ||
          errorMessage
            .toLowerCase()
            .includes('column') ||
          errorMessage
            .toLowerCase()
            .includes('schema cache')
        ) {
          userMessage =
            'The contact form does not match the current messages table in Supabase.';
        }

        /*
         * Missing messages table
         */
        if (
          errorCode === '42P01' ||
          (
            errorMessage
              .toLowerCase()
              .includes('relation') &&
            errorMessage
              .toLowerCase()
              .includes('does not exist')
          )
        ) {
          userMessage =
            'The messages table could not be found in Supabase.';
        }

        /*
         * Authentication error
         */
        if (
          errorCode === '401' ||
          errorStatus === '401'
        ) {
          userMessage =
            'The contact form could not authenticate with Supabase. Please try again.';
        }

        /*
         * Supabase server error
         */
        if (
          errorStatus === '500' ||
          errorCode === 'PGRST500'
        ) {
          userMessage =
            'Supabase is temporarily unavailable. Please try again shortly.';
        }

        showToast('error', userMessage);

        return;
      }

      /*
       * Successful submission
       */
      showToast(
        'success',
        "Message received. I'll be in touch."
      );

      setFormData({
        name: '',
        email: '',
        message: '',
      });
    } catch (error) {
      let errorMessage =
        'Something went wrong. Please try again.';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else {
        try {
          const serializedError = JSON.stringify(
            error,
            Object.getOwnPropertyNames(
              Object(error)
            ),
            2
          );

          if (
            serializedError &&
            serializedError !== '{}'
          ) {
            errorMessage = serializedError;
          }
        } catch {
          // Keep the default error message.
        }
      }

      console.log(
        '[Contact form unexpected error]',
        errorMessage
      );

      showToast('error', errorMessage);
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
          ? 'bg-[#D9CAB3] text-gray-950'
          : 'bg-[#0b0b0d] text-white'
      }`}
    >
      <ToastContainer />

      {/* Background grid */}
      <div
        className={`pointer-events-none absolute inset-0 ${
          lightMode
            ? 'text-black/[0.035]'
            : 'text-white/[0.02]'
        }`}
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Subtle glow */}
      <div
        className={`pointer-events-none absolute left-1/2 top-[35%] h-[420px] w-[420px] -translate-x-1/2 rounded-full blur-3xl ${
          lightMode
            ? 'bg-yellow-400/[0.045]'
            : 'bg-yellow-400/[0.025]'
        }`}
      />

      <div className="relative mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        {/* Section label */}
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
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
            duration: 0.5,
            ease,
          }}
          className="mb-12 flex items-center justify-center gap-3 sm:justify-start"
        >
          <span className="h-px w-6 bg-yellow-400" />

          <span
            className={`font-mono text-[9px] font-semibold uppercase tracking-[0.22em] ${
              lightMode
                ? 'text-[#3f3932]'
                : 'text-gray-500'
            }`}
          >
            Contact
          </span>
        </motion.div>

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center sm:mx-0 sm:text-left">
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
              margin: '-60px',
            }}
            transition={{
              duration: 0.6,
              ease,
            }}
            className={`text-[2.45rem] font-semibold leading-[1.03] tracking-[-0.055em] sm:text-5xl md:text-6xl ${
              lightMode
                ? 'text-[#171513]'
                : 'text-white'
            }`}
          >
            Have something
            <br />

            <span className="text-yellow-500">
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
              margin: '-60px',
            }}
            transition={{
              duration: 0.5,
              delay: 0.08,
              ease,
            }}
            className={`mx-auto mt-5 max-w-md text-[13px] leading-6 sm:mx-0 sm:text-base sm:leading-7 ${
              lightMode
                ? 'text-[#514a41]'
                : 'text-gray-400'
            }`}
          >
            Tell me what you&apos;re working on. Let&apos;s
            see where it goes.
          </motion.p>
        </div>

        {/* Form */}
        <motion.div
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
            margin: '-50px',
          }}
          transition={{
            duration: 0.6,
            delay: 0.12,
            ease,
          }}
          className="mx-auto mt-14 max-w-3xl sm:mx-0 sm:mt-16"
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-9 sm:space-y-10"
          >
            {/* Name + Email */}
            <div className="grid gap-8 sm:grid-cols-2 sm:gap-10">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className={`mb-3 block text-[10px] font-bold uppercase tracking-[0.18em] ${
                    lightMode
                      ? 'text-[#3f3932]'
                      : 'text-gray-500'
                  }`}
                >
                  Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  autoComplete="name"
                  disabled={isSubmitting}
                  className={`w-full border-0 border-b bg-transparent px-0 py-3.5 text-base outline-none transition-all duration-300 placeholder:text-[13px] placeholder:opacity-60 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm ${
                    lightMode
                      ? 'border-black/20 text-[#171513] placeholder:text-[#514a41] focus:border-yellow-600'
                      : 'border-white/10 text-white placeholder:text-gray-500 focus:border-yellow-400'
                  }`}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className={`mb-3 block text-[10px] font-bold uppercase tracking-[0.18em] ${
                    lightMode
                      ? 'text-[#3f3932]'
                      : 'text-gray-500'
                  }`}
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={isSubmitting}
                  className={`w-full border-0 border-b bg-transparent px-0 py-3.5 text-base outline-none transition-all duration-300 placeholder:text-[13px] placeholder:opacity-60 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm ${
                    lightMode
                      ? 'border-black/20 text-[#171513] placeholder:text-[#514a41] focus:border-yellow-600'
                      : 'border-white/10 text-white placeholder:text-gray-500 focus:border-yellow-400'
                  }`}
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className={`mb-3 block text-[10px] font-bold uppercase tracking-[0.18em] ${
                  lightMode
                    ? 'text-[#3f3932]'
                    : 'text-gray-500'
                }`}
              >
                Message
              </label>

              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me a little about the project..."
                disabled={isSubmitting}
                className={`w-full resize-none border-0 border-b bg-transparent px-0 py-3.5 text-base leading-7 outline-none transition-all duration-300 placeholder:text-[13px] placeholder:opacity-60 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm ${
                  lightMode
                    ? 'border-black/20 text-[#171513] placeholder:text-[#514a41] focus:border-yellow-600'
                    : 'border-white/10 text-white placeholder:text-gray-500 focus:border-yellow-400'
                }`}
              />
            </div>

            {/* Availability + Submit */}
            <div className="flex flex-col items-center gap-6 pt-1 sm:flex-row sm:items-center sm:justify-between">
              {/* Availability */}
              <div
                className={`flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] ${
                  lightMode
                    ? 'text-[#514a41]'
                    : 'text-gray-500'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="availability-blink absolute inline-flex h-full w-full rounded-full bg-green-500" />

                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>

                Available for selected projects
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={
                  !isSubmitting
                    ? {
                        y: -2,
                      }
                    : undefined
                }
                whileTap={
                  !isSubmitting
                    ? {
                        scale: 0.98,
                      }
                    : undefined
                }
                transition={{
                  duration: 0.2,
                }}
                className={`group inline-flex w-full items-center justify-center gap-3 rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${
                  lightMode
                    ? 'bg-[#171513] text-white hover:bg-[#29251f]'
                    : 'bg-yellow-400 text-gray-950 hover:bg-yellow-300'
                }`}
              >
                {isSubmitting
                  ? 'Sending...'
                  : 'Send message'}

                {!isSubmitting && (
                  <FiArrowUpRight className="text-base transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Footer signal */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
            margin: '-40px',
          }}
          transition={{
            duration: 0.5,
            delay: 0.15,
            ease,
          }}
          className={`mt-16 flex flex-col items-center gap-2 border-t pt-5 text-center sm:mt-20 sm:flex-row sm:items-center sm:justify-between sm:text-left ${
            lightMode
              ? 'border-black/15'
              : 'border-white/[0.07]'
          }`}
        >
          <span
            className={`font-mono text-[8px] uppercase tracking-[0.16em] ${
              lightMode
                ? 'text-[#71685d]'
                : 'text-gray-600'
            }`}
          >
            Adeshina Adedokun
          </span>

          <span
            className={`font-mono text-[8px] uppercase tracking-[0.16em] ${
              lightMode
                ? 'text-[#71685d]'
                : 'text-gray-600'
            }`}
          >
            Lagos · Nigeria
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;