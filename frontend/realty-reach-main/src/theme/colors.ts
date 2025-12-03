/**
 * RealtyReach Color Palette
 * 
 * This file defines all colors used in the application.
 * Update these values to change the color scheme globally.
 */

export const colors = {
  // Primary Colors - Professional Blue
  primary: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#1976d2', // Main primary
    600: '#1565c0',
    700: '#0d47a1',
    800: '#0a3d91',
    900: '#051c66',
  },

  // Secondary Colors - Vibrant Accent (for CTAs and highlights)
  secondary: {
    50: '#fce4ec',
    100: '#f8bbd0',
    200: '#f48fb1',
    300: '#f06292',
    400: '#ec407a',
    500: '#dc004e', // Main secondary
    600: '#d81b60',
    700: '#c2185b',
    800: '#ad1457',
    900: '#880e4f',
  },

  // Semantic Colors
  success: {
    50: '#e8f5e9',
    100: '#c8e6c9',
    200: '#a5d6a7',
    300: '#81c784',
    400: '#66bb6a',
    500: '#4caf50', // Main success - for finalised, completed
    600: '#43a047',
    700: '#388e3c',
    800: '#2e7d32',
    900: '#1b5e20',
  },

  // Warning Colors - for pending actions
  warning: {
    50: '#fff3e0',
    100: '#ffe0b2',
    200: '#ffcc80',
    300: '#ffb74d',
    400: '#ffa726',
    500: '#ff9800', // Main warning - for pending
    600: '#fb8c00',
    700: '#f57c00',
    800: '#e65100',
    900: '#bf360c',
  },

  // Error Colors - for errors and destructive actions
  error: {
    50: '#ffebee',
    100: '#ffcdd2',
    200: '#ef9a9a',
    300: '#e57373',
    400: '#ef5350',
    500: '#f44336', // Main error
    600: '#e53935',
    700: '#d32f2f',
    800: '#c62828',
    900: '#b71c1c',
  },

  // Info Colors - for informational messages
  info: {
    50: '#e1f5fe',
    100: '#b3e5fc',
    200: '#81d4fa',
    300: '#4fc3f7',
    400: '#29b6f6',
    500: '#03a9f4', // Main info
    600: '#039be5',
    700: '#0288d1',
    800: '#0277bd',
    900: '#01579b',
  },

  // Neutral Colors - for backgrounds and borders
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Text Colors
  text: {
    primary: 'rgba(0, 0, 0, 0.87)', // 87% opacity for primary text
    secondary: 'rgba(0, 0, 0, 0.60)', // 60% opacity for secondary text
    disabled: 'rgba(0, 0, 0, 0.38)', // 38% opacity for disabled text
    hint: 'rgba(0, 0, 0, 0.38)', // Same as disabled
  },

  // Background Colors
  background: {
    default: '#f5f5f5', // Light grey for page backgrounds
    paper: '#ffffff', // White for cards and components
    overlay: 'rgba(0, 0, 0, 0.5)', // For modal overlays
  },

  // Divider Color
  divider: 'rgba(0, 0, 0, 0.12)',

  // Real Estate Specific Colors (optional, for future use)
  realEstate: {
    buy: '#4caf50', // Green for buying
    sell: '#ff9800', // Orange for selling
    rent: '#03a9f4', // Blue for renting
    invest: '#9c27b0', // Purple for investing
  },
};

/**
 * Palette Configuration for Material-UI
 * Use this when creating the MUI theme
 */
export const palettConfig = {
  primary: {
    main: colors.primary[500],
    light: colors.primary[300],
    dark: colors.primary[700],
    contrastText: '#ffffff',
  },
  secondary: {
    main: colors.secondary[500],
    light: colors.secondary[300],
    dark: colors.secondary[700],
    contrastText: '#ffffff',
  },
  success: {
    main: colors.success[500],
    light: colors.success[300],
    dark: colors.success[700],
    contrastText: '#ffffff',
  },
  warning: {
    main: colors.warning[500],
    light: colors.warning[300],
    dark: colors.warning[700],
    contrastText: '#ffffff',
  },
  error: {
    main: colors.error[500],
    light: colors.error[300],
    dark: colors.error[700],
    contrastText: '#ffffff',
  },
  info: {
    main: colors.info[500],
    light: colors.info[300],
    dark: colors.info[700],
    contrastText: '#ffffff',
  },
  background: {
    default: colors.background.default,
    paper: colors.background.paper,
  },
  text: {
    primary: colors.text.primary,
    secondary: colors.text.secondary,
    disabled: colors.text.disabled,
  },
  divider: colors.divider,
};
