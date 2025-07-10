import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../style/NavBar.css';
import PrivateMessage from './PrivateMessage';
import ChatRoom from './ChatRoom';

const NavBar = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [showChat, setShowChat] = useState(false);
  // 임시 user 정보
  const userId = 'guest';
  const userName = '게스트';

  const handleShowMessage = () => {
    setShowMessage(v => !v);
    if (!showMessage) setShowChat(false);
  };
  const handleShowChat = () => {
    setShowChat(v => !v);
    if (!showChat) setShowMessage(false);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <span className="logo-icon">🏆</span>
        <span className="logo-text">몬스터옥션</span>
      </Link>
      <div className="nav-links">
        <Link to="/">홈</Link>
        <Link to="/auction/new">경매 등록</Link>
        <Link to="/cs">고객센터</Link>
        <Link to="/notice/admin">공지관리</Link>
        <Link to="/event/admin">이벤트관리</Link>
        <Link to="/inquiry/new">1:1문의</Link>
        <Link to="/inquiry/admin">1:1문의관리</Link>
      </div>
      <div className="nav-actions">
        <button className="nav-icon-btn" title="쪽지함" onClick={handleShowMessage}>✉️</button>
        <button className="nav-icon-btn" title="채팅" onClick={handleShowChat}>💬</button>
      </div>
      {showMessage && (
        <div className="nav-popup"><PrivateMessage userId={userId} userName={userName} onClose={() => setShowMessage(false)} /></div>
      )}
      {showChat && (
        <div className="nav-popup"><ChatRoom auctionId={null} roomName="전체 채팅" userId={userId} userName={userName} onClose={() => setShowChat(false)} /></div>
      )}
    </nav>
  );
};

export default NavBar; 