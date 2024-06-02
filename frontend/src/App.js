import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home.js";
import Display from "./components/update/Display.jsx";
import Login from "./pages/auth_pages/login.js";
import { AuthProvider } from "./components/auth/AuthContext.js";
import PrivateRoute from "./components/auth/PrivateRoute.js";
import Register from "./pages/auth_pages/register.js";
import VeiwSuggestionsCard from "./components/view/ViewSuggestionsCard.js";
import Addproduct from "./pages/Addproduct/Addproduct.jsx";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/veiw"
            element={
              <PrivateRoute>
                <VeiwSuggestionsCard />
              </PrivateRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <PrivateRoute>
                <Display />
              </PrivateRoute>
            }
          />
          <Route
            path="/addproduct"
            element={
              <PrivateRoute>
                <Addproduct />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
