import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import './Navigation.css';
import { FaTrophy } from 'react-icons/fa';
import NotificationBell from './NotificationBell';
import { FaEnvelope } from 'react-icons/fa';

const Navigation = () => {
  const location = useLocation();
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const isAdmin = user && user.role === 'ADMIN';

  const navItems = [
    { path: '/', label: '홈', icon: '🏠' },
    { path: '/auction', label: '경매', icon: '🔨' },
    { 
      path: isAdmin ? '/event/admin' : '/event', 
      label: '이벤트', 
      icon: '🎁' 
    },
    { 
      path: isAdmin ? '/notice/admin' : '/notice', 
      label: '공지사항', 
      icon: '📢' 
    },
    { 
      path: isAdmin ? '/faq/admin' : '/faq', 
      label: 'FAQ', 
      icon: '❓' 
    },
    { 
      path: isAdmin ? '/inquiry/admin' : (user ? '/inquiry/my' : '/inquiry'), 
      label: '1:1문의', 
      icon: '💬' 
    },
    { path: '/customer-service', label: '고객센터', icon: '📞' }
  ];

  // 로그인한 사용자만 좋아요 메뉴 표시 (임시로 항상 표시)
  const userNavItems = [
    { path: '/favorites', label: '찜한 경매', icon: '❤️' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        {/* 로고 */}
        <div className="nav-logo">
          <Link to="/" className="logo-link">
            <FaTrophy size={24} color="#FFD700" />
            <span className="logo-text">몬스터옥션</span>
          </Link>
        </div>

        {/* 메인 메뉴 */}
        <div className="nav-menu">
          <ul className="nav-list">
            {navItems.map((item) => {
              // 현재 경로가 해당 메뉴의 활성 상태인지 확인
              const isActive = (() => {
                if (item.path === '/') {
                  return location.pathname === '/';
                }
                if (item.path === '/auction') {
                  return location.pathname.startsWith('/auction');
                }
                if (item.path === '/customer-service') {
                  return location.pathname === '/customer-service';
                }
                // 관리자/사용자 페이지 구분
                if (isAdmin) {
                  // 관리자: admin 페이지가 활성화
                  return location.pathname.startsWith(item.path);
                } else {
                  // 사용자: 일반 페이지가 활성화
                  if (item.path === '/inquiry/my' || item.path === '/inquiry') {
                    return location.pathname.startsWith('/inquiry');
                  }
                  return location.pathname.startsWith(item.path);
                }
              })();

              return (
                <li key={item.path} className="nav-item">
                  <Link
                    to={item.path}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 사용자 메뉴 */}
        <div className="nav-user">
          {/* 사용자 전용 메뉴 */}
          {user && (
            <div className="user-nav-menu">
              <ul className="user-nav-list">
                {userNavItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.path} className="user-nav-item">
                      <Link
                        to={item.path}
                        className={`user-nav-link ${isActive ? 'active' : ''}`}
                      >
                        <span className="user-nav-icon">{item.icon}</span>
                        <span className="user-nav-label">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            {user && <NotificationBell />}
            {user && (
              <Link to="/messages" className="nav-link" title="쪽지함">
                <FaEnvelope size={20} style={{ verticalAlign: 'middle' }} />
              </Link>
            )}
          </div>
          <div className="auth-buttons">
            {/* 로그인/회원가입: 로그인 안 한 경우만 노출 */}
            {!user && (
              <>
                <button
                  className="auth-btn login-btn"
                  onClick={() => navigate('/login')}
                  style={{ marginRight: '8px' }}
                >
                  로그인하기
                </button>
                <Link to="/register" className="auth-btn register-btn">회원가입</Link>
              </>
            )}
            {/* 마이페이지/로그아웃: 로그인한 경우만 노출 */}
            {user && (
              <>
                <Link to="/mypage" className="auth-btn mypage-btn" style={{ marginRight: '8px' }}>
                  마이페이지 ({user.nickname || user.name}님)
                </Link>
                <button
                  className="user-btn logout-btn"
                  onClick={handleLogout}
                  style={{ marginRight: '8px' }}
                >
                  로그아웃하기
                </button>
              </>
            )}
          </div>
          {/* 권한 및 인사말: 로그인 시 평상문 안내 */}
          {user && (
            <div className="user-info" style={{ marginTop: '4px', fontSize: '0.95em' }}>
              {user.nickname || user.name}님, 반갑습니다.{' '}
              {user.role === 'ADMIN'
                ? '당신은 관리자 권한이 있습니다.'
                : '일반 회원으로 로그인 중입니다.'}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 