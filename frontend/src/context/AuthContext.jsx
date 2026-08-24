import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [member, setMember] = useState(() => {
    const savedMember = localStorage.getItem('fitzone_member');
    return savedMember ? JSON.parse(savedMember) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('fitzone_token') || null;
  });

  const role = member?.role || null;

  const login = (memberData, tokenData) => {
    setMember(memberData);
    setToken(tokenData);
    localStorage.setItem('fitzone_member', JSON.stringify(memberData));
    localStorage.setItem('fitzone_token', tokenData);
  };

  const logout = () => {
    setMember(null);
    setToken(null);
    localStorage.removeItem('fitzone_member');
    localStorage.removeItem('fitzone_token');
  };

  return (
    <AuthContext.Provider value={{ member, token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
