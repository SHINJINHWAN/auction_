import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import BidSection from '../components/BidSection';
import CommentSection from '../components/CommentSection';
import NotificationBell from '../components/NotificationBell';
import '../style/AuctionDetail.css';

function AuctionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);

  const auctionId = parseInt(id, 10);

  // 경매 정보 가져오기
  const loadAuction = () => {
    fetch(`http://localhost:8080/api/auctions/${auctionId}`)
      .then((res) => {
        if (!res.ok) throw new Error('경매 정보 없음');
        return res.json();
      })
      .then(setAuction)
      .catch((err) => {
        console.error('❌ 상세 로딩 실패:', err);
        setAuction(null);
      });
  };

  useEffect(() => {
    loadAuction();
  }, [auctionId]);

  // WebSocket 연결
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-auction'),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('✅ WebSocket 연결됨 (상세)');

        client.subscribe('/topic/auction-updates', (message) => {
          const updated = JSON.parse(message.body);
          if (updated.id === auctionId) {
            setAuction(updated);
            console.log('📡 실시간 반영:', updated);
          }
        });
      },
      onStompError: (frame) => {
        console.error('❌ STOMP 오류:', frame);
      },
    });

    client.activate();
    return () => client.deactivate();
  }, [auctionId]);

  if (!auction) return <p>❌ 경매 정보를 불러올 수 없습니다.</p>;

  // 경매 상태 계산
  const now = new Date();
  const startTime = new Date(auction.startTime);
  const endTime = new Date(auction.endTime);
  const isStarted = now >= startTime;
  const isEnded = now > endTime;
  const isClosed = auction.isClosed;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ 
        marginBottom: '2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← 홈으로 돌아가기
        </button>
        <NotificationBell userId="user1" />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* 경매 정보 */}
        <div style={{ 
          border: '1px solid #ddd', 
          padding: '20px', 
          borderRadius: '8px',
          backgroundColor: '#f8f9fa'
        }}>
          <h2>📦 {auction.title}</h2>
          
          {auction.imageUrl1 && (
            <img 
              src={`http://localhost:8080${auction.imageUrl1}`} 
              alt="상품 이미지" 
              style={{ 
                width: '100%', 
                maxWidth: '400px', 
                height: 'auto',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
              }}
            />
          )}

          <div style={{ marginBottom: '1rem' }}>
            <strong>카테고리:</strong> {auction.category} | <strong>브랜드:</strong> {auction.brand}
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <strong>상품 상태:</strong> {auction.status}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong>시작가:</strong> {auction.startPrice.toLocaleString()}원
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong>현재가:</strong> {Math.max(auction.startPrice, auction.highestBid).toLocaleString()}원
          </div>

          {auction.buyNowPrice && (
            <div style={{ marginBottom: '1rem' }}>
              <strong>💎 즉시구매가:</strong> {auction.buyNowPrice.toLocaleString()}원
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <strong>입찰단위:</strong> {auction.bidUnit.toLocaleString()}원
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong>마감시간:</strong> {auction.endTime.substring(0, 16)}
          </div>

          {!isStarted && (
            <div style={{ 
              padding: '10px',
              backgroundColor: '#d1ecf1',
              color: '#0c5460',
              borderRadius: '4px',
              marginBottom: '1rem'
            }}>
              ⏳ <strong>경매 진행예정</strong> 시작 시간: {auction.startTime.substring(0, 16)}
            </div>
          )}

          {isStarted && !isEnded && !isClosed && (
            <div style={{ 
              padding: '10px',
              backgroundColor: '#d4edda',
              color: '#155724',
              borderRadius: '4px',
              marginBottom: '1rem'
            }}>
              🔥 <strong>경매 진행중</strong> 마감까지 남은 시간이 있습니다
            </div>
          )}

          {isClosed && auction.winner && (
            <div style={{ 
              padding: '10px',
              backgroundColor: '#d4edda',
              color: '#155724',
              borderRadius: '4px',
              marginBottom: '1rem'
            }}>
              🏆 <strong>경매 종료!</strong> 낙찰자: {auction.winner}
            </div>
          )}

          {isEnded && !isClosed && (
            <div style={{ 
              padding: '10px',
              backgroundColor: '#fff3cd',
              color: '#856404',
              borderRadius: '4px',
              marginBottom: '1rem'
            }}>
              ⏰ <strong>경매 마감!</strong> 자동 종료 처리 중...
            </div>
          )}

          <div style={{ marginTop: '1rem' }}>
            <h4>📝 상품 설명</h4>
            <p style={{ whiteSpace: 'pre-wrap' }}>{auction.description}</p>
          </div>
        </div>

        {/* 입찰 섹션 */}
        <div>
          <BidSection auctionId={auctionId} auction={auction} />
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div style={{ marginTop: '2rem' }}>
        <CommentSection auctionId={auctionId} />
      </div>
    </div>
  );
}

export default AuctionDetail;
