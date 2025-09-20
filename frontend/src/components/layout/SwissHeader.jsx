import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  NotificationsNone as NotificationsIcon,
  AccountCircle as AccountIcon,
  Code as CodeIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import APIKeyManager from '../api/APIKeyManager';

const SwissHeader = ({ onToggleSidebar, sidebarOpen }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [apiManagerOpen, setApiManagerOpen] = useState(false);
  const [aiStatus, setAiStatus] = useState('disconnected'); // connected, disconnected, syncing

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleApiConfigSave = (config) => {
    console.log('API Configuration saved:', config);
    setAiStatus('connected');
    // Here you would typically save to context or backend
  };

  const getStatusColor = () => {
    switch (aiStatus) {
      case 'connected': return theme.palette.success.main;
      case 'syncing': return theme.palette.warning.main;
      default: return theme.palette.error.main;
    }
  };

  const getStatusText = () => {
    switch (aiStatus) {
      case 'connected': return 'AI Connected';
      case 'syncing': return 'Syncing...';
      default: return 'AI Disconnected';
    }
  };

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          bgcolor: 'background.paper',
          borderBottom: `1px solid ${theme.palette.divider}`,
          zIndex: theme.zIndex.drawer + 1,
          height: 64,
        }}
      >
        <Toolbar sx={{ minHeight: '64px !important', px: 3 }}>
          {/* Left Section */}
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton
              edge="start"
              onClick={onToggleSidebar}
              sx={{ color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
            
            <Box display="flex" alignItems="center" gap={1}>
              <CodeIcon sx={{ color: 'primary.main', fontSize: 28 }} />
              <Typography 
                variant="h6" 
                component="div" 
                fontWeight="bold"
                color="text.primary"
              >
                AI Coding Platform
              </Typography>
            </Box>
          </Box>

          {/* Center Section - Search */}
          <Box 
            flex={1} 
            display="flex" 
            justifyContent="center" 
            mx={4}
            maxWidth={500}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search files, functions, or ask AI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                sx: {
                  bgcolor: 'background.neutral',
                  borderRadius: 3,
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: `1px solid ${theme.palette.primary.main}`,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: `2px solid ${theme.palette.primary.main}`,
                  },
                },
              }}
            />
          </Box>

          {/* Right Section */}
          <Box display="flex" alignItems="center" gap={2}>
            {/* AI Status Indicator */}
            <Tooltip title={getStatusText()}>
              <Chip
                label="AI"
                size="small"
                sx={{
                  bgcolor: getStatusColor(),
                  color: 'white',
                  fontWeight: 'bold',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 8,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'white',
                    animation: aiStatus === 'syncing' ? 'pulse 1.5s infinite' : 'none',
                  },
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                    '100%': { opacity: 1 },
                  },
                }}
              />
            </Tooltip>

            {/* API Configuration Button */}
            <Tooltip title="Configure AI Providers">
              <Button
                variant="outlined"
                size="small"
                startIcon={<SettingsIcon />}
                onClick={() => setApiManagerOpen(true)}
                sx={{
                  borderColor: 'divider',
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                  },
                }}
              >
                API Keys
              </Button>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton sx={{ color: 'text.primary' }}>
                <NotificationsIcon />
              </IconButton>
            </Tooltip>

            {/* User Menu */}
            <Tooltip title="Account">
              <IconButton onClick={handleProfileClick} sx={{ color: 'text.primary' }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  <AccountIcon />
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                sx: { borderRadius: 2, minWidth: 200 }
              }}
            >
              <MenuItem onClick={handleMenuClose}>
                <PersonIcon sx={{ mr: 2 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={() => { handleMenuClose(); setApiManagerOpen(true); }}>
                <SettingsIcon sx={{ mr: 2 }} />
                Settings
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <LogoutIcon sx={{ mr: 2 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* API Key Manager Dialog */}
      <APIKeyManager
        open={apiManagerOpen}
        onClose={() => setApiManagerOpen(false)}
        onSave={handleApiConfigSave}
      />
    </>
  );
};

export default SwissHeader;