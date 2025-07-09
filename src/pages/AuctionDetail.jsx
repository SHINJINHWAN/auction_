import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import BidSection from '../components/BidSection'; // ✅ 입찰 섹션 추가
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

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📦 경매 상세 - {auction.title}</h2>
      <p>현재가: {auction.highestBid.toLocaleString()}원</p>

      {/* ✅ 입찰 섹션 삽입 */}
      <BidSection auctionId={auctionId} />

      <button onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>
        🏠 홈으로 돌아가기
      </button>
    </div>
  );
}

export default AuctionDetail;
