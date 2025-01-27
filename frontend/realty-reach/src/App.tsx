import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { UserProvider } from "./Context/useAuth";
import RoutesConfig from "./RoutesConfig";

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <Router>
        <UserProvider>
          <RoutesConfig />
        </UserProvider>
      </Router>
    </ChakraProvider>
  );
};

export default App;
