import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Divider,
  Tooltip,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  alpha,
} from '@mui/material';
import {
  Code as CodeIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  InsertDriveFileOutlined as FileIcon,
  Add as AddIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIconSmall,
  Search as SearchIcon,
} from '@mui/icons-material';

const drawerWidth = 280;

// Styled components
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Sidebar = ({ isOpen, isMobile, mobileOpen, onClose, drawerWidth }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState({});
  
  // Sample project structure - in a real app, this would come from an API
  const projectStructure = useMemo(() => ({
    name: 'My Project',
    type: 'folder',
    children: [
      {
        name: 'src',
        type: 'folder',
        children: [
          { name: 'index.js', type: 'file' },
          { name: 'App.js', type: 'file' },
          {
            name: 'components',
            type: 'folder',
            children: [
              { name: 'Button.js', type: 'file' },
              { name: 'Card.js', type: 'file' },
            ],
          },
        ],
      },
      { name: 'package.json', type: 'file' },
      { name: 'README.md', type: 'file' },
    ],
  }), []);

  const toggleFolder = (folderPath) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderPath]: !prev[folderPath],
    }));
  };

  const renderTree = (node, path = '') => {
    const nodePath = path ? `${path}.${node.name}` : node.name;
    const isFolder = node.type === 'folder';
    const isExpanded = expandedFolders[nodePath];
    
    // Filter nodes based on search query
    if (searchQuery && !node.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      if (!isFolder || !node.children?.some(child => 
        child.name.toLowerCase().includes(searchQuery.toLowerCase())
      )) {
        return null;
      }
    }

    return (
      <div key={nodePath}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              if (isFolder) {
                toggleFolder(nodePath);
              } else {
                // Handle file selection
                console.log('Selected file:', nodePath);
              }
            }}
            sx={{
              pl: path.split('.').length * 2,
              minHeight: 36,
              '&.Mui-selected': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.15),
                },
              },
            }}
            selected={location.pathname.includes(node.name.toLowerCase())}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              {isFolder ? (
                isExpanded ? <FolderOpenIcon fontSize="small" /> : <FolderIcon fontSize="small" />
              ) : (
                <FileIcon fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  variant="body2"
                  noWrap
                  sx={{
                    fontWeight: isFolder ? 600 : 400,
                    color: isFolder ? 'text.primary' : 'text.secondary',
                  }}
                >
                  {node.name}
                </Typography>
              }
            />
            {isFolder && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolder(nodePath);
                }}
                sx={{
                  p: 0.5,
                  transform: isExpanded ? 'rotate(90deg)' : 'none',
                  transition: theme.transitions.create('transform', {
                    duration: theme.transitions.duration.shorter,
                  }),
                }}
              >
                <ChevronRightIconSmall fontSize="small" />
              </IconButton>
            )}
          </ListItemButton>
        </ListItem>
        
        {isFolder && node.children && (
          <Collapse in={isExpanded || !!searchQuery} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {node.children.map((child) => renderTree(child, nodePath))}
            </List>
          </Collapse>
        )}
      </div>
    );
  };

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: 'background.paper',
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          Explorer
        </Typography>
        <Box>
          <Tooltip title="New File">
            <IconButton size="small" sx={{ mr: 0.5 }}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Collapse">
            <IconButton size="small" onClick={onClose}>
              {theme.direction === 'ltr' ? (
                <ChevronLeftIcon fontSize="small" />
              ) : (
                <ChevronRightIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {/* Search */}
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      {/* Project structure */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
        <List dense>
          {renderTree(projectStructure)}
        </List>
      </Box>
      
      {/* Footer */}
      <Box
        sx={{
          p: 1.5,
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: alpha(theme.palette.primary.main, 0.03),
        }}
      >
        <Button
          fullWidth
          variant="outlined"
          size="small"
          startIcon={<CodeIcon />}
          onClick={() => console.log('Open terminal')}
        >
          Open Terminal
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: isOpen ? drawerWidth : 0 }, flexShrink: { sm: 0 } }}
      aria-label="project files"
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: isOpen ? drawerWidth : 0,
            borderRight: 'none',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            ...(!isOpen && {
              overflowX: 'hidden',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              width: 0,
            }),
          },
        }}
        open={isOpen}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
