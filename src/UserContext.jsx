import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // JWT 토큰을 로컬 스토리지에서 가져오기
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // 토큰이 있으면 사용자 정보 가져오기
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUser(response.data.user);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('인증 상태 확인 실패:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      console.log('회원가입 요청 데이터:', userData);

      const response = await axios.post('/api/auth/register', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('회원가입 성공:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('회원가입 오류:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      console.log('로그인 요청:', credentials);

      const response = await axios.post('/api/auth/login', credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        setUser(response.data.user);
        console.log('로그인 성공:', response.data);
        return { success: true, data: response.data };
      } else {
        throw new Error('토큰이 응답에 없습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || '로그인 중 오류가 발생했습니다.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('/api/auth/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('로그아웃 오류:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setError(null);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('리프레시 토큰이 없습니다.');
      }

      const response = await axios.post('/api/auth/refresh', {
        refreshToken: refreshToken
      });

      if (response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        return { success: true, token: response.data.accessToken };
      }
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      logout();
      return { success: false };
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    refreshToken,
    updateUser,
    clearError,
    checkAuthStatus
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 