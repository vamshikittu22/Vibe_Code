import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SnackbarProvider } from 'notistack';
import { CssBaseline, ThemeProvider, StyledEngineProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeContextProvider } from './context/ThemeContext';
import { ProjectProvider } from './context/ProjectContext';
import AIAssistantProvider from './context/AIAssistantContext';

// Import the main App component
import App from './App';

// Import global styles
import './styles/app.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  registerSW();
}

// Create root element
const container = document.getElementById('root');
const root = createRoot(container);

// Theme Wrapper Component
const ThemeWrapper = ({ children }) => {
  const { theme } = useThemeContext();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

// Render the application
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <StyledEngineProvider injectFirst>
          <ThemeContextProvider>
            <ThemeWrapper>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <SnackbarProvider
                  maxSnack={3}
                  autoHideDuration={3000}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                >
                  <AuthProvider>
                    <ProjectProvider>
                      <AIAssistantProvider>
                        <App />
                      </AIAssistantProvider>
                    </ProjectProvider>
                  </AuthProvider>
                </SnackbarProvider>
              </LocalizationProvider>
            </ThemeWrapper>
          </ThemeContextProvider>
        </StyledEngineProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  </React.StrictMode>
);

// Web Vitals (optional)
// import reportWebVitals from './reportWebVitals';
// reportWebVitals(console.log);
