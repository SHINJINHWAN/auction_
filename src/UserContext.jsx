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
          // axios 대신 fetch를 사용하여 더 세밀한 제어
          const response = await fetch("/api/auth/me", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            credentials: "include"
          });

          // 응답 타입 확인
          const contentType = response.headers.get("content-type");
          
          if (!response.ok) {
            // 에러 응답 처리
            const errorText = await response.text();
            console.error(`HTTP ${response.status}: ${errorText}`);
            
            if (response.status === 401) {
              localStorage.removeItem("jwt");
              console.log("토큰이 만료되었거나 유효하지 않습니다.");
            }
            setUser(null);
            return;
          }

          // JSON 응답인지 확인
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            setUser(data);
          } else {
            // HTML 응답인 경우
            const text = await response.text();
            console.warn("서버에서 HTML 응답을 받았습니다:", text.substring(0, 200));
            localStorage.removeItem("jwt");
            setUser(null);
          }
        } catch (error) {
          console.error("인증 확인 실패:", error);
          
          // JSON 파싱 오류 처리
          if (error.message && error.message.includes("Unexpected token")) {
            console.log("JSON 파싱 오류: 서버에서 HTML 응답을 받았습니다.");
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