'use client';

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiArrowLeft,
  FiCheck,
  FiLoader,
  FiMoon,
  FiSun,
  FiUploadCloud,
  FiX,
} from 'react-icons/fi';

import { createClient } from '@/app/lib/client';
import { useTheme } from '@/app/contexts/ThemeContext';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGES = 5;

const categories = [
  'Web Development',
  'Mobile',
  'Design',
  'Backend',
  'Full Stack',
  'Other',
];

interface SelectedImage {
  file: File;
  preview: string;
}

export default function NewProjectPage() {
  const router = useRouter();
  const { lightMode, toggleTheme } = useTheme();

  /*
   * IMPORTANT:
   * Do NOT import a module-level Supabase instance.
   *
   * The old code used:
   *
   * import { supabase } from '@/app/lib/supabase';
   *
   * That caused Vercel to evaluate createClient()
   * during the build and fail.
   *
   * We create the browser client here instead.
   */
  const supabase = useMemo(() => createClient(), []);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] =
    useState('Web Development');
  const [technologies, setTechnologies] =
    useState('');
  const [link, setLink] = useState('');
  const [featured, setFeatured] = useState(false);

  const [images, setImages] =
    useState<SelectedImage[]>([]);

  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] =
    useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /* ------------------------------------------------------------------------ */
  /* Authentication                                                           */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (cancelled) return;

        if (authError) {
          console.error(
            'Authentication check failed:',
            authError
          );

          setError(
            'Unable to verify your session. Please log in again.'
          );
          setCheckingAuth(false);
          return;
        }

        if (!user) {
          router.replace('/admin/login');
          return;
        }

        setCheckingAuth(false);
      } catch (authError) {
        if (cancelled) return;

        console.error(
          'Authentication check failed:',
          authError
        );

        setError(
          'Unable to verify your session. Please log in again.'
        );
        setCheckingAuth(false);
      }
    }

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [router, supabase]);

  /* ------------------------------------------------------------------------ */
  /* Cleanup previews when page unmounts                                      */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    };
    // We intentionally only want cleanup when this page unmounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Image selection                                                          */
  /* ------------------------------------------------------------------------ */

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      event.target.files || []
    );

    if (!files.length) return;

    setError('');

    const remainingSlots =
      MAX_IMAGES - images.length;

    if (remainingSlots <= 0) {
      setError(
        `A project can have a maximum of ${MAX_IMAGES} images.`
      );

      event.target.value = '';
      return;
    }

    if (files.length > remainingSlots) {
      setError(
        `You can only add ${remainingSlots} more image${
          remainingSlots === 1 ? '' : 's'
        }.`
      );

      event.target.value = '';
      return;
    }

    const validImages: SelectedImage[] = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError(
          `"${file.name}" is not a supported image file.`
        );
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(
          `"${file.name}" is larger than 5MB.`
        );
        continue;
      }

      validImages.push({
        file,
        preview: URL.createObjectURL(file),
      });
    }

    setImages((current) => [
      ...current,
      ...validImages,
    ]);

    event.target.value = '';
  }

  /* ------------------------------------------------------------------------ */
  /* Remove image                                                             */
  /* ------------------------------------------------------------------------ */

  function removeImage(index: number) {
    setImages((current) => {
      const imageToRemove = current[index];

      if (imageToRemove) {
        URL.revokeObjectURL(
          imageToRemove.preview
        );
      }

      return current.filter(
        (_, imageIndex) =>
          imageIndex !== index
      );
    });
  }

  /* ------------------------------------------------------------------------ */
  /* Upload images                                                            */
  /* ------------------------------------------------------------------------ */

  async function uploadImages(
    selectedImages: SelectedImage[]
  ) {
    const imageUrls: string[] = [];
    const uploadedFilePaths: string[] = [];

    try {
      for (const selectedImage of selectedImages) {
        const extension =
          selectedImage.file.name
            .split('.')
            .pop()
            ?.toLowerCase() || 'jpg';

        const fileName = `${
          crypto.randomUUID()
        }.${extension}`;

        const filePath =
          `projects/${fileName}`;

        const {
          error: uploadError,
        } = await supabase.storage
          .from('portfolio-images')
          .upload(
            filePath,
            selectedImage.file,
            {
              cacheControl: '3600',
              upsert: false,
              contentType:
                selectedImage.file.type,
            }
          );

        if (uploadError) {
          throw new Error(
            `Image upload failed: ${uploadError.message}`
          );
        }

        uploadedFilePaths.push(filePath);

        const {
          data: publicUrlData,
        } = supabase.storage
          .from('portfolio-images')
          .getPublicUrl(filePath);

        imageUrls.push(
          publicUrlData.publicUrl
        );
      }

      return {
        urls: imageUrls,
        paths: uploadedFilePaths,
      };
    } catch (uploadError) {
      /*
       * If one upload fails after previous
       * uploads succeeded, remove the files
       * that were already uploaded.
       */
      if (uploadedFilePaths.length > 0) {
        await supabase.storage
          .from('portfolio-images')
          .remove(
            uploadedFilePaths
          );
      }

      throw uploadError;
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Submit                                                                   */
  /* ------------------------------------------------------------------------ */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!title.trim()) {
      setError(
        'Please enter a project title.'
      );
      return;
    }

    if (!description.trim()) {
      setError(
        'Please enter a project description.'
      );
      return;
    }

    if (images.length > MAX_IMAGES) {
      setError(
        `A project can have a maximum of ${MAX_IMAGES} images.`
      );
      return;
    }

    setLoading(true);

    let uploadedFilePaths: string[] = [];

    try {
      /* -------------------------------------------------------------------- */
      /* Verify authentication                                                */
      /* -------------------------------------------------------------------- */

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw new Error(
          `Authentication failed: ${authError.message}`
        );
      }

      if (!user) {
        router.replace('/admin/login');
        return;
      }

      /* -------------------------------------------------------------------- */
      /* Upload selected images                                               */
      /* -------------------------------------------------------------------- */

      let imageUrls: string[] = [];

      if (images.length > 0) {
        const uploaded =
          await uploadImages(images);

        imageUrls = uploaded.urls;
        uploadedFilePaths =
          uploaded.paths;
      }

      /* -------------------------------------------------------------------- */
      /* Primary image                                                        */
      /* -------------------------------------------------------------------- */

      const primaryImage =
        imageUrls.length > 0
          ? imageUrls[0]
          : null;

      /* -------------------------------------------------------------------- */
      /* Save project                                                         */
      /* -------------------------------------------------------------------- */

      const { error: insertError } =
        await supabase
          .from('portfolio')
          .insert({
            title: title.trim(),
            description: description.trim(),

            /*
             * Backward-compatible primary image.
             */
            image: primaryImage,

            /*
             * Complete project gallery.
             */
            images: imageUrls,

            link:
              link.trim() || null,

            category:
              category.trim() || null,

            technologies:
              technologies.trim() || null,

            featured,
          });

      /* -------------------------------------------------------------------- */
      /* Database insert failed                                              */
      /* -------------------------------------------------------------------- */

      if (insertError) {
        /*
         * Delete uploaded files so we don't
         * leave orphaned images in storage.
         */
        if (uploadedFilePaths.length > 0) {
          await supabase.storage
            .from('portfolio-images')
            .remove(
              uploadedFilePaths
            );

          uploadedFilePaths = [];
        }

        throw new Error(
          `Project could not be saved: ${insertError.message}`
        );
      }

      /* -------------------------------------------------------------------- */
      /* Success                                                              */
      /* -------------------------------------------------------------------- */

      setSuccess(
        'Project published successfully.'
      );

      /* -------------------------------------------------------------------- */
      /* Revoke previews                                                      */
      /* -------------------------------------------------------------------- */

      images.forEach((image) => {
        URL.revokeObjectURL(
          image.preview
        );
      });

      /* -------------------------------------------------------------------- */
      /* Reset form                                                           */
      /* -------------------------------------------------------------------- */

      setTitle('');
      setDescription('');
      setCategory('Web Development');
      setTechnologies('');
      setLink('');
      setFeatured(false);
      setImages([]);

      /* -------------------------------------------------------------------- */
      /* Redirect                                                             */
      /* -------------------------------------------------------------------- */

      setTimeout(() => {
        router.push('/admin/projects');
        router.refresh();
      }, 900);
    } catch (submitError) {
      console.error(
        'Project creation failed:',
        submitError
      );

      /*
       * Safety cleanup.
       *
       * If an unexpected error happens after
       * uploading images, remove those images.
       */
      if (uploadedFilePaths.length > 0) {
        await supabase.storage
          .from('portfolio-images')
          .remove(
            uploadedFilePaths
          );
      }

      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Loading                                                                  */
  /* ------------------------------------------------------------------------ */

  if (checkingAuth) {
    return (
      <main
        className={`flex min-h-screen items-center justify-center ${
          lightMode
            ? 'bg-[#F7F5F0]'
            : 'bg-[#09090B]'
        }`}
      >
        <FiLoader
          className="animate-spin text-yellow-400"
          size={22}
        />
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Page                                                                     */
  /* ------------------------------------------------------------------------ */

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
              type="button"
              onClick={toggleTheme}
              aria-label={
                lightMode
                  ? 'Switch to dark mode'
                  : 'Switch to light mode'
              }
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                lightMode
                  ? 'border-black/[0.07] text-zinc-600 hover:bg-black/[0.04]'
                  : 'border-white/[0.08] text-zinc-400 hover:bg-white/[0.05]'
              }`}
            >
              {lightMode ? (
                <FiMoon size={17} />
              ) : (
                <FiSun size={17} />
              )}
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
            Add a project to the work displayed on
            your portfolio.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Project information */}
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
                <Field
                  label="Project title"
                  required
                >
                  <input
                    type="text"
                    value={title}
                    onChange={(event) =>
                      setTitle(
                        event.target.value
                      )
                    }
                    placeholder="e.g. Fynaro Technologies"
                    disabled={loading}
                    className={inputClasses(
                      lightMode
                    )}
                  />
                </Field>

                {/* Description */}
                <Field
                  label="Description"
                  required
                >
                  <textarea
                    value={description}
                    onChange={(event) =>
                      setDescription(
                        event.target.value
                      )
                    }
                    placeholder="Briefly describe the project, what you built, and the problem it solves."
                    rows={5}
                    disabled={loading}
                    className={`${inputClasses(
                      lightMode
                    )} resize-none py-3`}
                  />

                  <div className="mt-2 flex justify-end">
                    <span className="text-[10px] text-zinc-600">
                      {description.length}{' '}
                      characters
                    </span>
                  </div>
                </Field>

                {/* Category */}
                <Field label="Category">
                  <select
                    value={category}
                    onChange={(event) =>
                      setCategory(
                        event.target.value
                      )
                    }
                    disabled={loading}
                    className={inputClasses(
                      lightMode
                    )}
                  >
                    {categories.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}
                  </select>
                </Field>

                {/* Technologies */}
                <Field
                  label="Technologies"
                  hint="Separate technologies with commas."
                >
                  <input
                    type="text"
                    value={technologies}
                    onChange={(event) =>
                      setTechnologies(
                        event.target.value
                      )
                    }
                    placeholder="Next.js, React, TypeScript, Supabase"
                    disabled={loading}
                    className={inputClasses(
                      lightMode
                    )}
                  />
                </Field>

                {/* Link */}
                <Field
                  label="Project URL"
                  hint="Optional"
                >
                  <input
                    type="url"
                    value={link}
                    onChange={(event) =>
                      setLink(
                        event.target.value
                      )
                    }
                    placeholder="https://example.com"
                    disabled={loading}
                    className={inputClasses(
                      lightMode
                    )}
                  />
                </Field>
              </div>
            </section>

            {/* Images */}
            <section
              className={`rounded-2xl border p-5 sm:p-7 ${
                lightMode
                  ? 'border-black/[0.07] bg-white/60'
                  : 'border-white/[0.07] bg-white/[0.025]'
              }`}
            >
              <div className="mb-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-semibold">
                      Project images
                    </h2>

                    <p className="mt-1 text-xs text-zinc-500">
                      Add up to 5 images. The
                      first image will be the
                      primary project image.
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                      images.length ===
                      MAX_IMAGES
                        ? 'bg-yellow-400/10 text-yellow-500'
                        : lightMode
                          ? 'bg-black/[0.04] text-zinc-500'
                          : 'bg-white/[0.05] text-zinc-500'
                    }`}
                  >
                    {images.length}/
                    {MAX_IMAGES}
                  </span>
                </div>
              </div>

              {/* Image previews */}
              {images.length > 0 && (
                <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {images.map(
                    (image, index) => (
                      <div
                        key={image.preview}
                        className="group relative aspect-[4/3] overflow-hidden rounded-xl"
                      >
                        <img
                          src={image.preview}
                          alt={`Project image ${
                            index + 1
                          }`}
                          className="h-full w-full object-cover"
                        />

                        {/* Image number */}
                        <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">
                          {index === 0
                            ? 'Primary'
                            : `Image ${
                                index + 1
                              }`}
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() =>
                            removeImage(
                              index
                            )
                          }
                          disabled={loading}
                          aria-label={`Remove image ${
                            index + 1
                          }`}
                          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition hover:bg-red-500"
                        >
                          <FiX size={15} />
                        </button>

                        {/* Filename */}
                        <div className="absolute bottom-0 left-0 right-0 truncate bg-black/60 px-3 py-2 text-[10px] text-white opacity-0 backdrop-blur-md transition group-hover:opacity-100">
                          {image.file.name}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* Upload */}
              {images.length <
                MAX_IMAGES && (
                <label
                  className={`group flex min-h-[210px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed transition ${
                    lightMode
                      ? 'border-black/[0.12] hover:border-yellow-400/60 hover:bg-yellow-400/[0.025]'
                      : 'border-white/[0.1] hover:border-yellow-400/50 hover:bg-yellow-400/[0.025]'
                  }`}
                >
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    onChange={
                      handleImageChange
                    }
                    disabled={loading}
                    className="hidden"
                  />

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-500 transition group-hover:scale-105">
                    <FiUploadCloud
                      size={21}
                    />
                  </div>

                  <p className="mt-4 text-sm font-medium">
                    {images.length === 0
                      ? 'Upload project images'
                      : 'Add more images'}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Select up to{' '}
                    {MAX_IMAGES -
                      images.length}{' '}
                    more · PNG, JPG or
                    WebP
                  </p>

                  <p className="mt-1 text-[10px] text-zinc-600">
                    Maximum 5MB per image
                  </p>
                </label>
              )}

              {/* Maximum reached */}
              {images.length ===
                MAX_IMAGES && (
                <div
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs ${
                    lightMode
                      ? 'border-yellow-400/20 bg-yellow-400/[0.04] text-yellow-600'
                      : 'border-yellow-400/20 bg-yellow-400/[0.04] text-yellow-400'
                  }`}
                >
                  <FiCheck size={14} />
                  Maximum of 5 images
                  reached
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
                    Highlight this project
                    on your portfolio.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={featured}
                  aria-label="Featured project"
                  onClick={() =>
                    setFeatured(
                      (value) => !value
                    )
                  }
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
                      featured
                        ? 'left-6'
                        : 'left-1'
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
                    <FiLoader
                      size={16}
                      className="animate-spin"
                    />
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
            <span className="ml-1 text-yellow-500">
              *
            </span>
          )}
        </label>

        {hint && (
          <span className="text-[10px] text-zinc-600">
            {hint}
          </span>
        )}
      </div>

      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Input styles                                                               */
/* -------------------------------------------------------------------------- */

function inputClasses(
  lightMode: boolean
) {
  return `h-12 w-full rounded-xl border bg-transparent px-4 text-sm outline-none transition ${
    lightMode
      ? 'border-black/[0.08] placeholder:text-zinc-400 focus:border-yellow-400/60 focus:ring-2 focus:ring-yellow-400/10'
      : 'border-white/[0.08] placeholder:text-zinc-600 focus:border-yellow-400/60 focus:ring-2 focus:ring-yellow-400/10'
  }`;
}