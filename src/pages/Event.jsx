import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style/Event.css';

const Event = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ongoing');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadEvents();
  }, [currentPage, filterType]);

  const loadEvents = () => {
    // 임시 이벤트 데이터
    const mockEvents = [
      {
        id: 1,
        title: "신년 맞이 특별 이벤트",
        subtitle: "2024년 새해를 맞이하여 특별한 혜택을 드립니다!",
        description: "1월 한 달간 경매 수수료 50% 할인 혜택을 드립니다. 신규 회원 가입 시 추가 혜택도 함께 제공됩니다.",
        image: "https://placehold.co/400x250/3498db/ffffff?text=신년+이벤트",
        startDate: "2024-01-01",
        endDate: "2024-01-31",
        status: "ongoing",
        category: "discount",
        participants: 1250,
        isHot: true
      },
      {
        id: 2,
        title: "첫 경매 참여 이벤트",
        subtitle: "처음 경매에 참여하시는 분들을 위한 특별 이벤트",
        description: "첫 경매 참여 시 수수료 면제 및 10,000원 할인 쿠폰을 제공합니다. 경험해보세요!",
        image: "https://placehold.co/400x250/e74c3c/ffffff?text=첫+경매+이벤트",
        startDate: "2024-01-15",
        endDate: "2024-02-15",
        status: "ongoing",
        category: "newbie",
        participants: 890,
        isHot: false
      },
      {
        id: 3,
        title: "겨울 시즌 특가 경매",
        subtitle: "겨울 시즌 상품들을 특별한 가격으로 만나보세요",
        description: "겨울 의류, 스키 용품, 겨울 스포츠 용품 등 다양한 상품을 특가로 경매합니다.",
        image: "https://placehold.co/400x250/2ecc71/ffffff?text=겨울+특가+이벤트",
        startDate: "2024-01-10",
        endDate: "2024-02-10",
        status: "ongoing",
        category: "seasonal",
        participants: 567,
        isHot: false
      },
      {
        id: 4,
        title: "2023년 연말 감사 이벤트",
        subtitle: "고객님들께 감사드리는 마음을 담아",
        description: "2023년 한 해 동안 이용해 주신 고객님들께 감사드리는 마음을 담아 특별한 혜택을 준비했습니다.",
        image: "https://placehold.co/400x250/f39c12/ffffff?text=연말+감사+이벤트",
        startDate: "2023-12-20",
        endDate: "2023-12-31",
        status: "ended",
        category: "thanks",
        participants: 2340,
        isHot: false
      },
      {
        id: 5,
        title: "블랙프라이데이 특별 이벤트",
        subtitle: "올해 마지막 특가 기회를 놓치지 마세요!",
        description: "블랙프라이데이 기간 동안 모든 상품에 대해 최대 70% 할인된 가격으로 경매를 진행합니다.",
        image: "https://placehold.co/400x250/9b59b6/ffffff?text=블랙프라이데이",
        startDate: "2023-11-24",
        endDate: "2023-11-26",
        status: "ended",
        category: "discount",
        participants: 3450,
        isHot: false
      },
      {
        id: 6,
        title: "가을 시즌 특가 경매",
        subtitle: "가을을 준비하는 특가 상품들",
        description: "가을 의류, 가을 스포츠 용품, 가을 캠핑 용품 등을 특가로 경매합니다.",
        image: "https://placehold.co/400x250/34495e/ffffff?text=가을+특가+이벤트",
        startDate: "2023-09-01",
        endDate: "2023-10-31",
        status: "ended",
        category: "seasonal",
        participants: 1234,
        isHot: false
      }
    ];

    // 필터링 적용
    let filteredEvents = mockEvents;
    
    if (filterType === 'ongoing') {
      filteredEvents = mockEvents.filter(event => event.status === 'ongoing');
    } else if (filterType === 'ended') {
      filteredEvents = mockEvents.filter(event => event.status === 'ended');
    }

    // 검색어 적용
    if (searchTerm) {
      filteredEvents = filteredEvents.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 최신순 정렬
    filteredEvents.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    // 페이징 적용
    const itemsPerPage = 6;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pagedEvents = filteredEvents.slice(startIndex, endIndex);

    setEvents(pagedEvents);
    setTotalPages(Math.ceil(filteredEvents.length / itemsPerPage));
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadEvents();
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    setCurrentPage(1);
  };

  const getCategoryLabel = (category) => {
    const labels = {
      discount: '할인',
      newbie: '신규회원',
      seasonal: '시즌',
      thanks: '감사'
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category) => {
    const colors = {
      discount: '#e74c3c',
      newbie: '#3498db',
      seasonal: '#2ecc71',
      thanks: '#f39c12'
    };
    return colors[category] || '#666';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysLeft = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <div className="event-loading">
        <div className="loading-spinner"></div>
        <p>이벤트를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="event-page">
      {/* 헤더 */}
      <div className="event-header">
        <h1>이벤트</h1>
        <p>몬스터옥션의 다양한 이벤트와 특별한 혜택을 확인하세요</p>
      </div>

      {/* 검색 및 필터 */}
      <div className="event-controls">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="이벤트 검색..."
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
            className={`filter-btn ${filterType === 'ongoing' ? 'active' : ''}`}
            onClick={() => handleFilterChange('ongoing')}
          >
            진행중
          </button>
          <button
            className={`filter-btn ${filterType === 'ended' ? 'active' : ''}`}
            onClick={() => handleFilterChange('ended')}
          >
            종료된 이벤트
          </button>
        </div>
      </div>

      {/* 이벤트 목록 */}
      <div className="event-list">
        {events.length === 0 ? (
          <div className="no-events">
            <div className="no-events-icon">🎉</div>
            <p>검색 결과가 없습니다.</p>
            <span>다른 검색어를 입력해보세요.</span>
          </div>
        ) : (
          <div className="event-grid">
            {events.map((event) => (
              <Link to={`/event/${event.id}`} key={event.id} className="event-card">
                <div className="event-image">
                  <img src={event.image} alt={event.title} />
                  {event.isHot && <span className="hot-badge">HOT</span>}
                  {event.status === 'ended' && <span className="ended-badge">종료</span>}
                  <span 
                    className="category-badge" 
                    style={{ backgroundColor: getCategoryColor(event.category) }}
                  >
                    {getCategoryLabel(event.category)}
                  </span>
                </div>
                <div className="event-content">
                  <h3>{event.title}</h3>
                  <p className="event-subtitle">{event.subtitle}</p>
                  <p className="event-description">{event.description}</p>
                  <div className="event-meta">
                    <div className="event-dates">
                      <span className="date-label">기간:</span>
                      <span className="date-value">
                        {formatDate(event.startDate)} ~ {formatDate(event.endDate)}
                      </span>
                    </div>
                    {event.status === 'ongoing' && (
                      <div className="days-left">
                        <span className="days-label">남은 기간:</span>
                        <span className="days-value">{getDaysLeft(event.endDate)}일</span>
                      </div>
                    )}
                    <div className="event-participants">
                      <span className="participants-label">참여자:</span>
                      <span className="participants-value">{event.participants.toLocaleString()}명</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
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

      {/* 관리자 링크 */}
      <div className="admin-link">
        <Link to="/event/admin" className="admin-button">
          관리자 페이지
        </Link>
      </div>
    </div>
  );
};

export default Event; 