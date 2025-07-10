import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style/FAQAdmin.css';

const FAQAdmin = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [expandedFAQs, setExpandedFAQs] = useState(new Set());

  const itemsPerPage = 10;

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = () => {
    // 임시 FAQ 데이터
    const mockFAQs = [
      {
        id: 1,
        question: "경매에 참여하려면 어떻게 해야 하나요?",
        answer: "경매 참여를 위해서는 먼저 회원가입을 완료하고 본인인증을 진행해야 합니다. 그 후 원하는 경매 상품을 찾아 입찰하시면 됩니다.",
        category: "auction",
        order: 1,
        date: "2024-01-10"
      },
      {
        id: 2,
        question: "입찰금은 언제 환불되나요?",
        answer: "낙찰되지 않은 경우 입찰금은 자동으로 환불되며, 환불까지는 1-2일 정도 소요됩니다. 낙찰된 경우 입찰금은 상품 대금으로 자동 처리됩니다.",
        category: "payment",
        order: 2,
        date: "2024-01-08"
      },
      {
        id: 3,
        question: "배송은 언제 시작되나요?",
        answer: "낙찰 후 결제가 완료되면 1-2일 내에 배송이 시작됩니다. 배송 상황은 마이페이지에서 실시간으로 확인하실 수 있습니다.",
        category: "delivery",
        order: 3,
        date: "2024-01-05"
      },
      {
        id: 4,
        question: "상품에 문제가 있으면 어떻게 하나요?",
        answer: "상품 수령 후 문제가 발견되면 7일 이내에 고객센터로 연락해 주세요. 사진과 함께 상세한 내용을 알려주시면 빠른 해결을 도와드립니다.",
        category: "refund",
        order: 4,
        date: "2024-01-03"
      },
      {
        id: 5,
        question: "자동입찰은 어떻게 설정하나요?",
        answer: "경매 상세 페이지에서 '자동입찰 설정' 버튼을 클릭하여 최대 입찰가를 설정하시면 됩니다. 설정한 금액 내에서 자동으로 입찰이 진행됩니다.",
        category: "auction",
        order: 5,
        date: "2024-01-01"
      }
    ];

    setFaqs(mockFAQs);
    setLoading(false);
  };

  const getCategoryLabel = (category) => {
    const labels = {
      auction: '경매',
      payment: '결제',
      delivery: '배송',
      refund: '환불/교환',
      account: '회원정보',
      technical: '기술지원'
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category) => {
    const colors = {
      auction: '#3498db',
      payment: '#f39c12',
      delivery: '#2ecc71',
      refund: '#e74c3c',
      account: '#9b59b6',
      technical: '#34495e'
    };
    return colors[category] || '#666';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  const toggleFAQ = (faqId) => {
    setExpandedFAQs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(faqId)) {
        newSet.delete(faqId);
      } else {
        newSet.add(faqId);
      }
      return newSet;
    });
  };

  // 필터링된 FAQ
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || faq.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // 페이징
  const totalPages = Math.ceil(filteredFAQs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFAQs = filteredFAQs.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (faq) => {
    setSelectedFAQ(faq);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedFAQ) {
      setFaqs(prev => prev.filter(faq => faq.id !== selectedFAQ.id));
      setShowDeleteModal(false);
      setSelectedFAQ(null);
    }
  };

  const handleEdit = (faq) => {
    setEditingFAQ(faq);
    setShowForm(true);
  };

  const handleNewFAQ = () => {
    setEditingFAQ(null);
    setShowForm(true);
  };

  const handleFormSubmit = (formData) => {
    if (editingFAQ) {
      // 수정
      setFaqs(prev => prev.map(faq => 
        faq.id === editingFAQ.id 
          ? { ...faq, ...formData, id: faq.id }
          : faq
      ));
    } else {
      // 새 FAQ
      const newFAQ = {
        ...formData,
        id: Math.max(...faqs.map(f => f.id)) + 1,
        date: new Date().toISOString().split('T')[0],
        order: faqs.length + 1
      };
      setFaqs(prev => [newFAQ, ...prev]);
    }
    setShowForm(false);
    setEditingFAQ(null);
  };

  if (loading) {
    return (
      <div className="faq-admin-loading">
        <div className="loading-spinner"></div>
        <p>FAQ를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="faq-admin-page">
      {/* 헤더 */}
      <div className="faq-admin-header">
        <div className="header-content">
          <h1>FAQ 관리</h1>
          <p>자주 묻는 질문을 관리할 수 있습니다</p>
        </div>
        <button onClick={handleNewFAQ} className="new-faq-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          새 FAQ
        </button>
      </div>

      {/* 검색 및 필터 */}
      <div className="search-filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="질문 또는 답변으로 검색..."
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
            <option value="auction">경매</option>
            <option value="payment">결제</option>
            <option value="delivery">배송</option>
            <option value="refund">환불/교환</option>
            <option value="account">회원정보</option>
            <option value="technical">기술지원</option>
          </select>
        </div>
      </div>

      {/* 통계 */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-number">{faqs.length}</div>
          <div className="stat-label">전체 FAQ</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{new Set(faqs.map(f => f.category)).size}</div>
          <div className="stat-label">카테고리 수</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{faqs.filter(f => f.category === 'auction').length}</div>
          <div className="stat-label">경매 관련</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{faqs.filter(f => f.category === 'payment').length}</div>
          <div className="stat-label">결제 관련</div>
        </div>
      </div>

      {/* FAQ 목록 */}
      <div className="faq-list-section">
        <div className="list-header">
          <h2>FAQ 목록</h2>
          <span className="result-count">총 {filteredFAQs.length}개</span>
        </div>

        <div className="faq-list">
          {paginatedFAQs.map((faq, index) => (
            <div key={faq.id} className="faq-item">
              <div className="faq-header" onClick={() => toggleFAQ(faq.id)}>
                <div className="faq-info">
                  <span className="faq-number">#{startIndex + index + 1}</span>
                  <span 
                    className="category-badge"
                    style={{ backgroundColor: getCategoryColor(faq.category) }}
                  >
                    {getCategoryLabel(faq.category)}
                  </span>
                  <span className="faq-question">{faq.question}</span>
                </div>
                <div className="faq-actions">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(faq);
                    }}
                    className="edit-btn"
                    title="수정"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(faq);
                    }}
                    className="delete-btn"
                    title="삭제"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6"></polyline>
                      <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                    </svg>
                  </button>
                  <svg 
                    className={`expand-icon ${expandedFAQs.has(faq.id) ? 'expanded' : ''}`}
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </div>
              </div>
              
              {expandedFAQs.has(faq.id) && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                  <div className="faq-meta">
                    <span className="faq-date">작성일: {formatDate(faq.date)}</span>
                    <span className="faq-order">순서: {faq.order}</span>
                  </div>
                </div>
              )}
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
            <h3>FAQ 삭제</h3>
            <p>"{selectedFAQ?.question}" FAQ를 삭제하시겠습니까?</p>
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

      {/* FAQ 작성/수정 폼 */}
      {showForm && (
        <FAQForm 
          faq={editingFAQ}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingFAQ(null);
          }}
        />
      )}
    </div>
  );
};

// FAQ 작성/수정 폼 컴포넌트
const FAQForm = ({ faq, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    question: faq?.question || '',
    answer: faq?.answer || '',
    category: faq?.category || 'auction',
    order: faq?.order || 1
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="form-modal">
        <h3>{faq ? 'FAQ 수정' : '새 FAQ 작성'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>질문 *</label>
            <input
              type="text"
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              required
              className="form-input"
              placeholder="질문을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label>답변 *</label>
            <textarea
              name="answer"
              value={formData.answer}
              onChange={handleInputChange}
              required
              rows="8"
              className="form-textarea"
              placeholder="답변을 입력하세요"
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
                <option value="auction">경매</option>
                <option value="payment">결제</option>
                <option value="delivery">배송</option>
                <option value="refund">환불/교환</option>
                <option value="account">회원정보</option>
                <option value="technical">기술지원</option>
              </select>
            </div>

            <div className="form-group">
              <label>표시 순서</label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleInputChange}
                min="1"
                className="form-input"
                placeholder="1"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              취소
            </button>
            <button type="submit" className="submit-btn">
              {faq ? '수정' : '작성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FAQAdmin; 