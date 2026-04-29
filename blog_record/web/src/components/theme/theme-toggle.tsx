"use client";

import { useEffect, useMemo, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";

type Theme = "light" | "dark";

function getEffectiveTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const explicit = document.documentElement.dataset.theme;
  if (explicit === "light" || explicit === "dark") return explicit;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);
}

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    setThemeState(getEffectiveTheme());
  }, []);

  const Icon = useMemo(() => (theme === "dark" ? Sun : Moon), [theme]);

  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground shadow-[var(--shadow)] transition hover:bg-surface-2",
        className
      )}
      aria-label="切换主题"
      onClick={() => {
        const next = getEffectiveTheme() === "dark" ? "light" : "dark";
        setTheme(next);
        setThemeState(next);
      }}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
