import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style/EventAdmin.css';

const EventAdmin = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    // 임시 이벤트 데이터
    const mockEvents = [
      {
        id: 1,
        title: "신년 맞이 특별 경매 이벤트",
        description: "2024년 새해를 맞이하여 특별한 경매 이벤트를 진행합니다. 다양한 프리미엄 상품들을 특가로 만나보세요!",
        startDate: "2024-01-01",
        endDate: "2024-01-31",
        status: "active",
        imageUrl: "https://placehold.co/300x200/3498db/ffffff?text=신년+이벤트",
        participants: 1250,
        views: 8900,
        isFeatured: true
      },
      {
        id: 2,
        title: "봄맞이 꽃 경매 페스티벌",
        description: "봄의 아름다운 꽃들과 함께하는 특별한 경매 이벤트입니다. 희귀한 꽃들과 화분들을 만나보세요.",
        startDate: "2024-03-01",
        endDate: "2024-03-31",
        status: "upcoming",
        imageUrl: "https://placehold.co/300x200/2ecc71/ffffff?text=봄+이벤트",
        participants: 0,
        views: 2340,
        isFeatured: false
      },
      {
        id: 3,
        title: "여름 휴가 특별 경매",
        description: "여름 휴가를 위한 다양한 상품들을 특별한 가격으로 만나보세요. 여행용품부터 휴가용 상품까지!",
        startDate: "2024-07-01",
        endDate: "2024-07-31",
        status: "upcoming",
        imageUrl: "https://placehold.co/300x200/f39c12/ffffff?text=여름+이벤트",
        participants: 0,
        views: 1560,
        isFeatured: false
      },
      {
        id: 4,
        title: "가을 수확의 기쁨 경매",
        description: "가을의 풍성한 수확을 기념하는 특별한 경매 이벤트입니다. 신선한 농산물과 가을 상품들을 만나보세요.",
        startDate: "2024-09-01",
        endDate: "2024-09-30",
        status: "upcoming",
        imageUrl: "https://placehold.co/300x200/e67e22/ffffff?text=가을+이벤트",
        participants: 0,
        views: 890,
        isFeatured: false
      },
      {
        id: 5,
        title: "연말 감사 경매 이벤트",
        description: "한 해를 마무리하며 고객 여러분께 감사하는 마음으로 준비한 특별한 경매 이벤트입니다.",
        startDate: "2024-12-01",
        endDate: "2024-12-31",
        status: "upcoming",
        imageUrl: "https://placehold.co/300x200/e74c3c/ffffff?text=연말+이벤트",
        participants: 0,
        views: 1230,
        isFeatured: true
      }
    ];

    setEvents(mockEvents);
    setLoading(false);
  };

  const getStatusLabel = (status) => {
    const labels = {
      active: '진행중',
      upcoming: '예정',
      ended: '종료'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: '#27ae60',
      upcoming: '#f39c12',
      ended: '#e74c3c'
    };
    return colors[status] || '#666';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  const isEventActive = (event) => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    return now >= startDate && now <= endDate;
  };

  const isEventUpcoming = (event) => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    return now < startDate;
  };

  const isEventEnded = (event) => {
    const now = new Date();
    const endDate = new Date(event.endDate);
    return now > endDate;
  };

  // 필터링된 이벤트
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // 페이징
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (event) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedEvent) {
      setEvents(prev => prev.filter(event => event.id !== selectedEvent.id));
      setShowDeleteModal(false);
      setSelectedEvent(null);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleNewEvent = () => {
    setEditingEvent(null);
    setShowForm(true);
  };

  const handleFormSubmit = (formData) => {
    if (editingEvent) {
      // 수정
      setEvents(prev => prev.map(event => 
        event.id === editingEvent.id 
          ? { ...event, ...formData, id: event.id }
          : event
      ));
    } else {
      // 새 이벤트
      const newEvent = {
        ...formData,
        id: Math.max(...events.map(e => e.id)) + 1,
        participants: 0,
        views: 0
      };
      setEvents(prev => [newEvent, ...prev]);
    }
    setShowForm(false);
    setEditingEvent(null);
  };

  if (loading) {
    return (
      <div className="event-admin-loading">
        <div className="loading-spinner"></div>
        <p>이벤트를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="event-admin-page">
      {/* 헤더 */}
      <div className="event-admin-header">
        <div className="header-content">
          <h1>이벤트 관리</h1>
          <p>경매 이벤트를 관리할 수 있습니다</p>
        </div>
        <button onClick={handleNewEvent} className="new-event-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          새 이벤트
        </button>
      </div>

      {/* 검색 및 필터 */}
      <div className="search-filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="이벤트 제목 또는 설명으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>

        <div className="filter-options">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">전체 상태</option>
            <option value="active">진행중</option>
            <option value="upcoming">예정</option>
            <option value="ended">종료</option>
          </select>
        </div>
      </div>

      {/* 통계 */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-number">{events.length}</div>
          <div className="stat-label">전체 이벤트</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{events.filter(e => e.status === 'active').length}</div>
          <div className="stat-label">진행중</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{events.filter(e => e.status === 'upcoming').length}</div>
          <div className="stat-label">예정</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{events.filter(e => e.isFeatured).length}</div>
          <div className="stat-label">추천 이벤트</div>
        </div>
      </div>

      {/* 이벤트 목록 */}
      <div className="event-list-section">
        <div className="list-header">
          <h2>이벤트 목록</h2>
          <span className="result-count">총 {filteredEvents.length}개</span>
        </div>

        <div className="event-grid">
          {paginatedEvents.map((event, index) => (
            <div key={event.id} className="event-card">
              <div className="event-image">
                <img src={event.imageUrl} alt={event.title} />
                {event.isFeatured && <span className="featured-badge">추천</span>}
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(event.status) }}
                >
                  {getStatusLabel(event.status)}
                </span>
              </div>
              
              <div className="event-content">
                <h3 className="event-title">{event.title}</h3>
                <p className="event-description">{event.description}</p>
                
                <div className="event-dates">
                  <div className="date-item">
                    <span className="date-label">시작일:</span>
                    <span className="date-value">{formatDate(event.startDate)}</span>
                  </div>
                  <div className="date-item">
                    <span className="date-label">종료일:</span>
                    <span className="date-value">{formatDate(event.endDate)}</span>
                  </div>
                </div>

                <div className="event-stats">
                  <div className="stat-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="m23 21-2-2"></path>
                      <path d="m16 16 2 2"></path>
                    </svg>
                    <span>{event.participants.toLocaleString()}명</span>
                  </div>
                  <div className="stat-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <span>{event.views.toLocaleString()}</span>
                  </div>
                </div>

                <div className="event-actions">
                  <button 
                    onClick={() => handleEdit(event)}
                    className="edit-btn"
                    title="수정"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    수정
                  </button>
                  <button 
                    onClick={() => handleDelete(event)}
                    className="delete-btn"
                    title="삭제"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6"></polyline>
                      <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                    </svg>
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 페이징 */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="page-btn"
            >
              이전
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`page-btn ${currentPage === page ? 'active' : ''}`}
              >
                {page}
              </button>
            ))}
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="page-btn"
            >
              다음
            </button>
          </div>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>이벤트 삭제</h3>
            <p>"{selectedEvent?.title}" 이벤트를 삭제하시겠습니까?</p>
            <p className="warning-text">이 작업은 되돌릴 수 없습니다.</p>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="cancel-btn">
                취소
              </button>
              <button onClick={confirmDelete} className="delete-btn">
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 이벤트 작성/수정 폼 */}
      {showForm && (
        <EventForm 
          event={editingEvent}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingEvent(null);
          }}
        />
      )}
    </div>
  );
};

// 이벤트 작성/수정 폼 컴포넌트
const EventForm = ({ event, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    startDate: event?.startDate || '',
    endDate: event?.endDate || '',
    status: event?.status || 'upcoming',
    imageUrl: event?.imageUrl || '',
    isFeatured: event?.isFeatured || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="form-modal">
        <h3>{event ? '이벤트 수정' : '새 이벤트 작성'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>이벤트 제목 *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="form-input"
              placeholder="이벤트 제목을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label>이벤트 설명 *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="6"
              className="form-textarea"
              placeholder="이벤트 설명을 입력하세요"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>시작일 *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>종료일 *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>상태</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="upcoming">예정</option>
                <option value="active">진행중</option>
                <option value="ended">종료</option>
              </select>
            </div>

            <div className="form-group">
              <label>이미지 URL</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="form-input"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
              />
              추천 이벤트로 설정
            </label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              취소
            </button>
            <button type="submit" className="submit-btn">
              {event ? '수정' : '작성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventAdmin; 