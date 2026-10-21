"use client";

import { useEffect, useState } from "react";

type ScrollState = {
  canScrollUp: boolean;
  canScrollDown: boolean;
};

export default function PageScrollControls() {
  const [state, setState] = useState<ScrollState>({
    canScrollUp: false,
    canScrollDown: false,
  });

  useEffect(() => {
    let frame: number | null = null;

    function update() {
      frame = null;

      const page = document.scrollingElement;

      if (!page) return;

      const maximum = Math.max(
        0,
        page.scrollHeight - page.clientHeight,
      );

      const next = {
        canScrollUp: page.scrollTop > 48,
        canScrollDown: maximum - page.scrollTop > 48,
      };

      setState((previous) =>
        previous.canScrollUp === next.canScrollUp &&
        previous.canScrollDown === next.canScrollDown
          ? previous
          : next,
      );
    }

    function scheduleUpdate() {
      if (frame === null) {
        frame = window.requestAnimationFrame(update);
      }
    }

    const observer = new ResizeObserver(scheduleUpdate);

    observer.observe(document.documentElement);
    observer.observe(document.body);

    window.addEventListener("scroll", scheduleUpdate, {
      passive: true,
    });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("pageshow", scheduleUpdate);

    scheduleUpdate();

    return () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }

      observer.disconnect();

      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("pageshow", scheduleUpdate);
    };
  }, []);

  function scrollTo(destination: "top" | "bottom") {
    const page = document.scrollingElement;

    if (!page) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top:
        destination === "top"
          ? 0
          : Math.max(0, page.scrollHeight - page.clientHeight),
      behavior: reduceMotion ? "instant" : "smooth",
    });
  }

  if (!state.canScrollUp && !state.canScrollDown) {
    return null;
  }

  const buttonClass =
    "flex h-11 w-11 items-center justify-center rounded-full " +
    "text-white/75 transition-colors duration-200 " +
    "hover:bg-white/10 hover:text-white " +
    "focus-visible:outline-none focus-visible:ring-2 " +
    "focus-visible:ring-inset focus-visible:ring-white " +
    "disabled:cursor-default disabled:opacity-20 " +
    "disabled:hover:bg-transparent disabled:hover:text-white/75 " +
    "motion-reduce:transition-none";

  return (
    <nav
      aria-label="Page scroll controls"
      className="fixed right-4 z-50 sm:right-6 lg:right-8"
      style={{
        bottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="flex flex-col items-center gap-1 rounded-full border border-white/15 bg-[#111113]/95 p-1 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl">
        <button
          type="button"
          aria-label="Scroll to top"
          title="Back to top"
          disabled={!state.canScrollUp}
          onClick={() => scrollTo("top")}
          className={buttonClass}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>

        <span
          aria-hidden="true"
          className="h-px w-4 bg-white/15"
        />

        <button
          type="button"
          aria-label="Scroll to bottom"
          title="Go to bottom"
          disabled={!state.canScrollDown}
          onClick={() => scrollTo("bottom")}
          className={buttonClass}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </button>
      </div>
    </nav>
  );
}