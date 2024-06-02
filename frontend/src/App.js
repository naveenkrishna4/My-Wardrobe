import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/home';
import Display from './components/update/Display';
import Login from './pages/auth_pages/login';
import { AuthProvider } from './components/auth/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Register from './pages/auth_pages/register';
import VeiwSuggestionsCard from './components/view/ViewSuggestionsCard';
import Addproduct from './pages/Addproduct/Addproduct';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
          <Route path="/veiw" element={
            <PrivateRoute>
              <VeiwSuggestionsCard />
            </PrivateRoute>
          } />
          <Route path="/upload" element={
            <PrivateRoute>
              <Display />
            </PrivateRoute>
          } />
          <Route path="/addproduct" element={
            <PrivateRoute>
              <Addproduct />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
