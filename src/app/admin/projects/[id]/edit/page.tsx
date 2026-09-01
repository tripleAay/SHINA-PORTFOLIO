'use client';

import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FiArrowLeft,
  FiCheck,
  FiImage,
  FiLoader,
  FiSave,
  FiUpload,
  FiX,
} from 'react-icons/fi';

import { useTheme } from '@/app/contexts/ThemeContext';
import { supabase } from '@/app/lib/supabase';

type PortfolioProject = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  link: string | null;
  category: string | null;
  technologies: string | null;
  featured: boolean;
};

export default function EditProjectPage() {
  const { lightMode } = useTheme();
  const router = useRouter();
  const params = useParams();

  const projectId = params.id as string;

  const [project, setProject] = useState<PortfolioProject | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [link, setLink] = useState('');
  const [featured, setFeatured] = useState(false);

  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProject();
  }, [projectId]);

  async function loadProject() {
    setLoading(true);
    setError('');

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace('/admin/login');
      return;
    }

    const { data, error: fetchError } = await supabase
      .from('portfolio')
      .select(
        'id, title, description, image, link, category, technologies, featured'
      )
      .eq('id', projectId)
      .single();

    if (fetchError || !data) {
      setError(fetchError?.message || 'Project could not be found.');
      setLoading(false);
      return;
    }

    const loadedProject = data as PortfolioProject;

    setProject(loadedProject);

    setTitle(loadedProject.title);
    setDescription(loadedProject.description);
    setCategory(loadedProject.category || '');
    setTechnologies(loadedProject.technologies || '');
    setLink(loadedProject.link || '');
    setFeatured(loadedProject.featured);
    setCurrentImage(loadedProject.image);

    setLoading(false);
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB.');
      return;
    }

    setError('');
    setNewImage(file);

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  }

  function removeNewImage() {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setNewImage(null);
    setPreview(null);
  }

  function getStoragePathFromUrl(url: string) {
    const marker = '/storage/v1/object/public/portfolio-images/';

    const index = url.indexOf(marker);

    if (index === -1) {
      return null;
    }

    return decodeURIComponent(url.substring(index + marker.length));
  }

  async function uploadNewImage(file: File) {
    setUploading(true);

    const extension =
      file.name.split('.').pop()?.toLowerCase() || 'jpg';

    const filePath = `projects/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      setUploading(false);
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(filePath);

    setUploading(false);

    return {
      url: data.publicUrl,
      path: filePath,
    };
  }

  async function deleteStorageImage(url: string | null) {
    if (!url) return;

    const path = getStoragePathFromUrl(url);

    if (!path) return;

    await supabase.storage
      .from('portfolio-images')
      .remove([path]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!title.trim()) {
      setError('Project title is required.');
      return;
    }

    if (!description.trim()) {
      setError('Project description is required.');
      return;
    }

    setSaving(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/admin/login');
        return;
      }

      let imageUrl = currentImage;
      let uploadedImagePath: string | null = null;

      /*
       * Upload the new image first.
       * We only delete the old image after the database update succeeds.
       */
      if (newImage) {
        const uploaded = await uploadNewImage(newImage);

        imageUrl = uploaded.url;
        uploadedImagePath = uploaded.path;
      }

      const { error: updateError } = await supabase
        .from('portfolio')
        .update({
          title: title.trim(),
          description: description.trim(),
          category: category.trim() || null,
          technologies: technologies.trim() || null,
          link: link.trim() || null,
          featured,
          image: imageUrl,
        })
        .eq('id', projectId);

      /*
       * If the database update fails, remove the newly uploaded image
       * so we don't leave an orphaned file in Storage.
       */
      if (updateError) {
        if (uploadedImagePath) {
          await supabase.storage
            .from('portfolio-images')
            .remove([uploadedImagePath]);
        }

        throw new Error(updateError.message);
      }

      /*
       * Database update succeeded.
       * Now it is safe to remove the previous image.
       */
      if (newImage && currentImage) {
        await deleteStorageImage(currentImage);
      }

      setCurrentImage(imageUrl);
      setNewImage(null);

      if (preview) {
        URL.revokeObjectURL(preview);
      }

      setPreview(null);

      setSuccess('Project updated successfully.');

      setTimeout(() => {
        router.push('/admin/projects');
      }, 900);
    } catch (err) {
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
                lightMode ? 'text-zinc-500' : 'text-zinc-400'
              }`}
            >
              {error || 'This project does not exist.'}
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

  const displayedImage = preview || currentImage;

  return (
    <main
      className={`min-h-screen ${
        lightMode
          ? 'bg-[#F7F5F0] text-zinc-900'
          : 'bg-[#09090B] text-white'
      }`}
    >
      {/* Subtle background */}
      <div
        className={`pointer-events-none fixed inset-0 ${
          lightMode
            ? 'bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.08),transparent_35%)]'
            : 'bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.06),transparent_35%)]'
        }`}
      />

      <div className="relative mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
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
                lightMode ? 'text-zinc-500' : 'text-zinc-400'
              }`}
            >
              Update your portfolio project.
            </p>
          </div>
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
                Keep your project information clear and concise.
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
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Fynaro Digital Platform"
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
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Describe what you built and the problem it solves..."
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
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                      lightMode
                        ? 'border-zinc-200 bg-zinc-50 focus:border-yellow-400'
                        : 'border-white/10 bg-white/[0.04] focus:border-yellow-400'
                    }`}
                  >
                    <option value="">Select category</option>
                    <option value="Web">Web</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Design">Design</option>
                    <option value="API">API</option>
                    <option value="Other">Other</option>
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
                      setTechnologies(e.target.value)
                    }
                    placeholder="Next.js, React, TypeScript, Supabase"
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
                    Separate each technology with a comma.
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
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://example.com"
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                    lightMode
                      ? 'border-zinc-200 bg-zinc-50 placeholder:text-zinc-400 focus:border-yellow-400'
                      : 'border-white/10 bg-white/[0.04] placeholder:text-zinc-600 focus:border-yellow-400'
                  }`}
                />
              </div>

              {/* Image */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Project image
                </label>

                <div className="grid gap-5 md:grid-cols-[220px_1fr]">
                  {/* Preview */}
                  <div
                    className={`relative aspect-[4/3] overflow-hidden rounded-xl border ${
                      lightMode
                        ? 'border-zinc-200 bg-zinc-100'
                        : 'border-white/10 bg-white/[0.03]'
                    }`}
                  >
                    {displayedImage ? (
                      <>
                        <img
                          src={displayedImage}
                          alt={title || 'Project preview'}
                          className="h-full w-full object-cover"
                        />

                        {preview && (
                          <div className="absolute left-2 top-2 rounded-full bg-yellow-400 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-black">
                            New image
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 text-zinc-500">
                        <FiImage className="text-2xl" />
                        <span className="text-xs">
                          No image
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Upload controls */}
                  <div className="flex flex-col justify-center">
                    <div
                      className={`rounded-xl border border-dashed p-5 ${
                        lightMode
                          ? 'border-zinc-300 bg-zinc-50'
                          : 'border-white/10 bg-white/[0.02]'
                      }`}
                    >
                      <FiUpload className="mb-3 text-xl text-yellow-400" />

                      <p className="text-sm font-medium">
                        Replace project image
                      </p>

                      <p
                        className={`mt-1 text-xs ${
                          lightMode
                            ? 'text-zinc-500'
                            : 'text-zinc-500'
                        }`}
                      >
                        JPG, PNG or WebP · Maximum 5MB
                      </p>

                      <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-yellow-400/30 bg-yellow-400/10 px-4 py-2.5 text-xs font-medium text-yellow-500 transition hover:bg-yellow-400/20">
                        <FiUpload />
                        Choose new image

                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>

                      {preview && (
                        <button
                          type="button"
                          onClick={removeNewImage}
                          className={`ml-2 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-medium transition ${
                            lightMode
                              ? 'text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900'
                              : 'text-zinc-400 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <FiX />
                          Cancel replacement
                        </button>
                      )}
                    </div>
                  </div>
                </div>
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
                    Highlight this project on your portfolio.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setFeatured(!featured)}
                  aria-pressed={featured}
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
                disabled={saving || uploading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving || uploading ? (
                  <>
                    <FiLoader className="animate-spin" />
                    {uploading
                      ? 'Uploading image...'
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