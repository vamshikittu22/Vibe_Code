import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  IconButton,
  Tooltip,
  Collapse,
  LinearProgress,
} from '@mui/material';
import {
  Code as CodeIcon,
  Chat as ChatIcon,
  History as HistoryIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Circle as CircleIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

const ContextSummaryPanel = ({ width = 280 }) => {
  const [expandedSections, setExpandedSections] = useState({
    context: true,
    session: true,
    network: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Mock data - in real app this would come from context/props
  const currentContext = {
    selectedFile: 'main.js',
    selectedLines: '23-45',
    language: 'JavaScript',
    lastModified: '2 minutes ago',
  };

  const recentInteractions = [
    { id: 1, type: 'optimize', query: 'Optimize this function', timestamp: '5 min ago', status: 'completed' },
    { id: 2, type: 'explain', query: 'Explain async/await', timestamp: '12 min ago', status: 'completed' },
    { id: 3, type: 'debug', query: 'Find bug in validation', timestamp: '18 min ago', status: 'completed' },
    { id: 4, type: 'refactor', query: 'Refactor to use hooks', timestamp: '25 min ago', status: 'completed' },
  ];

  const networkStatus = {
    api: 'connected',
    lastSync: '30 seconds ago',
    tokensUsed: 1247,
    tokensLimit: 10000,
    provider: 'Google Gemini',
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
      case 'completed':
        return <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />;
      case 'syncing':
      case 'processing':
        return <CircleIcon sx={{ fontSize: 16, color: 'warning.main' }} />;
      case 'error':
      case 'failed':
        return <ErrorIcon sx={{ fontSize: 16, color: 'error.main' }} />;
      default:
        return <CircleIcon sx={{ fontSize: 16, color: 'text.disabled' }} />;
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      optimize: 'success',
      explain: 'info',
      debug: 'error',
      refactor: 'warning',
    };
    return colors[type] || 'default';
  };

  return (
    <Box 
      sx={{ 
        width,
        height: '100%',
        bgcolor: 'background.paper',
        borderLeft: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="bold">
          Context & Session
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {/* Current Context */}
        <Card variant="outlined" sx={{ m: 2, mb: 1 }}>
          <CardContent sx={{ p: 2, pb: '16px !important' }}>
            <Box 
              display="flex" 
              justifyContent="space-between" 
              alignItems="center"
              onClick={() => toggleSection('context')}
              sx={{ cursor: 'pointer' }}
            >
              <Typography variant="subtitle1" fontWeight="600">
                Current Context
              </Typography>
              {expandedSections.context ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>
            
            <Collapse in={expandedSections.context}>
              <Box mt={2}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <CodeIcon sx={{ fontSize: 16 }} />
                  <Typography variant="body2" fontWeight="500">
                    {currentContext.selectedFile}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Lines: {currentContext.selectedLines}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Language: {currentContext.language}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Modified: {currentContext.lastModified}
                </Typography>
              </Box>
            </Collapse>
          </CardContent>
        </Card>

        {/* Recent AI Interactions */}
        <Card variant="outlined" sx={{ m: 2, mb: 1 }}>
          <CardContent sx={{ p: 2, pb: '16px !important' }}>
            <Box 
              display="flex" 
              justifyContent="space-between" 
              alignItems="center"
              onClick={() => toggleSection('session')}
              sx={{ cursor: 'pointer' }}
            >
              <Typography variant="subtitle1" fontWeight="600">
                Recent Interactions
              </Typography>
              {expandedSections.session ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>
            
            <Collapse in={expandedSections.session}>
              <List dense sx={{ mt: 1 }}>
                {recentInteractions.map((interaction) => (
                  <ListItem key={interaction.id} sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {getStatusIcon(interaction.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip 
                            label={interaction.type} 
                            size="small" 
                            color={getTypeColor(interaction.type)}
                            sx={{ fontSize: '0.6rem', height: 18 }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" display="block">
                            {interaction.query}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {interaction.timestamp}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </CardContent>
        </Card>

        {/* Network Status */}
        <Card variant="outlined" sx={{ m: 2, mb: 1 }}>
          <CardContent sx={{ p: 2, pb: '16px !important' }}>
            <Box 
              display="flex" 
              justifyContent="space-between" 
              alignItems="center"
              onClick={() => toggleSection('network')}
              sx={{ cursor: 'pointer' }}
            >
              <Typography variant="subtitle1" fontWeight="600">
                Network Status
              </Typography>
              {expandedSections.network ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>
            
            <Collapse in={expandedSections.network}>
              <Box mt={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2">API Status</Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getStatusIcon(networkStatus.api)}
                    <Typography variant="caption" color="success.main">
                      Connected
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                  Provider: {networkStatus.provider}
                </Typography>
                
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                  Last sync: {networkStatus.lastSync}
                </Typography>
                
                <Box mt={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="caption">Token Usage</Typography>
                    <Typography variant="caption">
                      {networkStatus.tokensUsed}/{networkStatus.tokensLimit}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(networkStatus.tokensUsed / networkStatus.tokensLimit) * 100} 
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      </Box>

      {/* Actions */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box display="flex" gap={1}>
          <Tooltip title="Share Session">
            <IconButton size="small">
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export Context">
            <IconButton size="small">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="View History">
            <IconButton size="small">
              <HistoryIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Button 
          fullWidth 
          variant="outlined" 
          size="small" 
          sx={{ mt: 1 }}
          startIcon={<ChatIcon />}
        >
          New AI Session
        </Button>
      </Box>
    </Box>
  );
};

export default ContextSummaryPanel;