import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Tooltip, useTheme, useMediaQuery } from '@mui/material';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Lightbulb as AssistantIcon, Code as CodeIcon } from '@mui/icons-material';
import CodeEditor from '../editor/CodeEditor';
import AIAssistantPanel from '../ai/AIAssistantPanel';
import { useProject } from '../../context/ProjectContext';

const CodeWorkspace = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { selectedFile } = useProject();
  const [isAssistantOpen, setIsAssistantOpen] = useState(!isMobile);
  const [isResizing, setIsResizing] = useState(false);
  const panelGroupRef = useRef(null);

  // Toggle AI assistant panel
  const toggleAssistant = () => {
    setIsAssistantOpen(!isAssistantOpen);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (panelGroupRef.current) {
        panelGroupRef.current.updateLayout();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle AI panel on mobile when file changes
  useEffect(() => {
    if (isMobile) {
      setIsAssistantOpen(false);
    }
  }, [selectedFile, isMobile]);

  // Handle panel resize
  const handleResizeStart = () => {
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  // Custom resize handle component
  const ResizeHandle = () => (
    <PanelResizeHandle
      onDragging={isDragging => {
        if (isDragging) handleResizeStart();
        else handleResizeEnd();
      }}
    >
      <Box
        sx={{
          width: '4px',
          height: '100%',
          bgcolor: isResizing ? 'primary.main' : 'divider',
          transition: 'background-color 0.2s ease',
          '&:hover': {
            bgcolor: 'primary.main',
            cursor: 'col-resize',
          },
        }}
      />
    </PanelResizeHandle>
  );

  // Mobile view - only show editor or assistant
  if (isMobile) {
    return (
      <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
        {isAssistantOpen ? (
          <AIAssistantPanel />
        ) : (
          <>
            <CodeEditor
              code={selectedFile?.content || ''}
              language={getFileLanguage(selectedFile?.name || '')}
              height="100%"
              width="100%"
              fileName={selectedFile?.name || 'Untitled'}
            />
            <Tooltip title="AI Assistant">
              <IconButton
                onClick={toggleAssistant}
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  boxShadow: theme.shadows[4],
                }}
              >
                <AssistantIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Box>
    );
  }

  // Desktop view - show both editor and assistant
  return (
    <Box sx={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      <PanelGroup direction="horizontal" ref={panelGroupRef}>
        <Panel defaultSize={70} minSize={30}>
          <Box sx={{ height: '100%', position: 'relative' }}>
            <CodeEditor
              code={selectedFile?.content || ''}
              language={getFileLanguage(selectedFile?.name || '')}
              height="100%"
              width="100%"
              fileName={selectedFile?.name || 'Untitled'}
            />
            <Tooltip title={isAssistantOpen ? 'Hide Assistant' : 'Show Assistant'}>
              <IconButton
                onClick={toggleAssistant}
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  bgcolor: 'background.paper',
                  border: `1px solid ${theme.palette.divider}`,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  boxShadow: theme.shadows[2],
                }}
              >
                {isAssistantOpen ? <CodeIcon /> : <AssistantIcon color="primary" />}
              </IconButton>
            </Tooltip>
          </Box>
        </Panel>
        
        {isAssistantOpen && (
          <>
            <ResizeHandle />
            <Panel defaultSize={30} minSize={20} maxSize={50}>
              <AIAssistantPanel />
            </Panel>
          </>
        )}
      </PanelGroup>
    </Box>
  );
};

// Helper function to determine language based on file extension
const getFileLanguage = (fileName) => {
  if (!fileName) return 'plaintext';
  
  const extension = fileName.split('.').pop().toLowerCase();
  
  const languageMap = {
    // Web
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'sass': 'sass',
    'json': 'json',
    
    // Backend
    'py': 'python',
    'java': 'java',
    'c': 'c',
    'cpp': 'cpp',
    'cs': 'csharp',
    'go': 'go',
    'php': 'php',
    'rb': 'ruby',
    'rs': 'rust',
    'swift': 'swift',
    'kt': 'kotlin',
    'scala': 'scala',
    
    // Data
    'sql': 'sql',
    'graphql': 'graphql',
    'yml': 'yaml',
    'yaml': 'yaml',
    'xml': 'xml',
    
    // Config
    'md': 'markdown',
    'sh': 'shell',
    'dockerfile': 'dockerfile',
    'gitignore': 'gitignore',
  };
  
  return languageMap[extension] || 'plaintext';
};

export default CodeWorkspace;
