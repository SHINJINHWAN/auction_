import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../style/Header.css';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 임시 로그인 상태

  const handleSearch = (e) => {
    e.preventDefault();
    // 검색 로직 구현 예정
    console.log('검색:', searchQuery);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* 로고 영역 */}
        <div className="header-logo">
          <Link to="/" className="logo-link">
            {/* h1.logo 부분 전체 삭제 */}
          </Link>
        </div>

        {/* 검색 영역 */}
        <div className="header-search">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="찾고 싶은 경매 물품을 검색하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </form>
        </div>

        {/* 우측 메뉴 영역 */}
        <div className="header-menu">
          {isLoggedIn ? (
            <>
              <Link to="/mypage" className="menu-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                마이페이지
              </Link>
              <Link to="/auction/new" className="menu-item highlight">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                물품등록
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="menu-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10,17 15,12 10,7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                로그인
              </Link>
              <Link to="/register" className="menu-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="m22 21-2-2"></path>
                  <path d="m16 16 2 2"></path>
                </svg>
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 