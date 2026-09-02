'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiEdit2,
  FiExternalLink,
  FiFolder,
  FiImage,
  FiLogOut,
  FiMail,
  FiMessageSquare,
  FiMoon,
  FiPlus,
  FiRefreshCw,
  FiSun,
  FiTrash2,
  FiUser,
} from 'react-icons/fi';

import { createClient } from '@/app/lib/client';
import { useTheme } from '@/app/contexts/ThemeContext';

type Project = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  link: string | null;
  category: string | null;
  technologies: string | null;
  featured: boolean;
  created_at: string;
};

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const { lightMode, toggleTheme } = useTheme();

  /*
   * IMPORTANT:
   * Do NOT create the Supabase client at module level.
   *
   * This prevents the Vercel/Next.js build error caused by:
   *
   * export const supabase = createClient();
   *
   * inside supabase.ts.
   *
   * useMemo keeps one browser client for this component.
   */
  const supabase = useMemo(() => createClient(), []);

  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const [error, setError] = useState('');

  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(
    null
  );

  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(
    null
  );

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard(showRefreshLoader = false) {
    if (showRefreshLoader) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError('');

    try {
      /*
       * Check authentication first.
       */
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(userError.message);
      }

      if (!user) {
        router.replace('/admin/login');
        return;
      }

      /*
       * Load projects and messages at the same time.
       */
      const [projectsResult, messagesResult] = await Promise.all([
        supabase
          .from('portfolio')
          .select(
            'id, title, description, image, link, category, technologies, featured, created_at'
          )
          .order('created_at', { ascending: false }),

        supabase
          .from('messages')
          .select(
            'id, name, email, subject, message, read, created_at'
          )
          .order('created_at', { ascending: false }),
      ]);

      if (projectsResult.error) {
        throw new Error(
          `Could not load projects: ${projectsResult.error.message}`
        );
      }

      if (messagesResult.error) {
        throw new Error(
          `Could not load messages: ${messagesResult.error.message}`
        );
      }

      setProjects((projectsResult.data || []) as Project[]);
      setMessages((messagesResult.data || []) as Message[]);
    } catch (err) {
      console.error('Dashboard loading error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while loading the dashboard.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    setError('');

    try {
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        throw new Error(signOutError.message);
      }

      router.replace('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Sign out error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Could not sign out. Please try again.'
      );

      setSigningOut(false);
    }
  }

  async function handleDeleteProject(project: Project) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingProjectId(project.id);
    setError('');

    try {
      /*
       * Delete the database record first.
       */
      const { error: deleteError } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', project.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      /*
       * Remove the project from the UI immediately.
       */
      setProjects((current) =>
        current.filter((item) => item.id !== project.id)
      );

      /*
       * If the project has an image, try to remove it from Storage too.
       *
       * This is intentionally non-blocking because the database record
       * has already been successfully deleted.
       */
      if (project.image) {
        const storagePath = getStoragePathFromUrl(project.image);

        if (storagePath) {
          await supabase.storage
            .from('portfolio-images')
            .remove([storagePath]);
        }
      }
    } catch (err) {
      console.error('Delete project error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Could not delete the project.'
      );
    } finally {
      setDeletingProjectId(null);
    }
  }

  async function handleDeleteMessage(message: Message) {
    const confirmed = window.confirm(
      `Delete the message from ${message.name}?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingMessageId(message.id);
    setError('');

    try {
      const { error: deleteError } = await supabase
        .from('messages')
        .delete()
        .eq('id', message.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      setMessages((current) =>
        current.filter((item) => item.id !== message.id)
      );
    } catch (err) {
      console.error('Delete message error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Could not delete the message.'
      );
    } finally {
      setDeletingMessageId(null);
    }
  }

  async function handleMarkMessageAsRead(message: Message) {
    if (message.read) return;

    try {
      const { error: updateError } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', message.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setMessages((current) =>
        current.map((item) =>
          item.id === message.id
            ? { ...item, read: true }
            : item
        )
      );
    } catch (err) {
      console.error('Mark message as read error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Could not update the message.'
      );
    }
  }

  function getStoragePathFromUrl(url: string) {
    const marker =
      '/storage/v1/object/public/portfolio-images/';

    const index = url.indexOf(marker);

    if (index === -1) {
      return null;
    }

    return decodeURIComponent(
      url.substring(index + marker.length)
    );
  }

  const unreadMessages = messages.filter(
    (message) => !message.read
  ).length;

  const featuredProjects = projects.filter(
    (project) => project.featured
  ).length;

  const pageBackground = lightMode
    ? 'bg-[#f7f4ee] text-zinc-900'
    : 'bg-[#09090b] text-zinc-100';

  const cardBackground = lightMode
    ? 'bg-white border-zinc-200'
    : 'bg-zinc-950/80 border-zinc-800';

  const mutedText = lightMode
    ? 'text-zinc-500'
    : 'text-zinc-400';

  const subtleText = lightMode
    ? 'text-zinc-600'
    : 'text-zinc-300';

  const inputBackground = lightMode
    ? 'bg-white border-zinc-200'
    : 'bg-zinc-900 border-zinc-800';

  if (loading) {
    return (
      <main
        className={`min-h-screen flex items-center justify-center ${pageBackground}`}
      >
        <div className="flex flex-col items-center gap-4">
          <FiRefreshCw className="w-6 h-6 animate-spin text-yellow-400" />

          <p className={`text-sm ${mutedText}`}>
            Loading dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen ${pageBackground}`}>
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute inset-0 ${
            lightMode
              ? 'bg-[linear-gradient(rgba(0,0,0,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.025)_1px,transparent_1px)]'
              : 'bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)]'
          } bg-[size:48px_48px]`}
        />

        <div
          className={`absolute top-[-250px] right-[-200px] w-[500px] h-[500px] rounded-full blur-[140px] ${
            lightMode
              ? 'bg-yellow-300/10'
              : 'bg-yellow-400/5'
          }`}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header
          className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
            lightMode
              ? 'bg-[#f7f4ee]/85 border-zinc-200'
              : 'bg-[#09090b]/85 border-zinc-800'
          }`}
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="h-20 flex items-center justify-between">
              {/* Brand */}
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold text-sm transition-transform duration-300 group-hover:scale-105">
                  AA
                </div>

                <div className="hidden sm:block">
                  <p className="text-sm font-semibold">
                    Admin Dashboard
                  </p>

                  <p className={`text-xs ${mutedText}`}>
                    Portfolio management
                  </p>
                </div>
              </Link>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link
                  href="/"
                  className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-colors ${
                    lightMode
                      ? 'hover:bg-zinc-100'
                      : 'hover:bg-zinc-900'
                  }`}
                >
                  <FiExternalLink className="w-4 h-4" />
                  View site
                </Link>

                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={
                    lightMode
                      ? 'Switch to dark mode'
                      : 'Switch to light mode'
                  }
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    lightMode
                      ? 'hover:bg-zinc-100'
                      : 'hover:bg-zinc-900'
                  }`}
                >
                  {lightMode ? (
                    <FiMoon className="w-4 h-4" />
                  ) : (
                    <FiSun className="w-4 h-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400 text-black text-sm font-semibold hover:bg-yellow-300 transition-colors disabled:opacity-50"
                >
                  <FiLogOut className="w-4 h-4" />

                  <span className="hidden sm:inline">
                    {signingOut ? 'Signing out...' : 'Sign out'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
          {/* Back */}
          <Link
            href="/"
            className={`inline-flex items-center gap-2 text-sm mb-8 transition-colors ${
              lightMode
                ? 'text-zinc-500 hover:text-zinc-900'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to portfolio
          </Link>

          {/* Heading */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-yellow-500 font-semibold mb-3">
                Control center
              </p>

              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                Welcome back.
              </h1>

              <p className={`mt-3 max-w-xl ${mutedText}`}>
                Manage your portfolio projects and keep track of
                messages from visitors.
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadDashboard(true)}
              disabled={refreshing}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border text-sm transition-colors disabled:opacity-50 ${inputBackground}`}
            >
              <FiRefreshCw
                className={`w-4 h-4 ${
                  refreshing ? 'animate-spin' : ''
                }`}
              />

              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div
              className={`mb-8 rounded-2xl border px-5 py-4 ${
                lightMode
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-red-950/30 border-red-900 text-red-300'
              }`}
            >
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div
              className={`rounded-2xl border p-5 ${cardBackground}`}
            >
              <div className="flex items-center justify-between mb-5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    lightMode
                      ? 'bg-zinc-100'
                      : 'bg-zinc-900'
                  }`}
                >
                  <FiFolder className="w-5 h-5" />
                </div>

                <span className="text-xs text-yellow-500 font-medium">
                  Projects
                </span>
              </div>

              <p className="text-3xl font-semibold">
                {projects.length}
              </p>

              <p className={`text-sm mt-1 ${mutedText}`}>
                Total projects
              </p>
            </div>

            <div
              className={`rounded-2xl border p-5 ${cardBackground}`}
            >
              <div className="flex items-center justify-between mb-5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    lightMode
                      ? 'bg-zinc-100'
                      : 'bg-zinc-900'
                  }`}
                >
                  <FiCheckCircle className="w-5 h-5" />
                </div>

                <span className="text-xs text-yellow-500 font-medium">
                  Featured
                </span>
              </div>

              <p className="text-3xl font-semibold">
                {featuredProjects}
              </p>

              <p className={`text-sm mt-1 ${mutedText}`}>
                Featured projects
              </p>
            </div>

            <div
              className={`rounded-2xl border p-5 ${cardBackground}`}
            >
              <div className="flex items-center justify-between mb-5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    lightMode
                      ? 'bg-zinc-100'
                      : 'bg-zinc-900'
                  }`}
                >
                  <FiMail className="w-5 h-5" />
                </div>

                <span className="text-xs text-yellow-500 font-medium">
                  Messages
                </span>
              </div>

              <p className="text-3xl font-semibold">
                {messages.length}
              </p>

              <p className={`text-sm mt-1 ${mutedText}`}>
                Total messages
              </p>
            </div>

            <div
              className={`rounded-2xl border p-5 ${cardBackground}`}
            >
              <div className="flex items-center justify-between mb-5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    lightMode
                      ? 'bg-zinc-100'
                      : 'bg-zinc-900'
                  }`}
                >
                  <FiMessageSquare className="w-5 h-5" />
                </div>

                <span className="text-xs text-yellow-500 font-medium">
                  Unread
                </span>
              </div>

              <p className="text-3xl font-semibold">
                {unreadMessages}
              </p>

              <p className={`text-sm mt-1 ${mutedText}`}>
                Unread messages
              </p>
            </div>
          </section>

          {/* Quick actions */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <Link
              href="/admin/projects/new"
              className={`group rounded-2xl border p-6 transition-all duration-300 ${
                lightMode
                  ? 'bg-white border-zinc-200 hover:border-yellow-400 hover:shadow-lg'
                  : 'bg-zinc-950/80 border-zinc-800 hover:border-yellow-400/50'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-yellow-400 text-black flex items-center justify-center mb-5">
                    <FiPlus className="w-5 h-5" />
                  </div>

                  <h2 className="font-semibold text-lg">
                    Add new project
                  </h2>

                  <p className={`text-sm mt-2 ${mutedText}`}>
                    Create a portfolio project with images,
                    technologies, links and featured status.
                  </p>
                </div>

                <FiExternalLink
                  className={`w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 ${mutedText}`}
                />
              </div>
            </Link>

            <Link
              href="/admin/projects"
              className={`group rounded-2xl border p-6 transition-all duration-300 ${
                lightMode
                  ? 'bg-white border-zinc-200 hover:border-yellow-400 hover:shadow-lg'
                  : 'bg-zinc-950/80 border-zinc-800 hover:border-yellow-400/50'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${
                      lightMode
                        ? 'bg-zinc-100'
                        : 'bg-zinc-900'
                    }`}
                  >
                    <FiFolder className="w-5 h-5" />
                  </div>

                  <h2 className="font-semibold text-lg">
                    Manage projects
                  </h2>

                  <p className={`text-sm mt-2 ${mutedText}`}>
                    View, edit and remove existing portfolio
                    projects.
                  </p>
                </div>

                <FiExternalLink
                  className={`w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 ${mutedText}`}
                />
              </div>
            </Link>
          </section>

          {/* Projects */}
          <section
            className={`rounded-2xl border overflow-hidden mb-10 ${cardBackground}`}
          >
            <div
              className={`px-6 py-5 border-b ${
                lightMode
                  ? 'border-zinc-200'
                  : 'border-zinc-800'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-lg">
                    Recent projects
                  </h2>

                  <p className={`text-sm mt-1 ${mutedText}`}>
                    Your latest portfolio work.
                  </p>
                </div>

                <Link
                  href="/admin/projects"
                  className="text-sm text-yellow-500 hover:text-yellow-400 transition-colors"
                >
                  View all
                </Link>
              </div>
            </div>

            {projects.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <FiFolder
                  className={`w-8 h-8 mx-auto mb-4 ${mutedText}`}
                />

                <h3 className="font-medium">
                  No projects yet
                </h3>

                <p className={`text-sm mt-2 ${mutedText}`}>
                  Add your first portfolio project.
                </p>

                <Link
                  href="/admin/projects/new"
                  className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-full bg-yellow-400 text-black text-sm font-semibold hover:bg-yellow-300 transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                  Add project
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/60">
                {projects.slice(0, 5).map((project) => (
                  <div
                    key={project.id}
                    className={`px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-5 ${
                      lightMode
                        ? 'border-zinc-200'
                        : ''
                    }`}
                  >
                    {/* Image */}
                    <div
                      className={`w-full sm:w-24 h-20 rounded-xl overflow-hidden shrink-0 flex items-center justify-center ${
                        lightMode
                          ? 'bg-zinc-100'
                          : 'bg-zinc-900'
                      }`}
                    >
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiImage
                          className={`w-6 h-6 ${mutedText}`}
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium truncate">
                          {project.title}
                        </h3>

                        {project.featured && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-500 text-[11px] font-medium">
                            <FiCheckCircle className="w-3 h-3" />
                            Featured
                          </span>
                        )}
                      </div>

                      {project.category && (
                        <p
                          className={`text-xs mt-1 ${mutedText}`}
                        >
                          {project.category}
                        </p>
                      )}

                      <p
                        className={`text-sm mt-2 line-clamp-2 ${mutedText}`}
                      >
                        {project.description}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                          lightMode
                            ? 'hover:bg-zinc-100'
                            : 'hover:bg-zinc-900'
                        }`}
                        title="Edit project"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </Link>

                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                            lightMode
                              ? 'hover:bg-zinc-100'
                              : 'hover:bg-zinc-900'
                          }`}
                          title="Open project"
                        >
                          <FiExternalLink className="w-4 h-4" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteProject(project)
                        }
                        disabled={
                          deletingProjectId === project.id
                        }
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 ${
                          lightMode
                            ? 'hover:bg-red-50 hover:text-red-600'
                            : 'hover:bg-red-950/40 hover:text-red-400'
                        }`}
                        title="Delete project"
                      >
                        {deletingProjectId === project.id ? (
                          <FiRefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <FiTrash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Messages */}
          <section
            className={`rounded-2xl border overflow-hidden ${cardBackground}`}
          >
            <div
              className={`px-6 py-5 border-b ${
                lightMode
                  ? 'border-zinc-200'
                  : 'border-zinc-800'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-lg">
                    Recent messages
                  </h2>

                  <p className={`text-sm mt-1 ${mutedText}`}>
                    Messages submitted through your contact form.
                  </p>
                </div>

                {unreadMessages > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-yellow-400 text-black text-xs font-semibold">
                    {unreadMessages} unread
                  </span>
                )}
              </div>
            </div>

            {messages.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <FiMail
                  className={`w-8 h-8 mx-auto mb-4 ${mutedText}`}
                />

                <h3 className="font-medium">
                  No messages yet
                </h3>

                <p className={`text-sm mt-2 ${mutedText}`}>
                  Contact form submissions will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/60">
                {messages.slice(0, 8).map((message) => (
                  <div
                    key={message.id}
                    className={`px-6 py-5 ${
                      !message.read
                        ? lightMode
                          ? 'bg-yellow-50/50'
                          : 'bg-yellow-400/[0.03]'
                        : ''
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                      {/* Avatar */}
                      <div
                        className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center ${
                          message.read
                            ? lightMode
                              ? 'bg-zinc-100'
                              : 'bg-zinc-900'
                            : 'bg-yellow-400 text-black'
                        }`}
                      >
                        <FiUser className="w-4 h-4" />
                      </div>

                      {/* Message */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-medium">
                            {message.name}
                          </h3>

                          {!message.read && (
                            <span className="w-2 h-2 rounded-full bg-yellow-400" />
                          )}
                        </div>

                        <a
                          href={`mailto:${message.email}`}
                          className="text-sm text-yellow-500 hover:text-yellow-400 transition-colors"
                        >
                          {message.email}
                        </a>

                        {message.subject && (
                          <p className="font-medium text-sm mt-3">
                            {message.subject}
                          </p>
                        )}

                        <p
                          className={`text-sm mt-2 whitespace-pre-wrap leading-relaxed ${subtleText}`}
                        >
                          {message.message}
                        </p>

                        <p
                          className={`text-xs mt-4 ${mutedText}`}
                        >
                          {new Date(
                            message.created_at
                          ).toLocaleString()}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {!message.read && (
                          <button
                            type="button"
                            onClick={() =>
                              handleMarkMessageAsRead(
                                message
                              )
                            }
                            className={`px-3 py-2 rounded-full text-xs font-medium transition-colors ${
                              lightMode
                                ? 'hover:bg-zinc-100'
                                : 'hover:bg-zinc-900'
                            }`}
                          >
                            Mark read
                          </button>
                        )}

                        <a
                          href={`mailto:${message.email}`}
                          className="w-9 h-9 rounded-full flex items-center justify-center bg-yellow-400 text-black hover:bg-yellow-300 transition-colors"
                          title="Reply by email"
                        >
                          <FiMail className="w-4 h-4" />
                        </a>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteMessage(message)
                          }
                          disabled={
                            deletingMessageId === message.id
                          }
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 ${
                            lightMode
                              ? 'hover:bg-red-50 hover:text-red-600'
                              : 'hover:bg-red-950/40 hover:text-red-400'
                          }`}
                          title="Delete message"
                        >
                          {deletingMessageId === message.id ? (
                            <FiRefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <FiTrash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Footer */}
          <footer
            className={`mt-12 pt-8 border-t ${
              lightMode
                ? 'border-zinc-200'
                : 'border-zinc-800'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className={`text-xs ${mutedText}`}>
                Admin dashboard · Shina Adedokun
              </p>

              <div className="flex items-center gap-2 text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>

                <span className={mutedText}>
                  System operational
                </span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}