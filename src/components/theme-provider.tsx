import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Fully Vite-compatible theme provider
// Uses DOM class toggling + localStorage

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try { return (localStorage.getItem('hmc_theme') as Theme) || 'light'; }
    catch { return 'light'; }
  });

  useEffect(() => {
    // Tailwind darkMode: "class" compatible
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem('hmc_theme', theme); } catch {}
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () => setThemeState(t => t === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
