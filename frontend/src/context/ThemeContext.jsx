import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';

// Default theme settings
const defaultSettings = {
  themeMode: 'light',
  direction: 'ltr',
  responsiveFontSizes: true,
  roundedCorners: true,
};

// Create context
const ThemeContext = createContext({
  ...defaultSettings,
  toggleThemeMode: () => {},
  toggleDirection: () => {},
  updateSettings: () => {},
});

// Custom hook to use theme context
export const useThemeContext = () => useContext(ThemeContext);

// Theme provider component
export const ThemeContextProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    // Load settings from localStorage or use defaults
    const savedSettings = localStorage.getItem('app_theme_settings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('app_theme_settings', JSON.stringify(settings));
  }, [settings]);

  // Toggle between light and dark mode
  const toggleThemeMode = () => {
    setSettings((prev) => ({
      ...prev,
      themeMode: prev.themeMode === 'light' ? 'dark' : 'light',
    }));
  };

  // Toggle between LTR and RTL
  const toggleDirection = () => {
    setSettings((prev) => ({
      ...prev,
      direction: prev.direction === 'ltr' ? 'rtl' : 'ltr',
    }));
  };

  // Update multiple settings at once
  const updateSettings = (newSettings) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  // Create theme based on settings
  const theme = useMemo(() => {
    const isDark = settings.themeMode === 'dark';

    return createTheme({
      direction: settings.direction,
      palette: {
        mode: settings.themeMode,
        primary: {
          main: isDark ? '#90caf9' : '#1976d2',
          light: isDark ? '#e3f2fd' : '#bbdefb',
          dark: isDark ? '#42a5f5' : '#1565c0',
          contrastText: isDark ? 'rgba(0, 0, 0, 0.87)' : '#fff',
        },
        secondary: {
          main: isDark ? '#f48fb1' : '#9c27b0',
          light: isDark ? '#f8bbd0' : '#ce93d8',
          dark: isDark ? '#f06292' : '#7b1fa2',
          contrastText: '#fff',
        },
        background: {
          default: isDark ? '#121212' : '#f5f5f5',
          paper: isDark ? '#1e1e1e' : '#fff',
        },
        text: {
          primary: isDark ? '#fff' : 'rgba(0, 0, 0, 0.87)',
          secondary: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
          disabled: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.38)',
        },
        divider: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
      },
      typography: {
        fontFamily: [
          'Roboto',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Arial',
          'sans-serif',
        ].join(','),
        h1: { fontWeight: 500, fontSize: '2.5rem' },
        h2: { fontWeight: 500, fontSize: '2rem' },
        h3: { fontWeight: 500, fontSize: '1.75rem' },
        h4: { fontWeight: 500, fontSize: '1.5rem' },
        h5: { fontWeight: 500, fontSize: '1.25rem' },
        h6: { fontWeight: 500, fontSize: '1rem' },
        button: { textTransform: 'none' },
      },
      shape: {
        borderRadius: settings.roundedCorners ? 8 : 0,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              textTransform: 'none',
              fontWeight: 500,
              padding: '8px 16px',
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
              '&:hover': {
                boxShadow: '0 6px 24px 0 rgba(0,0,0,0.1)',
              },
            },
          },
        },
      },
    });
  }, [settings.themeMode, settings.direction, settings.roundedCorners]);

  // Update document direction when direction changes
  useEffect(() => {
    document.dir = settings.direction;
  }, [settings.direction]);

  // Context value
  const contextValue = {
    ...settings,
    theme,
    toggleThemeMode,
    toggleDirection,
    updateSettings,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
