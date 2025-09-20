import React, { useState } from 'react';
import { Box, Drawer, useTheme, useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom';
import SwissHeader from './SwissHeader';
import Sidebar from './Sidebar';
import ContextSummaryPanel from './ContextSummaryPanel';
import AIPromptBar from '../ai/AIPromptBar';

const SIDEBAR_WIDTH = 280;
const CONTEXT_PANEL_WIDTH = 280;
const HEADER_HEIGHT = 64;

const SwissLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [contextPanelOpen, setContextPanelOpen] = useState(!isMobile);
  const [selectedCode, setSelectedCode] = useState('');
  const [currentFile, setCurrentFile] = useState('main.js');

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleContextPanelToggle = () => {
    setContextPanelOpen(!contextPanelOpen);
  };

  const handleSendPrompt = (prompt) => {
    console.log('AI Prompt sent:', prompt);
    // Here you would typically send to AI service
  };

  const getMainContentWidth = () => {
    let width = '100%';
    
    if (!isMobile) {
      const sidebarWidth = sidebarOpen ? SIDEBAR_WIDTH : 0;
      const contextWidth = contextPanelOpen ? CONTEXT_PANEL_WIDTH : 0;
      width = `calc(100% - ${sidebarWidth + contextWidth}px)`;
    }
    
    return width;
  };

  const getMainContentMargin = () => {
    if (isMobile) return 0;
    return sidebarOpen ? SIDEBAR_WIDTH : 0;
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Header */}
      <SwissHeader 
        onToggleSidebar={handleSidebarToggle}
        sidebarOpen={sidebarOpen}
      />

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={sidebarOpen}
        onClose={handleSidebarToggle}
        sx={{
          width: sidebarOpen ? SIDEBAR_WIDTH : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            borderRight: `1px solid ${theme.palette.divider}`,
            top: HEADER_HEIGHT,
            height: `calc(100vh - ${HEADER_HEIGHT}px)`,
            bgcolor: 'background.paper',
          },
        }}
      >
        <Sidebar 
          drawerWidth={SIDEBAR_WIDTH}
          isOpen={sidebarOpen}
          isMobile={isMobile}
          mobileOpen={sidebarOpen}
          onClose={handleSidebarToggle}
          onFileSelect={setCurrentFile}
        />
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: getMainContentWidth(),
          marginLeft: getMainContentMargin(),
          marginTop: `${HEADER_HEIGHT}px`,
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Main Editor Content */}
        <Box 
          sx={{ 
            flex: 1, 
            display: 'flex',
            overflow: 'hidden',
          }}
        >
          {/* Editor Area */}
          <Box 
            sx={{ 
              flex: 1, 
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <Outlet context={{ 
              selectedCode, 
              setSelectedCode, 
              currentFile,
              setCurrentFile 
            }} />
          </Box>

          {/* Context Summary Panel */}
          {!isMobile && (
            <Box
              sx={{
                width: contextPanelOpen ? CONTEXT_PANEL_WIDTH : 0,
                transition: theme.transitions.create('width', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.standard,
                }),
                overflow: 'hidden',
              }}
            >
              {contextPanelOpen && (
                <ContextSummaryPanel 
                  width={CONTEXT_PANEL_WIDTH}
                  onToggle={handleContextPanelToggle}
                />
              )}
            </Box>
          )}
        </Box>

        {/* AI Prompt Bar */}
        <AIPromptBar
          onSendPrompt={handleSendPrompt}
          selectedCode={selectedCode}
          currentFile={currentFile}
        />
      </Box>

      {/* Mobile Context Panel */}
      {isMobile && (
        <Drawer
          anchor="right"
          open={contextPanelOpen}
          onClose={handleContextPanelToggle}
          sx={{
            '& .MuiDrawer-paper': {
              width: CONTEXT_PANEL_WIDTH,
              top: HEADER_HEIGHT,
              height: `calc(100vh - ${HEADER_HEIGHT}px)`,
            },
          }}
        >
          <ContextSummaryPanel 
            width={CONTEXT_PANEL_WIDTH}
            onToggle={handleContextPanelToggle}
          />
        </Drawer>
      )}
    </Box>
  );
};

export default SwissLayout;