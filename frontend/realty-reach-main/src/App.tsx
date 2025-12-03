import React from 'react';
import './App.css';
import RoutesConfig from './RoutesConfig';
import RealtyReachThemeProvider from './theme/ThemeProvider';

function App() {
  return (
    <RealtyReachThemeProvider>
      <div className="App">
        <RoutesConfig />
      </div>
    </RealtyReachThemeProvider>
  );
}

export default App;