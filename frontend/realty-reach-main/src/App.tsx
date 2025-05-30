import React from 'react';
import './App.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';
import RoutesConfig from './RoutesConfig';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <RoutesConfig />
      </div>
    </ThemeProvider>
  );
}

export default App;
