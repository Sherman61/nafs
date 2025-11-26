"use client"

import { useTheme } from "@modules/theme/providers/theme-provider"

type ThemeValue = "light" | "dark" | "system"

const themeLabels: Record<ThemeValue, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
}

function normalize(value: string): ThemeValue {
  if (value === "dark" || value === "system") return value
  return "light"
}

export const ThemeSwitcher = () => {
  const { theme, resolvedTheme, setTheme } = useTheme()

  return (
    <label className="flex items-center gap-2 text-xs text-ahava-ink dark:text-white">
      <span className="whitespace-nowrap">Theme</span>
      <select
        value={theme}
        onChange={(event) => setTheme(normalize(event.target.value))}
        className="rounded-full border border-ahava-forest/40 bg-white px-3 py-1 text-[11px] font-medium shadow-sm transition-colors duration-200 hover:border-ahava-forest focus:border-ahava-forest dark:bg-[#0f1613] dark:text-white"
        aria-label="Choose a theme"
      >
        {Object.entries(themeLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <span className="rounded-full bg-ahava-forest/10 px-2 py-1 text-[10px] uppercase tracking-wide text-ahava-forest dark:bg-white/10 dark:text-white">
        {theme === "system" ? `Auto (${themeLabels[resolvedTheme]})` : themeLabels[resolvedTheme]}
      </span>
    </label>
  )
}
