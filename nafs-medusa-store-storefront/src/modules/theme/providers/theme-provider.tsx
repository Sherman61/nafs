"use client"

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

type ThemeOption = "light" | "dark" | "system"

type ResolvedTheme = "light" | "dark"

type ThemeContextValue = {
  theme: ThemeOption
  resolvedTheme: ResolvedTheme
  setTheme: Dispatch<SetStateAction<ThemeOption>>
}

const STORAGE_KEY = "theme-preference"

const ThemeContext = createContext<ThemeContextValue | null>(null)

const getSystemPreference = (): ResolvedTheme =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

const applyTheme = (selection: ThemeOption, updateResolved: (theme: ResolvedTheme) => void) => {
  const resolved = selection === "system" ? getSystemPreference() : selection

  document.documentElement.dataset.mode = resolved
  document.documentElement.classList.toggle("dark", resolved === "dark")

  if (selection === "system") {
    localStorage.removeItem(STORAGE_KEY)
  } else {
    localStorage.setItem(STORAGE_KEY, selection)
  }

  updateResolved(resolved)
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeOption>("system")
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light")

  useEffect(() => {
    const storedPreference = localStorage.getItem(STORAGE_KEY) as ThemeOption | null

    if (storedPreference) {
      setTheme(storedPreference)
    } else {
      setTheme("system")
    }
  }, [])

  useEffect(() => {
    applyTheme(theme, setResolvedTheme)

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system", setResolvedTheme)
      }
    }

    media.addEventListener("change", handleChange)

    return () => media.removeEventListener("change", handleChange)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [resolvedTheme, theme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
