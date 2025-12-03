/**
 * Theme Provider Component
 * 
 * Wraps the entire application with Material-UI theme provider.
 * This ensures all components have consistent styling globally.
 */

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { realtyreachTheme } from './theme';

interface RealtyReachThemeProviderProps {
  children: React.ReactNode;
}

/**
 * RealtyReachThemeProvider
 * 
 * - Applies the unified theme to all MUI components
 * - CssBaseline normalizes browser defaults for consistent styling
 * 
 * Usage: Wrap your entire app with this component at the top level
 */
export const RealtyReachThemeProvider: React.FC<RealtyReachThemeProviderProps> = ({ children }) => (
  <ThemeProvider theme={realtyreachTheme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
);

export default RealtyReachThemeProvider;
