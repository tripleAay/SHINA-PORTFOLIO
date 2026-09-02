'use client';

import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import {
  FiArrowUpRight,
  FiSearch,
  FiX,
} from 'react-icons/fi';
import Image from 'next/image';
import {
  motion,
  AnimatePresence,
} from 'framer-motion';
import { createClient } from '../lib/client';

type PortfolioProject = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  images: string[] | null;
  link: string | null;
  category: string | null;
  technologies: string | null;
  featured: boolean;
  created_at: string;
};

const Portfolio: React.FC = () => {
  const { lightMode } =
    useContext(ThemeContext);

  const [projects, setProjects] =
    useState<PortfolioProject[]>([]);

  const [selectedCategory, setSelectedCategory] =
    useState('All');

  const [selectedImage, setSelectedImage] =
    useState<PortfolioProject | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  /*
   * =========================================
   * LOAD PROJECTS FROM SUPABASE
   * =========================================
   *
   * IMPORTANT:
   *
   * Do NOT create the Supabase client during
   * component rendering.
   *
   * We create it inside useEffect so that the
   * browser client is only initialized after
   * this component has mounted in the browser.
   *
   * This prevents the Vercel build/prerender
   * from trying to initialize the browser
   * Supabase client.
   */
  useEffect(() => {
    let cancelled = false;

    const fetchProjects = async () => {
      setIsLoading(true);
      setError('');

      try {
        const supabase = createClient();

        const {
          data,
          error: supabaseError,
        } = await supabase
          .from('portfolio')
          .select(
            'id, title, description, image, images, link, category, technologies, featured, created_at'
          )
          .order('created_at', {
            ascending: false,
          });

        if (cancelled) return;

        if (supabaseError) {
          console.error(
            'Supabase portfolio error:',
            supabaseError
          );

          throw new Error(
            'Unable to load projects.'
          );
        }

        /*
         * Normalize the images field.
         *
         * New projects use:
         * images: [...]
         *
         * Older projects may only have:
         * image: '...'
         *
         * This keeps both formats working.
         */
        const normalizedProjects =
          (data ?? []).map((project) => ({
            ...project,

            images: Array.isArray(
              project.images
            )
              ? project.images
              : project.image
                ? [project.image]
                : [],
          })) as PortfolioProject[];

        setProjects(
          normalizedProjects
        );
      } catch (err) {
        if (cancelled) return;

        console.error(
          'Portfolio error:',
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load projects.'
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * =========================================
   * BUILD CATEGORY LIST
   * =========================================
   */
  const categories = [
    'All',
    ...Array.from(
      new Set(
        projects
          .map((project) =>
            project.category?.trim()
          )
          .filter(
            (
              category
            ): category is string =>
              Boolean(category)
          )
      )
    ),
  ];

  /*
   * =========================================
   * FILTER PROJECTS
   * =========================================
   */
  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter(
          (project) =>
            project.category?.trim() ===
            selectedCategory
        );

  /*
   * =========================================
   * KEEP CATEGORY VALID
   * =========================================
   */
  useEffect(() => {
    if (
      selectedCategory !== 'All' &&
      !categories.includes(
        selectedCategory
      )
    ) {
      setSelectedCategory('All');
    }
  }, [
    categories,
    selectedCategory,
  ]);

  /*
   * =========================================
   * CLOSE IMAGE PREVIEW WITH ESCAPE
   * =========================================
   */
  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === 'Escape') {
        setSelectedImage(null);
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, []);

  return (
    <section
      id="portfolio"
      aria-labelledby="portfolio-title"
      className={`relative overflow-hidden transition-colors duration-500 ${
        lightMode
          ? 'bg-[#D9CAB3]/40 text-gray-950'
          : 'bg-[#0b0b0d] text-white'
      }`}
    >
      {/* =========================================
          SUBTLE BACKGROUND
      ========================================== */}
      <div
        className={`pointer-events-none absolute inset-0 opacity-[0.018] ${
          lightMode
            ? 'text-black'
            : 'text-white'
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

            <motion.h2
              id="portfolio-title"
              initial={{
                opacity: 0,
                y: 14,
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
              className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-5xl"
            >
              Things I&apos;ve built.
            </motion.h2>

            <motion.p
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
                margin: '-80px',
              }}
              transition={{
                duration: 0.6,
                delay: 0.08,
                ease: 'easeOut',
              }}
              className={`mt-4 max-w-lg text-sm leading-7 sm:text-base ${
                lightMode
                  ? 'text-gray-500'
                  : 'text-gray-500'
              }`}
            >
              A selection of digital
              products, interfaces and
              experiences shaped through
              engineering and design.
            </motion.p>
          </div>

          {/* =========================================
              PROJECT COUNT
          ========================================== */}
          <div
            className={`hidden pb-1 text-right md:block ${
              lightMode
                ? 'text-gray-400'
                : 'text-gray-600'
            }`}
          >
            <span className="text-2xl font-medium tracking-tight">
              {String(
                filteredProjects.length
              ).padStart(2, '0')}
            </span>

            <span className="ml-2 text-[10px] uppercase tracking-[0.18em]">
              projects
            </span>
          </div>
        </div>

        {/* =========================================
            FILTERS
        ========================================== */}
        {!isLoading &&
          !error &&
          projects.length > 0 && (
            <div className="mt-14 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map(
                (category) => {
                  const active =
                    selectedCategory ===
                    category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() =>
                        setSelectedCategory(
                          category
                        )
                      }
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
                }
              )}
            </div>
          )}

        {/* =========================================
            LOADING STATE
        ========================================== */}
        {isLoading && (
          <div className="mt-20 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="animate-pulse"
                >
                  <div
                    className={`aspect-[16/10] rounded-lg ${
                      lightMode
                        ? 'bg-black/[0.05]'
                        : 'bg-white/[0.04]'
                    }`}
                  />

                  <div className="mt-5">
                    <div
                      className={`h-3 w-2/3 rounded ${
                        lightMode
                          ? 'bg-black/[0.06]'
                          : 'bg-white/[0.05]'
                      }`}
                    />

                    <div
                      className={`mt-3 h-2 w-full rounded ${
                        lightMode
                          ? 'bg-black/[0.04]'
                          : 'bg-white/[0.04]'
                      }`}
                    />

                    <div
                      className={`mt-2 h-2 w-4/5 rounded ${
                        lightMode
                          ? 'bg-black/[0.04]'
                          : 'bg-white/[0.04]'
                      }`}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* =========================================
            ERROR STATE
        ========================================== */}
        {!isLoading && error && (
          <div className="mt-20 flex flex-col items-center justify-center py-16 text-center">
            <p
              className={`text-sm ${
                lightMode
                  ? 'text-gray-500'
                  : 'text-gray-400'
              }`}
            >
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-5 rounded-full bg-yellow-400 px-5 py-2.5 text-xs font-semibold text-gray-950 transition-colors hover:bg-yellow-300"
            >
              Try again
            </button>
          </div>
        )}

        {/* =========================================
            EMPTY STATE
        ========================================== */}
        {!isLoading &&
          !error &&
          projects.length === 0 && (
            <div className="mt-20 flex flex-col items-center justify-center py-16 text-center">
              <p
                className={`text-sm ${
                  lightMode
                    ? 'text-gray-500'
                    : 'text-gray-400'
                }`}
              >
                No projects available
                yet.
              </p>
            </div>
          )}

        {/* =========================================
            PROJECT GRID
        ========================================== */}
        {!isLoading &&
          !error &&
          filteredProjects.length >
            0 && (
            <motion.div
              layout
              className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map(
                  (project) => (
                    <motion.article
                      key={project.id}
                      layout
                      initial={{
                        opacity: 0,
                        y: 12,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -12,
                      }}
                      transition={{
                        duration: 0.35,
                        ease: [
                          0.22,
                          1,
                          0.36,
                          1,
                        ],
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
                          {project.image ? (
                            <Image
                              src={
                                project.image
                              }
                              alt={
                                project.title ||
                                'Portfolio project'
                              }
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                            />
                          ) : (
                            <div
                              className={`flex h-full w-full items-center justify-center ${
                                lightMode
                                  ? 'bg-gray-100'
                                  : 'bg-white/[0.03]'
                              }`}
                            >
                              <span
                                className={`text-[10px] uppercase tracking-[0.18em] ${
                                  lightMode
                                    ? 'text-gray-400'
                                    : 'text-gray-600'
                                }`}
                              >
                                No image
                              </span>
                            </div>
                          )}

                          {/* Very light image treatment */}
                          <div className="pointer-events-none absolute inset-0 bg-black/[0.02]" />

                          {/* Hover action */}
                          {project.image && (
                            <div className="absolute right-3 top-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedImage(
                                    project
                                  )
                                }
                                aria-label={`Preview ${project.title}`}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-950 shadow-sm backdrop-blur-sm transition-transform duration-200 hover:scale-105"
                              >
                                <FiSearch
                                  size={13}
                                />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* =================================
                          PROJECT INFORMATION
                      ================================== */}
                      <div className="mt-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3
                                className={`text-sm font-semibold tracking-[-0.015em] ${
                                  lightMode
                                    ? 'text-gray-950'
                                    : 'text-gray-100'
                                }`}
                              >
                                {
                                  project.title
                                }
                              </h3>

                              {project.featured && (
                                <span className="rounded-full bg-yellow-400/10 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-yellow-600 dark:text-yellow-400">
                                  Featured
                                </span>
                              )}
                            </div>

                            <p
                              className={`mt-2 max-w-sm text-xs leading-5 ${
                                lightMode
                                  ? 'text-gray-500'
                                  : 'text-gray-500'
                              }`}
                            >
                              {
                                project.description
                              }
                            </p>
                          </div>

                          {/* External link */}
                          {project.link &&
                            project.link !==
                              '#' && (
                              <a
                                href={
                                  project.link
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Open ${project.title}`}
                                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                                  lightMode
                                    ? 'border-gray-900/10 text-gray-400 hover:border-gray-900/20 hover:bg-gray-950 hover:text-white'
                                    : 'border-white/10 text-gray-500 hover:border-white/20 hover:bg-white hover:text-gray-950'
                                }`}
                              >
                                <FiArrowUpRight
                                  size={
                                    13
                                  }
                                />
                              </a>
                            )}
                        </div>

                        {/* =================================
                            TECHNOLOGIES
                        ================================== */}
                        {project.technologies && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {project.technologies
                              .split(',')
                              .map(
                                (
                                  technology
                                ) =>
                                  technology.trim()
                              )
                              .filter(Boolean)
                              .map(
                                (
                                  technology
                                ) => (
                                  <span
                                    key={`${project.id}-${technology}`}
                                    className={`rounded-full px-2 py-1 text-[8px] font-medium uppercase tracking-[0.12em] ${
                                      lightMode
                                        ? 'bg-black/[0.035] text-gray-500'
                                        : 'bg-white/[0.04] text-gray-500'
                                    }`}
                                  >
                                    {
                                      technology
                                    }
                                  </span>
                                )
                              )}
                          </div>
                        )}

                        {/* =================================
                            CATEGORY
                        ================================== */}
                        {project.category && (
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
                              {
                                project.category
                              }
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.article>
                  )
                )}
              </AnimatePresence>
            </motion.div>
          )}

        {/* =========================================
            FILTER EMPTY STATE
        ========================================== */}
        {!isLoading &&
          !error &&
          projects.length > 0 &&
          filteredProjects.length ===
            0 && (
            <div className="mt-20 flex flex-col items-center justify-center py-16 text-center">
              <p
                className={`text-sm ${
                  lightMode
                    ? 'text-gray-500'
                    : 'text-gray-400'
                }`}
              >
                No projects in this
                category.
              </p>

              <button
                type="button"
                onClick={() =>
                  setSelectedCategory(
                    'All'
                  )
                }
                className="mt-5 text-xs font-semibold text-yellow-500 transition-colors hover:text-yellow-400"
              >
                View all projects
              </button>
            </div>
          )}

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
              Selected work · 2024 —
              2026
            </p>

            <p
              className={`text-[10px] ${
                lightMode
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}
            >
              More projects coming
              soon.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          IMAGE PREVIEW
      ========================================== */}
      <AnimatePresence>
        {selectedImage &&
          selectedImage.image && (
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={() =>
                setSelectedImage(null)
              }
            >
              <motion.div
                className="relative w-full max-w-4xl"
                initial={{
                  opacity: 0,
                  scale: 0.97,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.97,
                }}
                transition={{
                  duration: 0.25,
                  ease: 'easeOut',
                }}
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                <Image
                  src={
                    selectedImage.image
                  }
                  alt={
                    selectedImage.title
                  }
                  width={1200}
                  height={800}
                  className="max-h-[80vh] w-full rounded-lg object-contain"
                />

                <button
                  type="button"
                  onClick={() =>
                    setSelectedImage(null)
                  }
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