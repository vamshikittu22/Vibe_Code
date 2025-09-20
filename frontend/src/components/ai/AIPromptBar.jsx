import React, { useState, useRef } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Button,
  Chip,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Card,
  CardContent,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Send as SendIcon,
  AutoAwesome as TemplateIcon,
  Code as CodeIcon,
  BugReport as BugIcon,
  Speed as OptimizeIcon,
  Help as ExplainIcon,
  Build as RefactorIcon,
  AttachFile as AttachIcon,
} from '@mui/icons-material';

const promptTemplates = [
  {
    category: 'Debug',
    icon: <BugIcon />,
    templates: [
      'Find and fix bugs in this code',
      'Debug the error: {error_message}',
      'Why is this function not working as expected?',
      'Identify potential edge cases in this code',
    ]
  },
  {
    category: 'Optimize',
    icon: <OptimizeIcon />,
    templates: [
      'Optimize this code for better performance',
      'Reduce complexity and improve readability',
      'Make this code more efficient',
      'Suggest performance improvements for this function',
    ]
  },
  {
    category: 'Explain',
    icon: <ExplainIcon />,
    templates: [
      'Explain how this code works',
      'What does this function do?',
      'Break down this algorithm step by step',
      'Explain the design pattern used here',
    ]
  },
  {
    category: 'Refactor',
    icon: <RefactorIcon />,
    templates: [
      'Refactor this code using modern best practices',
      'Convert this to use React hooks',
      'Refactor this into smaller, reusable functions',
      'Apply SOLID principles to this code',
    ]
  },
  {
    category: 'Generate',
    icon: <CodeIcon />,
    templates: [
      'Generate unit tests for this function',
      'Create documentation for this component',
      'Write a function that does: {description}',
      'Generate TypeScript types for this interface',
    ]
  },
];

const AIPromptBar = ({ onSendPrompt, selectedCode, currentFile }) => {
  const theme = useTheme();
  const [prompt, setPrompt] = useState('');
  const [templatesAnchor, setTemplatesAnchor] = useState(null);
  const [contextChips, setContextChips] = useState([]);
  const inputRef = useRef(null);

  const handleSend = () => {
    if (!prompt.trim()) return;
    
    const fullPrompt = {
      text: prompt,
      context: {
        file: currentFile,
        selectedCode: selectedCode,
        chips: contextChips,
      },
      timestamp: new Date().toISOString(),
    };

    onSendPrompt(fullPrompt);
    setPrompt('');
    setContextChips([]);
  };

  const handleTemplateClick = (template) => {
    setPrompt(template);
    setTemplatesAnchor(null);
    inputRef.current?.focus();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      handleSend();
    }
  };

  const addContextChip = (type, value) => {
    const newChip = { type, value, id: Date.now() };
    setContextChips(prev => [...prev, newChip]);
  };

  const removeContextChip = (id) => {
    setContextChips(prev => prev.filter(chip => chip.id !== id));
  };

  React.useEffect(() => {
    if (selectedCode) {
      addContextChip('selection', `${selectedCode.length} chars selected`);
    }
  }, [selectedCode]);

  React.useEffect(() => {
    if (currentFile) {
      setContextChips(prev => {
        const filtered = prev.filter(chip => chip.type !== 'file');
        return [...filtered, { type: 'file', value: currentFile, id: `file-${Date.now()}` }];
      });
    }
  }, [currentFile]);

  return (
    <Box
      sx={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        p: 2,
        zIndex: 10,
      }}
    >
      {/* Context Chips */}
      {contextChips.length > 0 && (
        <Box display="flex" gap={1} mb={2} flexWrap="wrap">
          {contextChips.map((chip) => (
            <Chip
              key={chip.id}
              label={chip.value}
              size="small"
              variant="outlined"
              onDelete={() => removeContextChip(chip.id)}
              icon={chip.type === 'file' ? <AttachIcon /> : <CodeIcon />}
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                '& .MuiChip-deleteIcon': {
                  color: 'primary.main',
                },
              }}
            />
          ))}
        </Box>
      )}

      {/* Prompt Input */}
      <Box display="flex" gap={2} alignItems="flex-end">
        <TextField
          ref={inputRef}
          fullWidth
          multiline
          maxRows={4}
          placeholder="Ask AI to help with code... (⌘+Enter to send)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyPress}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: 'background.neutral',
              '& fieldset': {
                borderColor: 'divider',
              },
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
                borderWidth: 2,
              },
            },
          }}
        />

        {/* Templates Button */}
        <Tooltip title="Prompt Templates">
          <IconButton
            onClick={(e) => setTemplatesAnchor(e.currentTarget)}
            sx={{
              bgcolor: 'background.neutral',
              border: 1,
              borderColor: 'divider',
              '&:hover': {
                bgcolor: 'action.hover',
                borderColor: 'primary.main',
              },
            }}
          >
            <TemplateIcon />
          </IconButton>
        </Tooltip>

        {/* Send Button */}
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleSend}
          disabled={!prompt.trim()}
          sx={{
            borderRadius: 3,
            px: 3,
            py: 1.5,
            minWidth: 120,
          }}
        >
          Send
        </Button>
      </Box>

      {/* Templates Menu */}
      <Menu
        anchorEl={templatesAnchor}
        open={Boolean(templatesAnchor)}
        onClose={() => setTemplatesAnchor(null)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 400,
            maxWidth: 500,
            maxHeight: 600,
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Prompt Templates
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Click any template to use it as a starting point
          </Typography>
        </Box>

        {promptTemplates.map((category, categoryIndex) => (
          <Box key={category.category}>
            {categoryIndex > 0 && <Divider />}
            <Box sx={{ p: 2 }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                {category.icon}
                <Typography variant="subtitle1" fontWeight="600">
                  {category.category}
                </Typography>
              </Box>
              
              {category.templates.map((template, templateIndex) => (
                <Card
                  key={templateIndex}
                  variant="outlined"
                  sx={{
                    mb: 1,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'action.hover',
                      transform: 'translateY(-1px)',
                    },
                  }}
                  onClick={() => handleTemplateClick(template)}
                >
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Typography variant="body2">
                      {template}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        ))}
      </Menu>
    </Box>
  );
};

export default AIPromptBar;