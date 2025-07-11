import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && keyword.trim()) {
      navigate(`/search?query=${encodeURIComponent(keyword)}`);
    }
  };

  return (
    <header className="main-header">
      <div className="header-center" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <input
          className="search-input"
          placeholder="상품, 브랜드, 경매 검색"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </header>
  );
};

export default Header; 