"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import {
  FiArrowUpRight,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";

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

type Props = {
  project: PortfolioProject | null;
  lightMode: boolean;
  onClose: () => void;
};

export function getProjectImages(project: PortfolioProject): string[] {
  return Array.from(
    new Set(
      [
        project.image,
        ...(Array.isArray(project.images) ? project.images : []),
      ].filter(
        (image): image is string =>
          typeof image === "string" && image.trim().length > 0,
      ),
    ),
  );
}

function safeLink(value: string | null) {
  if (!value) return null;

  try {
    const url = new URL(value);

    return ["https:", "http:"].includes(url.protocol)
      ? url.href
      : null;
  } catch {
    return null;
  }
}

function ProjectDialog({
  project,
  lightMode,
  onClose,
}: {
  project: PortfolioProject;
  lightMode: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const [activeImage, setActiveImage] = useState(0);
  const [failedImages, setFailedImages] = useState<string[]>([]);

  const images = getProjectImages(project);
  const currentImage = images[activeImage];
  const link = safeLink(project.link);

  const technologies = Array.from(
    new Set(
      (project.technologies ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    dialog.showModal();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;

      if (
        previousFocus instanceof HTMLElement &&
        previousFocus.isConnected
      ) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, []);

  function changeImage(direction: number) {
    if (images.length < 2) return;

    setActiveImage(
      (current) =>
        (current + direction + images.length) % images.length,
    );
  }

  const muted = lightMode ? "text-zinc-600" : "text-zinc-400";
  const border = lightMode ? "border-black/10" : "border-white/10";

  const controlClass =
    "inline-flex h-11 w-11 shrink-0 items-center justify-center " +
    "rounded-full transition-colors focus-visible:outline-none " +
    "focus-visible:ring-2 focus-visible:ring-yellow-500 " +
    (lightMode ? "hover:bg-black/5" : "hover:bg-white/10");

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;

        const rect = event.currentTarget.getBoundingClientRect();

        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        ) {
          onClose();
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" && images.length > 1) {
          event.preventDefault();
          changeImage(-1);
        }

        if (event.key === "ArrowRight" && images.length > 1) {
          event.preventDefault();
          changeImage(1);
        }
      }}
      className={`project-dialog fixed inset-0 m-auto max-h-[90dvh] max-w-[820px] overflow-y-auto overscroll-contain rounded-2xl border p-0 shadow-2xl backdrop:bg-black/60 ${
        lightMode
          ? "border-black/10 bg-[#FAF8F4] text-zinc-950"
          : "border-white/10 bg-[#111113] text-white"
      }`}
      style={{ width: "calc(100% - 24px)" }}
    >
      <div className="flex w-full min-w-0 flex-col">
        <header
          className={`sticky top-0 z-20 flex items-center justify-between gap-4 border-b px-4 py-1.5 ${border} ${
            lightMode ? "bg-[#FAF8F4]" : "bg-[#111113]"
          }`}
        >
          <p
            className={`text-[10px] font-medium uppercase tracking-[0.16em] ${muted}`}
          >
            {project.category || "Selected project"}
          </p>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close project"
            className={controlClass}
          >
            <FiX size={18} aria-hidden="true" />
          </button>
        </header>

        {/* Full-width image. No information sidebar. */}
        {images.length > 0 && (
          <section
            aria-label="Project gallery"
            className={`w-full min-w-0 ${
              lightMode ? "bg-[#EEECE7]" : "bg-[#080809]"
            }`}
          >
            <div className="relative h-[250px] w-full sm:h-[380px]">
              {currentImage && !failedImages.includes(currentImage) ? (
                <Image
                  key={currentImage}
                  src={currentImage}
                  alt={`${project.title} — image ${activeImage + 1}`}
                  fill
                  sizes="(max-width: 844px) calc(100vw - 24px), 820px"
                  className="object-contain"
                  onError={() =>
                    setFailedImages((current) =>
                      current.includes(currentImage)
                        ? current
                        : [...current, currentImage],
                    )
                  }
                />
              ) : (
                <div
                  role="status"
                  className={`flex h-full items-center justify-center text-xs ${muted}`}
                >
                  Preview unavailable
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div
                className={`flex items-center gap-1 border-t px-2 py-2 sm:gap-2 sm:px-3 ${border}`}
              >
                <button
                  type="button"
                  onClick={() => changeImage(-1)}
                  aria-label="Previous image"
                  className={controlClass}
                >
                  <FiChevronLeft size={18} aria-hidden="true" />
                </button>

                <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto p-1">
                  {images.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      aria-label={`Show image ${index + 1}`}
                      aria-pressed={index === activeImage}
                      className={`relative h-11 w-16 shrink-0 overflow-hidden rounded-md border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 ${
                        index === activeImage
                          ? "border-yellow-500 opacity-100"
                          : `${border} opacity-50 hover:opacity-100`
                      }`}
                    >
                      <Image
                        src={image}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>

                <span className={`shrink-0 text-[11px] ${muted}`}>
                  {activeImage + 1}/{images.length}
                </span>

                <button
                  type="button"
                  onClick={() => changeImage(1)}
                  aria-label="Next image"
                  className={controlClass}
                >
                  <FiChevronRight size={18} aria-hidden="true" />
                </button>
              </div>
            )}
          </section>
        )}

        {/* All project details below the image */}
        <section className={`w-full border-t p-5 sm:p-7 ${border}`}>
          <div className="flex flex-wrap items-center gap-3">
            <h2
              id={titleId}
              className="text-xl font-semibold leading-tight tracking-tight sm:text-2xl"
            >
              {project.title}
            </h2>

            {project.featured && (
              <span
                className={`rounded-full bg-yellow-400/15 px-2.5 py-1 text-[10px] font-medium ${
                  lightMode ? "text-yellow-800" : "text-yellow-400"
                }`}
              >
                Featured
              </span>
            )}
          </div>

          <p
            className={`mt-4 whitespace-pre-line break-words text-sm leading-7 ${muted}`}
          >
            {project.description}
          </p>

          {technologies.length > 0 && (
            <div
              aria-label="Technologies used"
              className="mt-5 flex flex-wrap gap-2"
            >
              {technologies.map((technology) => (
                <span
                  key={technology}
                  className={`rounded-md border px-2.5 py-1.5 text-[11px] ${border} ${muted}`}
                >
                  {technology}
                </span>
              ))}
            </div>
          )}

          <footer
            className={`mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4 ${border}`}
          >
            <button
              type="button"
              onClick={onClose}
              className={`min-h-11 rounded-lg px-2 text-xs ${muted} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500`}
            >
              Back to projects
            </button>

            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-yellow-400 px-4 text-xs font-semibold text-black hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
              >
                Visit project
                <FiArrowUpRight size={15} aria-hidden="true" />
              </a>
            )}
          </footer>
        </section>
      </div>

      <style jsx>{`
        .project-dialog[open] {
          animation: project-appear 150ms ease-out;
        }

        @keyframes project-appear {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .project-dialog[open] {
            animation: none;
          }
        }
      `}</style>
    </dialog>
  );
}

export default function ProjectOverviewModal({
  project,
  lightMode,
  onClose,
}: Props) {
  if (!project) return null;

  return createPortal(
    <ProjectDialog
      key={project.id}
      project={project}
      lightMode={lightMode}
      onClose={onClose}
    />,
    document.body,
  );
}