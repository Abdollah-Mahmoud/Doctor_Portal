import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists on mount
    const storedDoctor = authService.getCurrentDoctor();
    if (storedDoctor && authService.isAuthenticated()) {
      setDoctor(storedDoctor);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    setDoctor(data.doctor);
    return data;
  };

  const register = async (doctorData) => {
    const data = await authService.register(doctorData);
    setDoctor(data.doctor);
    return data;
  };

  const logout = () => {
    authService.logout();
    setDoctor(null);
  };

  const updateDoctorState = (updatedDoctor) => {
    setDoctor(updatedDoctor);
  };

  return (
    <AuthContext.Provider
      value={{
        doctor,
        isAuthenticated: !!doctor,
        loading,
        login,
        register,
        logout,
        updateDoctorState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
