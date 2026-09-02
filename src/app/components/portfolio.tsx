'use client';

import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { ThemeContext } from '../contexts/ThemeContext';

import {
  FiArrowLeft,
  FiArrowRight,
  FiArrowUpRight,
  FiChevronLeft,
  FiChevronRight,
  FiExternalLink,
  FiX,
} from 'react-icons/fi';

import Image from 'next/image';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';

import { createClient } from '../lib/client';


/* =========================================================
   TYPES
========================================================= */

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


/* =========================================================
   HELPERS
========================================================= */

/**
 * Returns all available project images.
 *
 * New projects:
 * images: [...]
 *
 * Older projects:
 * image: '...'
 */
const getProjectImages = (
  project: PortfolioProject
): string[] => {
  const gallery = Array.isArray(project.images)
    ? project.images.filter(
        (image): image is string =>
          typeof image === 'string' &&
          image.trim().length > 0
      )
    : [];

  if (gallery.length > 0) {
    return gallery;
  }

  if (
    typeof project.image === 'string' &&
    project.image.trim().length > 0
  ) {
    return [project.image];
  }

  return [];
};


/**
 * Converts comma-separated technologies into
 * a clean array.
 */
const getTechnologies = (
  technologies: string | null
): string[] => {
  if (!technologies) return [];

  return technologies
    .split(',')
    .map((technology) => technology.trim())
    .filter(Boolean);
};


/* =========================================================
   PROJECT OVERVIEW MODAL
========================================================= */

type ProjectOverviewModalProps = {
  project: PortfolioProject | null;
  projects: PortfolioProject[];
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

const ProjectOverviewModal: React.FC<
  ProjectOverviewModalProps
> = ({
  project,
  projects,
  onClose,
  onPrevious,
  onNext,
}) => {
  const [activeImage, setActiveImage] =
    useState(0);

  const images = useMemo(
    () =>
      project
        ? getProjectImages(project)
        : [],
    [project]
  );

  const technologies = useMemo(
    () =>
      project
        ? getTechnologies(
            project.technologies
          )
        : [],
    [project]
  );

  const currentProjectIndex = project
    ? projects.findIndex(
        (item) => item.id === project.id
      )
    : -1;

  const hasPreviousProject =
    currentProjectIndex > 0;

  const hasNextProject =
    currentProjectIndex >= 0 &&
    currentProjectIndex <
      projects.length - 1;


  /* =======================================================
     RESET IMAGE WHEN PROJECT CHANGES
  ======================================================= */

  useEffect(() => {
    setActiveImage(0);
  }, [project?.id]);


  /* =======================================================
     KEYBOARD CONTROLS + BODY LOCK
  ======================================================= */

  useEffect(() => {
    if (!project) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (
        event.key === 'ArrowLeft' &&
        images.length > 1
      ) {
        setActiveImage(
          (current) =>
            current === 0
              ? images.length - 1
              : current - 1
        );

        return;
      }

      if (
        event.key === 'ArrowRight' &&
        images.length > 1
      ) {
        setActiveImage(
          (current) =>
            current === images.length - 1
              ? 0
              : current + 1
        );

        return;
      }

      if (
        event.key === 'ArrowUp' &&
        hasPreviousProject
      ) {
        onPrevious();
        return;
      }

      if (
        event.key === 'ArrowDown' &&
        hasNextProject
      ) {
        onNext();
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [
    project,
    images.length,
    hasPreviousProject,
    hasNextProject,
    onClose,
    onPrevious,
    onNext,
  ]);


  /* =======================================================
     NO PROJECT
  ======================================================= */

  if (!project) {
    return null;
  }


  /* =======================================================
     IMAGE NAVIGATION
  ======================================================= */

  const showPreviousImage = () => {
    setActiveImage(
      (current) =>
        current === 0
          ? images.length - 1
          : current - 1
    );
  };

  const showNextImage = () => {
    setActiveImage(
      (current) =>
        current === images.length - 1
          ? 0
          : current + 1
    );
  };


  /* =======================================================
     MODAL
  ======================================================= */

  return (
    <AnimatePresence>
      <motion.div
        key={project.id}
        className="fixed inset-0 z-[100] overflow-y-auto bg-black/75 p-4 backdrop-blur-md sm:p-6 lg:p-10"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        transition={{
          duration: 0.25,
          ease: 'easeOut',
        }}
        onClick={onClose}
      >
        <div className="flex min-h-full items-center justify-center">
          <motion.div
            className="relative w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#111113]"
            initial={{
              opacity: 0,
              y: 18,
              scale: 0.985,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 12,
              scale: 0.985,
            }}
            transition={{
              duration: 0.3,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* =================================================
                CLOSE BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close project overview"
              className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-black/80"
            >
              <FiX size={16} />
            </button>


            {/* =================================================
                PROJECT CONTENT
            ================================================= */}

            <div className="grid lg:grid-cols-[1.35fr_0.65fr]">


              {/* ===============================================
                  IMAGE AREA
              ================================================ */}

              <div className="relative bg-[#09090b]">

                <div className="relative aspect-[16/11] w-full overflow-hidden sm:aspect-[16/10] lg:aspect-auto lg:min-h-[650px]">

                  {images.length > 0 ? (
                    <AnimatePresence
                      mode="wait"
                    >
                      <motion.div
                        key={`${project.id}-${activeImage}`}
                        className="absolute inset-0"
                        initial={{
                          opacity: 0,
                        }}
                        animate={{
                          opacity: 1,
                        }}
                        exit={{
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.2,
                        }}
                      >
                        <Image
                          src={
                            images[
                              activeImage
                            ]
                          }
                          alt={`${project.title} — image ${
                            activeImage + 1
                          }`}
                          fill
                          priority
                          sizes="(max-width: 1024px) 100vw, 65vw"
                          className="object-cover"
                        />
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <div className="flex h-full min-h-[300px] items-center justify-center">
                      <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">
                        No project image
                      </span>
                    </div>
                  )}


                  {/* =========================================
                      IMAGE GRADIENT
                  ========================================== */}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />


                  {/* =========================================
                      IMAGE COUNTER
                  ========================================== */}

                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-4 rounded-full bg-black/55 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.16em] text-white/80 backdrop-blur-md">
                      {String(
                        activeImage + 1
                      ).padStart(2, '0')}{' '}
                      /{' '}
                      {String(
                        images.length
                      ).padStart(2, '0')}
                    </div>
                  )}


                  {/* =========================================
                      IMAGE ARROWS
                  ========================================== */}

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={
                          showPreviousImage
                        }
                        aria-label="Previous project image"
                        className="absolute left-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-black/75"
                      >
                        <FiChevronLeft
                          size={17}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={
                          showNextImage
                        }
                        aria-label="Next project image"
                        className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-black/75"
                      >
                        <FiChevronRight
                          size={17}
                        />
                      </button>
                    </>
                  )}

                </div>


                {/* =============================================
                    THUMBNAILS
                ============================================== */}

                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto border-t border-white/[0.06] bg-[#09090b] p-3 scrollbar-hide">
                    {images.map(
                      (
                        image,
                        index
                      ) => (
                        <button
                          key={`${project.id}-thumb-${index}`}
                          type="button"
                          onClick={() =>
                            setActiveImage(
                              index
                            )
                          }
                          aria-label={`Show image ${
                            index + 1
                          }`}
                          className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md transition-all duration-200 ${
                            activeImage ===
                            index
                              ? 'ring-2 ring-yellow-400'
                              : 'opacity-45 hover:opacity-80'
                          }`}
                        >
                          <Image
                            src={image}
                            alt=""
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </button>
                      )
                    )}
                  </div>
                )}

              </div>


              {/* ===============================================
                  INFORMATION AREA
              ================================================ */}

              <div className="flex flex-col">

                <div className="flex-1 p-6 sm:p-8 lg:p-10">

                  {/* =========================================
                      PROJECT META
                  ========================================== */}

                  <div className="flex items-center gap-3">

                    {project.category && (
                      <span className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />

                        {project.category}
                      </span>
                    )}

                    {project.featured && (
                      <span className="rounded-full bg-yellow-400/10 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-yellow-600 dark:text-yellow-400">
                        Featured
                      </span>
                    )}

                  </div>


                  {/* =========================================
                      TITLE
                  ========================================== */}

                  <h2 className="mt-5 max-w-md text-3xl font-semibold tracking-[-0.045em] text-gray-950 sm:text-4xl dark:text-white">
                    {project.title}
                  </h2>


                  {/* =========================================
                      DESCRIPTION
                  ========================================== */}

                  <div className="mt-8">

                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600">
                      Overview
                    </p>

                    <p className="mt-3 text-sm leading-7 text-gray-500 dark:text-gray-400">
                      {project.description}
                    </p>

                  </div>


                  {/* =========================================
                      TECHNOLOGIES
                  ========================================== */}

                  {technologies.length > 0 && (
                    <div className="mt-9">

                      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600">
                        Built with
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {technologies.map(
                          (
                            technology
                          ) => (
                            <span
                              key={`${project.id}-${technology}`}
                              className="rounded-full border border-gray-900/[0.07] bg-gray-950/[0.025] px-3 py-1.5 text-[9px] font-medium text-gray-500 dark:border-white/[0.07] dark:bg-white/[0.03] dark:text-gray-400"
                            >
                              {
                                technology
                              }
                            </span>
                          )
                        )}
                      </div>

                    </div>
                  )}


                  {/* =========================================
                      PROJECT LINK
                  ========================================== */}

                  {project.link &&
                    project.link !== '#' && (
                      <div className="mt-10">

                        <a
                          href={
                            project.link
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-3 rounded-full bg-gray-950 px-5 py-3 text-xs font-semibold text-white transition-all duration-200 hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
                        >
                          Visit project

                          <FiArrowUpRight
                            size={14}
                            className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          />
                        </a>

                      </div>
                    )}

                </div>


                {/* =============================================
                    PROJECT NAVIGATION
                ============================================== */}

                <div className="border-t border-gray-900/[0.07] p-5 dark:border-white/[0.07]">

                  <div className="flex items-center justify-between">

                    <button
                      type="button"
                      onClick={
                        onPrevious
                      }
                      disabled={
                        !hasPreviousProject
                      }
                      className="group flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-gray-400 transition-colors hover:text-gray-950 disabled:pointer-events-none disabled:opacity-20 dark:hover:text-white"
                    >
                      <FiArrowLeft
                        size={13}
                        className="transition-transform duration-200 group-hover:-translate-x-1"
                      />

                      Previous
                    </button>


                    <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-gray-300 dark:text-gray-700">
                      {currentProjectIndex +
                        1}{' '}
                      /{' '}
                      {projects.length}
                    </span>


                    <button
                      type="button"
                      onClick={onNext}
                      disabled={
                        !hasNextProject
                      }
                      className="group flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-gray-400 transition-colors hover:text-gray-950 disabled:pointer-events-none disabled:opacity-20 dark:hover:text-white"
                    >
                      Next

                      <FiArrowRight
                        size={13}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </button>

                  </div>

                </div>

              </div>

            </div>

          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};


/* =========================================================
   PORTFOLIO
========================================================= */

const Portfolio: React.FC = () => {
  const { lightMode } =
    useContext(ThemeContext);

  const [
    projects,
    setProjects,
  ] = useState<PortfolioProject[]>([]);

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState('All');

  const [
    selectedProject,
    setSelectedProject,
  ] =
    useState<PortfolioProject | null>(
      null
    );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');


  /* =========================================================
     LOAD PROJECTS
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const fetchProjects =
      async () => {
        setIsLoading(true);
        setError('');

        try {
          const supabase =
            createClient();

          const {
            data,
            error: supabaseError,
          } = await supabase
            .from('portfolio')
            .select(
              'id, title, description, image, images, link, category, technologies, featured, created_at'
            )
            .order(
              'created_at',
              {
                ascending: false,
              }
            );

          if (cancelled) return;

          if (supabaseError) {
            console.error(
              'SUPABASE PORTFOLIO ERROR:',
              {
                message:
                  supabaseError.message,
                details:
                  supabaseError.details,
                hint:
                  supabaseError.hint,
                code:
                  supabaseError.code,
              }
            );

            throw new Error(
              supabaseError.message ||
                'Unable to load projects.'
            );
          }


          /* ===============================================
             NORMALIZE PROJECT DATA
          ================================================ */

          const normalizedProjects =
            (data ?? []).map(
              (project) => ({
                ...project,

                images:
                  Array.isArray(
                    project.images
                  )
                    ? project.images
                    : project.image
                      ? [
                          project.image,
                        ]
                      : [],
              })
            ) as PortfolioProject[];


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


  /* =========================================================
     CATEGORIES
  ========================================================= */

  const categories =
    useMemo(() => {
      const uniqueCategories =
        Array.from(
          new Set(
            projects
              .map(
                (project) =>
                  project.category?.trim()
              )
              .filter(
                (
                  category
                ): category is string =>
                  Boolean(category)
              )
          )
        );

      return [
        'All',
        ...uniqueCategories,
      ];
    }, [projects]);


  /* =========================================================
     FILTERED PROJECTS
  ========================================================= */

  const filteredProjects =
    useMemo(() => {
      if (
        selectedCategory ===
        'All'
      ) {
        return projects;
      }

      return projects.filter(
        (project) =>
          project.category?.trim() ===
          selectedCategory
      );
    }, [
      projects,
      selectedCategory,
    ]);


  /* =========================================================
     KEEP FILTER VALID
  ========================================================= */

  useEffect(() => {
    if (
      selectedCategory !==
        'All' &&
      !categories.includes(
        selectedCategory
      )
    ) {
      setSelectedCategory(
        'All'
      );
    }
  }, [
    categories,
    selectedCategory,
  ]);


  /* =========================================================
     SELECTED PROJECT NAVIGATION
  ========================================================= */

  const openProject = (
    project: PortfolioProject
  ) => {
    setSelectedProject(
      project
    );
  };


  const closeProject = () => {
    setSelectedProject(
      null
    );
  };


  const goToPreviousProject =
    () => {
      if (
        !selectedProject
      ) {
        return;
      }

      const currentIndex =
        projects.findIndex(
          (project) =>
            project.id ===
            selectedProject.id
        );

      if (
        currentIndex <= 0
      ) {
        return;
      }

      setSelectedProject(
        projects[
          currentIndex - 1
        ]
      );
    };


  const goToNextProject =
    () => {
      if (
        !selectedProject
      ) {
        return;
      }

      const currentIndex =
        projects.findIndex(
          (project) =>
            project.id ===
            selectedProject.id
        );

      if (
        currentIndex < 0 ||
        currentIndex >=
          projects.length - 1
      ) {
        return;
      }

      setSelectedProject(
        projects[
          currentIndex + 1
        ]
      );
    };


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      <section
        id="portfolio"
        aria-labelledby="portfolio-title"
        className={`relative overflow-hidden transition-colors duration-500 ${
          lightMode
            ? 'bg-[#D9CAB3]/40 text-gray-950'
            : 'bg-[#0b0b0d] text-white'
        }`}
      >

        {/* ===================================================
            SUBTLE BACKGROUND GRID
        ==================================================== */}

        <div
          className={`pointer-events-none absolute inset-0 opacity-[0.018] ${
            lightMode
              ? 'text-black'
              : 'text-white'
          }`}
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize:
              '90px 90px',
          }}
        />


        <div className="relative mx-auto max-w-6xl px-6 py-28 sm:px-8 lg:px-10 lg:py-36">


          {/* =================================================
              INTRO
          ================================================== */}

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
                  margin:
                    '-80px',
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
                  margin:
                    '-80px',
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.08,
                  ease: 'easeOut',
                }}
                className="mt-4 max-w-lg text-sm leading-7 text-gray-500 sm:text-base"
              >
                A selection of digital
                products, interfaces and
                experiences shaped through
                engineering and design.
              </motion.p>

            </div>


            {/* =============================================
                PROJECT COUNT
            ============================================== */}

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
                ).padStart(
                  2,
                  '0'
                )}
              </span>

              <span className="ml-2 text-[10px] uppercase tracking-[0.18em]">
                projects
              </span>

            </div>

          </div>


          {/* =================================================
              FILTERS
          ================================================== */}

          {!isLoading &&
            !error &&
            projects.length >
              0 && (

              <div className="mt-14 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">

                {categories.map(
                  (category) => {
                    const active =
                      selectedCategory ===
                      category;

                    return (
                      <button
                        key={
                          category
                        }
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
                        {
                          category
                        }
                      </button>
                    );
                  }
                )}

              </div>
            )}


          {/* =================================================
              LOADING
          ================================================== */}

          {isLoading && (
            <div className="mt-20 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">

              {[
                1,
                2,
                3,
              ].map(
                (item) => (
                  <div
                    key={item}
                    className="animate-pulse"
                  >

                    <div
                      className={`aspect-[16/10] rounded-xl ${
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
                        className={`mt-3 h-2 w-1/3 rounded ${
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


          {/* =================================================
              ERROR
          ================================================== */}

          {!isLoading &&
            error && (

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


          {/* =================================================
              EMPTY
          ================================================== */}

          {!isLoading &&
            !error &&
            projects.length ===
              0 && (

              <div className="mt-20 flex flex-col items-center justify-center py-16 text-center">

                <p
                  className={`text-sm ${
                    lightMode
                      ? 'text-gray-500'
                      : 'text-gray-400'
                  }`}
                >
                  No projects
                  available yet.
                </p>

              </div>
            )}


          {/* =================================================
              PROJECT GRID
          ================================================== */}

          {!isLoading &&
            !error &&
            filteredProjects.length >
              0 && (

              <motion.div
                layout
                className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3"
              >

                <AnimatePresence mode="popLayout">

                  {filteredProjects.map(
                    (project) => {

                      const images =
                        getProjectImages(
                          project
                        );

                      const previewImage =
                        images[0] ??
                        project.image;

                      return (
                        <motion.article
                          key={
                            project.id
                          }
                          layout
                          initial={{
                            opacity: 0,
                            y: 14,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          exit={{
                            opacity: 0,
                            y: -10,
                          }}
                          transition={{
                            duration: 0.4,
                            ease: [
                              0.22,
                              1,
                              0.36,
                              1,
                            ],
                          }}
                          className="group cursor-pointer"
                          onClick={() =>
                            openProject(
                              project
                            )
                          }
                        >

                          {/* =================================
                              IMAGE
                          ================================== */}

                          <div
                            className={`relative overflow-hidden rounded-xl ${
                              lightMode
                                ? 'bg-gray-100'
                                : 'bg-white/[0.03]'
                            }`}
                          >

                            <div className="relative aspect-[16/10] overflow-hidden">

                              {previewImage ? (
                                <Image
                                  src={
                                    previewImage
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


                              {/* =================================
                                  IMAGE OVERLAY
                              ================================== */}

                              <div className="pointer-events-none absolute inset-0 bg-black/[0.02] transition-colors duration-500 group-hover:bg-black/[0.08]" />


                              {/* =================================
                                  VIEW INDICATOR
                              ================================== */}

                              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">

                                <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-gray-950 shadow-lg backdrop-blur-md">

                                  View project

                                  <FiArrowUpRight
                                    size={13}
                                  />

                                </div>

                              </div>


                              {/* =================================
                                  IMAGE COUNT
                              ================================== */}

                              {images.length >
                                1 && (
                                <div className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-[8px] font-medium uppercase tracking-[0.12em] text-white/80 backdrop-blur-md">
                                  {images.length}{' '}
                                  images
                                </div>
                              )}

                            </div>

                          </div>


                          {/* =================================
                              MINIMAL PROJECT INFO
                          ================================== */}

                          <div className="mt-4">

                            <div className="flex items-start justify-between gap-4">

                              <div className="min-w-0">

                                <div className="flex items-center gap-2">

                                  <h3
                                    className={`truncate text-sm font-semibold tracking-[-0.015em] ${
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
                                    <span className="shrink-0 rounded-full bg-yellow-400/10 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-yellow-600 dark:text-yellow-400">
                                      Featured
                                    </span>
                                  )}

                                </div>


                                {project.category && (
                                  <div className="mt-2 flex items-center gap-2">

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


                              {/* =================================
                                  ARROW
                              ================================== */}

                              <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                                  lightMode
                                    ? 'border-gray-900/[0.08] text-gray-400 group-hover:border-gray-950 group-hover:bg-gray-950 group-hover:text-white'
                                    : 'border-white/[0.08] text-gray-500 group-hover:border-white/20 group-hover:bg-white group-hover:text-gray-950'
                                }`}
                              >
                                <FiArrowUpRight
                                  size={14}
                                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                />
                              </div>

                            </div>

                          </div>

                        </motion.article>
                      );
                    }
                  )}

                </AnimatePresence>

              </motion.div>
            )}


          {/* =================================================
              FILTER EMPTY
          ================================================== */}

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


          {/* =================================================
              BOTTOM STATEMENT
          ================================================== */}

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
                Selected work ·
                2024 — 2026
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

      </section>


      {/* =====================================================
          PROJECT OVERVIEW
      ====================================================== */}

      <ProjectOverviewModal
        project={
          selectedProject
        }
        projects={projects}
        onClose={
          closeProject
        }
        onPrevious={
          goToPreviousProject
        }
        onNext={
          goToNextProject
        }
      />

    </>
  );
};


export default Portfolio;