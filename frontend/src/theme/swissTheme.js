import { createTheme } from '@mui/material/styles';

// Swiss-inspired color palette
export const swissColors = {
  // Primary colors
  richBlack: '#0D0D0D',
  deepNavy: '#1A1B3A',
  coldGrey: '#8B8B99',
  
  // Accent
  emeraldGreen: '#10B981',
  emeraldLight: '#34D399',
  emeraldDark: '#059669',
  
  // Backgrounds
  softWhite: '#FAFAFA',
  lightGrey: '#EEEEEE',
  warmGrey: '#F7F7F7',
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Code editor specific
  editorBg: '#1E1E1E',
  editorBorder: '#333333',
};

export const createSwissTheme = (mode = 'light') => {
  const isDark = mode === 'dark';
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: swissColors.emeraldGreen,
        light: swissColors.emeraldLight,
        dark: swissColors.emeraldDark,
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: swissColors.deepNavy,
        light: swissColors.coldGrey,
        dark: swissColors.richBlack,
        contrastText: '#FFFFFF',
      },
      background: {
        default: isDark ? swissColors.richBlack : swissColors.softWhite,
        paper: isDark ? swissColors.deepNavy : '#FFFFFF',
        neutral: swissColors.warmGrey,
      },
      text: {
        primary: isDark ? '#FFFFFF' : swissColors.richBlack,
        secondary: swissColors.coldGrey,
        disabled: isDark ? '#666666' : '#CCCCCC',
      },
      divider: isDark ? '#333333' : swissColors.lightGrey,
      success: {
        main: swissColors.success,
      },
      warning: {
        main: swissColors.warning,
      },
      error: {
        main: swissColors.error,
      },
      info: {
        main: swissColors.info,
      },
    },
    typography: {
      fontFamily: '"Inter", "Helvetica Neue", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 700,
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h4: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      body1: {
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: 1.5,
      },
      caption: {
        fontSize: '0.75rem',
        fontWeight: 300,
        lineHeight: 1.4,
        letterSpacing: '0.02em',
      },
      button: {
        fontSize: '0.875rem',
        fontWeight: 500,
        textTransform: 'none',
        letterSpacing: '0.01em',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '10px 24px',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'scale(0.98)',
            },
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: `1px solid ${isDark ? '#333333' : swissColors.lightGrey}`,
            boxShadow: 'none',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: swissColors.emeraldGreen,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: swissColors.emeraldGreen,
                borderWidth: 2,
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontSize: '0.75rem',
            fontWeight: 500,
          },
        },
      },
    },
  });
};