
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FiArrowUpRight,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from 'react-icons/fi';

export type PortfolioProject = {
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

type ProjectOverviewModalProps = {
  project: PortfolioProject | null;
  lightMode: boolean;
  onClose: () => void;
};

const ease = [0.16, 1, 0.3, 1] as const;

const getTechnologies = (technologies: string | null) => {
  if (!technologies) return [];

  return technologies
    .split(',')
    .map((technology) => technology.trim())
    .filter(Boolean);
};

const getProjectImages = (
  project: PortfolioProject
) => {
  if (
    project.images &&
    project.images.length > 0
  ) {
    return project.images;
  }

  return project.image
    ? [project.image]
    : [];
};

const ProjectOverviewModal: React.FC<
  ProjectOverviewModalProps
> = ({
  project,
  lightMode,
  onClose,
}) => {
  const [imageIndex, setImageIndex] = useState(0);

  const images = project
    ? getProjectImages(project)
    : [];

  useEffect(() => {
    if (!project) return;

    setImageIndex(0);
  }, [project]);

  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === 'Escape') {
        onClose();
      }

      if (
        event.key === 'ArrowLeft' &&
        images.length > 1
      ) {
        setImageIndex((current) =>
          current === 0
            ? images.length - 1
            : current - 1
        );
      }

      if (
        event.key === 'ArrowRight' &&
        images.length > 1
      ) {
        setImageIndex((current) =>
          current === images.length - 1
            ? 0
            : current + 1
        );
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
  }, [
    project,
    images.length,
    onClose,
  ]);

  useEffect(() => {
    if (!project) return;

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow =
        originalOverflow;
    };
  }, [project]);

  if (!project) return null;

  const technologies = getTechnologies(
    project.technologies
  );

  return (
    <AnimatePresence>
      <motion.div
        key={project.id}
        className="fixed inset-0 z-[100] overflow-y-auto bg-black/75 p-4 backdrop-blur-md sm:p-6 lg:p-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-overview-title"
          className={`relative mx-auto my-4 w-full max-w-5xl overflow-hidden rounded-2xl border shadow-2xl sm:my-8 ${
            lightMode
              ? 'border-black/[0.08] bg-[#f8f5ef]'
              : 'border-white/[0.08] bg-[#101012]'
          }`}
          initial={{
            opacity: 0,
            y: 24,
            scale: 0.985,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 16,
            scale: 0.985,
          }}
          transition={{
            duration: 0.45,
            ease,
          }}
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          {/* CLOSE */}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close project overview"
            className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-950 shadow-lg transition-transform duration-200 hover:scale-105"
          >
            <FiX size={16} />
          </button>

          {/* CONTENT */}

          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            {/* IMAGE */}

            <div
              className={`relative ${
                lightMode
                  ? 'bg-gray-100'
                  : 'bg-black'
              }`}
            >
              <div className="relative aspect-[16/11] w-full lg:aspect-auto lg:h-full lg:min-h-[620px]">
                {images.length > 0 ? (
                  <AnimatePresence
                    mode="wait"
                  >
                    <motion.div
                      key={imageIndex}
                      className="absolute inset-0"
                      initial={{
                        opacity: 0,
                        x: 12,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      exit={{
                        opacity: 0,
                        x: -12,
                      }}
                      transition={{
                        duration: 0.25,
                        ease,
                      }}
                    >
                      <Image
                        src={
                          images[
                            imageIndex
                          ]
                        }
                        alt={`${project.title} preview ${imageIndex + 1}`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        className="object-cover"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span
                      className={`font-mono text-[9px] uppercase tracking-[0.18em] ${
                        lightMode
                          ? 'text-gray-400'
                          : 'text-gray-600'
                      }`}
                    >
                      No image
                    </span>
                  </div>
                )}

                {/* IMAGE COUNTER */}

                {images.length > 1 && (
                  <>
                    <div className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                      {String(
                        imageIndex + 1
                      ).padStart(2, '0')}{' '}
                      /{' '}
                      {String(
                        images.length
                      ).padStart(2, '0')}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setImageIndex(
                          (current) =>
                            current === 0
                              ? images.length -
                                1
                              : current - 1
                        )
                      }
                      aria-label="Previous project image"
                      className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-white hover:text-gray-950"
                    >
                      <FiChevronLeft
                        size={18}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setImageIndex(
                          (current) =>
                            current ===
                            images.length - 1
                              ? 0
                              : current + 1
                        )
                      }
                      aria-label="Next project image"
                      className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-white hover:text-gray-950"
                    >
                      <FiChevronRight
                        size={18}
                      />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* INFORMATION */}

            <div className="flex flex-col p-6 sm:p-8 lg:p-10">
              {/* LABEL */}

              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />

                <span
                  className={`font-mono text-[8px] font-medium uppercase tracking-[0.2em] ${
                    lightMode
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  }`}
                >
                  {project.category ||
                    'Project'}
                </span>

                {project.featured && (
                  <span className="rounded-full bg-yellow-400/10 px-2 py-1 text-[7px] font-semibold uppercase tracking-[0.12em] text-yellow-700 dark:text-yellow-400">
                    Featured
                  </span>
                )}
              </div>

              {/* TITLE */}

              <h2
                id="project-overview-title"
                className={`mt-5 text-2xl font-semibold tracking-[-0.045em] sm:text-3xl lg:text-[2.65rem] ${
                  lightMode
                    ? 'text-gray-950'
                    : 'text-white'
                }`}
              >
                {project.title}
                <span className="text-yellow-400">
                  .
                </span>
              </h2>

              {/* OVERVIEW */}

              <div className="mt-8">
                <p
                  className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${
                    lightMode
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  }`}
                >
                  Overview
                </p>

                <p
                  className={`mt-3 text-sm leading-7 ${
                    lightMode
                      ? 'text-gray-600'
                      : 'text-gray-400'
                  }`}
                >
                  {project.description}
                </p>
              </div>

              {/* TECHNOLOGIES */}

              {technologies.length > 0 && (
                <div className="mt-8">
                  <p
                    className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${
                      lightMode
                        ? 'text-gray-400'
                        : 'text-gray-600'
                    }`}
                  >
                    Built with
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {technologies.map(
                      (technology) => (
                        <span
                          key={technology}
                          className={`rounded-full border px-2.5 py-1.5 text-[8px] font-medium uppercase tracking-[0.1em] ${
                            lightMode
                              ? 'border-black/[0.08] bg-black/[0.025] text-gray-500'
                              : 'border-white/[0.07] bg-white/[0.025] text-gray-500'
                          }`}
                        >
                          {technology}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* GALLERY INDICATORS */}

              {images.length > 1 && (
                <div className="mt-8 flex items-center gap-1.5">
                  {images.map(
                    (_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() =>
                          setImageIndex(
                            index
                          )
                        }
                        aria-label={`View image ${index + 1}`}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          index === imageIndex
                            ? 'w-7 bg-yellow-400'
                            : lightMode
                              ? 'w-2 bg-black/15 hover:bg-black/25'
                              : 'w-2 bg-white/15 hover:bg-white/25'
                        }`}
                      />
                    )
                  )}
                </div>
              )}

              {/* SPACER */}

              <div className="flex-1" />

              {/* FOOTER */}

              <div
                className={`mt-10 border-t pt-6 ${
                  lightMode
                    ? 'border-black/[0.07]'
                    : 'border-white/[0.07]'
                }`}
              >
                {project.link &&
                  project.link !== '#' && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] ${
                        lightMode
                          ? 'text-gray-700'
                          : 'text-gray-300'
                      }`}
                    >
                      <span className="transition-colors group-hover:text-yellow-500">
                        Visit project
                      </span>

                      <FiArrowUpRight
                        size={13}
                        className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </a>
                  )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectOverviewModal;
