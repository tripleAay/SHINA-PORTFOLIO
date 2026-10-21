"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiCheck,
  FiLoader,
  FiMoon,
  FiSun,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";

import { createClient } from "@/app/lib/client";
import { useTheme } from "@/app/contexts/ThemeContext";

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const BUCKET = "portfolio-images";

const FILE_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

const categories = [
  "Web Development",
  "Mobile",
  "Design",
  "Backend",
  "Full Stack",
  "Other",
];

type GalleryImage = {
  id: string;
  url: string;
  file?: File;
};

type ProjectRow = {
  id: string | number;
  title: string;
  description: string | null;
  category: string | null;
  technologies: string | null;
  link: string | null;
  featured: boolean;
  image: string | null;
  images: string[] | null;
};

export default function ProjectEditor({
  projectId,
}: {
  projectId?: string;
}) {
  const editing = Boolean(projectId);
  const router = useRouter();
  const { lightMode, toggleTheme } = useTheme();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [technologies, setTechnologies] = useState("");
  const [link, setLink] = useState("");
  const [featured, setFeatured] = useState(false);
  const [images, setImages] = useState<GalleryImage[]>([]);

  const [checking, setChecking] = useState(true);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");

  const busy = useRef(false);
  const previews = useRef(new Set<string>());
  const uploadInput = useRef<HTMLInputElement>(null);

  // Track every object URL, including images added after mount.
  useEffect(() => {
    const urls = previews.current;

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      setChecking(true);
      setReady(false);
      setError("");

      try {
        const supabase = createClient();

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (cancelled) return;

        if (authError || !user) {
          router.replace("/admin/login");
          return;
        }

        if (projectId) {
          const { data, error: fetchError } = await supabase
            .from("portfolio")
            .select(
              "id,title,description,image,images,link,category,technologies,featured",
            )
            .eq("id", projectId)
            .single();

          if (fetchError || !data) {
            throw new Error(
              fetchError?.message || "Project could not be found.",
            );
          }

          if (cancelled) return;

          const project = data as ProjectRow;

          const urls = Array.from(
            new Set(
              [
                project.image,
                ...(Array.isArray(project.images)
                  ? project.images
                  : []),
              ].filter(
                (url): url is string =>
                  typeof url === "string" && url.trim().length > 0,
              ),
            ),
          );

          setTitle(project.title);
          setDescription(project.description ?? "");
          setCategory(project.category || "Web Development");
          setTechnologies(project.technologies ?? "");
          setLink(project.link ?? "");
          setFeatured(Boolean(project.featured));

          setImages(
            urls.map((url) => ({
              id: url,
              url,
            })),
          );
        }

        setReady(true);
      } catch (caught) {
        if (!cancelled) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Unable to load the project editor.",
          );
        }
      } finally {
        if (!cancelled) setChecking(false);
      }
    }

    void initialize();

    return () => {
      cancelled = true;
    };
  }, [projectId, router]);

  function selectImages(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (busy.current || saved || !files.length) return;

    setError("");

    if (images.length + files.length > MAX_IMAGES) {
      setError(
        `You can add ${Math.max(0, MAX_IMAGES - images.length)} more image(s).`,
      );
      return;
    }

    // Validate the whole selection before creating previews.
    for (const file of files) {
      if (!FILE_TYPES[file.type]) {
        setError(`"${file.name}": use PNG, JPG or WebP.`);
        return;
      }

      if (file.size === 0 || file.size > MAX_FILE_SIZE) {
        setError(`"${file.name}": use a non-empty file up to 5MB.`);
        return;
      }
    }

    const selected = files.map((file) => {
      const url = URL.createObjectURL(file);
      previews.current.add(url);

      return {
        id: crypto.randomUUID(),
        url,
        file,
      };
    });

    setImages((current) => [...current, ...selected]);
  }

  function makeMain(id: string) {
    if (busy.current || saved) return;

    setImages((current) => {
      const selected = current.find((image) => image.id === id);
      if (!selected) return current;

      return [
        selected,
        ...current.filter((image) => image.id !== id),
      ];
    });
  }

  function removeImage(id: string) {
    if (busy.current || saved) return;

    const selected = images.find((image) => image.id === id);

    if (selected?.file) {
      URL.revokeObjectURL(selected.url);
      previews.current.delete(selected.url);
    }

    // If the main image is removed, the next image becomes main.
    setImages((current) =>
      current.filter((image) => image.id !== id),
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (busy.current || !ready || saved) return;

    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Enter a project title and description.");
      return;
    }

    if (images.length > MAX_IMAGES) {
      setError("A project can have up to five images.");
      return;
    }

    let projectLink: string | null = null;

    if (link.trim()) {
      try {
        const url = new URL(link.trim());

        if (!["https:", "http:"].includes(url.protocol)) {
          throw new Error("Invalid protocol");
        }

        projectLink = url.href;
      } catch {
        setError("Enter a valid project URL beginning with https://.");
        return;
      }
    }

    busy.current = true;
    setSaving(true);

    const uploadedPaths: string[] = [];
    let databaseSaved = false;

    try {
      const supabase = createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.replace("/admin/login");
        return;
      }

      const finalImages: string[] = [];
      const newImageCount = images.filter((image) => image.file).length;
      let uploadedCount = 0;

      // Preserve gallery order, including a new image chosen as main.
      for (const image of images) {
        if (!image.file) {
          finalImages.push(image.url);
          continue;
        }

        setProgress(
          `Uploading image ${uploadedCount + 1} of ${newImageCount}…`,
        );

        const extension = FILE_TYPES[image.file.type];
        const path = `projects/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, image.file, {
            cacheControl: "3600",
            upsert: false,
            contentType: image.file.type,
          });

        if (uploadError) {
          throw new Error(
            `Image upload failed: ${uploadError.message}`,
          );
        }

        uploadedPaths.push(path);

        const { data } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(path);

        finalImages.push(data.publicUrl);
        uploadedCount += 1;
      }

      setProgress(editing ? "Saving changes…" : "Publishing project…");

      const payload = {
        title: title.trim(),
        description: description.trim(),
        category: category.trim() || null,
        technologies: technologies.trim() || null,
        link: projectLink,
        featured,
        image: finalImages[0] ?? null,
        images: finalImages,
      };

      if (projectId) {
        const { data, error: updateError } = await supabase
          .from("portfolio")
          .update(payload)
          .eq("id", projectId)
          .select("id")
          .single();

        if (updateError || !data) {
          throw new Error(
            updateError?.message || "The project was not updated.",
          );
        }
      } else {
        const { data, error: insertError } = await supabase
          .from("portfolio")
          .insert(payload)
          .select("id")
          .single();

        if (insertError || !data) {
          throw new Error(
            insertError?.message || "The project was not created.",
          );
        }
      }

      databaseSaved = true;
      setSaved(true);

      router.push("/admin/projects");
      router.refresh();
    } catch (caught) {
      console.error("[Project editor]", caught);

      // Roll back newly uploaded files when saving fails.
      if (!databaseSaved && uploadedPaths.length > 0) {
        try {
          const supabase = createClient();
          const { error: cleanupError } = await supabase.storage
            .from(BUCKET)
            .remove(uploadedPaths);

          if (cleanupError) {
            console.error("[Project upload cleanup]", cleanupError);
          }
        } catch (cleanupError) {
          console.error("[Project upload cleanup]", cleanupError);
        }
      }

      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to save the project. Please try again.",
      );
    } finally {
      busy.current = false;
      setSaving(false);
      setProgress("");
    }
  }

  const disabled = saving || saved;

  const inputClass = `mt-2 min-h-12 w-full rounded-xl border px-4 py-3 text-base outline-none transition-colors focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/15 disabled:opacity-60 ${
    lightMode
      ? "border-black/10 bg-white text-zinc-900 placeholder:text-zinc-400"
      : "border-white/10 bg-[#131316] text-white placeholder:text-zinc-500"
  }`;

  const panelClass = `rounded-2xl border p-5 sm:p-6 ${
    lightMode
      ? "border-black/[0.08] bg-white/70"
      : "border-white/[0.08] bg-white/[0.025]"
  }`;

  const muted = lightMode ? "text-zinc-600" : "text-zinc-400";

  if (checking) {
    return (
      <main
        role="status"
        className={`flex min-h-screen items-center justify-center ${
          lightMode ? "bg-[#F7F5F0]" : "bg-[#09090B]"
        }`}
      >
        <FiLoader
          size={22}
          aria-hidden="true"
          className="animate-spin text-yellow-500"
        />
        <span className="sr-only">Loading project editor…</span>
      </main>
    );
  }

  return (
    <main
      className={`min-h-screen ${
        lightMode
          ? "bg-[#F7F5F0] text-zinc-900"
          : "bg-[#09090B] text-white"
      }`}
    >
      <header
        className={`sticky top-0 z-30 border-b backdrop-blur-xl ${
          lightMode
            ? "border-black/10 bg-[#F7F5F0]/95"
            : "border-white/10 bg-[#09090B]/95"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/admin/projects"
            className={`inline-flex min-h-11 items-center gap-2 text-sm ${muted}`}
          >
            <FiArrowLeft aria-hidden="true" />
            Projects
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                lightMode ? "Switch to dark mode" : "Switch to light mode"
              }
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-current/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
            >
              {lightMode ? (
                <FiMoon aria-hidden="true" />
              ) : (
                <FiSun aria-hidden="true" />
              )}
            </button>

            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-black">
              SA
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[900px] px-5 py-8 sm:px-8 sm:py-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-yellow-600">
          Projects
        </p>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          {editing ? "Edit project" : "Add new project"}
        </h1>

        <p className={`mt-2 text-sm ${muted}`}>
          Project details, gallery and main image.
        </p>

        {!ready ? (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm"
          >
            {error || "The editor could not be loaded."}
            <Link
              href="/admin/login"
              className="mt-3 block underline underline-offset-4"
            >
              Return to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} aria-busy={saving} className="mt-7">
            <fieldset disabled={disabled} className="space-y-5">
              <legend className="sr-only">Project information</legend>

              <section className={panelClass}>
                <h2 className="text-sm font-semibold">
                  Project information
                </h2>

                <div className="mt-5 space-y-5">
                  <label className="block text-sm font-medium">
                    Project title *
                    <input
                      name="title"
                      required
                      maxLength={200}
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="e.g. NewJersey.ng"
                      className={inputClass}
                    />
                  </label>

                  <label className="block text-sm font-medium">
                    Description *
                    <textarea
                      name="description"
                      required
                      maxLength={10000}
                      rows={5}
                      value={description}
                      onChange={(event) =>
                        setDescription(event.target.value)
                      }
                      placeholder="What you built and the problem it solves."
                      className={`${inputClass} resize-y`}
                    />
                    <span className={`mt-1 block text-xs font-normal ${muted}`}>
                      {description.length} characters
                    </span>
                  </label>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block text-sm font-medium">
                      Category
                      <select
                        name="category"
                        value={category}
                        onChange={(event) =>
                          setCategory(event.target.value)
                        }
                        className={inputClass}
                      >
                        {!categories.includes(category) && (
                          <option value={category}>{category}</option>
                        )}

                        {categories.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block text-sm font-medium">
                      Technologies
                      <input
                        name="technologies"
                        value={technologies}
                        onChange={(event) =>
                          setTechnologies(event.target.value)
                        }
                        placeholder="Next.js, React, Supabase"
                        className={inputClass}
                      />
                      <span className={`mt-1 block text-xs font-normal ${muted}`}>
                        Separate with commas.
                      </span>
                    </label>
                  </div>

                  <label className="block text-sm font-medium">
                    Project URL
                    <input
                      name="link"
                      type="url"
                      value={link}
                      onChange={(event) => setLink(event.target.value)}
                      placeholder="https://example.com"
                      className={inputClass}
                    />
                  </label>
                </div>
              </section>

              <section className={panelClass}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-semibold">Project images</h2>
                    <p className={`mt-1 text-xs leading-5 ${muted}`}>
                      Choose “Make main” for your portfolio cover.
                    </p>
                  </div>

                  <span className={`text-xs ${muted}`}>
                    {images.length}/{MAX_IMAGES}
                  </span>
                </div>

                {images.length > 0 && (
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {images.map((image, index) => (
                      <div
                        key={image.id}
                        className={`overflow-hidden rounded-xl border ${
                          index === 0
                            ? "border-yellow-500"
                            : lightMode
                              ? "border-black/10"
                              : "border-white/10"
                        }`}
                      >
                        <div className="relative aspect-[4/3] bg-black/5">
                          {/* Browser blob URLs are used for local previews. */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={image.url}
                            alt={`Project image ${index + 1}`}
                            className="h-full w-full object-cover"
                          />

                          {index === 0 && (
                            <span className="absolute left-2 top-2 rounded-full bg-yellow-400 px-2 py-1 text-[10px] font-semibold text-black">
                              Main image
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => removeImage(image.id)}
                            aria-label={`Remove image ${index + 1}`}
                            className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                          >
                            <FiX size={17} aria-hidden="true" />
                          </button>
                        </div>

                        <div className="p-2">
                          <button
                            type="button"
                            onClick={() => makeMain(image.id)}
                            disabled={disabled || index === 0}
                            aria-pressed={index === 0}
                            className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-lg text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 ${
                              index === 0
                                ? "bg-yellow-400 text-black"
                                : lightMode
                                  ? "bg-black/5 hover:bg-black/10"
                                  : "bg-white/5 hover:bg-white/10"
                            }`}
                          >
                            {index === 0 && (
                              <FiCheck size={14} aria-hidden="true" />
                            )}
                            {index === 0 ? "Main image" : "Make main"}
                          </button>

                          <p
                            title={image.file?.name}
                            className={`mt-2 truncate px-1 text-[10px] ${muted}`}
                          >
                            {image.file?.name || "Saved image"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {images.length < MAX_IMAGES && (
                  <div className="mt-4">
                    <input
                      ref={uploadInput}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      multiple
                      onChange={selectImages}
                      disabled={disabled}
                      aria-label="Choose project images"
                      className="sr-only"
                      tabIndex={-1}
                    />

                    <button
                      type="button"
                      onClick={() => uploadInput.current?.click()}
                      className={`flex min-h-32 w-full flex-col items-center justify-center rounded-xl border border-dashed px-4 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 ${
                        lightMode
                          ? "border-black/20 hover:bg-black/[0.025]"
                          : "border-white/20 hover:bg-white/[0.025]"
                      }`}
                    >
                      <FiUploadCloud
                        size={22}
                        aria-hidden="true"
                        className="text-yellow-500"
                      />
                      <span className="mt-2 text-sm font-medium">
                        {images.length ? "Add images" : "Upload project images"}
                      </span>
                      <span className={`mt-1 text-xs ${muted}`}>
                        PNG, JPG or WebP · Up to 5MB each
                      </span>
                    </button>
                  </div>
                )}
              </section>

              <section className={panelClass}>
                <label className="flex cursor-pointer items-center justify-between gap-5">
                  <span>
                    <span className="block text-sm font-semibold">
                      Featured project
                    </span>
                    <span className={`mt-1 block text-xs ${muted}`}>
                      Highlight this project on your portfolio.
                    </span>
                  </span>

                  <input
                    type="checkbox"
                    name="featured"
                    checked={featured}
                    onChange={(event) =>
                      setFeatured(event.target.checked)
                    }
                    className="h-5 w-5 shrink-0 accent-yellow-400"
                  />
                </label>
              </section>

              {error && (
                <p
                  role="alert"
                  className={`rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm ${
                    lightMode ? "text-red-800" : "text-red-300"
                  }`}
                >
                  {error}
                </p>
              )}

              {saved && (
                <p role="status" className="text-sm">
                  Project saved. Returning to projects…
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                {!saving && !saved && (
                  <Link
                    href="/admin/projects"
                    className={`inline-flex min-h-11 items-center justify-center rounded-xl border px-5 text-sm ${
                      lightMode ? "border-black/10" : "border-white/10"
                    }`}
                  >
                    Cancel
                  </Link>
                )}

                <button
                  type="submit"
                  disabled={disabled}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 text-sm font-semibold text-black hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <FiLoader
                        aria-hidden="true"
                        className="animate-spin"
                      />
                      {progress || "Saving…"}
                    </>
                  ) : (
                    <>
                      <FiCheck aria-hidden="true" />
                      {saved
                        ? "Saved"
                        : editing
                          ? "Save changes"
                          : "Publish project"}
                    </>
                  )}
                </button>
              </div>
            </fieldset>
          </form>
        )}
      </div>
    </main>
  );
}