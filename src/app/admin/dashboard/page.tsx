'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiArrowUpRight,
  FiBell,
  FiBriefcase,
  FiChevronRight,
  FiFileText,
  FiGrid,
  FiLogOut,
  FiMail,
  FiMenu,
  FiMoon,
  FiPlus,
  FiSettings,
  FiSun,
  FiX,
} from 'react-icons/fi';

import { supabase } from '@/app/lib/supabase';
import { useTheme } from '@/app/contexts/ThemeContext';

type Project = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  category: string | null;
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

  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/admin/login');
        return;
      }

      const [projectsResult, messagesResult] = await Promise.all([
        supabase
          .from('portfolio')
          .select(
            'id, title, description, image, category, featured, created_at'
          )
          .order('created_at', { ascending: false }),

        supabase
          .from('messages')
          .select(
            'id, name, email, subject, message, read, created_at'
          )
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      if (!mounted) return;

      if (!projectsResult.error) {
        setProjects(projectsResult.data ?? []);
      }

      if (!messagesResult.error) {
        setMessages(messagesResult.data ?? []);
      }

      setLoading(false);
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, [router]);

  const featuredProjects = useMemo(
    () => projects.filter((project) => project.featured).length,
    [projects]
  );

  const unreadMessages = useMemo(
    () => messages.filter((message) => !message.read).length,
    [messages]
  );

  async function handleSignOut() {
    setSigningOut(true);

    await supabase.auth.signOut();

    router.replace('/admin/login');
    router.refresh();
  }

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  const truncate = (text: string, length = 70) => {
    if (text.length <= length) return text;
    return `${text.slice(0, length)}...`;
  };

  const background = lightMode ? 'bg-[#F7F5F0]' : 'bg-[#09090B]';
  const foreground = lightMode ? 'text-zinc-900' : 'text-white';

  return (
    <main
      className={`min-h-screen ${background} ${foreground} transition-colors duration-500`}
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
        className={`fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col border-r transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          lightMode
            ? 'border-black/[0.07] bg-[#F2EFE8]'
            : 'border-white/[0.07] bg-[#0D0D0F]'
        }`}
      >
        {/* Logo */}
        <div className="flex h-[76px] items-center border-b border-inherit px-6">
          <Link
            href="/admin"
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
              <p
                className={`text-[10px] tracking-[0.18em] ${
                  lightMode ? 'text-zinc-500' : 'text-zinc-600'
                }`}
              >
                CONTROL CENTER
              </p>
            </div>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="ml-auto rounded-lg p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white lg:hidden"
          >
            <FiX size={19} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-7 px-4 py-7">
          <SidebarGroup label="Overview">
            <SidebarLink
              href="/admin/dashboard"
              icon={<FiGrid size={17} />}
              active
              lightMode={lightMode}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </SidebarLink>
          </SidebarGroup>

          <SidebarGroup label="Content">
            <SidebarLink
              href="/admin/projects"
              icon={<FiBriefcase size={17} />}
              lightMode={lightMode}
              onClick={() => setMobileMenuOpen(false)}
            >
              Projects
            </SidebarLink>

            <SidebarLink
              href="/admin/projects/new"
              icon={<FiPlus size={17} />}
              lightMode={lightMode}
              onClick={() => setMobileMenuOpen(false)}
            >
              Add Project
            </SidebarLink>
          </SidebarGroup>

          <SidebarGroup label="Communication">
            <SidebarLink
              href="/admin/messages"
              icon={<FiMail size={17} />}
              lightMode={lightMode}
              badge={unreadMessages > 0 ? unreadMessages : undefined}
              onClick={() => setMobileMenuOpen(false)}
            >
              Messages
            </SidebarLink>
          </SidebarGroup>

          <SidebarGroup label="System">
            <SidebarLink
              href="/admin/settings"
              icon={<FiSettings size={17} />}
              lightMode={lightMode}
              onClick={() => setMobileMenuOpen(false)}
            >
              Settings
            </SidebarLink>
          </SidebarGroup>
        </nav>

        {/* Bottom links */}
        <div
          className={`space-y-1 border-t p-4 ${
            lightMode ? 'border-black/[0.07]' : 'border-white/[0.07]'
          }`}
        >
          <Link
            href="/"
            target="_blank"
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
              lightMode
                ? 'text-zinc-500 hover:bg-black/[0.04] hover:text-zinc-900'
                : 'text-zinc-500 hover:bg-white/[0.04] hover:text-white'
            }`}
          >
            <FiArrowUpRight size={17} />
            View website
          </Link>

          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
              lightMode
                ? 'text-zinc-500 hover:bg-black/[0.04] hover:text-red-600'
                : 'text-zinc-500 hover:bg-white/[0.04] hover:text-red-400'
            }`}
          >
            <FiLogOut size={17} />
            {signingOut ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="lg:pl-[250px]">
        {/* Header */}
        <header
          className={`sticky top-0 z-30 flex h-[76px] items-center justify-between border-b px-5 backdrop-blur-xl sm:px-8 lg:px-10 ${
            lightMode
              ? 'border-black/[0.07] bg-[#F7F5F0]/85'
              : 'border-white/[0.07] bg-[#09090B]/85'
          }`}
        >
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-xl p-2.5 text-zinc-500 lg:hidden"
          >
            <FiMenu size={21} />
          </button>

          <div className="hidden lg:block">
            <p
              className={`text-xs uppercase tracking-[0.2em] ${
                lightMode ? 'text-zinc-500' : 'text-zinc-600'
              }`}
            >
              Dashboard
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Theme */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                lightMode
                  ? 'border-black/[0.07] text-zinc-600 hover:bg-black/[0.04]'
                  : 'border-white/[0.08] text-zinc-400 hover:bg-white/[0.05]'
              }`}
            >
              {lightMode ? <FiMoon size={17} /> : <FiSun size={17} />}
            </button>

            {/* Notifications */}
            <Link
              href="/admin/messages"
              className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                lightMode
                  ? 'border-black/[0.07] text-zinc-600 hover:bg-black/[0.04]'
                  : 'border-white/[0.08] text-zinc-400 hover:bg-white/[0.05]'
              }`}
            >
              <FiBell size={17} />

              {unreadMessages > 0 && (
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-yellow-400" />
              )}
            </Link>

            {/* User */}
            <div
              className={`ml-1 hidden items-center gap-3 border-l pl-4 sm:flex ${
                lightMode ? 'border-black/[0.07]' : 'border-white/[0.07]'
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-black">
                AA
              </div>

              <div className="hidden md:block">
                <p className="text-sm font-medium">Shina Adedokun</p>
                <p
                  className={`text-[11px] ${
                    lightMode ? 'text-zinc-500' : 'text-zinc-600'
                  }`}
                >
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <section className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          {/* Intro */}
          <div className="mb-9">
            <p className="mb-2 text-sm font-medium text-yellow-500">
              CONTROL CENTER
            </p>

            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Good morning, Shina.
            </h1>

            <p
              className={`mt-2 max-w-xl text-sm ${
                lightMode ? 'text-zinc-500' : 'text-zinc-500'
              }`}
            >
              Here&apos;s what&apos;s happening with your portfolio.
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              label="Projects"
              value={projects.length}
              description="Total portfolio projects"
              icon={<FiBriefcase size={18} />}
              lightMode={lightMode}
              loading={loading}
            />

            <StatCard
              label="Featured"
              value={featuredProjects}
              description="Projects highlighted"
              icon={<FiFileText size={18} />}
              lightMode={lightMode}
              loading={loading}
            />

            <StatCard
              label="Messages"
              value={messages.length}
              description={
                unreadMessages > 0
                  ? `${unreadMessages} unread`
                  : 'No unread messages'
              }
              icon={<FiMail size={18} />}
              lightMode={lightMode}
              loading={loading}
              accent={unreadMessages > 0}
            />
          </div>

          {/* Main cards */}
          <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_1fr]">
            {/* Recent projects */}
            <DashboardCard lightMode={lightMode}>
              <CardHeader
                title="Recent projects"
                href="/admin/projects"
                lightMode={lightMode}
              />

              {loading ? (
                <LoadingRows />
              ) : projects.length === 0 ? (
                <EmptyState
                  title="No projects yet"
                  description="Add your first project to your portfolio."
                  href="/admin/projects/new"
                  action="Add project"
                  lightMode={lightMode}
                />
              ) : (
                <div className="space-y-1">
                  {projects.slice(0, 5).map((project) => (
                    <Link
                      key={project.id}
                      href={`/admin/projects/${project.id}/edit`}
                      className={`group flex items-center gap-3 rounded-xl p-3 transition ${
                        lightMode
                          ? 'hover:bg-black/[0.035]'
                          : 'hover:bg-white/[0.035]'
                      }`}
                    >
                      <div
                        className={`h-12 w-12 shrink-0 overflow-hidden rounded-lg ${
                          lightMode ? 'bg-[#E5E0D7]' : 'bg-white/[0.05]'
                        }`}
                      >
                        {project.image ? (
                          <img
                            src={project.image}
                            alt=""
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
                          <p className="truncate text-sm font-medium">
                            {project.title}
                          </p>

                          {project.featured && (
                            <span className="hidden rounded-full bg-yellow-400/10 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-yellow-500 sm:inline-flex">
                              Featured
                            </span>
                          )}
                        </div>

                        <div className="mt-1 flex items-center gap-2 text-[11px] text-zinc-500">
                          <span>{project.category || 'Uncategorized'}</span>
                          <span>·</span>
                          <span>{formatDate(project.created_at)}</span>
                        </div>
                      </div>

                      <FiChevronRight
                        size={16}
                        className="shrink-0 text-zinc-600 transition group-hover:translate-x-0.5 group-hover:text-yellow-400"
                      />
                    </Link>
                  ))}
                </div>
              )}
            </DashboardCard>

            {/* Recent messages */}
            <DashboardCard lightMode={lightMode}>
              <CardHeader
                title="Recent messages"
                href="/admin/messages"
                lightMode={lightMode}
                count={unreadMessages > 0 ? unreadMessages : undefined}
              />

              {loading ? (
                <LoadingRows />
              ) : messages.length === 0 ? (
                <EmptyState
                  title="Your inbox is clear"
                  description="New contact form submissions will appear here."
                  lightMode={lightMode}
                />
              ) : (
                <div className="space-y-1">
                  {messages.map((message) => (
                    <Link
                      key={message.id}
                      href={`/admin/messages/${message.id}`}
                      className={`group block rounded-xl p-3 transition ${
                        lightMode
                          ? 'hover:bg-black/[0.035]'
                          : 'hover:bg-white/[0.035]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative mt-1.5">
                          <div className="h-8 w-8 rounded-full bg-yellow-400/10" />

                          {!message.read && (
                            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-yellow-400" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate text-sm font-medium">
                              {message.name}
                            </p>

                            <span className="shrink-0 text-[10px] text-zinc-600">
                              {formatDate(message.created_at)}
                            </span>
                          </div>

                          <p
                            className={`mt-1 truncate text-xs ${
                              lightMode ? 'text-zinc-500' : 'text-zinc-500'
                            }`}
                          >
                            {message.subject || 'No subject'}
                          </p>

                          <p className="mt-1 truncate text-[11px] text-zinc-600">
                            {truncate(message.message, 55)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </DashboardCard>
          </div>

          {/* Status */}
          <div
            className={`mt-5 flex flex-col justify-between gap-5 rounded-2xl border p-5 sm:flex-row sm:items-center sm:p-6 ${
              lightMode
                ? 'border-black/[0.07] bg-white/60'
                : 'border-white/[0.07] bg-white/[0.025]'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-green-400/60" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-green-400" />
              </div>

              <div>
                <p className="text-sm font-medium">Portfolio is live</p>
                <p className="mt-1 text-xs text-zinc-500">
                  Your website is currently online and accepting visitors.
                </p>
              </div>
            </div>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-yellow-400/30 px-4 py-2.5 text-xs font-medium text-yellow-500 transition hover:bg-yellow-400/10"
            >
              View website
              <FiArrowUpRight size={14} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

function SidebarGroup({
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

function SidebarLink({
  href,
  icon,
  children,
  active = false,
  badge,
  lightMode,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  badge?: number;
  lightMode: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
        active
          ? 'bg-yellow-400 text-black'
          : lightMode
            ? 'text-zinc-500 hover:bg-black/[0.04] hover:text-zinc-900'
            : 'text-zinc-500 hover:bg-white/[0.04] hover:text-white'
      }`}
    >
      {icon}

      <span className="flex-1">{children}</span>

      {badge !== undefined && (
        <span
          className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold ${
            active
              ? 'bg-black/10 text-black'
              : 'bg-yellow-400/10 text-yellow-500'
          }`}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}

function StatCard({
  label,
  value,
  description,
  icon,
  lightMode,
  loading,
  accent = false,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  lightMode: boolean;
  loading: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 transition ${
        lightMode
          ? 'border-black/[0.07] bg-white/60 hover:bg-white'
          : 'border-white/[0.07] bg-white/[0.025] hover:bg-white/[0.04]'
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            accent
              ? 'bg-yellow-400/10 text-yellow-500'
              : lightMode
                ? 'bg-black/[0.04] text-zinc-500'
                : 'bg-white/[0.05] text-zinc-500'
          }`}
        >
          {icon}
        </span>

        {accent && (
          <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" />
        )}
      </div>

      {loading ? (
        <div className="mt-6">
          <div className="h-8 w-16 animate-pulse rounded-lg bg-zinc-500/10" />
          <div className="mt-2 h-3 w-28 animate-pulse rounded bg-zinc-500/10" />
        </div>
      ) : (
        <>
          <p className="mt-6 text-3xl font-semibold tracking-tight">
            {value}
          </p>

          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="text-xs text-zinc-500">{label}</p>

            <p
              className={`text-[10px] ${
                accent ? 'text-yellow-500' : 'text-zinc-600'
              }`}
            >
              {description}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function DashboardCard({
  children,
  lightMode,
}: {
  children: React.ReactNode;
  lightMode: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 ${
        lightMode
          ? 'border-black/[0.07] bg-white/60'
          : 'border-white/[0.07] bg-white/[0.025]'
      }`}
    >
      {children}
    </div>
  );
}

function CardHeader({
  title,
  href,
  lightMode,
  count,
}: {
  title: string;
  href: string;
  lightMode: boolean;
  count?: number;
}) {
  return (
    <div className="mb-3 flex items-center justify-between px-2">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold">{title}</h2>

        {count !== undefined && (
          <span className="rounded-full bg-yellow-400/10 px-2 py-0.5 text-[9px] font-medium text-yellow-500">
            {count} new
          </span>
        )}
      </div>

      <Link
        href={href}
        className={`text-[11px] transition ${
          lightMode
            ? 'text-zinc-500 hover:text-zinc-900'
            : 'text-zinc-500 hover:text-white'
        }`}
      >
        View all →
      </Link>
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="space-y-2 p-2">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="flex items-center gap-3 rounded-xl p-3"
        >
          <div className="h-12 w-12 animate-pulse rounded-lg bg-zinc-500/10" />

          <div className="flex-1">
            <div className="h-3 w-32 animate-pulse rounded bg-zinc-500/10" />
            <div className="mt-2 h-2.5 w-24 animate-pulse rounded bg-zinc-500/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  title,
  description,
  href,
  action,
  lightMode,
}: {
  title: string;
  description: string;
  href?: string;
  action?: string;
  lightMode: boolean;
}) {
  return (
    <div className="flex min-h-[190px] flex-col items-center justify-center px-5 text-center">
      <p className="text-sm font-medium">{title}</p>

      <p className="mt-1 max-w-xs text-xs leading-5 text-zinc-500">
        {description}
      </p>

      {href && action && (
        <Link
          href={href}
          className={`mt-5 rounded-xl px-4 py-2.5 text-xs font-medium transition ${
            lightMode
              ? 'bg-zinc-900 text-white hover:bg-zinc-800'
              : 'bg-white text-black hover:bg-zinc-200'
          }`}
        >
          {action}
        </Link>
      )}
    </div>
  );
}