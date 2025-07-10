import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style/Home.css';

const Home = () => {
  const [auctions, setAuctions] = useState([]);
  const [notices, setNotices] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 임시 데이터 로드
    loadMockData();
  }, []);

  const loadMockData = () => {
    // 임시 경매 데이터
    const mockAuctions = [
      {
        id: 1,
        title: "애플 맥북 프로 16인치 M2 Pro",
        currentPrice: 2500000,
        startPrice: 2000000,
        endTime: "2024-01-15T18:00:00",
        image: "https://placehold.co/120x80?text=경매",
        bidCount: 15,
        seller: "애플전문점",
        category: "전자제품"
      },
      {
        id: 2,
        title: "샤넬 클래식 플랩백 미니",
        currentPrice: 850000,
        startPrice: 800000,
        endTime: "2024-01-14T20:00:00",
        image: "https://placehold.co/120x80?text=경매",
        bidCount: 8,
        seller: "럭셔리백전문",
        category: "패션잡화"
      },
      {
        id: 3,
        title: "삼성 갤럭시 S24 울트라 256GB",
        currentPrice: 1200000,
        startPrice: 1100000,
        endTime: "2024-01-16T22:00:00",
        image: "https://placehold.co/120x80?text=경매",
        bidCount: 23,
        seller: "삼성공식스토어",
        category: "전자제품"
      },
      {
        id: 4,
        title: "로렉스 서브마리너 데이트",
        currentPrice: 8500000,
        startPrice: 8000000,
        endTime: "2024-01-13T16:00:00",
        image: "https://placehold.co/120x80?text=경매",
        bidCount: 12,
        seller: "시계전문점",
        category: "시계"
      },
      {
        id: 5,
        title: "닌텐도 스위치 OLED + 게임팩",
        currentPrice: 350000,
        startPrice: 320000,
        endTime: "2024-01-17T19:00:00",
        image: "https://placehold.co/120x80?text=경매",
        bidCount: 7,
        seller: "게임전문점",
        category: "게임"
      },
      {
        id: 6,
        title: "아디다스 울트라부스트 21",
        currentPrice: 180000,
        startPrice: 160000,
        endTime: "2024-01-15T21:00:00",
        image: "https://placehold.co/120x80?text=경매",
        bidCount: 19,
        seller: "스포츠용품점",
        category: "스포츠용품"
      }
    ];

    // 임시 공지사항 데이터
    const mockNotices = [
      {
        id: 1,
        title: "2024년 몬스터옥션 이용약관 개정 안내",
        date: "2024-01-10",
        isImportant: true
      },
      {
        id: 2,
        title: "신년 맞이 특별 이벤트 안내",
        date: "2024-01-08",
        isImportant: false
      },
      {
        id: 3,
        title: "시스템 점검 안내 (1월 15일)",
        date: "2024-01-05",
        isImportant: true
      },
      {
        id: 4,
        title: "안전거래 가이드 업데이트",
        date: "2024-01-03",
        isImportant: false
      }
    ];

    // 임시 FAQ 데이터
    const mockFaqs = [
      {
        id: 1,
        question: "경매 참여는 어떻게 하나요?",
        category: "이용방법"
      },
      {
        id: 2,
        question: "입찰 취소가 가능한가요?",
        category: "입찰"
      },
      {
        id: 3,
        question: "배송비는 누가 부담하나요?",
        category: "배송"
      },
      {
        id: 4,
        question: "사기 방지 시스템은 어떻게 작동하나요?",
        category: "안전거래"
      }
    ];

    // 임시 이벤트 데이터
    const mockEvents = [
      {
        id: 1,
        title: "신년 맞이 경매 특가 이벤트",
        description: "1월 한 달간 특별 할인된 가격으로 경매 참여",
        endDate: "2024-01-31",
        image: "https://placehold.co/200x120/03c75a/ffffff?text=NewYear"
      },
      {
        id: 2,
        title: "첫 경매 참여자 50% 할인",
        description: "처음 경매에 참여하는 분들을 위한 특별 혜택",
        endDate: "2024-01-20",
        image: "https://placehold.co/200x120/03c75a/ffffff?text=First"
      }
    ];

    setAuctions(mockAuctions);
    setNotices(mockNotices);
    setFaqs(mockFaqs);
    setEvents(mockEvents);
    setLoading(false);
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatTimeLeft = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) return "마감";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}일 ${hours}시간`;
    if (hours > 0) return `${hours}시간 ${minutes}분`;
    return `${minutes}분`;
  };

  const getTimeStatus = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    
    if (diff <= 0) return "ended";
    if (diff < 1000 * 60 * 60) return "urgent"; // 1시간 이내
    if (diff < 1000 * 60 * 60 * 24) return "ending"; // 24시간 이내
    return "normal";
  };

  if (loading) {
    return (
      <div className="home-loading">
        <div className="loading-spinner"></div>
        <p>데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="home">
      {/* 메인 배너 */}
      <section className="main-banner">
        <div className="banner-content">
          <h1>안전하고 신뢰할 수 있는<br />경매 플랫폼</h1>
          <p>몬스터옥션에서 특별한 물품을 만나보세요</p>
          <div className="banner-buttons">
            <Link to="/auction" className="btn-primary">경매 보기</Link>
            <Link to="/auction/new" className="btn-secondary">물품 등록</Link>
          </div>
        </div>
        <div className="banner-stats">
          <div className="stat-item">
            <span className="stat-number">15,234</span>
            <span className="stat-label">총 경매 건수</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">98.7%</span>
            <span className="stat-label">고객만족도</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">0</span>
            <span className="stat-label">사기 피해</span>
          </div>
        </div>
      </section>

      {/* 실시간 경매 */}
      <section className="auction-section">
        <div className="section-header">
          <h2>🔥 실시간 인기 경매</h2>
          <Link to="/auction" className="view-all">전체보기 →</Link>
        </div>
        <div className="auction-grid">
          {auctions.map((auction) => (
            <Link to={`/auction/${auction.id}`} key={auction.id} className="auction-item">
              <div className="auction-image">
                <img src={auction.image} alt={auction.title} />
                <div className={`time-badge ${getTimeStatus(auction.endTime)}`}>
                  {formatTimeLeft(auction.endTime)}
                </div>
              </div>
              <div className="auction-info">
                <h3 className="auction-title">{auction.title}</h3>
                <div className="auction-details">
                  <span className="seller">{auction.seller}</span>
                  <span className="category">{auction.category}</span>
                </div>
                <div className="price-info">
                  <div className="current-price">
                    <span className="price-label">현재가</span>
                    <span className="price-value">{formatPrice(auction.currentPrice)}원</span>
                  </div>
                  <div className="bid-info">
                    <span className="bid-count">입찰 {auction.bidCount}회</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 서비스 그리드: 공지, FAQ, 이벤트, 1:1문의 */}
      <section className="service-grid">
        {/* 공지사항 카드 */}
        <div className="service-card notice-card">
          <div className="service-icon">📢</div>
          <div className="service-title">공지사항</div>
          <ul className="service-preview">
            {notices.slice(0,2).map(notice => (
              <li key={notice.id}>
                <span className={`notice-title${notice.isImportant ? ' important' : ''}`}>{notice.title}</span>
                <span className="notice-date">{notice.date}</span>
              </li>
            ))}
          </ul>
          <a href="/notice" className="service-more">더보기 →</a>
        </div>
        {/* FAQ 카드 */}
        <div className="service-card faq-card">
          <div className="service-icon">❓</div>
          <div className="service-title">자주묻는질문</div>
          <ul className="service-preview">
            {faqs.slice(0,2).map(faq => (
              <li key={faq.id}>
                <span className="faq-question">{faq.question}</span>
                <span className="faq-category">{faq.category}</span>
              </li>
            ))}
          </ul>
          <a href="/faq" className="service-more">더보기 →</a>
        </div>
        {/* 이벤트 카드 */}
        <div className="service-card event-card">
          <div className="service-icon">🎁</div>
          <div className="service-title">이벤트</div>
          <ul className="service-preview">
            {events.slice(0,1).map(event => (
              <li key={event.id}>
                <span className="event-title">{event.title}</span>
                <span className="event-date">~ {event.endDate}</span>
              </li>
            ))}
          </ul>
          <a href="/event" className="service-more">더보기 →</a>
        </div>
        {/* 1:1문의 카드 */}
        <div className="service-card inquiry-card">
          <div className="service-icon">💬</div>
          <div className="service-title">1:1 문의</div>
          <div className="service-preview inquiry-preview">
            <div>궁금한 점이 있으신가요?</div>
            <div>빠르고 정확한 답변을 받아보세요</div>
          </div>
          <a href="/inquiry/new" className="service-more btn-primary">1:1 문의하기</a>
        </div>
      </section>
    </div>
  );
};

export default Home;
