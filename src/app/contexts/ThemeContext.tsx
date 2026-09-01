'use client';

import {
  createContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface ThemeContextType {
  lightMode: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  lightMode: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // Dark mode is the default
  const [lightMode, setLightMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load the user's saved preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
      setLightMode(true);
    } else {
      // Dark is the default
      setLightMode(false);
    }

    setMounted(true);
  }, []);

  // Keep HTML + localStorage synchronized
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    if (lightMode) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }, [lightMode, mounted]);

  const toggleTheme = () => {
    setLightMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        lightMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};