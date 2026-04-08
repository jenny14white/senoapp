import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeName = 'default' | 'defaultDark' | 'forest' | 'pinkDreams';

interface Theme {
  name: string;
  colors: {
    primary: string;
    primaryDark: string;
    accent: string;
    background: string;
    cardBg: string;
    cardBgSolid: string; // Mocniejsze tło dla wyróżniających się kart
    textPrimary: string;
    textSecondary: string;
  };
  isDark: boolean;
}

export const THEMES: Record<ThemeName, Theme> = {
  default: {
    name: 'Jasny (Domyślny)',
    isDark: false,
    colors: {
      primary: '#797641',
      primaryDark: '#4b4c2c',
      accent: '#9fa659',
      background: '#f5f5f5',
      cardBg: 'rgba(255, 255, 255, 0.6)',
      cardBgSolid: '#ffffff', // Mocniejsze tło dla wyróżniających się kart
      textPrimary: '#1f2937',
      textSecondary: '#6b7280',
    },
  },
  defaultDark: {
    name: 'Ciemny (Domyślny)',
    isDark: true,
    colors: {
      primary: '#63335A',
      primaryDark: '#9A7490',
      accent: '#9A7490',
      background: '#17122A',
      cardBg: 'rgba(23, 18, 42, 0.6)',
      cardBgSolid: '#333333', // Mocniejsze tło dla wyróżniających się kart
      textPrimary: '#f9fafb',
      textSecondary: '#9ca3af',
    },
  },
  forest: {
    name: 'Las',
    isDark: false,
    colors: {
      primary: '#335c67',
      primaryDark: '#540b0e',
      accent: '#e09f3e',
      background: '#fff3b0',
      cardBg: 'rgba(255, 243, 176, 0.8)',
      cardBgSolid: 'rgba(255, 255, 255, 0.9)', // Białe, bardziej wyróżniające się karty
      textPrimary: '#540b0e',
      textSecondary: '#9e2a2b',
    },
  },
  pinkDreams: {
    name: 'Różowe Sny',
    isDark: false,
    colors: {
      primary: '#fb6f92',
      primaryDark: '#ff8fab',
      accent: '#ffb3c6',
      background: '#fff0f5',
      cardBg: 'rgba(255, 179, 198, 0.3)',
      cardBgSolid: 'rgba(255, 255, 255, 0.85)', // Białe, bardziej wyróżniające się karty
      textPrimary: '#fb6f92',
      textSecondary: '#ff8fab',
    },
  },
};

interface ThemeContextType {
  themeName: ThemeName;
  theme: Theme;
  setTheme: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    const saved = localStorage.getItem('finapp-theme');
    
    // Migracja ze starych wartości
    if (saved === 'light') {
      return 'default';
    }
    if (saved === 'dark') {
      return 'defaultDark';
    }
    
    // Sprawdź czy zapisana wartość jest poprawna
    if (saved && saved in THEMES) {
      return saved as ThemeName;
    }
    
    return 'default';
  });

  const theme = THEMES[themeName];

  useEffect(() => {
    localStorage.setItem('finapp-theme', themeName);
    
    // Aplikuj dark class jeśli potrzebne
    if (theme.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Aplikuj kolory jako CSS variables
    document.documentElement.style.setProperty('--color-primary', theme.colors.primary);
    document.documentElement.style.setProperty('--color-primary-dark', theme.colors.primaryDark);
    document.documentElement.style.setProperty('--color-accent', theme.colors.accent);
    document.documentElement.style.setProperty('--color-background', theme.colors.background);
    document.documentElement.style.setProperty('--color-card-bg', theme.colors.cardBg);
    document.documentElement.style.setProperty('--color-card-bg-solid', theme.colors.cardBgSolid);
    document.documentElement.style.setProperty('--color-text-primary', theme.colors.textPrimary);
    document.documentElement.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
  }, [themeName, theme]);

  const setTheme = (name: ThemeName) => {
    setThemeName(name);
  };

  return (
    <ThemeContext.Provider value={{ themeName, theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}