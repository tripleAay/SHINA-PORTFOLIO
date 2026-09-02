
'use client';

import {
  useEffect,
  useState,
  ChangeEvent,
  FormEvent,
} from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FiArrowLeft,
  FiCheck,
  FiLoader,
  FiSave,
  FiUpload,
  FiX,
} from 'react-icons/fi';

import { useTheme } from '@/app/contexts/ThemeContext';
import { createClient } from '@/app/lib/client';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGES = 5;

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
};

type NewImage = {
  file: File;
  preview: string;
};

export default function EditProjectPage() {
  const { lightMode } = useTheme();
  const router = useRouter();
  const params = useParams();

  const projectId = params.id as string;

  const [project, setProject] =
    useState<PortfolioProject | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [link, setLink] = useState('');
  const [featured, setFeatured] = useState(false);

  /*
   * Existing images already stored in Supabase.
   */
  const [existingImages, setExistingImages] =
    useState<string[]>([]);

  /*
   * New images selected but not uploaded yet.
   */
  const [newImages, setNewImages] =
    useState<NewImage[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /* -------------------------------------------------------------------------- */
  /* Load project                                                               */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    loadProject();

    // Preview URLs are revoked when images are removed
    // or after a successful save.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  async function loadProject() {
    setLoading(true);
    setError('');

    try {
      /*
       * IMPORTANT:
       * Create the Supabase client only when this function runs.
       *
       * This prevents createClient() from executing during
       * Next.js/Vercel build-time prerendering.
       */
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/admin/login');
        return;
      }

      const { data, error: fetchError } =
        await supabase
          .from('portfolio')
          .select(
            'id, title, description, image, images, link, category, technologies, featured'
          )
          .eq('id', projectId)
          .single();

      if (fetchError || !data) {
        setError(
          fetchError?.message ||
            'Project could not be found.'
        );
        setLoading(false);
        return;
      }

      const loadedProject =
        data as PortfolioProject;

      setProject(loadedProject);

      setTitle(loadedProject.title);
      setDescription(loadedProject.description);
      setCategory(
        loadedProject.category || ''
      );
      setTechnologies(
        loadedProject.technologies || ''
      );
      setLink(loadedProject.link || '');
      setFeatured(loadedProject.featured);

      /*
       * New projects use `images`.
       *
       * Older projects may only have `image`,
       * so we fall back to that.
       */
      const loadedImages =
        Array.isArray(loadedProject.images) &&
        loadedProject.images.length > 0
          ? loadedProject.images
          : loadedProject.image
            ? [loadedProject.image]
            : [];

      setExistingImages(loadedImages);
      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while loading the project.'
      );
      setLoading(false);
    }
  }

  /* -------------------------------------------------------------------------- */
  /* Image selection                                                            */
  /* -------------------------------------------------------------------------- */

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      event.target.files || []
    );

    if (!files.length) return;

    setError('');

    const totalImages =
      existingImages.length +
      newImages.length;

    const remainingSlots =
      MAX_IMAGES - totalImages;

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

    const validImages: NewImage[] = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError(
          `"${file.name}" is not a valid image file.`
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

    setNewImages((current) => [
      ...current,
      ...validImages,
    ]);

    event.target.value = '';
  }

  /* -------------------------------------------------------------------------- */
  /* Remove existing image                                                      */
  /* -------------------------------------------------------------------------- */

  function removeExistingImage(index: number) {
    if (saving) return;

    setExistingImages((current) =>
      current.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );
  }

  /* -------------------------------------------------------------------------- */
  /* Remove new image                                                           */
  /* -------------------------------------------------------------------------- */

  function removeNewImage(index: number) {
    if (saving) return;

    setNewImages((current) => {
      const image = current[index];

      if (image) {
        URL.revokeObjectURL(image.preview);
      }

      return current.filter(
        (_, imageIndex) =>
          imageIndex !== index
      );
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Storage helpers                                                            */
  /* -------------------------------------------------------------------------- */

  function getStoragePathFromUrl(
    url: string
  ): string | null {
    const marker =
      '/storage/v1/object/public/portfolio-images/';

    const index = url.indexOf(marker);

    if (index === -1) {
      return null;
    }

    return decodeURIComponent(
      url.substring(
        index + marker.length
      )
    );
  }

  async function uploadImages(
    files: NewImage[]
  ) {
    const supabase = createClient();

    const uploadedUrls: string[] = [];
    const uploadedPaths: string[] = [];

    setUploading(true);

    try {
      for (const image of files) {
        const extension =
          image.file.name
            .split('.')
            .pop()
            ?.toLowerCase() || 'jpg';

        const filePath =
          `projects/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } =
          await supabase.storage
            .from('portfolio-images')
            .upload(
              filePath,
              image.file,
              {
                cacheControl: '3600',
                upsert: false,
                contentType:
                  image.file.type,
              }
            );

        if (uploadError) {
          throw new Error(
            uploadError.message
          );
        }

        uploadedPaths.push(filePath);

        const { data } =
          supabase.storage
            .from('portfolio-images')
            .getPublicUrl(filePath);

        uploadedUrls.push(
          data.publicUrl
        );
      }

      return {
        urls: uploadedUrls,
        paths: uploadedPaths,
      };
    } catch (uploadError) {
      /*
       * If one of several uploads fails,
       * remove everything that was already uploaded.
       */
      if (uploadedPaths.length > 0) {
        await supabase.storage
          .from('portfolio-images')
          .remove(uploadedPaths);
      }

      throw uploadError;
    } finally {
      setUploading(false);
    }
  }

  async function deleteStorageImages(
    urls: string[]
  ) {
    const supabase = createClient();

    const paths = urls
      .map(getStoragePathFromUrl)
      .filter(
        (path): path is string =>
          Boolean(path)
      );

    if (!paths.length) return;

    await supabase.storage
      .from('portfolio-images')
      .remove(paths);
  }

  /* -------------------------------------------------------------------------- */
  /* Submit                                                                     */
  /* -------------------------------------------------------------------------- */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!title.trim()) {
      setError(
        'Project title is required.'
      );
      return;
    }

    if (!description.trim()) {
      setError(
        'Project description is required.'
      );
      return;
    }

    const totalImages =
      existingImages.length +
      newImages.length;

    if (totalImages > MAX_IMAGES) {
      setError(
        `A project can have a maximum of ${MAX_IMAGES} images.`
      );
      return;
    }

    setSaving(true);

    let uploadedImagePaths: string[] = [];
    let databaseUpdated = false;

    try {
      /*
       * Create Supabase client here instead of at component render.
       */
      const supabase = createClient();

      /* ---------------------------------------------------------------------- */
      /* Verify authentication                                                  */
      /* ---------------------------------------------------------------------- */

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/admin/login');
        return;
      }

      /* ---------------------------------------------------------------------- */
      /* Upload new images                                                      */
      /* ---------------------------------------------------------------------- */

      let uploadedUrls: string[] = [];

      if (newImages.length > 0) {
        const uploaded =
          await uploadImages(newImages);

        uploadedUrls = uploaded.urls;
        uploadedImagePaths =
          uploaded.paths;
      }

      /* ---------------------------------------------------------------------- */
      /* Combine existing + new images                                         */
      /* ---------------------------------------------------------------------- */

      const finalImages = [
        ...existingImages,
        ...uploadedUrls,
      ];

      /*
       * First image is always the primary image.
       *
       * This keeps the existing `image` column
       * compatible with older portfolio code.
       */
      const primaryImage =
        finalImages.length > 0
          ? finalImages[0]
          : null;

      /* ---------------------------------------------------------------------- */
      /* Update database                                                        */
      /* ---------------------------------------------------------------------- */

      const { error: updateError } =
        await supabase
          .from('portfolio')
          .update({
            title: title.trim(),
            description: description.trim(),
            category:
              category.trim() || null,
            technologies:
              technologies.trim() || null,
            link: link.trim() || null,
            featured,

            /*
             * Backward-compatible primary image.
             */
            image: primaryImage,

            /*
             * Complete project gallery.
             */
            images: finalImages,
          })
          .eq('id', projectId);

      if (updateError) {
        /*
         * Database failed.
         *
         * Remove newly uploaded images because
         * they are not referenced by the database.
         */
        if (uploadedImagePaths.length > 0) {
          await supabase.storage
            .from('portfolio-images')
            .remove(
              uploadedImagePaths
            );

          uploadedImagePaths = [];
        }

        throw new Error(
          updateError.message
        );
      }

      /*
       * From this point onward, the new images
       * belong to the saved project.
       */
      databaseUpdated = true;

      /* ---------------------------------------------------------------------- */
      /* Delete removed old images                                              */
      /* ---------------------------------------------------------------------- */

      const oldImages =
        project?.images &&
        Array.isArray(project.images) &&
        project.images.length > 0
          ? project.images
          : project?.image
            ? [project.image]
            : [];

      const removedImages =
        oldImages.filter(
          (oldImage) =>
            !finalImages.includes(oldImage)
        );

      if (removedImages.length > 0) {
        /*
         * Storage cleanup should not make the
         * database update appear to have failed.
         */
        try {
          await deleteStorageImages(
            removedImages
          );
        } catch {
          // Database is already updated.
        }
      }

      /* ---------------------------------------------------------------------- */
      /* Update local state                                                     */
      /* ---------------------------------------------------------------------- */

      setExistingImages(finalImages);

      newImages.forEach((image) => {
        URL.revokeObjectURL(
          image.preview
        );
      });

      setNewImages([]);

      setProject((current) =>
        current
          ? {
              ...current,
              title: title.trim(),
              description:
                description.trim(),
              category:
                category.trim() || null,
              technologies:
                technologies.trim() ||
                null,
              link:
                link.trim() || null,
              featured,
              image: primaryImage,
              images: finalImages,
            }
          : current
      );

      setSuccess(
        'Project updated successfully.'
      );

      /* ---------------------------------------------------------------------- */
      /* Redirect                                                               */
      /* ---------------------------------------------------------------------- */

      setTimeout(() => {
        router.push('/admin/projects');
        router.refresh();
      }, 900);
    } catch (err) {
      /*
       * Only clean up newly uploaded images if
       * the database was NOT successfully updated.
       *
       * This prevents accidentally deleting images
       * that are already referenced by the project.
       */
      if (
        !databaseUpdated &&
        uploadedImagePaths.length > 0
      ) {
        try {
          const supabase = createClient();

          await supabase.storage
            .from('portfolio-images')
            .remove(
              uploadedImagePaths
            );
        } catch {
          // Ignore cleanup failure.
        }
      }

      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while updating the project.'
      );
    } finally {
      setSaving(false);
      setUploading(false);
    }
  }

  /* -------------------------------------------------------------------------- */
  /* Loading                                                                    */
  /* -------------------------------------------------------------------------- */

  if (loading) {
    return (
      <main
        className={`min-h-screen ${
          lightMode
            ? 'bg-[#F7F5F0] text-zinc-900'
            : 'bg-[#09090B] text-white'
        }`}
      >
        <div className="flex min-h-screen items-center justify-center">
          <FiLoader className="animate-spin text-xl text-yellow-400" />
        </div>
      </main>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* Not found                                                                  */
  /* -------------------------------------------------------------------------- */

  if (!project) {
    return (
      <main
        className={`min-h-screen ${
          lightMode
            ? 'bg-[#F7F5F0] text-zinc-900'
            : 'bg-[#09090B] text-white'
        }`}
      >
        <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6">
          <div className="w-full text-center">
            <h1 className="text-2xl font-semibold">
              Project not found
            </h1>

            <p
              className={`mt-3 text-sm ${
                lightMode
                  ? 'text-zinc-500'
                  : 'text-zinc-400'
              }`}
            >
              {error ||
                'This project does not exist.'}
            </p>

            <Link
              href="/admin/projects"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300"
            >
              <FiArrowLeft />
              Back to projects
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const totalImages =
    existingImages.length +
    newImages.length;

  return (
    <main
      className={`min-h-screen ${
        lightMode
          ? 'bg-[#F7F5F0] text-zinc-900'
          : 'bg-[#09090B] text-white'
      }`}
    >
      {/* Background */}
      <div
        className={`pointer-events-none fixed inset-0 ${
          lightMode
            ? 'bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.08),transparent_35%)]'
            : 'bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.06),transparent_35%)]'
        }`}
      />

      <div className="relative mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <Link
            href="/admin/projects"
            className={`mb-3 inline-flex items-center gap-2 text-sm transition ${
              lightMode
                ? 'text-zinc-500 hover:text-zinc-900'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FiArrowLeft />
            Back to projects
          </Link>

          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Edit project
          </h1>

          <p
            className={`mt-1 text-sm ${
              lightMode
                ? 'text-zinc-500'
                : 'text-zinc-400'
            }`}
          >
            Update your portfolio project.
          </p>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div
            className={`overflow-hidden rounded-2xl border ${
              lightMode
                ? 'border-zinc-200 bg-white'
                : 'border-white/10 bg-white/[0.03]'
            }`}
          >
            {/* Form header */}
            <div
              className={`border-b px-5 py-4 sm:px-6 ${
                lightMode
                  ? 'border-zinc-200'
                  : 'border-white/10'
              }`}
            >
              <h2 className="text-sm font-semibold">
                Project details
              </h2>

              <p
                className={`mt-1 text-xs ${
                  lightMode
                    ? 'text-zinc-500'
                    : 'text-zinc-500'
                }`}
              >
                Keep your project information
                clear and concise.
              </p>
            </div>

            <div className="space-y-7 p-5 sm:p-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium"
                >
                  Project title
                </label>

                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="e.g. Fynaro Digital Platform"
                  disabled={saving}
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                    lightMode
                      ? 'border-zinc-200 bg-zinc-50 placeholder:text-zinc-400 focus:border-yellow-400'
                      : 'border-white/10 bg-white/[0.04] placeholder:text-zinc-600 focus:border-yellow-400'
                  }`}
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  rows={5}
                  placeholder="Describe what you built and the problem it solves..."
                  disabled={saving}
                  className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition ${
                    lightMode
                      ? 'border-zinc-200 bg-zinc-50 placeholder:text-zinc-400 focus:border-yellow-400'
                      : 'border-white/10 bg-white/[0.04] placeholder:text-zinc-600 focus:border-yellow-400'
                  }`}
                />
              </div>

              {/* Category + Technologies */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-medium"
                  >
                    Category
                  </label>

                  <select
                    id="category"
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value)
                    }
                    disabled={saving}
                    className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                      lightMode
                        ? 'border-zinc-200 bg-zinc-50 focus:border-yellow-400'
                        : 'border-white/10 bg-white/[0.04] focus:border-yellow-400'
                    }`}
                  >
                    <option value="">
                      Select category
                    </option>

                    <option value="Web">
                      Web
                    </option>

                    <option value="Mobile">
                      Mobile
                    </option>

                    <option value="Design">
                      Design
                    </option>

                    <option value="API">
                      API
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="technologies"
                    className="mb-2 block text-sm font-medium"
                  >
                    Technologies
                  </label>

                  <input
                    id="technologies"
                    type="text"
                    value={technologies}
                    onChange={(e) =>
                      setTechnologies(
                        e.target.value
                      )
                    }
                    placeholder="Next.js, React, TypeScript, Supabase"
                    disabled={saving}
                    className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                      lightMode
                        ? 'border-zinc-200 bg-zinc-50 placeholder:text-zinc-400 focus:border-yellow-400'
                        : 'border-white/10 bg-white/[0.04] placeholder:text-zinc-600 focus:border-yellow-400'
                    }`}
                  />

                  <p
                    className={`mt-2 text-xs ${
                      lightMode
                        ? 'text-zinc-400'
                        : 'text-zinc-500'
                    }`}
                  >
                    Separate each technology
                    with a comma.
                  </p>
                </div>
              </div>

              {/* Link */}
              <div>
                <label
                  htmlFor="link"
                  className="mb-2 block text-sm font-medium"
                >
                  Project URL
                </label>

                <input
                  id="link"
                  type="url"
                  value={link}
                  onChange={(e) =>
                    setLink(e.target.value)
                  }
                  placeholder="https://example.com"
                  disabled={saving}
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                    lightMode
                      ? 'border-zinc-200 bg-zinc-50 placeholder:text-zinc-400 focus:border-yellow-400'
                      : 'border-white/10 bg-white/[0.04] placeholder:text-zinc-600 focus:border-yellow-400'
                  }`}
                />
              </div>

              {/* Images */}
              <div>
                <div className="mb-3 flex items-end justify-between gap-4">
                  <div>
                    <label className="block text-sm font-medium">
                      Project images
                    </label>

                    <p
                      className={`mt-1 text-xs ${
                        lightMode
                          ? 'text-zinc-500'
                          : 'text-zinc-500'
                      }`}
                    >
                      Add up to 5 images. The first
                      image is the primary image.
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                      totalImages === MAX_IMAGES
                        ? 'bg-yellow-400/10 text-yellow-500'
                        : lightMode
                          ? 'bg-zinc-100 text-zinc-500'
                          : 'bg-white/[0.05] text-zinc-500'
                    }`}
                  >
                    {totalImages}/{MAX_IMAGES}
                  </span>
                </div>

                {/* Image grid */}
                {totalImages > 0 && (
                  <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {/* Existing images */}
                    {existingImages.map(
                      (image, index) => (
                        <div
                          key={`${image}-${index}`}
                          className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10"
                        >
                          <img
                            src={image}
                            alt={`${title} image ${index + 1}`}
                            className="h-full w-full object-cover"
                          />

                          {/* Primary label */}
                          <div className="absolute left-2 top-2 rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
                            {index === 0
                              ? 'Primary'
                              : `Image ${index + 1}`}
                          </div>

                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() =>
                              removeExistingImage(
                                index
                              )
                            }
                            disabled={saving}
                            aria-label={`Remove image ${index + 1}`}
                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-md transition hover:bg-red-500"
                          >
                            <FiX size={15} />
                          </button>
                        </div>
                      )
                    )}

                    {/* New images */}
                    {newImages.map(
                      (image, index) => {
                        const displayIndex =
                          existingImages.length +
                          index;

                        return (
                          <div
                            key={image.preview}
                            className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-yellow-400/30"
                          >
                            <img
                              src={image.preview}
                              alt={`New project image ${
                                displayIndex + 1
                              }`}
                              className="h-full w-full object-cover"
                            />

                            <div className="absolute left-2 top-2 rounded-full bg-yellow-400 px-2.5 py-1 text-[10px] font-semibold text-black">
                              {displayIndex === 0
                                ? 'Primary'
                                : `Image ${
                                    displayIndex + 1
                                  }`}
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removeNewImage(
                                  index
                                )
                              }
                              disabled={saving}
                              aria-label={`Remove new image ${
                                displayIndex + 1
                              }`}
                              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-md transition hover:bg-red-500"
                            >
                              <FiX size={15} />
                            </button>

                            <div className="absolute bottom-0 left-0 right-0 truncate bg-black/65 px-3 py-2 text-[10px] text-white backdrop-blur-md">
                              {image.file.name}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}

                {/* Add images */}
                {totalImages < MAX_IMAGES && (
                  <label
                    className={`flex min-h-[170px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed transition ${
                      lightMode
                        ? 'border-zinc-300 bg-zinc-50 hover:border-yellow-400/60 hover:bg-yellow-400/[0.025]'
                        : 'border-white/10 bg-white/[0.02] hover:border-yellow-400/50 hover:bg-yellow-400/[0.025]'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      multiple
                      onChange={
                        handleImageChange
                      }
                      disabled={saving}
                      className="hidden"
                    />

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-500">
                      <FiUpload size={19} />
                    </div>

                    <p className="mt-3 text-sm font-medium">
                      {totalImages === 0
                        ? 'Upload project images'
                        : 'Add more images'}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      {MAX_IMAGES -
                        totalImages}{' '}
                      slot
                      {MAX_IMAGES -
                        totalImages ===
                      1
                        ? ''
                        : 's'}{' '}
                      remaining
                    </p>

                    <p className="mt-1 text-[10px] text-zinc-600">
                      PNG, JPG or WebP ·
                      Maximum 5MB per image
                    </p>
                  </label>
                )}

                {/* Maximum reached */}
                {totalImages ===
                  MAX_IMAGES && (
                  <div
                    className={`mt-3 flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs ${
                      lightMode
                        ? 'border-yellow-400/20 bg-yellow-400/[0.04] text-yellow-600'
                        : 'border-yellow-400/20 bg-yellow-400/[0.04] text-yellow-400'
                    }`}
                  >
                    <FiCheck size={14} />
                    Maximum of 5 images reached
                  </div>
                )}
              </div>

              {/* Featured */}
              <div
                className={`flex items-center justify-between rounded-xl border p-4 ${
                  lightMode
                    ? 'border-zinc-200 bg-zinc-50'
                    : 'border-white/10 bg-white/[0.02]'
                }`}
              >
                <div>
                  <p className="text-sm font-medium">
                    Featured project
                  </p>

                  <p
                    className={`mt-1 text-xs ${
                      lightMode
                        ? 'text-zinc-500'
                        : 'text-zinc-500'
                    }`}
                  >
                    Highlight this project on
                    your portfolio.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setFeatured(
                      !featured
                    )
                  }
                  aria-pressed={featured}
                  disabled={saving}
                  className={`relative h-6 w-11 rounded-full transition ${
                    featured
                      ? 'bg-yellow-400'
                      : lightMode
                        ? 'bg-zinc-300'
                        : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                      featured
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Errors */}
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                  <FiCheck />
                  {success}
                </div>
              )}
            </div>

            {/* Actions */}
            <div
              className={`flex flex-col-reverse gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 ${
                lightMode
                  ? 'border-zinc-200'
                  : 'border-white/10'
              }`}
            >
              <Link
                href="/admin/projects"
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition ${
                  lightMode
                    ? 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <FiX />
                Cancel
              </Link>

              <button
                type="submit"
                disabled={
                  saving || uploading
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ||
                uploading ? (
                  <>
                    <FiLoader className="animate-spin" />

                    {uploading
                      ? 'Uploading images...'
                      : 'Saving changes...'}
                  </>
                ) : (
                  <>
                    <FiSave />
                    Save changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

