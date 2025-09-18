'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  lightMode: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  lightMode: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [lightMode, setLightMode] = useState(false);

  // Initialize theme based on user preference or localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setLightMode(savedTheme === 'light');
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setLightMode(true);
    }
  }, []);

  // Update localStorage and HTML class when theme changes
  useEffect(() => {
    if (lightMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }, [lightMode]);

  const toggleTheme = () => {
    setLightMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ lightMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};