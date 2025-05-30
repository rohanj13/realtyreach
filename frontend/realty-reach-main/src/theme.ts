import { createTheme } from '@mui/material/styles';

// Create a theme instance with RealtyReach branding
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue
      light: '#63a4ff',
      dark: '#004ba0',
    },
    secondary: {
      main: '#00bcd4', // Teal
      light: '#62efff',
      dark: '#008ba3',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 500,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#0069c0',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
