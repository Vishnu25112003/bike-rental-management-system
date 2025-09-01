import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import VendorRoutes from './Components/Routes';
import Login from "./Components/Login"

const App = () => {
  return (
    <BrowserRouter>
      <VendorRoutes />
    </BrowserRouter>
  );
};

export default App;
