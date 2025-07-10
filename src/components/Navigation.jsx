import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '홈', icon: '🏠' },
    { path: '/auction', label: '경매', icon: '🔨' },
    { path: '/event', label: '이벤트', icon: '🎁' },
    { path: '/notice', label: '공지사항', icon: '📢' },
    { path: '/faq', label: 'FAQ', icon: '❓' },
    { path: '/inquiry', label: '1:1문의', icon: '💬' },
    { path: '/customer-service', label: '고객센터', icon: '📞' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation; 