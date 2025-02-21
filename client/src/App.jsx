import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/routing/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProjectCreate from './pages/ProjectCreate';
import ProjectDetails from './pages/ProjectDetails';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

// Context
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

const App = () => {
  return (
    <PayPalScriptProvider options={{ 
      "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID 
    }}>
      <AuthProvider>
        <AlertProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
              <div className="App">
                <Navbar />
                <main style={{ minHeight: 'calc(100vh - 128px)', padding: '20px' }}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/projects/:id" element={<ProjectDetails />} />
                    <Route
                      path="/create-project"
                      element={
                        <PrivateRoute>
                          <ProjectCreate />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <PrivateRoute>
                          <Dashboard />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <PrivateRoute>
                          <Profile />
                        </PrivateRoute>
                      }
                    />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </ThemeProvider>
        </AlertProvider>
      </AuthProvider>
    </PayPalScriptProvider>
  );
};

export default App;
