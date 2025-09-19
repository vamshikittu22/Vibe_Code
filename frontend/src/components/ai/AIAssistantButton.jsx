import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip, Badge, Box, keyframes, styled } from '@mui/material';
import { SmartToy as AIIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// Pulsing animation for the AI Assistant button
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(25, 118, 210, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
  }
`;

// Styled AI Assistant button
const StyledAIAssistantButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})(({ theme, isactive }) => ({
  position: 'fixed',
  bottom: 24,
  right: 24,
  width: 56,
  height: 56,
  backgroundColor: isactive ? theme.palette.secondary.main : theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  zIndex: theme.zIndex.speedDial,
  boxShadow: theme.shadows[8],
  animation: isactive ? 'none' : `${pulse} 2s infinite`,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: isactive ? theme.palette.secondary.dark : theme.palette.primary.dark,
    transform: 'scale(1.1)',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
  '& .ai-icon': {
    transition: 'transform 0.3s ease',
    transform: isactive ? 'rotate(15deg)' : 'rotate(0)',
  },
  '&:hover .ai-icon': {
    transform: isactive ? 'rotate(0)' : 'rotate(15deg)',
  },
}));

/**
 * AI Assistant Floating Action Button
 * @param {Object} props - Component props
 * @param {boolean} props.isActive - Whether the AI assistant panel is active
 * @param {Function} props.onClick - Click handler for the button
 * @param {boolean} [props.showTooltip] - Whether to show the tooltip
 * @param {string} [props.tooltipTitle] - Tooltip title
 * @param {string} [props.position] - Position of the button ('bottom-right' | 'inline')
 * @param {boolean} [props.showBadge] - Whether to show the notification badge
 * @param {number} [props.unreadCount] - Number of unread messages
 * @param {boolean} [props.isProcessing] - Whether the AI is processing a request
 */
const AIAssistantButton = ({
  isActive = false,
  onClick,
  showTooltip = true,
  tooltipTitle = 'AI Assistant',
  position = 'bottom-right',
  showBadge = false,
  unreadCount = 0,
  isProcessing = false,
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [showPulse, setShowPulse] = useState(true);

  useEffect(() => {
    // Only show pulse animation when not active and not processing
    setShowPulse(!isActive && !isProcessing);
  }, [isActive, isProcessing]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Badge content - show loading indicator or unread count
  const badgeContent = isProcessing ? (
    <Box
      sx={{
        width: 12,
        height: 12,
        borderRadius: '50%',
        border: `2px solid ${theme.palette.background.paper}`,
        borderTopColor: 'transparent',
        animation: 'spin 1s linear infinite',
        '@keyframes spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      }}
    />
  ) : unreadCount > 0 ? (
    unreadCount
  ) : null;

  const button = (
    <Badge
      badgeContent={showBadge ? badgeContent : null}
      color="error"
      overlap="circular"
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{
        '& .MuiBadge-badge': {
          boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        },
      }}
    >
      <StyledAIAssistantButton
        isactive={isActive.toString()}
        onClick={onClick}
        aria-label="AI Assistant"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={position === 'inline' ? { 
          position: 'relative', 
          bottom: 'auto', 
          right: 'auto',
          margin: 1,
        } : {}}
      >
        <AIIcon className="ai-icon" />
      </StyledAIAssistantButton>
    </Badge>
  );

  const tooltipTitleWithCount = unreadCount > 0 
    ? `${tooltipTitle} (${unreadCount} unread)` 
    : tooltipTitle;

  return showTooltip ? (
    <Tooltip 
      title={tooltipTitleWithCount} 
      placement={position === 'inline' ? 'right' : 'left'}
      arrow
    >
      {button}
    </Tooltip>
  ) : button;
};

export default AIAssistantButton;
