import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";
import "../style/Login.css";

const Login = () => {
  const [form, setForm] = useState({ 
    usernameOrEmail: "", 
    password: "" 
  });
  const [userType, setUserType] = useState("user");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(""); // 입력 시 에러 메시지 제거
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      // 실제 API 호출 대신 모의 로그인 처리
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 테스트 계정 검증
      if (userType === "admin") {
        if (form.usernameOrEmail === "admin" && form.password === "1234") {
          const mockUser = {
            id: 1,
            username: "admin",
            email: "admin@auction.com",
            nickname: "관리자",
            role: "ADMIN"
          };
          localStorage.setItem("jwt", "mock-admin-token");
          setUser(mockUser);
          navigate("/notice/admin");
        } else {
          throw new Error("관리자 계정 정보가 올바르지 않습니다.");
        }
      } else {
        if (form.usernameOrEmail === "testuser" && form.password === "1234") {
          const mockUser = {
            id: 2,
            username: "testuser",
            email: "test@auction.com",
            nickname: "테스트유저",
            role: "USER"
          };
          localStorage.setItem("jwt", "mock-user-token");
          setUser(mockUser);
          navigate("/");
        } else {
          throw new Error("로그인 정보가 올바르지 않습니다.");
        }
      }
    } catch (err) {
      setError(err.message || "로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocial = (provider) => {
    if (userType === "admin") {
      setError("관리자는 소셜 로그인을 사용할 수 없습니다.");
      return;
    }
    // 소셜 로그인 처리
    setError(`${provider} 로그인은 준비 중입니다.`);
  };

  const handleQuickLogin = (type, credentials) => {
    setUserType(type);
    setForm({
      usernameOrEmail: credentials.username,
      password: credentials.password
    });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* 왼쪽 배경 */}
        <div className="login-background">
          <div className="background-content">
            <h1>경매 플랫폼에 오신 것을 환영합니다</h1>
            <p>안전하고 투명한 경매 서비스로 특별한 물품을 만나보세요</p>
            <div className="background-features">
              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <span>안전한 거래</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span>실시간 입찰</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💰</span>
                <span>합리적인 가격</span>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 로그인 폼 */}
        <div className="login-form-container" style={{ width: '100%', maxWidth: 400, margin: '0 auto', padding: 32, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <div className="login-header">
            <h2>로그인</h2>
            <p>아이디와 비밀번호를 입력해 주세요.</p>
          </div>
          {/* 사용자 타입 선택 */}
          <div className="user-type-selector" style={{ marginBottom: 16 }}>
            <button
              className={`type-btn ${userType === "user" ? "active" : ""}`}
              onClick={() => setUserType("user")}
              type="button"
            >
              👤 일반 사용자
            </button>
            <button
              className={`type-btn ${userType === "admin" ? "active" : ""}`}
              onClick={() => setUserType("admin")}
              type="button"
            >
              🔧 관리자
            </button>
          </div>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="usernameOrEmail">
                {userType === "admin" ? "관리자 아이디" : "아이디 또는 이메일"}
              </label>
              <input
                id="usernameOrEmail"
                name="usernameOrEmail"
                type="text"
                value={form.usernameOrEmail}
                onChange={handleChange}
                placeholder={userType === "admin" ? "관리자 아이디를 입력하세요" : "아이디 또는 이메일을 입력하세요"}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">비밀번호</label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <button
              type="submit"
              className={`login-btn ${userType === "admin" ? "admin" : ""} ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
              style={{ marginTop: 16 }}
            >
              {isLoading ? "로그인 중..." : userType === "admin" ? "관리자 로그인" : "로그인"}
            </button>
          </form>
          {error && (
            <div className="error-message" style={{ marginTop: 12 }}>
              ⚠️ {error}
            </div>
          )}
          <div className="auth-links" style={{ marginTop: 16 }}>
            <p>
              계정이 없으신가요?{' '}
              <Link to="/register" className="register-link">회원가입</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 