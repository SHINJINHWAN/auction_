import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "./axiosConfig";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("jwt");
      if (token) {
        try {
          const response = await axios.get("/auth/me");
          setUser(response.data);
        } catch (error) {
          // 401 오류나 다른 인증 오류인 경우 토큰 제거
          if (error.response?.status === 401) {
            localStorage.removeItem("jwt");
          }
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// useUser 훅 추가
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 