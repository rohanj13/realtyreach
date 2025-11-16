/**
 * Reusable UI Components
 * 
 * Common components used across the application, styled with the unified theme.
 */

import React from 'react';
import {
  Container,
  ContainerProps,
  Box,
  Typography,
  Stack,
  StackProps,
  CircularProgress,
  Alert,
  AlertTitle,
  AlertProps,
  Button,
  ButtonProps,
} from '@mui/material';

// ============================================================================
// PAGE CONTAINER
// ============================================================================

interface PageContainerProps extends ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * PageContainer
 * 
 * Wrapper for page content with consistent padding and max-width
 */
export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  maxWidth = 'lg',
  sx = {},
  ...props
}) => (
  <Container
    maxWidth={maxWidth}
    sx={{
      py: 4,
      px: { xs: 2, sm: 3 },
      ...sx,
    }}
    {...props}
  >
    {children}
  </Container>
);

// ============================================================================
// PAGE HEADER
// ============================================================================

interface PageHeaderProps extends StackProps {
  title: string;
  subtitle?: string;
  description?: string;
  actions?: React.ReactNode;
}

/**
 * PageHeader
 * 
 * Consistent header for pages with title, subtitle, and actions
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  description,
  actions,
  sx = {},
  ...props
}) => (
  <Stack
    direction={{ xs: 'column', sm: 'row' }}
    justifyContent="space-between"
    alignItems={{ xs: 'flex-start', sm: 'center' }}
    spacing={2}
    sx={{
      mb: 4,
      pb: 3,
      borderBottom: '1px solid',
      borderColor: 'divider',
      ...sx,
    }}
    {...props}
  >
    <Box>
      <Typography variant="h2" component="h1" gutterBottom sx={{ mb: 1 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 0.5 }}>
          {subtitle}
        </Typography>
      )}
      {description && (
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      )}
    </Box>
    {actions && <Box sx={{ flexShrink: 0 }}>{actions}</Box>}
  </Stack>
);

// ============================================================================
// LOADING SPINNER
// ============================================================================

interface LoadingSpinnerProps {
  message?: string;
  fullHeight?: boolean;
  size?: number;
}

/**
 * LoadingSpinner
 * 
 * Consistent loading indicator used throughout the app
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  fullHeight = false,
  size = 48,
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: fullHeight ? '100vh' : '400px',
      gap: 2,
    }}
  >
    <CircularProgress size={size} />
    <Typography variant="body1" color="textSecondary">
      {message}
    </Typography>
  </Box>
);

// ============================================================================
// ERROR ALERT
// ============================================================================

interface ErrorAlertProps extends AlertProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onClose?: () => void;
}

/**
 * ErrorAlert
 * 
 * Consistent error message display with optional retry action
 */
export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title = 'Error',
  message,
  onRetry,
  onClose,
  ...props
}) => (
  <Alert
    severity="error"
    onClose={onClose}
    sx={{
      mb: 2,
      '& .MuiAlert-action': {
        flexDirection: 'row-reverse',
        ml: -1,
      },
    }}
    {...props}
  >
    {title && <AlertTitle>{title}</AlertTitle>}
    <Box sx={{ mb: onRetry ? 2 : 0 }}>
      {message}
    </Box>
    {onRetry && (
      <Button
        size="small"
        variant="text"
        color="inherit"
        onClick={onRetry}
        sx={{
          fontWeight: 600,
          textDecoration: 'underline',
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
      >
        Try Again
      </Button>
    )}
  </Alert>
);

// ============================================================================
// SUCCESS ALERT
// ============================================================================

interface SuccessAlertProps extends AlertProps {
  title?: string;
  message: string;
  onClose?: () => void;
}

/**
 * SuccessAlert
 * 
 * Consistent success message display
 */
export const SuccessAlert: React.FC<SuccessAlertProps> = ({
  title,
  message,
  onClose,
  ...props
}) => (
  <Alert
    severity="success"
    onClose={onClose}
    sx={{
      mb: 2,
    }}
    {...props}
  >
    {title && <AlertTitle>{title}</AlertTitle>}
    {message}
  </Alert>
);

// ============================================================================
// WARNING ALERT
// ============================================================================

interface WarningAlertProps extends AlertProps {
  title?: string;
  message: string;
  onClose?: () => void;
}

/**
 * WarningAlert
 * 
 * Consistent warning message display
 */
export const WarningAlert: React.FC<WarningAlertProps> = ({
  title,
  message,
  onClose,
  ...props
}) => (
  <Alert
    severity="warning"
    onClose={onClose}
    sx={{
      mb: 2,
    }}
    {...props}
  >
    {title && <AlertTitle>{title}</AlertTitle>}
    {message}
  </Alert>
);

// ============================================================================
// ACTION BUTTON
// ============================================================================

interface ActionButtonProps extends ButtonProps {
  label: string;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

/**
 * ActionButton
 * 
 * Primary action button with loading state
 */
export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  isLoading = false,
  icon,
  disabled,
  ...props
}) => (
  <Button
    variant="contained"
    color="primary"
    disabled={disabled || isLoading}
    startIcon={isLoading ? <CircularProgress size={20} /> : icon}
    {...props}
  >
    {isLoading ? 'Loading...' : label}
  </Button>
);

// ============================================================================
// SECONDARY ACTION BUTTON
// ============================================================================

interface SecondaryActionButtonProps extends ButtonProps {
  label: string;
  icon?: React.ReactNode;
}

/**
 * SecondaryActionButton
 * 
 * Secondary action button with outline style
 */
export const SecondaryActionButton: React.FC<SecondaryActionButtonProps> = ({
  label,
  icon,
  ...props
}) => (
  <Button
    variant="outlined"
    color="primary"
    startIcon={icon}
    {...props}
  >
    {label}
  </Button>
);

// ============================================================================
// EMPTY STATE
// ============================================================================

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

/**
 * EmptyState
 * 
 * Display when no content is available
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => (
  <Box
    sx={{
      p: 6,
      textAlign: 'center',
      bgcolor: 'background.paper',
      borderRadius: 3,
      border: '2px dashed',
      borderColor: 'divider',
    }}
  >
    {icon && (
      <Box sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }}>
        {icon}
      </Box>
    )}
    <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
      {title}
    </Typography>
    {description && (
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        {description}
      </Typography>
    )}
    {action && <Box>{action}</Box>}
  </Box>
);
