
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiArrowLeft,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiCopy,
  FiExternalLink,
  FiInbox,
  FiLogOut,
  FiMail,
  FiMessageSquare,
  FiMoon,
  FiRefreshCw,
  FiSearch,
  FiSend,
  FiSun,
  FiTrash2,
  FiUser,
  FiX,
} from 'react-icons/fi';

import { createClient } from '@/app/lib/client';
import { useTheme } from '@/app/contexts/ThemeContext';

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
};

type FilterType = 'all' | 'unread' | 'read';
type SortOrder = 'newest' | 'oldest';

export default function AdminMessagesPage() {
  const router = useRouter();
  const { lightMode, toggleTheme } = useTheme();

  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [filter, setFilter] = useState<FilterType>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [query, setQuery] = useState('');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  const [updatingMessageId, setUpdatingMessageId] =
    useState<string | null>(null);

  const [deletingMessageId, setDeletingMessageId] =
    useState<string | null>(null);

  /*
   * ---------------------------------------------------------
   * THEME
   * ---------------------------------------------------------
   */

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

  const hoverBackground = lightMode
    ? 'hover:bg-zinc-50'
    : 'hover:bg-zinc-900';

  /*
   * ---------------------------------------------------------
   * HELPERS
   * ---------------------------------------------------------
   */

  function getInitials(name: string) {
    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0]?.slice(0, 2).toUpperCase() || '??';
    }

    return `${parts[0]?.[0] || ''}${parts[parts.length - 1]?.[0] || ''}`
      .toUpperCase();
  }

  function formatRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();

    const difference = now.getTime() - date.getTime();

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return 'Just now';
    }

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    if (hours < 24) {
      return `${hours}h ago`;
    }

    if (days < 7) {
      return `${days}d ago`;
    }

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year:
        date.getFullYear() !== now.getFullYear()
          ? 'numeric'
          : undefined,
    });
  }

  function formatExactDate(dateString: string) {
    return new Date(dateString).toLocaleString(undefined, {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  function getExcerpt(message: string, length = 90) {
    const cleaned = message.replace(/\s+/g, ' ').trim();

    if (cleaned.length <= length) {
      return cleaned;
    }

    return `${cleaned.slice(0, length).trim()}…`;
  }

  /*
   * ---------------------------------------------------------
   * LOAD MESSAGES
   * ---------------------------------------------------------
   */

  async function loadMessages(showRefreshing = false) {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');
      setActionError('');

      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace('/admin/login');
        return;
      }

      const { data, error: messagesError } = await supabase
        .from('messages')
        .select(
          'id, name, email, subject, message, read, created_at'
        )
        .order('created_at', {
          ascending: sortOrder === 'oldest',
        });

      if (messagesError) {
        throw new Error(messagesError.message);
      }

      const loadedMessages = (data || []) as Message[];

      setMessages(loadedMessages);

      if (loadedMessages.length > 0) {
        setSelectedId((current) => {
          if (
            current &&
            loadedMessages.some((message) => message.id === current)
          ) {
            return current;
          }

          return loadedMessages[0].id;
        });
      } else {
        setSelectedId(null);
      }
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load your messages.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  /*
   * ---------------------------------------------------------
   * FILTER + SEARCH
   * ---------------------------------------------------------
   */

  const filteredMessages = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return messages
      .filter((message) => {
        if (filter === 'unread') {
          return !message.read;
        }

        if (filter === 'read') {
          return message.read;
        }

        return true;
      })
      .filter((message) => {
        if (!normalizedQuery) {
          return true;
        }

        return [
          message.name,
          message.email,
          message.subject || '',
          message.message,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);
      });
  }, [messages, filter, query]);

  const unreadCount = messages.filter(
    (message) => !message.read
  ).length;

  const readCount = messages.filter(
    (message) => message.read
  ).length;

  const selectedMessage =
    filteredMessages.find(
      (message) => message.id === selectedId
    ) ||
    filteredMessages[0] ||
    null;

  /*
   * Keep selected message valid after filtering/searching.
   */

  useEffect(() => {
    if (
      selectedId &&
      filteredMessages.some(
        (message) => message.id === selectedId
      )
    ) {
      return;
    }

    setSelectedId(filteredMessages[0]?.id || null);
  }, [filteredMessages, selectedId]);

  /*
   * ---------------------------------------------------------
   * SELECT MESSAGE
   * ---------------------------------------------------------
   */

  async function handleSelectMessage(message: Message) {
    setSelectedId(message.id);
    setActionError('');

    /*
     * Automatically mark unread messages as read
     * when opened.
     */
    if (!message.read) {
      try {
        setUpdatingMessageId(message.id);

        const supabase = createClient();

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.replace('/admin/login');
          return;
        }

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
        console.error(err);

        setActionError(
          err instanceof Error
            ? err.message
            : 'Unable to mark message as read.'
        );
      } finally {
        setUpdatingMessageId(null);
      }
    }
  }

  /*
   * ---------------------------------------------------------
   * MARK READ / UNREAD
   * ---------------------------------------------------------
   */

  async function handleToggleRead(message: Message) {
    try {
      setUpdatingMessageId(message.id);
      setActionError('');

      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace('/admin/login');
        return;
      }

      const { error: updateError } = await supabase
        .from('messages')
        .update({
          read: !message.read,
        })
        .eq('id', message.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setMessages((current) =>
        current.map((item) =>
          item.id === message.id
            ? {
                ...item,
                read: !message.read,
              }
            : item
        )
      );
    } catch (err) {
      console.error(err);

      setActionError(
        err instanceof Error
          ? err.message
          : 'Unable to update message.'
      );
    } finally {
      setUpdatingMessageId(null);
    }
  }

  /*
   * ---------------------------------------------------------
   * DELETE
   * ---------------------------------------------------------
   */

  async function handleDelete(message: Message) {
    const confirmed = window.confirm(
      `Delete the message from ${message.name}? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingMessageId(message.id);
      setActionError('');

      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace('/admin/login');
        return;
      }

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

      if (selectedId === message.id) {
        const remainingMessages = filteredMessages.filter(
          (item) => item.id !== message.id
        );

        setSelectedId(remainingMessages[0]?.id || null);
      }
    } catch (err) {
      console.error(err);

      setActionError(
        err instanceof Error
          ? err.message
          : 'Unable to delete message.'
      );
    } finally {
      setDeletingMessageId(null);
    }
  }

  /*
   * ---------------------------------------------------------
   * COPY EMAIL
   * ---------------------------------------------------------
   */

  async function handleCopyEmail(email: string) {
    try {
      await navigator.clipboard.writeText(email);
    } catch (err) {
      console.error(err);

      setActionError('Unable to copy the email address.');
    }
  }

  /*
   * ---------------------------------------------------------
   * SIGN OUT
   * ---------------------------------------------------------
   */

  async function handleSignOut() {
    try {
      setSigningOut(true);

      const supabase = createClient();

      await supabase.auth.signOut();

      router.replace('/admin/login');
      router.refresh();
    } catch (err) {
      console.error(err);
      setSigningOut(false);
    }
  }

  /*
   * ---------------------------------------------------------
   * REPLY LINK
   * ---------------------------------------------------------
   */

  function getReplyHref(message: Message) {
    const subject = message.subject
      ? message.subject.toLowerCase().startsWith('re:')
        ? message.subject
        : `Re: ${message.subject}`
      : 'Re: Your message';

    const body = `Hi ${message.name},

Thank you for reaching out.

`;

    return `mailto:${message.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  /*
   * ---------------------------------------------------------
   * LOADING
   * ---------------------------------------------------------
   */

  if (loading) {
    return (
      <main
        className={`min-h-screen ${pageBackground} relative overflow-hidden`}
      >
        <Background lightMode={lightMode} />

        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div
              className={`h-10 w-10 rounded-full border-2 border-t-yellow-400 animate-spin ${
                lightMode
                  ? 'border-zinc-200'
                  : 'border-zinc-800'
              }`}
            />

            <p className={`text-sm ${mutedText}`}>
              Loading messages…
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
   * ---------------------------------------------------------
   * MAIN UI
   * ---------------------------------------------------------
   */

  return (
    <main
      className={`min-h-screen ${pageBackground} relative overflow-hidden`}
    >
      <Background lightMode={lightMode} />

      {/* HEADER */}
      <header
        className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
          lightMode
            ? 'border-zinc-200 bg-[#f7f4ee]/90'
            : 'border-zinc-800 bg-[#09090b]/90'
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="h-20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                href="/admin/dashboard"
                className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-800 hover:border-yellow-400 transition"
                aria-label="Back to dashboard"
                title="Back to dashboard"
              >
                <FiArrowLeft size={17} />
              </Link>

              <div className="h-10 w-10 rounded-full bg-yellow-400 text-black flex items-center justify-center font-black tracking-tight shadow-sm">
                AA
              </div>

              <div className="min-w-0">
                <p className="font-semibold tracking-tight truncate">
                  Messages
                </p>

                <p className={`text-xs ${mutedText}`}>
                  Private communications
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                target="_blank"
                className={`hidden md:flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${hoverBackground}`}
              >
                <FiExternalLink size={15} />
                View site
              </Link>

              <button
                type="button"
                onClick={toggleTheme}
                className={`h-10 w-10 rounded-full border flex items-center justify-center transition ${
                  lightMode
                    ? 'border-zinc-200 bg-white hover:border-zinc-300'
                    : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                }`}
                aria-label={
                  lightMode
                    ? 'Switch to dark mode'
                    : 'Switch to light mode'
                }
                title={
                  lightMode
                    ? 'Switch to dark mode'
                    : 'Switch to light mode'
                }
              >
                {lightMode ? (
                  <FiMoon size={16} />
                ) : (
                  <FiSun size={16} />
                )}
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className={`h-10 w-10 rounded-full border flex items-center justify-center transition ${
                  lightMode
                    ? 'border-zinc-200 bg-white hover:border-red-300 hover:text-red-600'
                    : 'border-zinc-800 bg-zinc-950 hover:border-red-900 hover:text-red-400'
                }`}
                aria-label="Sign out"
                title="Sign out"
              >
                {signingOut ? (
                  <FiRefreshCw
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <FiLogOut size={16} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 py-8 sm:py-10">
        {/* TOP */}
        <div className="mb-7">
          <Link
            href="/admin/dashboard"
            className={`sm:hidden inline-flex items-center gap-2 text-sm ${mutedText} hover:text-yellow-500 transition mb-5`}
          >
            <FiArrowLeft size={15} />
            Dashboard
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />

                <span
                  className={`text-xs uppercase tracking-[0.18em] font-medium ${mutedText}`}
                >
                  Communications
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                Your inbox.
              </h1>

              <p className={`mt-2 text-sm sm:text-base ${mutedText}`}>
                Keep track of every conversation coming through your
                portfolio.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <StatPill
                icon={<FiInbox size={14} />}
                label="Total"
                value={messages.length}
                lightMode={lightMode}
              />

              <StatPill
                icon={<FiMail size={14} />}
                label="Unread"
                value={unreadCount}
                highlight={unreadCount > 0}
                lightMode={lightMode}
              />
            </div>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div
            className={`mb-5 rounded-2xl border px-4 py-3 flex items-center justify-between gap-4 ${
              lightMode
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-red-900/50 bg-red-950/20 text-red-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <FiX size={17} />
              <p className="text-sm">{error}</p>
            </div>

            <button
              type="button"
              onClick={() => loadMessages()}
              className="text-sm font-medium underline underline-offset-4"
            >
              Retry
            </button>
          </div>
        )}

        {/* ACTION ERROR */}
        {actionError && (
          <div
            className={`mb-5 rounded-2xl border px-4 py-3 flex items-center justify-between gap-4 ${
              lightMode
                ? 'border-amber-200 bg-amber-50 text-amber-800'
                : 'border-amber-900/50 bg-amber-950/20 text-amber-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <FiX size={17} />
              <p className="text-sm">{actionError}</p>
            </div>

            <button
              type="button"
              onClick={() => setActionError('')}
              className="opacity-70 hover:opacity-100"
            >
              <FiX size={16} />
            </button>
          </div>
        )}

        {/* INBOX */}
        <section
          className={`rounded-3xl border overflow-hidden shadow-sm ${cardBackground}`}
        >
          <div className="grid lg:grid-cols-[330px_minmax(0,1fr)] min-h-[680px]">
            {/* SIDEBAR */}
            <aside
              className={`border-b lg:border-b-0 lg:border-r ${
                lightMode
                  ? 'border-zinc-200'
                  : 'border-zinc-800'
              }`}
            >
              {/* SEARCH */}
              <div className="p-4">
                <div className="relative">
                  <FiSearch
                    size={16}
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${mutedText}`}
                  />

                  <input
                    type="search"
                    value={query}
                    onChange={(event) =>
                      setQuery(event.target.value)
                    }
                    placeholder="Search messages…"
                    className={`w-full h-11 rounded-xl border pl-10 pr-4 text-sm outline-none transition focus:border-yellow-400 ${inputBackground}`}
                  />
                </div>
              </div>

              {/* FILTERS */}
              <div className="px-4 pb-4">
                <div
                  className={`p-1 rounded-xl ${
                    lightMode
                      ? 'bg-zinc-100'
                      : 'bg-zinc-900'
                  }`}
                >
                  <div className="grid grid-cols-3 gap-1">
                    <FilterButton
                      active={filter === 'all'}
                      onClick={() => setFilter('all')}
                      label="All"
                      count={messages.length}
                      lightMode={lightMode}
                    />

                    <FilterButton
                      active={filter === 'unread'}
                      onClick={() => setFilter('unread')}
                      label="Unread"
                      count={unreadCount}
                      lightMode={lightMode}
                    />

                    <FilterButton
                      active={filter === 'read'}
                      onClick={() => setFilter('read')}
                      label="Read"
                      count={readCount}
                      lightMode={lightMode}
                    />
                  </div>
                </div>
              </div>

              {/* SORT */}
              <div
                className={`px-4 pb-3 flex items-center justify-between text-xs ${mutedText}`}
              >
                <span>
                  {filteredMessages.length}{' '}
                  {filteredMessages.length === 1
                    ? 'conversation'
                    : 'conversations'}
                </span>

                <select
                  value={sortOrder}
                  onChange={(event) => {
                    const value = event.target
                      .value as SortOrder;

                    setSortOrder(value);

                    /*
                     * Reload so Supabase ordering matches
                     * the selected sort.
                     */
                    setTimeout(() => {
                      loadMessages(true);
                    }, 0);
                  }}
                  className={`bg-transparent outline-none cursor-pointer ${mutedText}`}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>

              {/* MESSAGE LIST */}
              <div
                className={`border-t ${
                  lightMode
                    ? 'border-zinc-200'
                    : 'border-zinc-800'
                }`}
              >
                {filteredMessages.length === 0 ? (
                  <EmptyList
                    query={query}
                    filter={filter}
                    lightMode={lightMode}
                  />
                ) : (
                  filteredMessages.map((message) => (
                    <MessageListItem
                      key={message.id}
                      message={message}
                      selected={selectedMessage?.id === message.id}
                      lightMode={lightMode}
                      onClick={() =>
                        handleSelectMessage(message)
                      }
                    />
                  ))
                )}
              </div>
            </aside>

            {/* READER */}
            <section className="min-w-0">
              {selectedMessage ? (
                <MessageReader
                  message={selectedMessage}
                  lightMode={lightMode}
                  updating={
                    updatingMessageId === selectedMessage.id
                  }
                  deleting={
                    deletingMessageId === selectedMessage.id
                  }
                  onToggleRead={() =>
                    handleToggleRead(selectedMessage)
                  }
                  onDelete={() =>
                    handleDelete(selectedMessage)
                  }
                  onCopyEmail={() =>
                    handleCopyEmail(selectedMessage.email)
                  }
                  replyHref={getReplyHref(selectedMessage)}
                  formatExactDate={formatExactDate}
                />
              ) : (
                <EmptyReader
                  lightMode={lightMode}
                  hasMessages={messages.length > 0}
                />
              )}
            </section>
          </div>
        </section>

        {/* FOOTER NOTE */}
        <div className="mt-5 flex items-center justify-between gap-4">
          <p className={`text-xs ${mutedText}`}>
            Admin communications · Shina Adedokun
          </p>

          <button
            type="button"
            onClick={() => loadMessages(true)}
            disabled={refreshing}
            className={`inline-flex items-center gap-2 text-xs font-medium transition ${
              refreshing
                ? 'opacity-50 cursor-not-allowed'
                : lightMode
                  ? 'text-zinc-500 hover:text-zinc-900'
                  : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <FiRefreshCw
              size={13}
              className={refreshing ? 'animate-spin' : ''}
            />

            {refreshing ? 'Refreshing…' : 'Refresh inbox'}
          </button>
        </div>
      </div>
    </main>
  );
}

/*
 * =========================================================
 * BACKGROUND
 * =========================================================
 */

function Background({
  lightMode,
}: {
  lightMode: boolean;
}) {
  return (
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
  );
}

/*
 * =========================================================
 * STAT PILL
 * =========================================================
 */

function StatPill({
  icon,
  label,
  value,
  highlight = false,
  lightMode,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  highlight?: boolean;
  lightMode: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-full border px-3.5 py-2 ${
        lightMode
          ? 'border-zinc-200 bg-white'
          : 'border-zinc-800 bg-zinc-950'
      }`}
    >
      <span
        className={
          highlight
            ? 'text-yellow-500'
            : lightMode
              ? 'text-zinc-500'
              : 'text-zinc-400'
        }
      >
        {icon}
      </span>

      <span className="text-sm font-medium">
        {value}
      </span>

      <span
        className={`text-xs ${
          lightMode ? 'text-zinc-500' : 'text-zinc-400'
        }`}
      >
        {label}
      </span>
    </div>
  );
}

/*
 * =========================================================
 * FILTER BUTTON
 * =========================================================
 */

function FilterButton({
  active,
  onClick,
  label,
  count,
  lightMode,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  lightMode: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-0 rounded-lg px-2 py-2 text-xs font-medium transition ${
        active
          ? lightMode
            ? 'bg-white text-zinc-900 shadow-sm'
            : 'bg-zinc-800 text-white shadow-sm'
          : lightMode
            ? 'text-zinc-500 hover:text-zinc-900'
            : 'text-zinc-400 hover:text-zinc-100'
      }`}
    >
      <span>{label}</span>

      <span
        className={`ml-1 ${
          active
            ? 'text-yellow-500'
            : lightMode
              ? 'text-zinc-400'
              : 'text-zinc-600'
        }`}
      >
        {count}
      </span>
    </button>
  );
}

/*
 * =========================================================
 * MESSAGE LIST ITEM
 * =========================================================
 */

function MessageListItem({
  message,
  selected,
  lightMode,
  onClick,
}: {
  message: Message;
  selected: boolean;
  lightMode: boolean;
  onClick: () => void;
}) {
  const initials = message.name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-4 border-b transition ${
        lightMode
          ? 'border-zinc-100'
          : 'border-zinc-900'
      } ${
        selected
          ? lightMode
            ? 'bg-yellow-50/70'
            : 'bg-yellow-400/[0.06]'
          : lightMode
            ? 'hover:bg-zinc-50'
            : 'hover:bg-zinc-900/60'
      }`}
    >
      <div className="flex gap-3">
        {/* AVATAR */}
        <div
          className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-xs font-semibold ${
            message.read
              ? lightMode
                ? 'bg-zinc-100 text-zinc-500'
                : 'bg-zinc-900 text-zinc-500'
              : 'bg-yellow-400 text-black'
          }`}
        >
          {initials || '??'}
        </div>

        {/* CONTENT */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p
              className={`truncate text-sm ${
                message.read
                  ? 'font-medium'
                  : 'font-semibold'
              }`}
            >
              {message.name}
            </p>

            <span
              className={`shrink-0 text-[11px] ${
                lightMode
                  ? 'text-zinc-400'
                  : 'text-zinc-600'
              }`}
            >
              {formatListTime(message.created_at)}
            </span>
          </div>

          <p
            className={`mt-1 truncate text-xs ${
              message.read
                ? lightMode
                  ? 'text-zinc-500'
                  : 'text-zinc-400'
                : lightMode
                  ? 'text-zinc-800'
                  : 'text-zinc-200'
            }`}
          >
            {message.subject || 'No subject'}
          </p>

          <p
            className={`mt-1 line-clamp-1 text-xs ${
              lightMode
                ? 'text-zinc-400'
                : 'text-zinc-600'
            }`}
          >
            {getListExcerpt(message.message)}
          </p>
        </div>

        {!message.read && (
          <span className="mt-1.5 shrink-0 h-2 w-2 rounded-full bg-yellow-400" />
        )}
      </div>
    </button>
  );
}

/*
 * =========================================================
 * MESSAGE READER
 * =========================================================
 */

function MessageReader({
  message,
  lightMode,
  updating,
  deleting,
  onToggleRead,
  onDelete,
  onCopyEmail,
  replyHref,
  formatExactDate,
}: {
  message: Message;
  lightMode: boolean;
  updating: boolean;
  deleting: boolean;
  onToggleRead: () => void;
  onDelete: () => void;
  onCopyEmail: () => void;
  replyHref: string;
  formatExactDate: (date: string) => string;
}) {
  const initials = message.name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="h-full flex flex-col">
      {/* READER TOOLBAR */}
      <div
        className={`h-16 shrink-0 border-b px-5 flex items-center justify-between gap-3 ${
          lightMode
            ? 'border-zinc-200'
            : 'border-zinc-800'
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`hidden sm:inline text-xs ${lightMode ? 'text-zinc-400' : 'text-zinc-600'}`}
          >
            MESSAGE
          </span>

          {!message.read && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400/10 px-2.5 py-1 text-[11px] font-medium text-yellow-600 dark:text-yellow-400">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
              Unread
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleRead}
            disabled={updating}
            className={`h-9 w-9 rounded-lg flex items-center justify-center transition ${
              lightMode
                ? 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900'
                : 'hover:bg-zinc-900 text-zinc-400 hover:text-zinc-100'
            }`}
            title={
              message.read
                ? 'Mark as unread'
                : 'Mark as read'
            }
            aria-label={
              message.read
                ? 'Mark as unread'
                : 'Mark as read'
            }
          >
            {updating ? (
              <FiRefreshCw
                size={15}
                className="animate-spin"
              />
            ) : message.read ? (
              <FiMail size={16} />
            ) : (
              <FiCheck size={16} />
            )}
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className={`h-9 w-9 rounded-lg flex items-center justify-center transition ${
              lightMode
                ? 'text-zinc-500 hover:bg-red-50 hover:text-red-600'
                : 'text-zinc-400 hover:bg-red-950/30 hover:text-red-400'
            }`}
            title="Delete message"
            aria-label="Delete message"
          >
            {deleting ? (
              <FiRefreshCw
                size={15}
                className="animate-spin"
              />
            ) : (
              <FiTrash2 size={16} />
            )}
          </button>
        </div>
      </div>

      {/* MESSAGE CONTENT */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-8">
        {/* SENDER */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="h-12 w-12 shrink-0 rounded-full bg-yellow-400 text-black flex items-center justify-center font-semibold">
              {initials || '??'}
            </div>

            <div className="min-w-0">
              <h2 className="text-base font-semibold truncate">
                {message.name}
              </h2>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                <a
                  href={`mailto:${message.email}`}
                  className={`text-sm hover:text-yellow-500 transition truncate ${
                    lightMode
                      ? 'text-zinc-500'
                      : 'text-zinc-400'
                  }`}
                >
                  {message.email}
                </a>

                <span
                  className={`hidden sm:block h-1 w-1 rounded-full ${
                    lightMode
                      ? 'bg-zinc-300'
                      : 'bg-zinc-700'
                  }`}
                />

                <span
                  className={`text-xs ${lightMode ? 'text-zinc-400' : 'text-zinc-600'}`}
                >
                  {formatRelativeTime(message.created_at)}
                </span>
              </div>
            </div>
          </div>

          <span
            className={`text-xs sm:text-right ${lightMode ? 'text-zinc-400' : 'text-zinc-600'}`}
          >
            {formatExactDate(message.created_at)}
          </span>
        </div>

        {/* SUBJECT */}
        <div
          className={`mt-8 pb-5 border-b ${
            lightMode
              ? 'border-zinc-200'
              : 'border-zinc-800'
          }`}
        >
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight break-words">
            {message.subject || 'No subject'}
          </h1>
        </div>

        {/* BODY */}
        <div className="py-7">
          <div
            className={`whitespace-pre-wrap break-words text-[15px] leading-7 ${
              lightMode
                ? 'text-zinc-700'
                : 'text-zinc-300'
            }`}
          >
            {message.message}
          </div>
        </div>

        {/* CONTACT ACTIONS */}
        <div
          className={`mt-5 pt-6 border-t ${
            lightMode
              ? 'border-zinc-200'
              : 'border-zinc-800'
          }`}
        >
          <p
            className={`text-xs uppercase tracking-[0.15em] font-medium mb-3 ${
              lightMode
                ? 'text-zinc-400'
                : 'text-zinc-600'
            }`}
          >
            Contact
          </p>

          <div className="flex flex-wrap gap-2">
            <a
              href={replyHref}
              className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-black hover:bg-yellow-300 transition"
            >
              <FiSend size={15} />
              Reply by email
            </a>

            <button
              type="button"
              onClick={onCopyEmail}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                lightMode
                  ? 'border-zinc-200 bg-white hover:bg-zinc-50'
                  : 'border-zinc-800 bg-zinc-950 hover:bg-zinc-900'
              }`}
            >
              <FiCopy size={15} />
              Copy email
            </button>

            <a
              href={`mailto:${message.email}`}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                lightMode
                  ? 'border-zinc-200 bg-white hover:bg-zinc-50'
                  : 'border-zinc-800 bg-zinc-950 hover:bg-zinc-900'
              }`}
            >
              <FiMail size={15} />
              Open mail app
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
 * =========================================================
 * EMPTY LIST
 * =========================================================
 */

function EmptyList({
  query,
  filter,
  lightMode,
}: {
  query: string;
  filter: FilterType;
  lightMode: boolean;
}) {
  let title = 'No messages yet.';
  let description =
    'Messages submitted through your portfolio will appear here.';

  if (query) {
    title = 'No matches found.';
    description = 'Try another search term.';
  } else if (filter === 'unread') {
    title = 'Inbox is clear.';
    description = 'You have no unread messages.';
  } else if (filter === 'read') {
    title = 'Nothing here yet.';
    description = 'Read messages will appear in this view.';
  }

  return (
    <div className="px-6 py-16 text-center">
      <div
        className={`mx-auto h-11 w-11 rounded-full flex items-center justify-center ${
          lightMode
            ? 'bg-zinc-100 text-zinc-400'
            : 'bg-zinc-900 text-zinc-600'
        }`}
      >
        <FiInbox size={19} />
      </div>

      <h3 className="mt-4 text-sm font-semibold">
        {title}
      </h3>

      <p
        className={`mt-1.5 text-xs leading-5 ${lightMode ? 'text-zinc-500' : 'text-zinc-500'}`}
      >
        {description}
      </p>
    </div>
  );
}

/*
 * =========================================================
 * EMPTY READER
 * =========================================================
 */

function EmptyReader({
  lightMode,
  hasMessages,
}: {
  lightMode: boolean;
  hasMessages: boolean;
}) {
  return (
    <div className="h-full min-h-[520px] flex items-center justify-center p-8">
      <div className="text-center max-w-sm">
        <div
          className={`mx-auto h-14 w-14 rounded-full flex items-center justify-center ${
            lightMode
              ? 'bg-zinc-100 text-zinc-400'
              : 'bg-zinc-900 text-zinc-600'
          }`}
        >
          <FiMessageSquare size={22} />
        </div>

        <h3 className="mt-5 text-lg font-semibold">
          {hasMessages
            ? 'Nothing selected'
            : 'Your inbox is quiet'}
        </h3>

        <p
          className={`mt-2 text-sm leading-6 ${
            lightMode
              ? 'text-zinc-500'
              : 'text-zinc-500'
          }`}
        >
          {hasMessages
            ? 'Choose a conversation from the left to read it here.'
            : 'When someone contacts you through your portfolio, their message will appear here.'}
        </p>
      </div>
    </div>
  );
}

/*
 * =========================================================
 * SMALL HELPERS
 * =========================================================
 */

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  const difference = now.getTime() - date.getTime();

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return 'Just now';
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  if (days < 7) {
    return `${days}d ago`;
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

function formatListTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  const sameDay =
    date.toDateString() === now.toDateString();

  if (sameDay) {
    return date.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  const difference =
    now.getTime() - date.getTime();

  const days = Math.floor(
    difference / (1000 * 60 * 60 * 24)
  );

  if (days < 7) {
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
    });
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

function getListExcerpt(message: string) {
  const cleaned = message.replace(/\s+/g, ' ').trim();

  if (cleaned.length <= 75) {
    return cleaned;
  }

  return `${cleaned.slice(0, 75).trim()}…`;
}

