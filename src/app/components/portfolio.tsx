"use client";

import Image from "next/image";
import {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FiArrowUpRight, FiRefreshCw } from "react-icons/fi";

import { ThemeContext } from "../contexts/ThemeContext";
import { createClient } from "../lib/client";

import ProjectOverviewModal, {
  getProjectImages,
  type PortfolioProject,
} from "./projectOverviewModal";

function technologiesFor(value: string | null): string[] {
  return Array.from(
    new Set(
      (value ?? "")
        .split(",")
        .map((technology) => technology.trim())
        .filter(Boolean),
    ),
  );
}

function ProjectPreview({
  src,
  title,
}: {
  src: string | null;
  title: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-zinc-500">
        Preview unavailable
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={`${title} project preview`}
      fill
      sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 1024px) 50vw, 360px"
      className="object-cover object-top"
      onError={() => setFailed(true)}
    />
  );
}

export default function Portfolio() {
  const { lightMode } = useContext(ThemeContext);

  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProject, setSelectedProject] =
    useState<PortfolioProject | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      setLoading(true);
      setError("");

      try {
        const supabase = createClient();

        const { data, error: fetchError } = await supabase
          .from("portfolio")
          .select(
            "id,title,description,image,images,link,category,technologies,featured,created_at",
          )
          .order("created_at", { ascending: false });

        if (fetchError) throw new Error(fetchError.message);
        if (cancelled) return;

        const normalized = (data ?? []).map((project) => ({
          ...project,
          id: String(project.id),
          images: Array.isArray(project.images)
            ? project.images.filter(
                (image: unknown): image is string =>
                  typeof image === "string" &&
                  image.trim().length > 0,
              )
            : [],
        })) as PortfolioProject[];

        setProjects(normalized);
      } catch (caught) {
        if (cancelled) return;

        console.error("[Portfolio]", caught);
        setError("Projects couldn’t load right now. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadProjects();

    return () => {
      cancelled = true;
    };
  }, [retry]);

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          projects
            .map((project) => project.category?.trim())
            .filter((category): category is string => Boolean(category)),
        ),
      ),
    ],
    [projects],
  );

  const filteredProjects = useMemo(
    () =>
      selectedCategory === "All"
        ? projects
        : projects.filter(
            (project) => project.category?.trim() === selectedCategory,
          ),
    [projects, selectedCategory],
  );

  useEffect(() => {
    if (!categories.includes(selectedCategory)) {
      setSelectedCategory("All");
    }
  }, [categories, selectedCategory]);

  const muted = lightMode ? "text-[#5A5147]" : "text-zinc-400";
  const border = lightMode
    ? "border-black/[0.09]"
    : "border-white/[0.09]";

  return (
    <>
      <section
        id="portfolio"
        aria-labelledby="portfolio-title"
        className={`relative scroll-mt-24 ${
          lightMode
            ? "bg-[#D9CAB3] text-[#171512]"
            : "bg-[#0B0B0D] text-white"
        }`}
      >
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-px w-7 bg-yellow-500"
                />
                <p
                  className={`text-[10px] font-medium uppercase tracking-[0.18em] ${muted}`}
                >
                  Selected work
                </p>
              </div>

              <h2
                id="portfolio-title"
                className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl"
              >
                Things I&apos;ve built.
              </h2>

              <p className={`mt-4 max-w-lg text-sm leading-7 ${muted}`}>
                Digital products and experiences shaped through
                engineering, product thinking and design.
              </p>
            </div>

            {!loading && !error && (
              <p className={`shrink-0 text-xs ${muted}`}>
                <span className="mr-2 text-xl font-medium tracking-tight">
                  {String(filteredProjects.length).padStart(2, "0")}
                </span>
                {filteredProjects.length === 1 ? "project" : "projects"}
              </p>
            )}
          </div>

          {!loading && !error && projects.length > 0 && (
            <div
              role="group"
              aria-label="Filter projects by category"
              className="mt-8 flex gap-2 overflow-x-auto pb-2"
            >
              {categories.map((category) => {
                const active = selectedCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelectedCategory(category)}
                    className={`min-h-11 shrink-0 rounded-full px-4 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 ${
                      active
                        ? "bg-yellow-400 text-black"
                        : lightMode
                          ? "text-[#5A5147] hover:bg-black/5"
                          : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          )}

          {loading && (
            <div role="status" className="mt-10">
              <span className="sr-only">Loading projects…</span>

              <div
                aria-hidden="true"
                className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3"
              >
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse motion-reduce:animate-none"
                  >
                    <div
                      className={`aspect-[16/10] rounded-xl ${
                        lightMode ? "bg-black/5" : "bg-white/5"
                      }`}
                    />
                    <div
                      className={`mt-4 h-4 w-2/3 rounded ${
                        lightMode ? "bg-black/5" : "bg-white/5"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && error && (
            <div
              role="alert"
              className={`mt-10 rounded-xl border p-7 ${border}`}
            >
              <p className={`text-sm ${muted}`}>{error}</p>

              <button
                type="button"
                onClick={() => setRetry((value) => value + 1)}
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-yellow-400 px-4 text-xs font-semibold text-black hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
              >
                <FiRefreshCw size={14} aria-hidden="true" />
                Try again
              </button>
            </div>
          )}

          {!loading && !error && projects.length === 0 && (
            <p className={`mt-10 text-sm ${muted}`}>
              Projects will appear here soon.
            </p>
          )}

          {!loading && !error && filteredProjects.length > 0 && (
            <div className="mt-8 grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => {
                const images = getProjectImages(project);
                const preview = images[0] ?? null;
                const technologies = technologiesFor(project.technologies);

                return (
                  <article key={project.id} className="min-w-0">
                    <button
                      type="button"
                      onClick={() => setSelectedProject(project)}
                      aria-label={`View ${project.title}`}
                      aria-haspopup="dialog"
                      className="group block w-full rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
                    >
                      <div
                        className={`relative aspect-[16/10] overflow-hidden rounded-xl border ${border} ${
                          lightMode ? "bg-black/[0.03]" : "bg-white/[0.03]"
                        }`}
                      >
                        <ProjectPreview
                          key={preview ?? project.id}
                          src={preview}
                          title={project.title}
                        />

                        {project.featured && (
                          <span className="absolute left-3 top-3 rounded-full bg-yellow-400 px-2.5 py-1 text-[10px] font-semibold text-black">
                            Featured
                          </span>
                        )}

                        {images.length > 1 && (
                          <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] text-white">
                            {images.length} images
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold leading-6 tracking-tight">
                            {project.title}
                          </h3>

                          {project.category && (
                            <p
                              className={`mt-1 text-[10px] uppercase tracking-[0.12em] ${muted}`}
                            >
                              {project.category}
                            </p>
                          )}
                        </div>

                        <span
                          aria-hidden="true"
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${border} ${
                            lightMode
                              ? "group-hover:bg-black group-hover:text-white"
                              : "group-hover:bg-white group-hover:text-black"
                          }`}
                        >
                          <FiArrowUpRight size={16} />
                        </span>
                      </div>

                      <p
                        className={`mt-3 line-clamp-2 text-xs leading-6 ${muted}`}
                      >
                        {project.description}
                      </p>

                      {technologies.length > 0 && (
                        <div
                          className={`mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[10px] ${muted}`}
                        >
                          {technologies.slice(0, 3).map((technology) => (
                            <span key={technology}>{technology}</span>
                          ))}

                          {technologies.length > 3 && (
                            <span>+{technologies.length - 3}</span>
                          )}
                        </div>
                      )}
                    </button>
                  </article>
                );
              })}
            </div>
          )}

          {!loading &&
            !error &&
            projects.length > 0 &&
            filteredProjects.length === 0 && (
              <div className="mt-10">
                <p className={`text-sm ${muted}`}>
                  No projects in this category.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("All")}
                  className="mt-3 min-h-11 rounded text-xs font-semibold underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
                >
                  View all projects
                </button>
              </div>
            )}

          <div
            className={`mt-12 flex flex-wrap items-center justify-between gap-3 border-t pt-5 ${border}`}
          >
            <p
              className={`text-[10px] uppercase tracking-[0.15em] ${muted}`}
            >
              Software · Product · Design
            </p>
            <p className={`text-xs ${muted}`}>
              Selected projects and ongoing work.
            </p>
          </div>
        </div>
      </section>

      <ProjectOverviewModal
        project={selectedProject}
        lightMode={lightMode}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}