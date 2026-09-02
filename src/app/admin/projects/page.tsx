'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiBriefcase,
  FiChevronRight,
  FiEdit3,
  FiExternalLink,
  FiFilter,
  FiGrid,
  FiList,
  FiMenu,
  FiMoon,
  FiPlus,
  FiSearch,
  FiSun,
  FiTrash2,
  FiX,
} from 'react-icons/fi';

import { supabase } from '@/app/lib/supabase';
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

export default function ProjectsPage() {
  const router = useRouter();
  const { lightMode, toggleTheme } = useTheme();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
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
        'id, title, description, image, link, category, technologies, featured, created_at'
      )
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError('Unable to load your projects.');
      setLoading(false);
      return;
    }

    setProjects(data ?? []);
    setLoading(false);
  }

  const categories = useMemo(() => {
    const values = projects
      .map((project) => project.category)
      .filter((value): value is string => Boolean(value?.trim()));

    return ['All', ...Array.from(new Set(values))];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesCategory =
        category === 'All' || project.category === category;

      const matchesSearch =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.technologies?.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [projects, search, category]);

  async function handleDelete(project: Project) {
    const confirmed = window.confirm(
      `Delete "${project.title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(project.id);

    const { error: deleteError } = await supabase
      .from('portfolio')
      .delete()
      .eq('id', project.id);

    if (deleteError) {
      window.alert('Unable to delete this project.');
      setDeletingId(null);
      return;
    }

    setProjects((current) =>
      current.filter((item) => item.id !== project.id)
    );

    setDeletingId(null);
  }

  async function toggleFeatured(project: Project) {
    const nextValue = !project.featured;

    const { error: updateError } = await supabase
      .from('portfolio')
      .update({ featured: nextValue })
      .eq('id', project.id);

    if (updateError) {
      window.alert('Unable to update featured status.');
      return;
    }

    setProjects((current) =>
      current.map((item) =>
        item.id === project.id
          ? { ...item, featured: nextValue }
          : item
      )
    );
  }

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));

  return (
    <main
      className={`min-h-screen transition-colors duration-500 ${
        lightMode
          ? 'bg-[#F7F5F0] text-zinc-900'
          : 'bg-[#09090B] text-white'
      }`}
    >
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col border-r transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${
          lightMode
            ? 'border-black/[0.07] bg-[#F2EFE8]'
            : 'border-white/[0.07] bg-[#0D0D0F]'
        }`}
      >
        {/* Logo */}
        <div
          className={`flex h-[76px] items-center border-b px-6 ${
            lightMode ? 'border-black/[0.07]' : 'border-white/[0.07]'
          }`}
        >
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-black">
              AA
            </span>

            <div>
              <p className="text-sm font-semibold tracking-tight">
                SHINA ADMIN
              </p>

              <p className="text-[10px] tracking-[0.18em] text-zinc-600">
                CONTROL CENTER
              </p>
            </div>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="ml-auto text-zinc-500 lg:hidden"
          >
            <FiX size={19} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-7 px-4 py-7">
          <NavGroup label="Overview">
            <NavItem
              href="/admin"
              icon={<FiGrid size={17} />}
              lightMode={lightMode}
            >
              Dashboard
            </NavItem>
          </NavGroup>

          <NavGroup label="Content">
            <NavItem
              href="/admin/projects"
              icon={<FiBriefcase size={17} />}
              active
              lightMode={lightMode}
            >
              Projects
            </NavItem>

            <NavItem
              href="/admin/projects/new"
              icon={<FiPlus size={17} />}
              lightMode={lightMode}
            >
              Add Project
            </NavItem>
          </NavGroup>

          <NavGroup label="Communication">
            <NavItem
              href="/admin/messages"
              icon={<span className="text-[17px]">✉</span>}
              lightMode={lightMode}
            >
              Messages
            </NavItem>
          </NavGroup>

          <NavGroup label="System">
            <NavItem
              href="/admin/settings"
              icon={<span className="text-[16px]">⚙</span>}
              lightMode={lightMode}
            >
              Settings
            </NavItem>
          </NavGroup>
        </nav>

        <div
          className={`space-y-1 border-t p-4 ${
            lightMode ? 'border-black/[0.07]' : 'border-white/[0.07]'
          }`}
        >
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-500 transition hover:text-yellow-500"
          >
            <FiExternalLink size={16} />
            View website
          </Link>

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.replace('/admin/login');
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-500 transition hover:text-red-400"
          >
            <span>↪</span>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-[250px]">
        {/* Header */}
        <header
          className={`sticky top-0 z-30 flex h-[76px] items-center border-b px-5 backdrop-blur-xl sm:px-8 lg:px-10 ${
            lightMode
              ? 'border-black/[0.07] bg-[#F7F5F0]/85'
              : 'border-white/[0.07] bg-[#09090B]/85'
          }`}
        >
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-xl p-2 text-zinc-500 lg:hidden"
          >
            <FiMenu size={21} />
          </button>

          <div className="hidden lg:block">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Content
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                lightMode
                  ? 'border-black/[0.07] text-zinc-600 hover:bg-black/[0.04]'
                  : 'border-white/[0.08] text-zinc-400 hover:bg-white/[0.05]'
              }`}
            >
              {lightMode ? <FiMoon size={17} /> : <FiSun size={17} />}
            </button>

            <div className="ml-2 hidden items-center gap-3 border-l border-white/[0.07] pl-4 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-black">
                AA
              </div>

              <div className="hidden md:block">
                <p className="text-sm font-medium">Shina Adedokun</p>
                <p className="text-[11px] text-zinc-500">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page */}
        <section className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-11">
          {/* Page heading */}
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-medium text-yellow-500">
                CONTENT
              </p>

              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Projects
              </h1>

              <p className="mt-2 text-sm text-zinc-500">
                Manage the work displayed on your portfolio.
              </p>
            </div>

            <Link
              href="/admin/projects/new"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 text-sm font-semibold text-black transition hover:bg-yellow-300"
            >
              <FiPlus size={17} />
              Add project
            </Link>
          </div>

          {/* Toolbar */}
          <div
            className={`mt-8 flex flex-col gap-3 rounded-2xl border p-3 sm:flex-row ${
              lightMode
                ? 'border-black/[0.07] bg-white/60'
                : 'border-white/[0.07] bg-white/[0.025]'
            }`}
          >
            {/* Search */}
            <div className="relative flex-1">
              <FiSearch
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search projects..."
                className={`h-11 w-full rounded-xl border bg-transparent pl-11 pr-4 text-sm outline-none transition ${
                  lightMode
                    ? 'border-black/[0.07] placeholder:text-zinc-400 focus:border-yellow-400/60'
                    : 'border-white/[0.07] placeholder:text-zinc-600 focus:border-yellow-400/60'
                }`}
              />

              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  <FiX size={15} />
                </button>
              )}
            </div>

            {/* Category */}
            <div className="relative">
              <FiFilter
                size={15}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className={`h-11 w-full appearance-none rounded-xl border bg-transparent pl-10 pr-9 text-sm outline-none sm:w-[180px] ${
                  lightMode
                    ? 'border-black/[0.07]'
                    : 'border-white/[0.07]'
                }`}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* View switch */}
            <div
              className={`hidden items-center gap-1 rounded-xl border p-1 sm:flex ${
                lightMode
                  ? 'border-black/[0.07]'
                  : 'border-white/[0.07]'
              }`}
            >
              <button
                onClick={() => setView('grid')}
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  view === 'grid'
                    ? 'bg-yellow-400 text-black'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <FiGrid size={16} />
              </button>

              <button
                onClick={() => setView('list')}
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  view === 'list'
                    ? 'bg-yellow-400 text-black'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <FiList size={16} />
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="mb-4 mt-6 flex items-center justify-between">
            <p className="text-xs text-zinc-500">
              {loading
                ? 'Loading projects...'
                : `${filteredProjects.length} ${
                    filteredProjects.length === 1 ? 'project' : 'projects'
                  }`}
            </p>

            {category !== 'All' && (
              <button
                onClick={() => setCategory('All')}
                className="text-xs text-yellow-500 hover:text-yellow-400"
              >
                Clear filter
              </button>
            )}
          </div>

          {/* Error */}
          {error && (
            <div
              className={`rounded-2xl border p-5 text-sm ${
                lightMode
                  ? 'border-red-500/20 bg-red-500/[0.04] text-red-600'
                  : 'border-red-400/20 bg-red-400/[0.05] text-red-300'
              }`}
            >
              <p>{error}</p>

              <button
                onClick={loadProjects}
                className="mt-3 text-xs font-medium underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && !error && <ProjectSkeleton view={view} />}

          {/* Empty */}
          {!loading && !error && filteredProjects.length === 0 && (
            <div
              className={`flex min-h-[360px] flex-col items-center justify-center rounded-2xl border px-6 text-center ${
                lightMode
                  ? 'border-black/[0.07] bg-white/50'
                  : 'border-white/[0.07] bg-white/[0.025]'
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-500">
                <FiBriefcase size={20} />
              </div>

              <h2 className="mt-5 text-sm font-semibold">
                {search || category !== 'All'
                  ? 'No matching projects'
                  : 'No projects yet'}
              </h2>

              <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-500">
                {search || category !== 'All'
                  ? 'Try changing your search or category filter.'
                  : 'Your portfolio is ready for its first project.'}
              </p>

              {!search && category === 'All' && (
                <Link
                  href="/admin/projects/new"
                  className="mt-5 rounded-xl bg-yellow-400 px-4 py-2.5 text-xs font-semibold text-black hover:bg-yellow-300"
                >
                  Add your first project
                </Link>
              )}
            </div>
          )}

          {/* Grid */}
          {!loading &&
            !error &&
            filteredProjects.length > 0 &&
            view === 'grid' && (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    lightMode={lightMode}
                    deleting={deletingId === project.id}
                    onDelete={handleDelete}
                    onToggleFeatured={toggleFeatured}
                  />
                ))}
              </div>
            )}

          {/* List */}
          {!loading &&
            !error &&
            filteredProjects.length > 0 &&
            view === 'list' && (
              <div
                className={`overflow-hidden rounded-2xl border ${
                  lightMode
                    ? 'border-black/[0.07] bg-white/60'
                    : 'border-white/[0.07] bg-white/[0.025]'
                }`}
              >
                {filteredProjects.map((project, index) => (
                  <ProjectListRow
                    key={project.id}
                    project={project}
                    lightMode={lightMode}
                    deleting={deletingId === project.id}
                    last={index === filteredProjects.length - 1}
                    onDelete={handleDelete}
                    onToggleFeatured={toggleFeatured}
                  />
                ))}
              </div>
            )}
        </section>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Navigation                                                                 */
/* -------------------------------------------------------------------------- */

function NavGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 px-3 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">
        {label}
      </p>

      <div className="space-y-1">{children}</div>
    </div>
  );
}

function NavItem({
  href,
  icon,
  children,
  active,
  lightMode,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  lightMode: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
        active
          ? 'bg-yellow-400 text-black'
          : lightMode
            ? 'text-zinc-500 hover:bg-black/[0.04] hover:text-zinc-900'
            : 'text-zinc-500 hover:bg-white/[0.04] hover:text-white'
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* Project Card                                                               */
/* -------------------------------------------------------------------------- */

function ProjectCard({
  project,
  lightMode,
  deleting,
  onDelete,
  onToggleFeatured,
}: {
  project: Project;
  lightMode: boolean;
  deleting: boolean;
  onDelete: (project: Project) => void;
  onToggleFeatured: (project: Project) => void;
}) {
  return (
    <article
      className={`group overflow-hidden rounded-2xl border transition ${
        lightMode
          ? 'border-black/[0.07] bg-white/60 hover:bg-white'
          : 'border-white/[0.07] bg-white/[0.025] hover:bg-white/[0.04]'
      }`}
    >
      {/* Image */}
      <div
        className={`relative aspect-[16/10] overflow-hidden ${
          lightMode ? 'bg-[#E7E1D7]' : 'bg-white/[0.04]'
        }`}
      >
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-500">
            <FiBriefcase size={25} />
          </div>
        )}

        {project.featured && (
          <div className="absolute left-3 top-3 rounded-full bg-yellow-400 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-black">
            Featured
          </div>
        )}

        <div className="absolute right-3 top-3">
          <button
            onClick={() => onToggleFeatured(project)}
            className={`rounded-full px-2.5 py-1 text-[9px] font-medium backdrop-blur-md transition ${
              project.featured
                ? 'bg-black/50 text-white'
                : 'bg-black/40 text-white/70 hover:text-white'
            }`}
          >
            {project.featured ? 'Unfeature' : 'Feature'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold">
              {project.title}
            </h2>

            <p className="mt-1 text-[11px] text-zinc-500">
              {project.category || 'Uncategorized'}
            </p>
          </div>

          {project.link && project.link !== '#' && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${project.title}`}
              className="shrink-0 text-zinc-500 transition hover:text-yellow-500"
            >
              <FiExternalLink size={15} />
            </a>
          )}
        </div>

        <p className="mt-4 line-clamp-2 text-xs leading-5 text-zinc-500">
          {project.description}
        </p>

        {/* Technologies */}
        {project.technologies && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies
              .split(',')
              .map((tech) => tech.trim())
              .filter(Boolean)
              .slice(0, 4)
              .map((tech) => (
                <span
                  key={tech}
                  className={`rounded-md px-2 py-1 text-[9px] ${
                    lightMode
                      ? 'bg-black/[0.04] text-zinc-500'
                      : 'bg-white/[0.05] text-zinc-500'
                  }`}
                >
                  {tech}
                </span>
              ))}
          </div>
        )}

        {/* Actions */}
        <div
          className={`mt-5 flex items-center justify-between border-t pt-4 ${
            lightMode ? 'border-black/[0.06]' : 'border-white/[0.06]'
          }`}
        >
          <p className="text-[10px] text-zinc-600">
            {new Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }).format(new Date(project.created_at))}
          </p>

          <div className="flex items-center gap-1">
            <Link
              href={`/admin/projects/${project.id}/edit`}
              className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] text-zinc-500 transition hover:bg-yellow-400/10 hover:text-yellow-500"
            >
              <FiEdit3 size={13} />
              Edit
            </Link>

            <button
              onClick={() => onDelete(project)}
              disabled={deleting}
              className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] text-zinc-500 transition hover:bg-red-400/10 hover:text-red-400 disabled:opacity-50"
            >
              <FiTrash2 size={13} />
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Project List                                                               */
/* -------------------------------------------------------------------------- */

function ProjectListRow({
  project,
  lightMode,
  deleting,
  last,
  onDelete,
  onToggleFeatured,
}: {
  project: Project;
  lightMode: boolean;
  deleting: boolean;
  last: boolean;
  onDelete: (project: Project) => void;
  onToggleFeatured: (project: Project) => void;
}) {
  return (
    <div
      className={`flex flex-col gap-4 p-4 sm:flex-row sm:items-center ${
        !last
          ? lightMode
            ? 'border-b border-black/[0.06]'
            : 'border-b border-white/[0.06]'
          : ''
      }`}
    >
      <div
        className={`h-16 w-full shrink-0 overflow-hidden rounded-xl sm:h-14 sm:w-20 ${
          lightMode ? 'bg-[#E7E1D7]' : 'bg-white/[0.04]'
        }`}
      >
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-500">
            <FiBriefcase size={17} />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="truncate text-sm font-medium">{project.title}</h2>

          {project.featured && (
            <span className="rounded-full bg-yellow-400/10 px-2 py-0.5 text-[9px] text-yellow-500">
              Featured
            </span>
          )}
        </div>

        <p className="mt-1 truncate text-xs text-zinc-500">
          {project.description}
        </p>

        <div className="mt-2 flex gap-2 text-[10px] text-zinc-600">
          <span>{project.category || 'Uncategorized'}</span>
          <span>·</span>
          <span>
            {new Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }).format(new Date(project.created_at))}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onToggleFeatured(project)}
          className="rounded-lg px-3 py-2 text-[11px] text-zinc-500 hover:bg-yellow-400/10 hover:text-yellow-500"
        >
          {project.featured ? 'Unfeature' : 'Feature'}
        </button>

        <Link
          href={`/admin/projects/${project.id}/edit`}
          className="rounded-lg p-2.5 text-zinc-500 hover:bg-yellow-400/10 hover:text-yellow-500"
        >
          <FiEdit3 size={15} />
        </Link>

        <button
          onClick={() => onDelete(project)}
          disabled={deleting}
          className="rounded-lg p-2.5 text-zinc-500 hover:bg-red-400/10 hover:text-red-400"
        >
          <FiTrash2 size={15} />
        </button>

        <FiChevronRight size={15} className="ml-1 text-zinc-700" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Loading                                                                    */
/* -------------------------------------------------------------------------- */

function ProjectSkeleton({ view }: { view: 'grid' | 'list' }) {
  if (view === 'list') {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="flex items-center gap-4 rounded-2xl border border-white/[0.06] p-4"
          >
            <div className="h-14 w-20 animate-pulse rounded-xl bg-white/[0.05]" />

            <div className="flex-1">
              <div className="h-3 w-32 animate-pulse rounded bg-white/[0.05]" />
              <div className="mt-2 h-2.5 w-52 animate-pulse rounded bg-white/[0.04]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="overflow-hidden rounded-2xl border border-white/[0.06]"
        >
          <div className="aspect-[16/10] animate-pulse bg-white/[0.04]" />

          <div className="space-y-3 p-5">
            <div className="h-3 w-32 animate-pulse rounded bg-white/[0.05]" />
            <div className="h-2.5 w-20 animate-pulse rounded bg-white/[0.04]" />
            <div className="h-8 w-full animate-pulse rounded bg-white/[0.04]" />
          </div>
        </div>
      ))}
    </div>
  );
}