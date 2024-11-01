/**
 * Application theme configurations
 * Each theme defines colors and styles for different UI components
 */
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
    },
    // Holiday Themes
    christmas: {
      name: 'Christmas',
      preview: {
        primary: '#D42426',
        background: '#0C3823',
        text: '#ffffff',
        accent: '#165B33'
      },
      colors: {
        bgPrimary: 'bg-green-900',
        bgSecondary: 'bg-green-800',
        bgAccent: 'bg-red-900/50',
        bgHover: 'hover:bg-green-800/70',
        text: 'text-green-50',
        textSecondary: 'text-red-100',
        textMuted: 'text-green-200',
        border: 'border-green-700',
        accent: 'bg-red-600',
        accentHover: 'hover:bg-red-700',
        buttonHover: 'hover:bg-green-800/50',
        highlight: 'bg-red-900/30',
        messageUser: 'bg-red-600 text-white',
        messageBot: 'bg-green-800 text-green-50',
        icon: 'text-red-300'
      }
    },
    halloween: {
      name: 'Halloween',
      preview: {
        primary: '#FF6600',
        background: '#1A1A1A',
        text: '#ffffff',
        accent: '#663399'
      },
      colors: {
        bgPrimary: 'bg-gray-900',
        bgSecondary: 'bg-gray-800',
        bgAccent: 'bg-orange-900/50',
        bgHover: 'hover:bg-purple-900/30',
        text: 'text-orange-50',
        textSecondary: 'text-purple-200',
        textMuted: 'text-orange-200',
        border: 'border-purple-900',
        accent: 'bg-orange-500',
        accentHover: 'hover:bg-orange-600',
        buttonHover: 'hover:bg-purple-900/50',
        highlight: 'bg-orange-900/30',
        messageUser: 'bg-orange-500 text-white',
        messageBot: 'bg-purple-900 text-purple-50',
        icon: 'text-orange-300'
      }
    },
    valentines: {
      name: 'Valentine\'s Day',
      preview: {
        primary: '#FF69B4',
        background: '#FFF0F5',
        text: '#4A0404',
        accent: '#FFB6C1'
      },
      colors: {
        bgPrimary: 'bg-pink-50',
        bgSecondary: 'bg-pink-100',
        bgAccent: 'bg-red-100',
        bgHover: 'hover:bg-pink-200',
        text: 'text-red-900',
        textSecondary: 'text-red-800',
        textMuted: 'text-red-600',
        border: 'border-pink-200',
        accent: 'bg-pink-500',
        accentHover: 'hover:bg-pink-600',
        buttonHover: 'hover:bg-pink-200',
        highlight: 'bg-red-100',
        messageUser: 'bg-pink-500 text-white',
        messageBot: 'bg-red-50 text-red-900',
        icon: 'text-pink-400'
      }
    },
    stPatricks: {
      name: 'St. Patrick\'s Day',
      preview: {
        primary: '#02C94B',
        background: '#004B1C',
        text: '#ffffff',
        accent: '#007A29'
      },
      colors: {
        bgPrimary: 'bg-green-900',
        bgSecondary: 'bg-green-800',
        bgAccent: 'bg-emerald-800/50',
        bgHover: 'hover:bg-emerald-700/30',
        text: 'text-green-50',
        textSecondary: 'text-emerald-200',
        textMuted: 'text-green-300',
        border: 'border-emerald-700',
        accent: 'bg-emerald-500',
        accentHover: 'hover:bg-emerald-600',
        buttonHover: 'hover:bg-green-800/50',
        highlight: 'bg-emerald-800/30',
        messageUser: 'bg-emerald-500 text-white',
        messageBot: 'bg-green-800 text-green-50',
        icon: 'text-emerald-300'
      }
    },
    easter: {
      name: 'Easter',
      preview: {
        primary: '#FFB7C5',
        background: '#E6F3FF',
        text: '#2C1810',
        accent: '#87CEEB'
      },
      colors: {
        bgPrimary: 'bg-blue-50',
        bgSecondary: 'bg-purple-50',
        bgAccent: 'bg-pink-100',
        bgHover: 'hover:bg-blue-100',
        text: 'text-purple-900',
        textSecondary: 'text-purple-800',
        textMuted: 'text-purple-600',
        border: 'border-purple-200',
        accent: 'bg-pink-400',
        accentHover: 'hover:bg-pink-500',
        buttonHover: 'hover:bg-purple-100',
        highlight: 'bg-blue-100',
        messageUser: 'bg-pink-400 text-white',
        messageBot: 'bg-purple-50 text-purple-900',
        icon: 'text-purple-400'
      }
    },
    thanksgiving: {
      name: 'Thanksgiving',
      preview: {
        primary: '#B7410E',
        background: '#4A2511',
        text: '#ffffff',
        accent: '#843C0C'
      },
      colors: {
        bgPrimary: 'bg-orange-900',
        bgSecondary: 'bg-orange-800',
        bgAccent: 'bg-amber-900/50',
        bgHover: 'hover:bg-amber-800/30',
        text: 'text-orange-50',
        textSecondary: 'text-amber-200',
        textMuted: 'text-orange-200',
        border: 'border-amber-700',
        accent: 'bg-amber-600',
        accentHover: 'hover:bg-amber-700',
        buttonHover: 'hover:bg-orange-800/50',
        highlight: 'bg-amber-900/30',
        messageUser: 'bg-amber-600 text-white',
        messageBot: 'bg-orange-800 text-orange-50',
        icon: 'text-amber-300'
      }
    },
    // TV Show Themes
    simpsons: {
      name: 'The Simpsons',
      preview: {
        primary: '#FED41D',
        background: '#3B95D1',
        text: '#000000',
        accent: '#D6E69F'
      },
      colors: {
        bgPrimary: 'bg-blue-400',
        bgSecondary: 'bg-blue-500',
        bgAccent: 'bg-yellow-300/50',
        bgHover: 'hover:bg-blue-300',
        text: 'text-gray-900',
        textSecondary: 'text-gray-800',
        textMuted: 'text-gray-700',
        border: 'border-yellow-400',
        accent: 'bg-yellow-400',
        accentHover: 'hover:bg-yellow-500',
        buttonHover: 'hover:bg-blue-300',
        highlight: 'bg-yellow-200',
        messageUser: 'bg-yellow-400 text-gray-900',
        messageBot: 'bg-blue-300 text-gray-900',
        icon: 'text-yellow-400'
      }
    },
    dragonBallZ: {
      name: 'Dragon Ball Z',
      preview: {
        primary: '#FF9232',
        background: '#23238E',
        text: '#ffffff',
        accent: '#FF4900'
      },
      colors: {
        bgPrimary: 'bg-indigo-900',
        bgSecondary: 'bg-indigo-800',
        bgAccent: 'bg-orange-500/50',
        bgHover: 'hover:bg-indigo-700',
        text: 'text-orange-50',
        textSecondary: 'text-orange-100',
        textMuted: 'text-orange-200',
        border: 'border-orange-500',
        accent: 'bg-orange-500',
        accentHover: 'hover:bg-orange-600',
        buttonHover: 'hover:bg-indigo-700',
        highlight: 'bg-orange-500/30',
        messageUser: 'bg-orange-500 text-white',
        // Inspired by Goku's gi
        messageBot: 'bg-blue-700 text-orange-50',
        icon: 'text-orange-400'
      }
    },
    naruto: {
      name: 'Naruto',
      preview: {
        primary: '#FF6B2B',
        background: '#000000',
        text: '#ffffff',
        accent: '#ED3E37'
      },
      colors: {
        // Based on Naruto's outfit and general aesthetic
        bgPrimary: 'bg-slate-900',
        bgSecondary: 'bg-slate-800',
        bgAccent: 'bg-orange-500/50',
        bgHover: 'hover:bg-slate-700',
        text: 'text-orange-50',
        textSecondary: 'text-orange-100',
        textMuted: 'text-orange-200',
        // Red spiral inspired by the Uzumaki clan symbol
        border: 'border-red-500',
        accent: 'bg-orange-500',
        accentHover: 'hover:bg-orange-600',
        buttonHover: 'hover:bg-slate-700',
        highlight: 'bg-orange-500/30',
        // Orange from Naruto's outfit
        messageUser: 'bg-orange-500 text-white',
        // Black and red from Akatsuki theme
        messageBot: 'bg-red-900 text-red-50',
        icon: 'text-orange-400'
      }
    },
    // Extended with additional anime-inspired theme
    akatsuki: {
      name: 'Akatsuki',
      preview: {
        primary: '#FF0000',
        background: '#1A1A1A',
        text: '#ffffff',
        accent: '#CF0000'
      },
      colors: {
        // Based on Akatsuki cloak colors
        bgPrimary: 'bg-gray-900',
        bgSecondary: 'bg-gray-800',
        bgAccent: 'bg-red-900/50',
        bgHover: 'hover:bg-gray-700',
        text: 'text-red-50',
        textSecondary: 'text-red-100',
        textMuted: 'text-red-200',
        // Red clouds pattern inspiration
        border: 'border-red-800',
        accent: 'bg-red-600',
        accentHover: 'hover:bg-red-700',
        buttonHover: 'hover:bg-gray-700',
        highlight: 'bg-red-900/30',
        messageUser: 'bg-red-600 text-white',
        messageBot: 'bg-gray-800 text-red-50',
        icon: 'text-red-500'
      }
    }
  };
  
  /**
   * Helper function to get theme colors
   * @param {string} themeName - Name of the theme
   * @returns {Object} Theme colors or default theme if not found
   */
  export const getThemeColors = (themeName) => {
    return themes[themeName]?.colors || themes.light.colors;
  };
  
  /**
   * Get all available theme names
   * @returns {string[]} Array of theme names
   */
  export const getThemeNames = () => Object.keys(themes);
  
  export default themes;