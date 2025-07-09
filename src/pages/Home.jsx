import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import '../style/Home.css';

// 카테고리 리스트 및 상태, 정렬 옵션
const CATEGORY_LIST = ['전체', '가전', '전자제품', '패션', '명품', '도서', '취미', '스포츠'];
const STATUS_LIST = ['전체', '신품', '중고'];
const SORT_LIST = [
  { key: "recent", label: "최신순" },
  { key: "ending", label: "마감임박순" },
  { key: "lowest", label: "최저가순" },
  { key: "buyNow", label: "즉시구매가순" },
];

function Home() {
  const [auctions, setAuctions] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [category, setCategory] = useState('전체');
  const [status, setStatus] = useState('전체');
  const [sort, setSort] = useState('recent');
  const [showOngoing, setShowOngoing] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 10;
  const location = useLocation();
  const navigate = useNavigate();

  // 현재 시간 1초마다 갱신
  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  // 경매 목록 초기 로딩 및 변경 시 갱신
  useEffect(() => {
    fetch("http://localhost:8080/api/auctions")
      .then(res => res.json())
      .then(data => setAuctions(Array.isArray(data) ? data : []))
      .catch(err => console.error("❌ 오류 발생:", err));
  }, [location]);

  // WebSocket 실시간 반영
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws-auction"),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe("/topic/auction-updates", (message) => {
          const updatedAuction = JSON.parse(message.body);
          setAuctions(prev => {
            const idx = prev.findIndex(a => a.id === updatedAuction.id);
            if (idx !== -1) {
              return prev.map(a => a.id === updatedAuction.id ? updatedAuction : a);
            } else {
              return [...prev, updatedAuction];
            }
          });
        });
      },
    });
    client.activate();
    return () => client.deactivate();
  }, []);

  // 필터 및 정렬 처리
  let filtered = auctions;
  if (category !== '전체') filtered = filtered.filter(a => a.category === category);
  if (status !== '전체') filtered = filtered.filter(a => a.status === status);
  if (showOngoing) filtered = filtered.filter(a => new Date(a.endTime).getTime() > Date.now());
  if (search) {
    filtered = filtered.filter(a =>
      (a.title && a.title.includes(search)) ||
      (a.brand && a.brand.includes(search))
    );
  }
  filtered = [...filtered]; // 복사 후 정렬
  if (sort === "recent") filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (sort === "ending") filtered.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
  if (sort === "lowest") filtered.sort((a, b) => Math.max(a.startPrice, a.highestBid) - Math.max(b.startPrice, b.highestBid));
  if (sort === "buyNow") filtered.sort((a, b) => (a.buyNowPrice || Infinity) - (b.buyNowPrice || Infinity));

  // 페이징
  const totalPage = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // 현재 시간 포맷팅
  const formattedCurrentTime = currentTime.toLocaleString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });

  return (
    <div className="auction-main-container">
      {/* 네비 */}
      <nav className="auction-nav">
        <span className="auction-logo">🎁 AUCTION</span>
        <ul className="auction-nav-menu">
          <li onClick={() => navigate("/")}>홈</li>
          <li onClick={() => alert("이벤트/공지 개발중")}>이벤트</li>
          <li onClick={() => alert("마이페이지 개발중")}>마이경매</li>
        </ul>
        <button className="auction-login-btn" onClick={() => alert('로그인/회원가입 개발중')}>
          로그인/회원가입
        </button>
      </nav>

      {/* 배너 */}
      <div className="auction-banner-area">
        <div className="auction-banner">
          <div>
            <div className="auction-banner-title">매일 쏟아지는<br />실시간 경매!</div>
            <div className="auction-banner-desc">중고부터 명품까지, <b>AI로 관리되는 깨끗한 플랫폼</b> 지금 시작하세요!</div>
          </div>
          <img className="auction-banner-img" src="https://cdn-icons-png.flaticon.com/512/2642/2642002.png" alt="배너" />
        </div>
      </div>

      {/* 카테고리 */}
      <div className="auction-category-area">
        {CATEGORY_LIST.slice(1).map((cat, idx) => (
          <div
            key={cat}
            className="auction-category-box"
            style={{ color: category === cat ? '#fba800' : '#333' }}
            onClick={() => { setCategory(cat); setPage(1); }}
          >
            <span className="auction-category-icon">{["💻","📺","👚","👑","📚","🎸","🏀"][idx]}</span>
            <span>{cat}</span>
          </div>
        ))}
      </div>

      {/* 경매 게시판 본문 */}
      <div className="auction-content-main">
        {/* 툴바 */}
        <div className="auction-home-toolbar" style={{ marginBottom: 14, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            className="auction-search"
            placeholder="상품명/브랜드 검색"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
            {STATUS_LIST.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)}>
            {SORT_LIST.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
          <button className="auction-tab"
            style={{ fontWeight: showOngoing ? 'bold' : 'normal' }}
            onClick={() => { setShowOngoing(true); setPage(1); }}>진행중</button>
          <button className="auction-tab"
            style={{ fontWeight: !showOngoing ? 'bold' : 'normal' }}
            onClick={() => { setShowOngoing(false); setPage(1); }}>마감</button>
          <button onClick={() => navigate("/new")} className="btn-new-auction">+ 새 경매 등록</button>
        </div>

        {/* 테이블 */}
        <table className="auction-list-table">
          <thead>
            <tr>
              <th>사진</th>
              <th>상품명</th>
              <th>카테고리</th>
              <th>브랜드</th>
              <th>상태</th>
              <th>현재가</th>
              <th>즉시구매가</th>
              <th>마감</th>
              <th>남은시간</th>
              <th>입찰</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={10}>불러올 경매가 없습니다.</td>
              </tr>
            ) : paged.map(auction => {
              // 이미지 및 남은 시간 계산
              const imgSrc = auction.imageUrl1
                ? `http://localhost:8080${encodeURI(auction.imageUrl1)}`
                : 'https://via.placeholder.com/90x60?text=No+Image';

              const now = Date.now();
              const end = auction.endTime ? new Date(auction.endTime).getTime() : 0;
              const left = Math.max(0, Math.floor((end - now) / 1000));
              const remain = left > 0
                ? `${Math.floor(left/3600)}:${String(Math.floor((left%3600)/60)).padStart(2, '0')}:${String(left%60).padStart(2, '0')}`
                : <span className="auction-ended">종료</span>;

              return (
                <tr key={auction.id}>
                  <td>
                    <img className="auction-thumbnail" src={imgSrc} alt="썸네일" width={90} height={60}
                      onError={e => { e.target.src = 'https://via.placeholder.com/90x60?text=No+Image'; }}
                    />
                  </td>
                  <td>
                    <a className="auction-title-link" href={`/auction/${auction.id}`}>
                      {auction.title}
                    </a>
                  </td>
                  <td>{auction.category}</td>
                  <td>{auction.brand}</td>
                  <td>{auction.status}</td>
                  <td>{Math.max(auction.startPrice, auction.highestBid).toLocaleString()}원</td>
                  <td>{auction.buyNowPrice ? auction.buyNowPrice.toLocaleString() + "원" : '-'}</td>
                  <td>{auction.endTime ? auction.endTime.substring(0,16) : '-'}</td>
                  <td>{remain}</td>
                  <td>
                    <button className="bid-btn" onClick={() => navigate(`/auction/${auction.id}`)}>입찰하기</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        <div className="auction-home-pagination" style={{ marginTop: 24, textAlign: 'center' }}>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>이전</button>
          <span> {page} / {totalPage || 1} </span>
          <button disabled={page === totalPage || totalPage === 0} onClick={() => setPage(p => p + 1)}>다음</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
