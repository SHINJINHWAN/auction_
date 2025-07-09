import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import AuctionDetail from './pages/AuctionDetail';
import AuctionNew from './pages/AuctionNew';
import FAQList from './pages/FAQList';
import NoticeList from './pages/NoticeList';
import EventList from './pages/EventList';
import InquiryList from './pages/InquiryList';
import './App.css';

export default function App() {
  // 임시: 관리자 여부 하드코딩, 실제론 로그인/권한 연동 필요
  const isAdmin = true;
  const userId = 'user1';

  return (
    <Router>
      <nav className="main-nav" style={{ display: 'flex', alignItems: 'center', gap: '32px', padding: '16px 32px', background: '#fff', borderBottom: '1px solid #eee' }}>
        <Link to="/" className="main-logo" style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#fba800', textDecoration: 'none', marginRight: 32 }}>AUCTION</Link>
        <div style={{ display: 'flex', gap: '24px', flex: 1 }}>
          <Link to="/faq" className="main-nav-link">FAQ</Link>
          <Link to="/notice" className="main-nav-link">공지사항</Link>
          <Link to="/event" className="main-nav-link">이벤트</Link>
          <Link to="/inquiry" className="main-nav-link">1:1문의</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auction/:id" element={<AuctionDetail />} />
        <Route path="/auction/new" element={<AuctionNew />} />
        <Route path="/faq" element={<FAQList />} />
        <Route path="/notice" element={<NoticeList />} />
        <Route path="/event" element={<EventList />} />
        <Route path="/inquiry" element={<InquiryList userId={userId} isAdmin={isAdmin} />} />
      </Routes>
    </Router>
  );
}