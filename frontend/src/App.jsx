import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createSwissTheme } from './theme/swissTheme';
import SwissLayout from './components/layout/SwissLayout';
import EnhancedCodeWorkspace from './components/workspace/EnhancedCodeWorkspace';

function App() {
  const [themeMode, setThemeMode] = React.useState('dark');
  const theme = React.useMemo(() => createSwissTheme(themeMode), [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<SwissLayout />}>
          <Route index element={<EnhancedCodeWorkspace />} />
          <Route path="editor/:projectId" element={<EnhancedCodeWorkspace />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;