import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style/Inquiry.css';

const Inquiry = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadInquiries();
  }, [currentPage, filterType]);

  const loadInquiries = () => {
    // 임시 문의 데이터
    const mockInquiries = [
      {
        id: 1,
        title: "경매 입찰 관련 문의",
        content: "경매에 입찰했는데 낙찰이 되지 않았습니다. 입찰 기록은 어디서 확인할 수 있나요?",
        category: "auction",
        status: "answered",
        date: "2024-01-10",
        answer: "입찰 기록은 마이페이지 > 입찰 내역에서 확인하실 수 있습니다. 낙찰되지 않은 경우 입찰금은 자동으로 환불됩니다.",
        answerDate: "2024-01-11"
      },
      {
        id: 2,
        title: "배송 지연 문의",
        content: "낙찰 후 결제를 완료했는데 배송이 시작되지 않았습니다. 언제 배송되나요?",
        category: "delivery",
        status: "pending",
        date: "2024-01-09"
      },
      {
        id: 3,
        title: "환불 신청 방법",
        content: "상품을 받았는데 설명과 다릅니다. 환불을 신청하고 싶습니다.",
        category: "refund",
        status: "answered",
        date: "2024-01-08",
        answer: "환불 신청은 마이페이지 > 주문내역에서 해당 상품을 선택하신 후 '환불신청' 버튼을 클릭하시면 됩니다. 상품 수령 후 7일 이내에 신청 가능합니다.",
        answerDate: "2024-01-09"
      },
      {
        id: 4,
        title: "회원정보 변경",
        content: "연락처를 변경하고 싶습니다. 어떻게 해야 하나요?",
        category: "account",
        status: "answered",
        date: "2024-01-07",
        answer: "회원정보 변경은 마이페이지 > 개인정보 수정에서 가능합니다. 본인인증 후 연락처를 변경하실 수 있습니다.",
        answerDate: "2024-01-08"
      },
      {
        id: 5,
        title: "결제 오류",
        content: "결제 중 오류가 발생했습니다. 결제는 되었나요?",
        category: "payment",
        status: "pending",
        date: "2024-01-06"
      },
      {
        id: 6,
        title: "경매 취소 문의",
        content: "실수로 입찰했습니다. 취소할 수 있나요?",
        category: "auction",
        status: "answered",
        date: "2024-01-05",
        answer: "입찰은 취소가 불가능합니다. 입찰 전에 신중하게 고려하신 후 참여해 주시기 바랍니다. 단, 경매 시작 전까지는 입찰을 수정하실 수 있습니다.",
        answerDate: "2024-01-06"
      },
      {
        id: 7,
        title: "상품 품질 문의",
        content: "받은 상품에 흠집이 있습니다. 어떻게 해야 하나요?",
        category: "quality",
        status: "answered",
        date: "2024-01-04",
        answer: "상품에 문제가 있는 경우 사진과 함께 환불 신청을 해주세요. 검토 후 적절한 조치를 취하겠습니다.",
        answerDate: "2024-01-05"
      },
      {
        id: 8,
        title: "앱 오류 문의",
        content: "모바일 앱에서 로그인이 안 됩니다.",
        category: "technical",
        status: "pending",
        date: "2024-01-03"
      }
    ];

    // 필터링 적용
    let filteredInquiries = mockInquiries;
    
    if (filterType === 'pending') {
      filteredInquiries = mockInquiries.filter(inquiry => inquiry.status === 'pending');
    } else if (filterType === 'answered') {
      filteredInquiries = mockInquiries.filter(inquiry => inquiry.status === 'answered');
    }

    // 검색어 적용
    if (searchTerm) {
      filteredInquiries = filteredInquiries.filter(inquiry =>
        inquiry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 최신순 정렬
    filteredInquiries.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 페이징 적용
    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pagedInquiries = filteredInquiries.slice(startIndex, endIndex);

    setInquiries(pagedInquiries);
    setTotalPages(Math.ceil(filteredInquiries.length / itemsPerPage));
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadInquiries();
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    setCurrentPage(1);
  };

  const getCategoryLabel = (category) => {
    const labels = {
      auction: '경매',
      delivery: '배송',
      refund: '환불/교환',
      account: '회원정보',
      payment: '결제',
      quality: '상품품질',
      technical: '기술지원'
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category) => {
    const colors = {
      auction: '#3498db',
      delivery: '#2ecc71',
      refund: '#e74c3c',
      account: '#9b59b6',
      payment: '#f39c12',
      quality: '#1abc9c',
      technical: '#34495e'
    };
    return colors[category] || '#666';
  };

  const getStatusLabel = (status) => {
    return status === 'answered' ? '답변완료' : '답변대기';
  };

  const getStatusColor = (status) => {
    return status === 'answered' ? '#27ae60' : '#f39c12';
  };

  if (loading) {
    return (
      <div className="inquiry-loading">
        <div className="loading-spinner"></div>
        <p>문의내역을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="inquiry-page">
      {/* 헤더 */}
      <div className="inquiry-header">
        <h1>1:1 문의</h1>
        <p>궁금한 점이나 문제가 있으시면 언제든 문의해 주세요</p>
      </div>

      {/* 검색 및 필터 */}
      <div className="inquiry-controls">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="문의 내용 검색..."
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
            className={`filter-btn ${filterType === 'pending' ? 'active' : ''}`}
            onClick={() => handleFilterChange('pending')}
          >
            답변대기
          </button>
          <button
            className={`filter-btn ${filterType === 'answered' ? 'active' : ''}`}
            onClick={() => handleFilterChange('answered')}
          >
            답변완료
          </button>
        </div>
      </div>

      {/* 문의 목록 */}
      <div className="inquiry-list">
        {inquiries.length === 0 ? (
          <div className="no-inquiries">
            <div className="no-inquiries-icon">📞</div>
            <p>검색 결과가 없습니다.</p>
            <span>다른 검색어를 입력해보세요.</span>
          </div>
        ) : (
          inquiries.map((inquiry) => (
            <Link to={`/inquiry/${inquiry.id}`} key={inquiry.id} className="inquiry-item">
              <div className="inquiry-content">
                <div className="inquiry-header">
                  <div className="inquiry-title">
                    <span 
                      className="category-badge" 
                      style={{ backgroundColor: getCategoryColor(inquiry.category) }}
                    >
                      {getCategoryLabel(inquiry.category)}
                    </span>
                    <span 
                      className="status-badge" 
                      style={{ backgroundColor: getStatusColor(inquiry.status) }}
                    >
                      {getStatusLabel(inquiry.status)}
                    </span>
                    <h3>{inquiry.title}</h3>
                  </div>
                  <div className="inquiry-meta">
                    <span className="inquiry-date">{inquiry.date}</span>
                  </div>
                </div>
                <p className="inquiry-preview">{inquiry.content.substring(0, 100)}...</p>
                {inquiry.status === 'answered' && (
                  <div className="answer-preview">
                    <span className="answer-label">답변:</span>
                    <span className="answer-text">{inquiry.answer.substring(0, 80)}...</span>
                  </div>
                )}
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

      {/* 문의 작성 버튼 */}
      <div className="inquiry-actions">
        <Link to="/inquiry/new" className="new-inquiry-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          새 문의 작성
        </Link>
      </div>

      {/* 관리자 링크 */}
      <div className="admin-link">
        <Link to="/inquiry/admin" className="admin-button">
          관리자 페이지
        </Link>
      </div>
    </div>
  );
};

export default Inquiry; 