import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style/FAQ.css';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState(new Set());

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = () => {
    // 임시 FAQ 데이터
    const mockFAQs = [
      {
        id: 1,
        category: 'account',
        question: '회원가입은 어떻게 하나요?',
        answer: '몬스터옥션 회원가입은 매우 간단합니다. 홈페이지 상단의 "회원가입" 버튼을 클릭하신 후, 이메일 주소와 비밀번호를 입력하시면 됩니다. 가입 후 이메일 인증을 완료하시면 모든 서비스를 이용하실 수 있습니다.'
      },
      {
        id: 2,
        category: 'account',
        question: '비밀번호를 잊어버렸어요. 어떻게 해야 하나요?',
        answer: '로그인 페이지에서 "비밀번호 찾기"를 클릭하신 후, 가입 시 등록한 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다. 이메일을 확인하신 후 새로운 비밀번호로 변경하실 수 있습니다.'
      },
      {
        id: 3,
        category: 'auction',
        question: '경매에 참여하려면 어떻게 해야 하나요?',
        answer: '경매 참여를 위해서는 먼저 회원가입과 본인인증이 필요합니다. 경매 상품을 선택하신 후 "입찰하기" 버튼을 클릭하여 원하시는 금액을 입력하시면 됩니다. 실시간으로 다른 입찰자들과 경쟁하실 수 있습니다.'
      },
      {
        id: 4,
        category: 'auction',
        question: '입찰 취소가 가능한가요?',
        answer: '입찰은 취소가 불가능합니다. 입찰 전에 신중하게 고려하신 후 참여해 주시기 바랍니다. 단, 경매 시작 전까지는 입찰을 수정하실 수 있습니다.'
      },
      {
        id: 5,
        category: 'payment',
        question: '결제 방법은 어떤 것들이 있나요?',
        answer: '신용카드, 계좌이체, 가상계좌, 간편결제(카카오페이, 네이버페이, 페이팔) 등 다양한 결제 방법을 제공합니다. 안전한 결제를 위해 SSL 암호화를 적용하고 있습니다.'
      },
      {
        id: 6,
        category: 'payment',
        question: '낙찰 후 결제 기간은 얼마나 되나요?',
        answer: '낙찰 후 3일 이내에 결제를 완료해 주셔야 합니다. 기간 내 결제가 완료되지 않으면 낙찰이 취소되고, 다음 입찰자에게 낙찰권이 넘어갑니다.'
      },
      {
        id: 7,
        category: 'delivery',
        question: '배송은 언제 시작되나요?',
        answer: '결제 완료 후 1-2일 내에 배송이 시작됩니다. 배송 상황은 마이페이지에서 실시간으로 확인하실 수 있으며, 배송 시작 시 SMS로 알림을 보내드립니다.'
      },
      {
        id: 8,
        category: 'delivery',
        question: '배송비는 얼마인가요?',
        answer: '배송비는 상품의 크기와 무게, 배송 지역에 따라 다릅니다. 일반적으로 3,000원~15,000원 정도이며, 50만원 이상 구매 시 무료배송 혜택을 제공합니다.'
      },
      {
        id: 9,
        category: 'refund',
        question: '환불은 어떻게 신청하나요?',
        answer: '마이페이지 > 주문내역에서 환불을 원하는 상품을 선택하신 후 "환불신청" 버튼을 클릭하시면 됩니다. 상품 수령 후 7일 이내에 신청 가능하며, 상품 상태에 따라 환불이 결정됩니다.'
      },
      {
        id: 10,
        category: 'refund',
        question: '환불 처리 기간은 얼마나 걸리나요?',
        answer: '환불 신청 후 검토 기간은 1-3일 소요되며, 승인 후 실제 환불까지는 3-5일 정도 걸립니다. 신용카드 결제의 경우 카드사 정책에 따라 1-2주가 소요될 수 있습니다.'
      },
      {
        id: 11,
        category: 'security',
        question: '개인정보는 안전한가요?',
        answer: '네, 매우 안전합니다. 몬스터옥션은 개인정보보호법을 준수하며, 모든 개인정보는 암호화되어 저장됩니다. 또한 SSL 인증서를 통해 안전한 통신을 보장하고 있습니다.'
      },
      {
        id: 12,
        category: 'security',
        question: '사기 방지는 어떻게 하나요?',
        answer: '몬스터옥션은 전문 보안팀이 24시간 모니터링하며, AI 기반 이상 거래 탐지 시스템을 운영합니다. 또한 에스크로 서비스를 통해 안전한 거래를 보장하고 있습니다.'
      }
    ];

    setFaqs(mockFAQs);
    setLoading(false);
  };

  const categories = [
    { id: 'all', name: '전체', icon: '📋' },
    { id: 'account', name: '회원정보', icon: '👤' },
    { id: 'auction', question: '경매', icon: '🔨' },
    { id: 'payment', name: '결제', icon: '💳' },
    { id: 'delivery', name: '배송', icon: '🚚' },
    { id: 'refund', name: '환불/교환', icon: '🔄' },
    { id: 'security', name: '보안', icon: '🔒' }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // 검색 로직은 이미 실시간으로 처리됨
  };

  if (loading) {
    return (
      <div className="faq-loading">
        <div className="loading-spinner"></div>
        <p>FAQ를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="faq-page">
      {/* 헤더 */}
      <div className="faq-header">
        <h1>자주 묻는 질문</h1>
        <p>몬스터옥션 이용 시 궁금한 점들을 빠르게 찾아보세요</p>
      </div>

      {/* 검색 */}
      <div className="faq-search">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="궁금한 내용을 검색해보세요..."
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
      </div>

      {/* 카테고리 필터 */}
      <div className="faq-categories">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>

      {/* FAQ 목록 */}
      <div className="faq-list">
        {filteredFAQs.length === 0 ? (
          <div className="no-faqs">
            <div className="no-faqs-icon">❓</div>
            <p>검색 결과가 없습니다.</p>
            <span>다른 검색어를 입력해보세요.</span>
          </div>
        ) : (
          filteredFAQs.map((faq) => (
            <div key={faq.id} className="faq-item">
              <button
                className={`faq-question ${expandedItems.has(faq.id) ? 'expanded' : ''}`}
                onClick={() => toggleExpanded(faq.id)}
              >
                <span className="question-text">{faq.question}</span>
                <span className="expand-icon">
                  {expandedItems.has(faq.id) ? '−' : '+'}
                </span>
              </button>
              <div className={`faq-answer ${expandedItems.has(faq.id) ? 'expanded' : ''}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 추가 도움말 */}
      <div className="faq-help">
        <h3>더 자세한 도움이 필요하신가요?</h3>
        <div className="help-options">
          <Link to="/inquiry" className="help-option">
            <div className="help-icon">📞</div>
            <div className="help-content">
              <h4>1:1 문의하기</h4>
              <p>직접 문의하여 빠른 답변을 받아보세요</p>
            </div>
          </Link>
          <Link to="/customer-service" className="help-option">
            <div className="help-icon">💬</div>
            <div className="help-content">
              <h4>고객센터</h4>
              <p>전화 또는 채팅으로 상담받기</p>
            </div>
          </Link>
          <a href="tel:1588-1234" className="help-option">
            <div className="help-icon">📱</div>
            <div className="help-content">
              <h4>전화 상담</h4>
              <p>1588-1234 (평일 09:00-18:00)</p>
            </div>
          </a>
        </div>
      </div>

      {/* 관리자 링크 */}
      <div className="admin-link">
        <Link to="/faq/admin" className="admin-button">
          관리자 페이지
        </Link>
      </div>
    </div>
  );
};

export default FAQ; 