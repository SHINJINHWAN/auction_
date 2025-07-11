import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/Home.css";

const Home = ({ dashboardData }) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState('전체');
  
  // 현재 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 카테고리 목록
  const categories = ['전체', '가전', '전자제품', '패션', '명품', '도서', '취미', '스포츠'];
  
  // 카테고리별 경매 필터링
  const filteredAuctions = selectedCategory === '전체' 
    ? (dashboardData?.auctions || [])
    : (dashboardData?.auctions || []).filter(auction => auction.category === selectedCategory);

  // 남은 시간 계산 함수
  const calculateRemainingTime = (endAt) => {
    if (!endAt) return { hours: 0, minutes: 0, seconds: 0, isEnded: true };
    
    const now = new Date().getTime();
    const end = new Date(endAt).getTime();
    const diff = end - now;
    
    if (diff <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, isEnded: true };
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { hours, minutes, seconds, isEnded: false };
  };

  // 경매 카드 컴포넌트
  const AuctionCard = ({ auction }) => {
    const { hours, minutes, seconds, isEnded } = calculateRemainingTime(auction.endAt);
    
    // 이미지 소스 결정 로직 - Auction 페이지와 동일하게
    const getImageSrc = () => {
      if (!auction.imageUrl1) return "https://placehold.co/300x200?text=No+Image";
      if (auction.imageUrl1.startsWith('/uploads/')) {
        return `/api${auction.imageUrl1}`;
      }
      return auction.imageUrl1;
    };
    
    const imgSrc = getImageSrc();
    const currentPrice = Math.max(auction.startPrice, auction.highestBid || 0);

    return (
      <div className="auction-card">
        <div className="auction-image">
          <img src={imgSrc} alt={auction.title} />
          <div className="auction-category">{auction.category || '기타'}</div>
          {isEnded && <div className="auction-ended">경매 종료</div>}
        </div>
        <Link to={`/auction/${auction.id}`} className="auction-content-link">
          <div className="auction-content">
            <h3 className="auction-title">{auction.title}</h3>
            <div className="auction-price">
              <span className="price-label">현재가</span>
              <span className="price-value">{currentPrice.toLocaleString()}원</span>
            </div>
            <div className="auction-time">
              <span className="time-label">남은 시간</span>
              <span className={`time-value ${isEnded ? 'ended' : ''}`}>
                {isEnded ? '종료됨' : `${hours}시간 ${minutes}분 ${seconds}초`}
              </span>
            </div>
            <div className="auction-meta">
              <span className="bid-count">입찰 {auction.bidCount || 0}회</span>
              <span className="view-count">조회 {auction.viewCount || 0}회</span>
            </div>
            <div className="auction-link">
              입찰하러 가기 →
            </div>
          </div>
        </Link>
      </div>
    );
  };

  // 더 명확한 디버깅 로그 추가
  console.log('🚀 Home 컴포넌트 렌더링 시작');
  console.log('📊 전체 dashboardData:', dashboardData);
  console.log('📋 notices 배열:', dashboardData?.notices);
  console.log('❓ faqs 배열:', dashboardData?.faqs);
  console.log('🎉 events 배열:', dashboardData?.events);
  console.log('📦 auctions 배열:', dashboardData?.auctions);
  
  // 각 배열의 길이 확인
  console.log('📏 notices 길이:', dashboardData?.notices?.length || 0);
  console.log('📏 faqs 길이:', dashboardData?.faqs?.length || 0);
  console.log('📏 events 길이:', dashboardData?.events?.length || 0);
  console.log('📏 auctions 길이:', dashboardData?.auctions?.length || 0);
  
  // 조건부 렌더링 조건 확인
  const noticesCondition = dashboardData?.notices && dashboardData.notices.length > 0;
  const faqsCondition = dashboardData?.faqs && dashboardData.faqs.length > 0;
  const eventsCondition = dashboardData?.events && dashboardData.events.length > 0;
  
  console.log('✅ 공지사항 표시 조건:', noticesCondition);
  console.log('✅ FAQ 표시 조건:', faqsCondition);
  console.log('✅ 이벤트 표시 조건:', eventsCondition);
  
  return (
    <div className="home-container">
      {/* 현재 시간 표시 */}
      <div className="current-time">
        <span>현재 시간: {currentTime.toLocaleString('ko-KR')}</span>
      </div>

      {/* 상단 경매 등록/전체보기 버튼 영역 */}
      <div className="auction-action-bar">
        <button
          className="auction-register-btn"
          onClick={() => navigate("/auction-new")}
        >
          경매 등록하기
        </button>
        <Link to="/auction" className="auction-all-link">
          전체 경매 보기
        </Link>
      </div>

      {/* 경매 섹션 */}
      <section className="auction-section">
        <div className="container">
          <div className="section-header">
            <h2>진행중인 경매</h2>
            <div className="category-filter">
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="auction-grid">
            {filteredAuctions.length > 0 ? (
              filteredAuctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))
            ) : (
              <div className="no-auctions">
                <p>해당 카테고리의 경매가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 공지사항 */}
      {noticesCondition && (
        <section className="notice-section">
          <div className="container">
            <div className="section-header">
              <h2>공지사항</h2>
            </div>
            <div className="notice-list">
              {dashboardData.notices.slice(0, 3).map((notice) => (
                <div key={notice.id} className={`notice-item ${notice.isImportant ? 'important' : ''}`}>
                  <div className="notice-content">
                    <h3 className="notice-title">
                      {notice.isImportant && <span className="important-badge">중요</span>}
                      {notice.title}
                    </h3>
                    <p className="notice-excerpt">{notice.content.substring(0, 50)}...</p>
                    <div className="notice-meta">
                      <span className="notice-date">
                        {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
                      </span>
                      <span className="notice-views">조회 {notice.views}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqsCondition && (
        <section className="faq-section">
          <div className="container">
            <div className="section-header">
              <h2>자주 묻는 질문</h2>
            </div>
            <div className="faq-list">
              {dashboardData.faqs.slice(0, 3).map((faq) => (
                <div key={faq.id} className="faq-item">
                  <div className="faq-question">
                    <h3>{faq.question}</h3>
                    <p className="faq-answer">{faq.answer.substring(0, 100)}...</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 이벤트 */}
      {eventsCondition && (
        <section className="event-section">
          <div className="container">
            <div className="section-header">
              <h2>진행중인 이벤트</h2>
            </div>
            <div className="event-list">
              {dashboardData.events.slice(0, 2).map((event) => (
                <div key={event.id} className="event-item">
                  <div className="event-content">
                    <h3 className="event-title">
                      {event.isImportant && <span className="important-badge">중요</span>}
                      {event.title}
                    </h3>
                    <p className="event-excerpt">{event.content.substring(0, 80)}...</p>
                    <div className="event-meta">
                      <span className="event-date">
                        {new Date(event.startDate).toLocaleDateString('ko-KR')} ~ {new Date(event.endDate).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
