import React, { useState, useRef } from 'react';
import { 
  Box, 
  Tab, 
  Tabs, 
  IconButton, 
  Typography, 
  Chip,
  Menu,
  MenuItem,
  useTheme 
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  MoreVert as MoreIcon,
  FileCopy as FileCopyIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useOutletContext } from 'react-router-dom';
import CodeEditor from '../editor/CodeEditor';

const EnhancedCodeWorkspace = () => {
  const theme = useTheme();
  const { selectedCode, setSelectedCode, currentFile, setCurrentFile } = useOutletContext();
  const [openTabs, setOpenTabs] = useState([
    { id: 1, name: 'main.js', language: 'javascript', modified: true, content: '// Welcome to AI Coding Platform\n// This is a Monaco Editor powered workspace\n\nfunction welcome() {\n  console.log("Hello, AI Coding Platform!");\n  console.log("Let\'s build something amazing!");\n}\n\n// Try selecting some code and ask AI for help\nfunction calculateSum(a, b) {\n  return a + b;\n}\n\n// TODO: Add error handling\nfunction processData(data) {\n  const result = [];\n  for (let i = 0; i < data.length; i++) {\n    result.push(data[i] * 2);\n  }\n  return result;\n}\n\nwelcome();' },
    { id: 2, name: 'config.json', language: 'json', modified: false, content: '{\n  "name": "ai-coding-platform",\n  "version": "1.0.0",\n  "description": "AI-powered coding assistant",\n  "features": {\n    "aiAssistant": true,\n    "codeCompletion": true,\n    "debugging": true,\n    "optimization": true\n  },\n  "providers": {\n    "openai": false,\n    "anthropic": false,\n    "gemini": false\n  }\n}' },
  ]);
  const [activeTab, setActiveTab] = useState(0);
  const [tabMenuAnchor, setTabMenuAnchor] = useState(null);
  const [menuTabId, setMenuTabId] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setCurrentFile(openTabs[newValue]?.name);
  };

  const handleCloseTab = (tabId, event) => {
    event.stopPropagation();
    const tabIndex = openTabs.findIndex(tab => tab.id === tabId);
    const newTabs = openTabs.filter(tab => tab.id !== tabId);
    setOpenTabs(newTabs);
    
    if (newTabs.length === 0) {
      setActiveTab(0);
    } else if (tabIndex <= activeTab && activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  const handleTabContextMenu = (event, tabId) => {
    event.preventDefault();
    setTabMenuAnchor(event.currentTarget);
    setMenuTabId(tabId);
  };

  const handleAddTab = () => {
    const newTab = {
      id: Date.now(),
      name: 'untitled.js',
      language: 'javascript',
      modified: false,
      content: '// New file\n',
    };
    setOpenTabs([...openTabs, newTab]);
    setActiveTab(openTabs.length);
  };

  const handleCodeChange = (newCode) => {
    const updatedTabs = openTabs.map((tab, index) => 
      index === activeTab 
        ? { ...tab, content: newCode, modified: true }
        : tab
    );
    setOpenTabs(updatedTabs);
  };

  const handleSelectionChange = (selectedText) => {
    setSelectedCode(selectedText);
  };

  const getLanguageIcon = (language) => {
    const icons = {
      javascript: '🟨',
      json: '📄',
      typescript: '🔷',
      python: '🐍',
      html: '🌐',
      css: '🎨',
    };
    return icons[language] || '📝';
  };

  const getStatusBarInfo = () => {
    const currentTab = openTabs[activeTab];
    if (!currentTab) return null;

    return {
      language: currentTab.language,
      lines: currentTab.content.split('\n').length,
      chars: currentTab.content.length,
      encoding: 'UTF-8',
    };
  };

  const statusInfo = getStatusBarInfo();

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Tab Bar */}
      <Box 
        sx={{ 
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          minHeight: 48,
        }}
      >
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            flex: 1,
            '& .MuiTab-root': {
              minHeight: 48,
              textTransform: 'none',
              minWidth: 120,
              maxWidth: 200,
              position: 'relative',
            },
          }}
        >
          {openTabs.map((tab, index) => (
            <Tab
              key={tab.id}
              label={
                <Box 
                  display="flex" 
                  alignItems="center" 
                  gap={1}
                  onContextMenu={(e) => handleTabContextMenu(e, tab.id)}
                >
                  <Typography variant="body2">
                    {getLanguageIcon(tab.language)}
                  </Typography>
                  <Typography variant="body2" noWrap>
                    {tab.name}
                  </Typography>
                  {tab.modified && (
                    <Box 
                      sx={{ 
                        width: 6, 
                        height: 6, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.main' 
                      }} 
                    />
                  )}
                  <Box
                    component="span"
                    onClick={(e) => handleCloseTab(tab.id, e)}
                    sx={{ 
                      ml: 0.5, 
                      p: 0.25,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </Box>
                </Box>
              }
            />
          ))}
        </Tabs>

        <IconButton 
          size="small" 
          onClick={handleAddTab}
          sx={{ mr: 1, color: 'text.secondary' }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      {/* Editor Area */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {openTabs[activeTab] && (
          <CodeEditor
            code={openTabs[activeTab].content}
            language={openTabs[activeTab].language}
            height="100%"
            width="100%"
            onChange={handleCodeChange}
            onSelectionChange={handleSelectionChange}
            fileName={openTabs[activeTab].name}
          />
        )}
      </Box>

      {/* Status Bar */}
      {statusInfo && (
        <Box 
          sx={{ 
            height: 24,
            bgcolor: 'background.neutral',
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            px: 2,
            gap: 2,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {statusInfo.lines} lines
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {statusInfo.chars} chars
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {statusInfo.encoding}
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Chip 
            label={statusInfo.language.toUpperCase()} 
            size="small" 
            variant="outlined"
            sx={{ 
              height: 18, 
              fontSize: '0.6rem',
              borderColor: 'primary.main',
              color: 'primary.main',
            }}
          />
        </Box>
      )}

      {/* Tab Context Menu */}
      <Menu
        anchorEl={tabMenuAnchor}
        open={Boolean(tabMenuAnchor)}
        onClose={() => setTabMenuAnchor(null)}
      >
        <MenuItem onClick={() => setTabMenuAnchor(null)}>
          <SaveIcon sx={{ mr: 1, fontSize: 16 }} />
          Save
        </MenuItem>
        <MenuItem onClick={() => setTabMenuAnchor(null)}>
          <FileCopyIcon sx={{ mr: 1, fontSize: 16 }} />
          Duplicate
        </MenuItem>
        <MenuItem onClick={() => setTabMenuAnchor(null)}>
          <RefreshIcon sx={{ mr: 1, fontSize: 16 }} />
          Reload
        </MenuItem>
        <MenuItem onClick={() => setTabMenuAnchor(null)}>
          <CloseIcon sx={{ mr: 1, fontSize: 16 }} />
          Close
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default EnhancedCodeWorkspace;