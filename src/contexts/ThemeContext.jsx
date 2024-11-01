import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export const themes = {
    light: {
      name: 'Light',
      preview: {
        primary: '#1a56db',
        background: '#ffffff',
        text: '#000000',
        accent: '#f3f4f6'
      },
      colors: {
        bgPrimary: 'bg-white',
        bgSecondary: 'bg-gray-50',
        bgAccent: 'bg-blue-50',
        bgHover: 'hover:bg-gray-100',
        text: 'text-gray-900',
        textSecondary: 'text-gray-600',
        textMuted: 'text-gray-500',
        border: 'border-gray-200',
        accent: 'bg-blue-600',
        accentHover: 'hover:bg-blue-700',
        buttonHover: 'hover:bg-gray-100',
        highlight: 'bg-blue-50',
        messageUser: 'bg-blue-600 text-white',
        messageBot: 'bg-gray-100 text-gray-900',
        icon: 'text-gray-500'
      }
    },
    dark: {
      name: 'Dark',
      preview: {
        primary: '#3b82f6',
        background: '#111827',
        text: '#ffffff',
        accent: '#1f2937'
      },
      colors: {
        bgPrimary: 'bg-gray-900',
        bgSecondary: 'bg-gray-800',
        bgAccent: 'bg-gray-800',
        bgHover: 'hover:bg-gray-700',
        text: 'text-gray-100',
        textSecondary: 'text-gray-300',
        textMuted: 'text-gray-400',
        border: 'border-gray-700',
        accent: 'bg-blue-500',
        accentHover: 'hover:bg-blue-600',
        buttonHover: 'hover:bg-gray-700',
        highlight: 'bg-gray-700',
        messageUser: 'bg-blue-500 text-white',
        messageBot: 'bg-gray-800 text-gray-100',
        icon: 'text-gray-400'
      }
    },
    purple: {
      name: 'Purple Dream',
      preview: {
        primary: '#8b5cf6',
        background: '#0f172a',
        text: '#ffffff',
        accent: '#1e1b4b'
      },
      colors: {
        bgPrimary: 'bg-slate-900',
        bgSecondary: 'bg-slate-800',
        bgAccent: 'bg-purple-900/50',
        bgHover: 'hover:bg-purple-800/30',
        text: 'text-purple-50',
        textSecondary: 'text-purple-200',
        textMuted: 'text-purple-300',
        border: 'border-purple-800',
        accent: 'bg-purple-500',
        accentHover: 'hover:bg-purple-600',
        buttonHover: 'hover:bg-purple-900/50',
        highlight: 'bg-purple-900/30',
        messageUser: 'bg-purple-500 text-white',
        messageBot: 'bg-purple-800 text-purple-50',
        icon: 'text-purple-300'
      }
    },
    forest: {
      name: 'Forest',
      preview: {
        primary: '#059669',
        background: '#064e3b',
        text: '#ffffff',
        accent: '#065f46'
      },
      colors: {
        bgPrimary: 'bg-emerald-900',
        bgSecondary: 'bg-emerald-800',
        bgAccent: 'bg-emerald-800/50',
        bgHover: 'hover:bg-emerald-700/30',
        text: 'text-emerald-50',
        textSecondary: 'text-emerald-200',
        textMuted: 'text-emerald-300',
        border: 'border-emerald-700',
        accent: 'bg-emerald-500',
        accentHover: 'hover:bg-emerald-600',
        buttonHover: 'hover:bg-emerald-800/50',
        highlight: 'bg-emerald-800/30',
        messageUser: 'bg-emerald-500 text-white',
        messageBot: 'bg-emerald-700 text-emerald-50',
        icon: 'text-emerald-300'
      }
    },
    sunset: {
      name: 'Sunset',
      preview: {
        primary: '#f59e0b',
        background: '#7c2d12',
        text: '#ffffff',
        accent: '#9a3412'
      },
      colors: {
        bgPrimary: 'bg-orange-900',
        bgSecondary: 'bg-orange-800',
        bgAccent: 'bg-orange-800/50',
        bgHover: 'hover:bg-orange-700/30',
        text: 'text-orange-50',
        textSecondary: 'text-orange-200',
        textMuted: 'text-orange-300',
        border: 'border-orange-700',
        accent: 'bg-amber-500',
        accentHover: 'hover:bg-amber-600',
        buttonHover: 'hover:bg-orange-800/50',
        highlight: 'bg-orange-800/30',
        messageUser: 'bg-amber-500 text-white',
        messageBot: 'bg-orange-700 text-orange-50',
        icon: 'text-orange-300'
      }
    },
    ocean: {
      name: 'Ocean',
      preview: {
        primary: '#0ea5e9',
        background: '#0c4a6e',
        text: '#ffffff',
        accent: '#075985'
      },
      colors: {
        bgPrimary: 'bg-sky-900',
        bgSecondary: 'bg-sky-800',
        bgAccent: 'bg-sky-800/50',
        bgHover: 'hover:bg-sky-700/30',
        text: 'text-sky-50',
        textSecondary: 'text-sky-200',
        textMuted: 'text-sky-300',
        border: 'border-sky-700',
        accent: 'bg-cyan-500',
        accentHover: 'hover:bg-cyan-600',
        buttonHover: 'hover:bg-sky-800/50',
        highlight: 'bg-sky-800/30',
        messageUser: 'bg-cyan-500 text-white',
        messageBot: 'bg-sky-700 text-sky-50',
        icon: 'text-sky-300'
      }
    },
    rose: {
      name: 'Rose',
      preview: {
        primary: '#e11d48',
        background: '#881337',
        text: '#ffffff',
        accent: '#9f1239'
      },
      colors: {
        bgPrimary: 'bg-rose-900',
        bgSecondary: 'bg-rose-800',
        bgAccent: 'bg-rose-800/50',
        bgHover: 'hover:bg-rose-700/30',
        text: 'text-rose-50',
        textSecondary: 'text-rose-200',
        textMuted: 'text-rose-300',
        border: 'border-rose-700',
        accent: 'bg-pink-500',
        accentHover: 'hover:bg-pink-600',
        buttonHover: 'hover:bg-rose-800/50',
        highlight: 'bg-rose-800/30',
        messageUser: 'bg-pink-500 text-white',
        messageBot: 'bg-rose-700 text-rose-50',
        icon: 'text-rose-300'
      }
    },
    amber: {
      name: 'Amber',
      preview: {
        primary: '#d97706',
        background: '#92400e',
        text: '#ffffff',
        accent: '#b45309'
      },
      colors: {
        bgPrimary: 'bg-amber-900',
        bgSecondary: 'bg-amber-800',
        bgAccent: 'bg-amber-800/50',
        bgHover: 'hover:bg-amber-700/30',
        text: 'text-amber-50',
        textSecondary: 'text-amber-200',
        textMuted: 'text-amber-300',
        border: 'border-amber-700',
        accent: 'bg-yellow-500',
        accentHover: 'hover:bg-yellow-600',
        buttonHover: 'hover:bg-amber-800/50',
        highlight: 'bg-amber-800/30',
        messageUser: 'bg-yellow-500 text-white',
        messageBot: 'bg-amber-700 text-amber-50',
        icon: 'text-amber-300'
      }
    }
  };

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or system preference
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved && themes[saved]) return saved;
    
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const theme = themes[currentTheme].colors;

  // Update theme in localStorage and document
  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(currentTheme);
  }, [currentTheme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setCurrentTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setTheme = useCallback((themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  }, []);

  const value = {
    currentTheme,
    theme,
    setTheme,
    availableThemes: Object.keys(themes).map(key => ({
      id: key,
      name: themes[key].name
    }))
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};