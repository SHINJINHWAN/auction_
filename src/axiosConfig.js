import axios from 'axios';

// axios 기본 설정
axios.defaults.baseURL = "";

// 요청 인터셉터 - 토큰 자동 추가
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios; 