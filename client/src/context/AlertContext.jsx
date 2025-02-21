import React, { createContext, useContext, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

const AlertContext = createContext(null);

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'info', // 'error', 'warning', 'info', 'success'
  });

  const showAlert = (message, severity = 'info') => {
    setAlert({
      open: true,
      message,
      severity,
    });
  };

  const hideAlert = () => {
    setAlert((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={hideAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={hideAlert}
          severity={alert.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
};

export default AlertContext;
