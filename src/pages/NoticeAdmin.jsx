import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style/NoticeAdmin.css';

const NoticeAdmin = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = () => {
    // 임시 공지사항 데이터
    const mockNotices = [
      {
        id: 1,
        title: "2024년 몬스터옥션 이용약관 개정 안내",
        category: "important",
        status: "published",
        date: "2024-01-10",
        views: 1250,
        isImportant: true,
        author: "관리자"
      },
      {
        id: 2,
        title: "신년 맞이 특별 이벤트 안내",
        category: "event",
        status: "published",
        date: "2024-01-08",
        views: 890,
        isImportant: false,
        author: "관리자"
      },
      {
        id: 3,
        title: "시스템 점검 안내 (1월 15일)",
        category: "maintenance",
        status: "draft",
        date: "2024-01-05",
        views: 0,
        isImportant: true,
        author: "시스템관리자"
      },
      {
        id: 4,
        title: "경매 이용 가이드 업데이트",
        category: "guide",
        status: "published",
        date: "2024-01-03",
        views: 567,
        isImportant: false,
        author: "고객지원팀"
      },
      {
        id: 5,
        title: "모바일 앱 업데이트 안내",
        category: "update",
        status: "published",
        date: "2024-01-01",
        views: 432,
        isImportant: false,
        author: "개발팀"
      }
    ];

    setNotices(mockNotices);
    setLoading(false);
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

  const getStatusLabel = (status) => {
    return status === 'published' ? '발행' : '임시저장';
  };

  const getStatusColor = (status) => {
    return status === 'published' ? '#27ae60' : '#f39c12';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  // 필터링된 공지사항
  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || notice.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || notice.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // 페이징
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotices = filteredNotices.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (notice) => {
    setSelectedNotice(notice);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedNotice) {
      setNotices(prev => prev.filter(notice => notice.id !== selectedNotice.id));
      setShowDeleteModal(false);
      setSelectedNotice(null);
    }
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    setShowForm(true);
  };

  const handleNewNotice = () => {
    setEditingNotice(null);
    setShowForm(true);
  };

  const handleFormSubmit = (formData) => {
    if (editingNotice) {
      // 수정
      setNotices(prev => prev.map(notice => 
        notice.id === editingNotice.id 
          ? { ...notice, ...formData, id: notice.id }
          : notice
      ));
    } else {
      // 새 공지사항
      const newNotice = {
        ...formData,
        id: Math.max(...notices.map(n => n.id)) + 1,
        date: new Date().toISOString().split('T')[0],
        views: 0,
        author: "관리자"
      };
      setNotices(prev => [newNotice, ...prev]);
    }
    setShowForm(false);
    setEditingNotice(null);
  };

  if (loading) {
    return (
      <div className="notice-admin-loading">
        <div className="loading-spinner"></div>
        <p>공지사항을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="notice-admin-page">
      {/* 헤더 */}
      <div className="notice-admin-header">
        <div className="header-content">
          <h1>공지사항 관리</h1>
          <p>공지사항을 작성, 수정, 삭제할 수 있습니다</p>
        </div>
        <button onClick={handleNewNotice} className="new-notice-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          새 공지사항
        </button>
      </div>

      {/* 검색 및 필터 */}
      <div className="search-filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="공지사항 제목으로 검색..."
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
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">전체 카테고리</option>
            <option value="important">중요</option>
            <option value="event">이벤트</option>
            <option value="maintenance">점검</option>
            <option value="guide">가이드</option>
            <option value="update">업데이트</option>
          </select>

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">전체 상태</option>
            <option value="published">발행</option>
            <option value="draft">임시저장</option>
          </select>
        </div>
      </div>

      {/* 통계 */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-number">{notices.length}</div>
          <div className="stat-label">전체 공지사항</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{notices.filter(n => n.status === 'published').length}</div>
          <div className="stat-label">발행된 공지사항</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{notices.filter(n => n.isImportant).length}</div>
          <div className="stat-label">중요 공지사항</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{notices.reduce((sum, n) => sum + n.views, 0).toLocaleString()}</div>
          <div className="stat-label">총 조회수</div>
        </div>
      </div>

      {/* 공지사항 목록 */}
      <div className="notice-list-section">
        <div className="list-header">
          <h2>공지사항 목록</h2>
          <span className="result-count">총 {filteredNotices.length}개</span>
        </div>

        <div className="notice-table">
          <table>
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>카테고리</th>
                <th>상태</th>
                <th>작성일</th>
                <th>조회수</th>
                <th>작성자</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {paginatedNotices.map((notice, index) => (
                <tr key={notice.id}>
                  <td>{startIndex + index + 1}</td>
                  <td className="title-cell">
                    <div className="title-content">
                      {notice.isImportant && <span className="important-badge">중요</span>}
                      <span className="title-text">{notice.title}</span>
                    </div>
                  </td>
                  <td>
                    <span 
                      className="category-badge"
                      style={{ backgroundColor: getCategoryColor(notice.category) }}
                    >
                      {getCategoryLabel(notice.category)}
                    </span>
                  </td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(notice.status) }}
                    >
                      {getStatusLabel(notice.status)}
                    </span>
                  </td>
                  <td>{formatDate(notice.date)}</td>
                  <td>{notice.views.toLocaleString()}</td>
                  <td>{notice.author}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleEdit(notice)}
                        className="edit-btn"
                        title="수정"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(notice)}
                        className="delete-btn"
                        title="삭제"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3,6 5,6 21,6"></polyline>
                          <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            <h3>공지사항 삭제</h3>
            <p>"{selectedNotice?.title}" 공지사항을 삭제하시겠습니까?</p>
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

      {/* 공지사항 작성/수정 폼 */}
      {showForm && (
        <NoticeForm 
          notice={editingNotice}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingNotice(null);
          }}
        />
      )}
    </div>
  );
};

// 공지사항 작성/수정 폼 컴포넌트
const NoticeForm = ({ notice, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: notice?.title || '',
    content: notice?.content || '',
    category: notice?.category || 'important',
    isImportant: notice?.isImportant || false,
    status: notice?.status || 'draft'
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
        <h3>{notice ? '공지사항 수정' : '새 공지사항 작성'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>제목 *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="form-input"
              placeholder="공지사항 제목을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label>내용 *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              rows="10"
              className="form-textarea"
              placeholder="공지사항 내용을 입력하세요"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>카테고리</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="important">중요</option>
                <option value="event">이벤트</option>
                <option value="maintenance">점검</option>
                <option value="guide">가이드</option>
                <option value="update">업데이트</option>
              </select>
            </div>

            <div className="form-group">
              <label>상태</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="draft">임시저장</option>
                <option value="published">발행</option>
              </select>
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isImportant"
                checked={formData.isImportant}
                onChange={handleInputChange}
              />
              중요 공지사항으로 설정
            </label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              취소
            </button>
            <button type="submit" className="submit-btn">
              {notice ? '수정' : '작성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoticeAdmin; 