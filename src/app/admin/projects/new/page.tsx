'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiArrowLeft,
  FiBriefcase,
  FiCheck,
  FiImage,
  FiLoader,
  FiMoon,
  FiSun,
  FiUploadCloud,
  FiX,
} from 'react-icons/fi';

import { supabase } from '@/app/lib/supabase';
import { useTheme } from '@/app/contexts/ThemeContext';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const categories = [
  'Web Development',
  'Mobile',
  'Design',
  'Backend',
  'Full Stack',
  'Other',
];

export default function NewProjectPage() {
  const router = useRouter();
  const { lightMode, toggleTheme } = useTheme();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [technologies, setTechnologies] = useState('');
  const [link, setLink] = useState('');
  const [featured, setFeatured] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/admin/login');
        return;
      }

      setCheckingAuth(false);
    }

    checkAuth();
  }, [router]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError('');

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('Image must be smaller than 5MB.');
      event.target.value = '';
      return;
    }

    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!title.trim()) {
      setError('Please enter a project title.');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a project description.');
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/admin/login');
        return;
      }

      let imageUrl: string | null = null;

      /*
       * Upload project image if one was selected.
       */
      if (imageFile) {
        const extension =
          imageFile.name.split('.').pop()?.toLowerCase() || 'jpg';

        const fileName = `${crypto.randomUUID()}.${extension}`;
        const filePath = `projects/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio-images')
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: false,
            contentType: imageFile.type,
          });

        if (uploadError) {
          throw new Error(
            `Image upload failed: ${uploadError.message}`
          );
        }

        const { data: publicUrlData } = supabase.storage
          .from('portfolio-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      /*
       * Save project to database.
       */
      const { error: insertError } = await supabase
        .from('portfolio')
        .insert({
          title: title.trim(),
          description: description.trim(),
          image: imageUrl,
          link: link.trim() || null,
          category: category || null,
          technologies: technologies.trim() || null,
          featured,
        });

      if (insertError) {
        throw new Error(
          `Project could not be saved: ${insertError.message}`
        );
      }

      setSuccess('Project published successfully.');

      setTitle('');
      setDescription('');
      setCategory('Web Development');
      setTechnologies('');
      setLink('');
      setFeatured(false);
      removeImage();

      /*
       * Give the success message a moment to appear,
       * then return to the projects page.
       */
      setTimeout(() => {
        router.push('/admin/projects');
        router.refresh();
      }, 900);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return (
      <main
        className={`flex min-h-screen items-center justify-center ${
          lightMode ? 'bg-[#F7F5F0]' : 'bg-[#09090B]'
        }`}
      >
        <FiLoader
          className="animate-spin text-yellow-400"
          size={22}
        />
      </main>
    );
  }

  return (
    <main
      className={`min-h-screen transition-colors duration-500 ${
        lightMode
          ? 'bg-[#F7F5F0] text-zinc-900'
          : 'bg-[#09090B] text-white'
      }`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-30 border-b backdrop-blur-xl ${
          lightMode
            ? 'border-black/[0.07] bg-[#F7F5F0]/85'
            : 'border-white/[0.07] bg-[#09090B]/85'
        }`}
      >
        <div className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-between px-5 sm:px-8">
          <Link
            href="/admin/projects"
            className={`inline-flex items-center gap-2 text-sm transition ${
              lightMode
                ? 'text-zinc-500 hover:text-zinc-900'
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            <FiArrowLeft size={17} />
            <span>Projects</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                lightMode
                  ? 'border-black/[0.07] text-zinc-600 hover:bg-black/[0.04]'
                  : 'border-white/[0.08] text-zinc-400 hover:bg-white/[0.05]'
              }`}
            >
              {lightMode ? <FiMoon size={17} /> : <FiSun size={17} />}
            </button>

            <div className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-black">
              AA
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-[900px] px-5 py-8 sm:px-8 sm:py-12">
        {/* Heading */}
        <div className="mb-9">
          <p className="mb-2 text-sm font-medium text-yellow-500">
            PROJECTS
          </p>

          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Add new project
          </h1>

          <p className="mt-2 max-w-xl text-sm text-zinc-500">
            Add a project to the work displayed on your portfolio.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Basic information */}
            <section
              className={`rounded-2xl border p-5 sm:p-7 ${
                lightMode
                  ? 'border-black/[0.07] bg-white/60'
                  : 'border-white/[0.07] bg-white/[0.025]'
              }`}
            >
              <div className="mb-6">
                <h2 className="text-sm font-semibold">
                  Project information
                </h2>

                <p className="mt-1 text-xs text-zinc-500">
                  Tell visitors what you built.
                </p>
              </div>

              <div className="space-y-5">
                {/* Title */}
                <Field label="Project title" required>
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="e.g. Fynaro Technologies"
                    disabled={loading}
                    className={inputClasses(lightMode)}
                  />
                </Field>

                {/* Description */}
                <Field label="Description" required>
                  <textarea
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value)
                    }
                    placeholder="Briefly describe the project, what you built, and the problem it solves."
                    rows={5}
                    disabled={loading}
                    className={`${inputClasses(lightMode)} resize-none py-3`}
                  />

                  <div className="mt-2 flex justify-end">
                    <span className="text-[10px] text-zinc-600">
                      {description.length} characters
                    </span>
                  </div>
                </Field>

                {/* Category */}
                <Field label="Category">
                  <select
                    value={category}
                    onChange={(event) =>
                      setCategory(event.target.value)
                    }
                    disabled={loading}
                    className={inputClasses(lightMode)}
                  >
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </Field>

                {/* Technologies */}
                <Field
                  label="Technologies"
                  hint="Separate technologies with commas."
                >
                  <input
                    value={technologies}
                    onChange={(event) =>
                      setTechnologies(event.target.value)
                    }
                    placeholder="Next.js, React, TypeScript, Supabase"
                    disabled={loading}
                    className={inputClasses(lightMode)}
                  />
                </Field>

                {/* Link */}
                <Field label="Project URL" hint="Optional">
                  <input
                    type="url"
                    value={link}
                    onChange={(event) => setLink(event.target.value)}
                    placeholder="https://example.com"
                    disabled={loading}
                    className={inputClasses(lightMode)}
                  />
                </Field>
              </div>
            </section>

            {/* Image */}
            <section
              className={`rounded-2xl border p-5 sm:p-7 ${
                lightMode
                  ? 'border-black/[0.07] bg-white/60'
                  : 'border-white/[0.07] bg-white/[0.025]'
              }`}
            >
              <div className="mb-6">
                <h2 className="text-sm font-semibold">
                  Project image
                </h2>

                <p className="mt-1 text-xs text-zinc-500">
                  Upload an image to display on your portfolio.
                </p>
              </div>

              {!imagePreview ? (
                <label
                  className={`group flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed transition ${
                    lightMode
                      ? 'border-black/[0.12] hover:border-yellow-400/60 hover:bg-yellow-400/[0.025]'
                      : 'border-white/[0.1] hover:border-yellow-400/50 hover:bg-yellow-400/[0.025]'
                  }`}
                >
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    disabled={loading}
                    className="hidden"
                  />

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-500 transition group-hover:scale-105">
                    <FiUploadCloud size={21} />
                  </div>

                  <p className="mt-4 text-sm font-medium">
                    Upload project image
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    PNG, JPG or WebP · Maximum 5MB
                  </p>
                </label>
              ) : (
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={imagePreview}
                    alt="Project preview"
                    className="max-h-[420px] w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    disabled={loading}
                    aria-label="Remove image"
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition hover:bg-red-500"
                  >
                    <FiX size={17} />
                  </button>

                  <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-[10px] text-white backdrop-blur-md">
                    <FiImage size={13} />
                    {imageFile?.name}
                  </div>
                </div>
              )}
            </section>

            {/* Publishing */}
            <section
              className={`rounded-2xl border p-5 sm:p-7 ${
                lightMode
                  ? 'border-black/[0.07] bg-white/60'
                  : 'border-white/[0.07] bg-white/[0.025]'
              }`}
            >
              <div className="flex items-center justify-between gap-5">
                <div>
                  <h2 className="text-sm font-semibold">
                    Featured project
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Highlight this project on your portfolio.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={featured}
                  onClick={() => setFeatured((value) => !value)}
                  disabled={loading}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    featured
                      ? 'bg-yellow-400'
                      : lightMode
                        ? 'bg-black/[0.12]'
                        : 'bg-white/[0.1]'
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                      featured ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </section>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-400/20 bg-red-400/[0.05] px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-center gap-3 rounded-xl border border-green-400/20 bg-green-400/[0.05] px-4 py-3 text-sm text-green-400">
                <FiCheck size={17} />
                {success}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Link
                href="/admin/projects"
                className={`flex h-11 items-center justify-center rounded-xl border px-5 text-sm font-medium transition ${
                  lightMode
                    ? 'border-black/[0.08] text-zinc-600 hover:bg-black/[0.04]'
                    : 'border-white/[0.08] text-zinc-400 hover:bg-white/[0.04]'
                }`}
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 text-sm font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <FiLoader size={16} className="animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <FiCheck size={16} />
                    Publish project
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Field                                                                      */
/* -------------------------------------------------------------------------- */

function Field({
  label,
  hint,
  required = false,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-sm font-medium">
          {label}
          {required && (
            <span className="ml-1 text-yellow-500">*</span>
          )}
        </label>

        {hint && <span className="text-[10px] text-zinc-600">{hint}</span>}
      </div>

      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Input styles                                                               */
/* -------------------------------------------------------------------------- */

function inputClasses(lightMode: boolean) {
  return `w-full rounded-xl border bg-transparent px-4 text-sm outline-none transition ${
    lightMode
      ? 'border-black/[0.08] placeholder:text-zinc-400 focus:border-yellow-400/60 focus:ring-2 focus:ring-yellow-400/10'
      : 'border-white/[0.08] placeholder:text-zinc-600 focus:border-yellow-400/60 focus:ring-2 focus:ring-yellow-400/10'
  } h-12`;
}