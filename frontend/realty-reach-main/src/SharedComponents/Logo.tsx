/**
 * RealtyReach Logo Component
 * 
 * Reusable logo/branding component for headers and landing pages
 */

import React from 'react';
import { Box, Typography, Stack, useTheme } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

interface LogoProps {
  variant?: 'compact' | 'full' | 'icon-only';
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  onClick?: () => void;
  color?: 'primary' | 'inherit' | 'white';
}

/**
 * Logo Component
 * 
 * Displays the RealtyReach branding in various formats
 * 
 * Variants:
 * - compact: Icon + text on one line (default, responsive)
 * - full: Full logo with tagline (for landing pages)
 * - icon-only: Just the icon (for mobile headers)
 * 
 * Sizes:
 * - small: 24px icon, 14px text
 * - medium: 32px icon, 18px text (default)
 * - large: 48px icon, 24px text
 * 
 * @example
 * // Header with compact logo
 * <Logo variant="compact" size="medium" />
 * 
 * // Landing page with full branding
 * <Logo variant="full" size="large" />
 * 
 * // Mobile header with icon only
 * <Logo variant="icon-only" size="small" />
 */
export const Logo: React.FC<LogoProps> = ({
  variant = 'compact',
  size = 'medium',
  showText = true,
  onClick,
  color = 'primary',
}) => {
  const theme = useTheme();

  // Size configurations
  const sizeConfig = {
    small: { icon: 24, text: 14, spacing: 0.5 },
    medium: { icon: 32, text: 18, spacing: 0.75 },
    large: { icon: 48, text: 24, spacing: 1 },
  };

  const config = sizeConfig[size];

  // Color configurations
  const colorConfig = {
    primary: { icon: theme.palette.primary.main, text: theme.palette.text.primary },
    inherit: { icon: 'currentColor', text: 'currentColor' },
    white: { icon: '#ffffff', text: '#ffffff' },
  };

  const colorScheme = colorConfig[color];

  // Compact variant - icon and text side by side
  if (variant === 'compact') {
    return (
      <Stack
        direction="row"
        alignItems="center"
        spacing={config.spacing}
        onClick={onClick}
        sx={{
          cursor: onClick ? 'pointer' : 'default',
          transition: 'opacity 0.2s',
          '&:hover': onClick ? { opacity: 0.8 } : {},
        }}
      >
        <HomeIcon
          sx={{
            fontSize: config.icon,
            color: colorScheme.icon,
          }}
        />
        {showText && (
          <Typography
            variant="h6"
            sx={{
              fontSize: config.text,
              fontWeight: 700,
              color: colorScheme.text,
              letterSpacing: '-0.5px',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            RealtyReach
          </Typography>
        )}
      </Stack>
    );
  }

  // Full variant - logo with tagline (landing pages)
  if (variant === 'full') {
    return (
      <Stack
        alignItems="center"
        spacing={1}
        onClick={onClick}
        sx={{
          cursor: onClick ? 'pointer' : 'default',
          transition: 'transform 0.2s',
          '&:hover': onClick ? { transform: 'scale(1.02)' } : {},
        }}
      >
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <HomeIcon
            sx={{
              fontSize: config.icon,
              color: '#ffffff',
            }}
          />
        </Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: colorScheme.text,
            letterSpacing: '-1px',
          }}
        >
          RealtyReach
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            color: colorScheme.text,
            opacity: 0.7,
            fontStyle: 'italic',
          }}
        >
          Connect with Real Estate Professionals
        </Typography>
      </Stack>
    );
  }

  // Icon-only variant - just the icon (mobile headers)
  if (variant === 'icon-only') {
    return (
      <Box
        onClick={onClick}
        sx={{
          cursor: onClick ? 'pointer' : 'default',
          transition: 'transform 0.2s',
          '&:hover': onClick ? { transform: 'scale(1.1)' } : {},
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <HomeIcon
          sx={{
            fontSize: config.icon,
            color: colorScheme.icon,
          }}
        />
      </Box>
    );
  }

  // Default fallback to compact
  return (
    <Stack direction="row" alignItems="center" spacing={config.spacing}>
      <HomeIcon
        sx={{
          fontSize: config.icon,
          color: colorScheme.icon,
        }}
      />
      {showText && (
        <Typography
          variant="h6"
          sx={{
            fontSize: config.text,
            fontWeight: 700,
            color: colorScheme.text,
          }}
        >
          RealtyReach
        </Typography>
      )}
    </Stack>
  );
};

export default Logo;
