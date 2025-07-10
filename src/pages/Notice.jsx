import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style/Notice.css';

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadNotices();
  }, [currentPage, filterType]);

  const loadNotices = () => {
    // 임시 공지사항 데이터
    const mockNotices = [
      {
        id: 1,
        title: "2024년 몬스터옥션 이용약관 개정 안내",
        content: "안녕하세요, 몬스터옥션을 이용해 주시는 고객님들께 안내드립니다. 2024년 1월 1일부터 이용약관이 개정되어 적용됩니다. 주요 변경사항은 다음과 같습니다...",
        category: "important",
        date: "2024-01-10",
        views: 1250,
        isImportant: true
      },
      {
        id: 2,
        title: "신년 맞이 특별 이벤트 안내",
        content: "2024년 신년을 맞이하여 특별한 이벤트를 준비했습니다. 1월 한 달간 경매 수수료 50% 할인 혜택을 드립니다...",
        category: "event",
        date: "2024-01-08",
        views: 890,
        isImportant: false
      },
      {
        id: 3,
        title: "시스템 점검 안내 (1월 15일)",
        content: "더 나은 서비스를 위해 시스템 점검을 실시합니다. 점검 시간: 2024년 1월 15일 오전 2시 ~ 6시 (4시간)...",
        category: "maintenance",
        date: "2024-01-05",
        views: 567,
        isImportant: true
      },
      {
        id: 4,
        title: "안전거래 가이드 업데이트",
        content: "안전한 거래를 위한 가이드라인이 업데이트되었습니다. 사기 방지 방법과 안전한 입찰 방법을 확인해보세요...",
        category: "guide",
        date: "2024-01-03",
        views: 432,
        isImportant: false
      },
      {
        id: 5,
        title: "신규 회원 혜택 안내",
        content: "몬스터옥션에 새로 가입하신 회원님들을 위한 특별 혜택을 준비했습니다. 첫 경매 참여 시 수수료 면제...",
        category: "event",
        date: "2023-12-28",
        views: 345,
        isImportant: false
      },
      {
        id: 6,
        title: "개인정보처리방침 개정 안내",
        content: "개인정보 보호를 위한 개인정보처리방침이 개정되었습니다. 주요 변경사항을 확인하시고 동의해주세요...",
        category: "important",
        date: "2023-12-25",
        views: 678,
        isImportant: true
      },
      {
        id: 7,
        title: "모바일 앱 업데이트 안내",
        content: "몬스터옥션 모바일 앱이 업데이트되었습니다. 더 빠르고 편리한 경매 경험을 제공합니다...",
        category: "update",
        date: "2023-12-20",
        views: 234,
        isImportant: false
      },
      {
        id: 8,
        title: "연말연시 배송 안내",
        content: "연말연시 배송 일정 안내드립니다. 12월 25일 ~ 1월 2일까지 배송이 지연될 수 있습니다...",
        category: "guide",
        date: "2023-12-18",
        views: 456,
        isImportant: false
      }
    ];

    // 필터링 적용
    let filteredNotices = mockNotices;
    
    if (filterType === 'important') {
      filteredNotices = mockNotices.filter(notice => notice.isImportant);
    } else if (filterType === 'event') {
      filteredNotices = mockNotices.filter(notice => notice.category === 'event');
    } else if (filterType === 'maintenance') {
      filteredNotices = mockNotices.filter(notice => notice.category === 'maintenance');
    }

    // 검색어 적용
    if (searchTerm) {
      filteredNotices = filteredNotices.filter(notice =>
        notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 최신순 정렬
    filteredNotices.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 페이징 적용
    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pagedNotices = filteredNotices.slice(startIndex, endIndex);

    setNotices(pagedNotices);
    setTotalPages(Math.ceil(filteredNotices.length / itemsPerPage));
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadNotices();
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    setCurrentPage(1);
  };

  const getCategoryLabel = (category) => {
    const labels = {
      important: '중요',
      event: '이벤트',
      maintenance: '점검',
      guide: '가이드',
      update: '업데이트'
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category) => {
    const colors = {
      important: '#e74c3c',
      event: '#f39c12',
      maintenance: '#3498db',
      guide: '#27ae60',
      update: '#9b59b6'
    };
    return colors[category] || '#666';
  };

  if (loading) {
    return (
      <div className="notice-loading">
        <div className="loading-spinner"></div>
        <p>공지사항을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="notice-page">
      {/* 헤더 */}
      <div className="notice-header">
        <h1>공지사항</h1>
        <p>몬스터옥션의 최신 소식과 중요한 안내사항을 확인하세요</p>
      </div>

      {/* 검색 및 필터 */}
      <div className="notice-controls">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="공지사항 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
        </form>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            전체
          </button>
          <button
            className={`filter-btn ${filterType === 'important' ? 'active' : ''}`}
            onClick={() => handleFilterChange('important')}
          >
            중요
          </button>
          <button
            className={`filter-btn ${filterType === 'event' ? 'active' : ''}`}
            onClick={() => handleFilterChange('event')}
          >
            이벤트
          </button>
          <button
            className={`filter-btn ${filterType === 'maintenance' ? 'active' : ''}`}
            onClick={() => handleFilterChange('maintenance')}
          >
            점검
          </button>
        </div>
      </div>

      {/* 공지사항 목록 */}
      <div className="notice-list">
        {notices.length === 0 ? (
          <div className="no-notices">
            <div className="no-notices-icon">📢</div>
            <p>검색 결과가 없습니다.</p>
            <span>다른 검색어를 입력해보세요.</span>
          </div>
        ) : (
          notices.map((notice) => (
            <Link to={`/notice/${notice.id}`} key={notice.id} className="notice-item">
              <div className="notice-content">
                <div className="notice-header">
                  <div className="notice-title">
                    {notice.isImportant && <span className="important-badge">중요</span>}
                    <span className="category-badge" style={{ backgroundColor: getCategoryColor(notice.category) }}>
                      {getCategoryLabel(notice.category)}
                    </span>
                    <h3>{notice.title}</h3>
                  </div>
                  <div className="notice-meta">
                    <span className="notice-date">{notice.date}</span>
                    <span className="notice-views">조회 {notice.views}</span>
                  </div>
                </div>
                <p className="notice-preview">{notice.content.substring(0, 100)}...</p>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* 페이징 */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            이전
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
              onClick={() => setCurrentPage(pageNum)}
              disabled={currentPage === pageNum}
            >
              {pageNum}
            </button>
          ))}
          <button
            className="page-btn"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default Notice;
