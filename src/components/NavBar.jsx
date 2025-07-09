import React from 'react';
import { Link } from 'react-router-dom';
import '../style/NavBar.css';

const NavBar = () => (
  <nav className="navbar">
    <Link to="/">홈</Link>
    <Link to="/auction/new">경매 등록</Link>
    <Link to="/cs">고객센터</Link>
    <Link to="/notice/admin">공지관리</Link>
    <Link to="/event/admin">이벤트관리</Link>
    <Link to="/inquiry/my">1:1문의</Link>
    <Link to="/inquiry/admin">1:1문의관리</Link>
  </nav>
);

export default NavBar; 