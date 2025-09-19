import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  IconButton, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Divider, 
  Chip, 
  CircularProgress,
  Button,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Send as SendIcon, 
  Code as CodeIcon, 
  SmartToy as AIIcon, 
  Person as UserIcon, 
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  Lightbulb as SuggestionIcon
} from '@mui/icons-material';
import { useThemeContext } from '../../context/ThemeContext';
import { useProject } from '../../context/ProjectContext';

const AIAssistantPanel = ({ width = '100%', height = '100%' }) => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const { selectedFile } = useProject();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! I\'m your AI coding assistant. How can I help you today?',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  // Sample code suggestions based on the selected file
  const codeSuggestions = [
    'Optimize this code',
    'Explain this function',
    'Find bugs in this code',
    'Refactor this component',
    'Add error handling',
    'Write unit tests for this',
  ];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate AI response (in a real app, this would be an API call)
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          text: getAIResponse(input, selectedFile?.content || ''),
          sender: 'ai',
          timestamp: new Date(),
          type: 'text',
          codeSuggestion: Math.random() > 0.7 ? generateCodeSuggestion() : null
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsLoading(false);
    }
  };

  const getAIResponse = (userInput, fileContent) => {
    // This is a simplified response generator
    // In a real app, this would call an AI API
    const responses = [
      `I've analyzed your code. ${fileContent ? 'Here are some suggestions...' : 'Could you share the code you\'d like me to look at?'}`,
      'Based on your code, I recommend the following improvements...',
      'This is an interesting approach. Have you considered...',
      'I can help you optimize this code. Here\'s what I suggest...',
      'Let me explain how this code works...',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateCodeSuggestion = () => {
    return {
      code: '// Example code suggestion\nfunction optimizeThis() {\n  // Your optimized code here\n  return "Optimized!";\n}',
      language: 'javascript',
      explanation: 'This is a suggested optimization for your code.'
    };
  };

  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box 
      sx={{ 
        width, 
        height,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderLeft: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          p: 2, 
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          bgcolor: theme.palette.background.default,
        }}
      >
        <AIIcon color="primary" />
        <Typography variant="subtitle1" fontWeight={600}>
          AI Assistant
        </Typography>
        <Chip 
          label="Beta" 
          size="small" 
          color="primary" 
          variant="outlined"
          sx={{ ml: 'auto' }}
        />
      </Box>

      {/* Messages */}
      <Box 
        sx={{ 
          flex: 1, 
          overflowY: 'auto',
          p: 2,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.action.hover,
            borderRadius: '3px',
          },
        }}
      >
        <List sx={{ width: '100%' }}>
          {messages.map((message, index) => (
            <React.Fragment key={message.id}>
              <ListItem 
                alignItems="flex-start"
                sx={{
                  flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  mb: 2,
                  px: 1,
                }}
              >
                <ListItemAvatar sx={{ minWidth: 40, mt: 0.5 }}>
                  {message.sender === 'ai' ? (
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                      <AIIcon fontSize="small" />
                    </Avatar>
                  ) : (
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                      <UserIcon fontSize="small" />
                    </Avatar>
                  )}
                </ListItemAvatar>
                <Box
                  sx={{
                    maxWidth: '80%',
                    ml: message.sender === 'ai' ? 0 : 'auto',
                    mr: message.sender === 'ai' ? 'auto' : 0,
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: message.sender === 'ai' 
                        ? theme.palette.mode === 'dark'
                          ? alpha(theme.palette.background.paper, 0.8)
                          : theme.palette.grey[100]
                        : theme.palette.primary.main,
                      color: message.sender === 'ai' 
                        ? 'text.primary' 
                        : theme.palette.primary.contrastText,
                      borderRadius: 2,
                      borderTopLeftRadius: message.sender === 'ai' ? 4 : 12,
                      borderTopRightRadius: message.sender === 'ai' ? 12 : 4,
                    }}
                  >
                    {message.type === 'code' ? (
                      <Box>
                        <Box 
                          sx={{ 
                            position: 'relative',
                            bgcolor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f8f9fa',
                            borderRadius: 1,
                            p: 2,
                            mb: 1,
                            overflowX: 'auto',
                          }}
                        >
                          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                            <code>{message.text}</code>
                          </pre>
                          <Tooltip 
                            title={copiedId === message.id ? 'Copied!' : 'Copy code'}
                            placement="top"
                            arrow
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleCopyCode(message.text, message.id)}
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                color: 'text.secondary',
                                '&:hover': {
                                  bgcolor: 'action.hover',
                                },
                              }}
                            >
                              {copiedId === message.id ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
                            </IconButton>
                          </Tooltip>
                        </Box>
                        {message.explanation && (
                          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                            {message.explanation}
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {message.text}
                      </Typography>
                    )}

                    {message.codeSuggestion && (
                      <Box 
                        sx={{ 
                          mt: 2, 
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 1,
                          overflow: 'hidden',
                        }}
                      >
                        <Box 
                          sx={{ 
                            bgcolor: theme.palette.action.selected,
                            px: 2, 
                            py: 1, 
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <SuggestionIcon color="primary" fontSize="small" />
                          <Typography variant="caption" color="text.secondary">
                            SUGGESTION
                          </Typography>
                        </Box>
                        <Box 
                          sx={{ 
                            p: 2,
                            bgcolor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f8f9fa',
                            maxHeight: '200px',
                            overflow: 'auto',
                          }}
                        >
                          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>
                            <code>{message.codeSuggestion.code}</code>
                          </pre>
                        </Box>
                        <Box sx={{ p: 1.5, borderTop: `1px solid ${theme.palette.divider}` }}>
                          <Button 
                            size="small" 
                            startIcon={<ContentCopyIcon />}
                            onClick={() => handleCopyCode(message.codeSuggestion.code, `suggestion-${message.id}`)}
                          >
                            Copy Code
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </Paper>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: 'block',
                      textAlign: message.sender === 'ai' ? 'left' : 'right',
                      color: 'text.secondary',
                      mt: 0.5,
                      px: 1,
                    }}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
              </ListItem>
              {index < messages.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
          <div ref={messagesEndRef} />
        </List>
      </Box>

      {/* Quick Suggestions */}
      {!input && messages.length <= 1 && (
        <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Try asking me to:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {codeSuggestions.map((suggestion, index) => (
              <Chip
                key={index}
                label={suggestion}
                size="small"
                variant="outlined"
                onClick={() => handleSuggestionClick(suggestion)}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Input */}
      <Box 
        sx={{ 
          p: 2, 
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.default,
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask me anything about your code..."
            multiline
            maxRows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            InputProps={{
              sx: {
                borderRadius: 4,
                bgcolor: 'background.paper',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'divider',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            sx={{
              alignSelf: 'flex-end',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              '&:disabled': {
                bgcolor: 'action.disabledBackground',
                color: 'action.disabled',
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
          AI Assistant may produce inaccurate information. Always verify important information.
        </Typography>
      </Box>
    </Box>
  );
};

export default AIAssistantPanel;
