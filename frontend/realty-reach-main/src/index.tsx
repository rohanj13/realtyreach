import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// Import the simple test app first to isolate issues
//import TestApp from './TestApp';
// Keep these imports commented out until we confirm basic rendering works
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './Context/userContext';

// Add debug logs
console.log("React version:", React.version);
console.log("ReactDOM:", ReactDOM);
//console.log("TestApp:", TestApp);

try {
  const rootElement = document.getElementById('root');
  console.log("Root element found:", rootElement);
  
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    console.log("Root created successfully");
    
    // Try to render the simple test app first
    root.render(
    <React.StrictMode>
      <BrowserRouter>
        <UserProvider>
          <App />
        </UserProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
    console.log("Render called");
  } else {
    console.error("Could not find root element!");
  }
} catch (error) {
  console.error("Error during rendering:", error);
}

// We'll add these back once basic rendering is confirmed
reportWebVitals();
