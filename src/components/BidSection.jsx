import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

function BidSection({ auctionId, auction }) {
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [bidder, setBidder] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [message, setMessage] = useState('');
  const [autoBidMax, setAutoBidMax] = useState('');
  const [isAutoBidding, setIsAutoBidding] = useState(false);

  // 경매 상태 계산
  const now = new Date();
  const startTime = auction?.startTime ? new Date(auction.startTime) : null;
  const endTime = auction?.endTime ? new Date(auction.endTime) : null;
  const isStarted = startTime && now >= startTime;
  const isEnded = endTime && now > endTime;
  const isClosed = auction?.isClosed || false;

  useEffect(() => {
    fetchBids();
  }, [auctionId]);

  // WebSocket 실시간 업데이트
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-auction'),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('✅ WebSocket 연결됨 (입찰)');
        client.subscribe('/topic/auction-updates', (message) => {
          const updatedAuction = JSON.parse(message.body);
          if (updatedAuction.id === auctionId) {
            // 경매 정보가 업데이트되면 입찰 목록도 새로고침
            fetchBids();
            setMessage('🎉 새로운 입찰이 등록되었습니다!');
            setTimeout(() => setMessage(''), 3000);
          }
        });
      },
    });
    client.activate();
    return () => client.deactivate();
  }, [auctionId]);

  const fetchBids = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/bids/${auctionId}`);
      setBids(response.data);
    } catch (error) {
      console.error('입찰 목록 불러오기 실패:', error);
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:8080/api/bids', {
        auctionId,
        bidAmount: parseInt(bidAmount, 10),
        bidder,
      });
      
      setBidAmount('');
      setMessage('✅ 입찰이 성공적으로 등록되었습니다!');
      setTimeout(() => setMessage(''), 3000);
      fetchBids();
    } catch (error) {
      const errorMessage = error.response?.data || '입찰 처리 중 오류가 발생했습니다.';
      setMessage(`❌ ${errorMessage}`);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuyNow = async () => {
    if (!bidder.trim()) {
      setMessage('❌ 구매자 이름을 입력해주세요.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setIsBuyingNow(true);
    setMessage('');

    try {
      const response = await axios.post(`http://localhost:8080/api/auctions/${auctionId}/buy-now`, {
        buyer: bidder
      });
      
      setMessage('💎 즉시구매가 완료되었습니다!');
      setTimeout(() => setMessage(''), 3000);
      
      // 페이지 새로고침 또는 상태 업데이트
      window.location.reload();
    } catch (error) {
      const errorMessage = error.response?.data || '즉시구매 처리 중 오류가 발생했습니다.';
      setMessage(`❌ ${errorMessage}`);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setIsBuyingNow(false);
    }
  };

  // 자동입찰 시작 (프론트엔드 UI만, 백엔드 연동은 이후 단계)
  const handleAutoBid = () => {
    if (!bidder.trim() || !autoBidMax.trim() || isNaN(autoBidMax)) {
      setMessage('❌ 입찰자 이름과 최대 자동입찰가를 올바르게 입력하세요.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    setIsAutoBidding(true);
    setMessage(`🤖 자동입찰이 시작되었습니다! (최대 ${parseInt(autoBidMax, 10).toLocaleString()}원까지)`);
    setTimeout(() => setMessage(''), 3000);
    // 실제 자동입찰 로직은 백엔드 연동 필요
  };

  const highestBid = bids.length > 0
    ? Math.max(...bids.map((bid) => bid.bidAmount))
    : 0;

  const currentPrice = Math.max(auction?.startPrice || 0, highestBid);
  const nextBidAmount = currentPrice + (auction?.bidUnit || 1000);

  return (
    <div className="bid-section" style={{ 
      border: '1px solid #ddd', 
      padding: '20px', 
      borderRadius: '8px',
      marginTop: '20px'
    }}>
      <h3>💰 입찰하기</h3>

      {/* 입찰 내역 테이블 */}
      {bids.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '8px' }}>입찰 내역</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f1f3f5' }}>
                <th style={{ padding: '4px', border: '1px solid #ddd' }}>입찰자</th>
                <th style={{ padding: '4px', border: '1px solid #ddd' }}>입찰가</th>
                <th style={{ padding: '4px', border: '1px solid #ddd' }}>입찰시간</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid, idx) => (
                <tr key={idx} style={{ background: idx === 0 ? '#fffbe6' : 'white' }}>
                  <td style={{ padding: '4px', border: '1px solid #ddd', fontWeight: idx === 0 ? 'bold' : 'normal' }}>{bid.bidder}</td>
                  <td style={{ padding: '4px', border: '1px solid #ddd', color: idx === 0 ? '#d63384' : '#333', fontWeight: idx === 0 ? 'bold' : 'normal' }}>{bid.bidAmount.toLocaleString()}원</td>
                  <td style={{ padding: '4px', border: '1px solid #ddd' }}>{new Date(bid.createdAt).toLocaleString('ko-KR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* 경매 상태 표시 */}
      {!isStarted && (
        <div style={{ 
          padding: '10px',
          backgroundColor: '#d1ecf1',
          color: '#0c5460',
          borderRadius: '4px',
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          ⏳ 경매가 아직 시작되지 않았습니다. 시작 시간: {auction?.startTime?.substring(0, 16)}
        </div>
      )}
      
      {isEnded && !isClosed && (
        <div style={{ 
          padding: '10px',
          backgroundColor: '#fff3cd',
          color: '#856404',
          borderRadius: '4px',
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          ⏰ 경매가 마감되었습니다. 자동 종료 처리 중...
        </div>
      )}
      
      {isClosed && (
        <div style={{ 
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          ❌ 경매가 종료되었습니다.
          {auction?.winner && ` 낙찰자: ${auction.winner}`}
        </div>
      )}
      
      {message && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '15px',
          borderRadius: '4px',
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24',
          border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleBidSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="입찰자 이름"
            value={bidder}
            onChange={(e) => setBidder(e.target.value)}
            required
            disabled={!isStarted || isEnded || isClosed}
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: (!isStarted || isEnded || isClosed) ? '#f8f9fa' : 'white'
            }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="number"
            placeholder={`입찰가 (최소 ${nextBidAmount.toLocaleString()}원)`}
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            min={nextBidAmount}
            required
            disabled={!isStarted || isEnded || isClosed}
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: (!isStarted || isEnded || isClosed) ? '#f8f9fa' : 'white'
            }}
          />
        </div>
        {/* 자동입찰 UI */}
        <div style={{ marginBottom: '10px' }}>
          <input
            type="number"
            placeholder="최대 자동입찰가 (선택)"
            value={autoBidMax}
            onChange={e => setAutoBidMax(e.target.value)}
            min={nextBidAmount}
            disabled={!isStarted || isEnded || isClosed}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: (!isStarted || isEnded || isClosed) ? '#f8f9fa' : 'white'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="submit"
            disabled={!isStarted || isEnded || isClosed || isSubmitting}
            style={{
              flex: 1,
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px',
              borderRadius: '4px',
              cursor: (!isStarted || isEnded || isClosed || isSubmitting) ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            입찰하기
          </button>
          <button
            type="button"
            onClick={handleAutoBid}
            disabled={!isStarted || isEnded || isClosed || isAutoBidding}
            style={{
              flex: 1,
              backgroundColor: '#20c997',
              color: 'white',
              border: 'none',
              padding: '10px',
              borderRadius: '4px',
              cursor: (!isStarted || isEnded || isClosed || isAutoBidding) ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            자동입찰 시작
          </button>
        </div>

        {/* 즉시구매 버튼 */}
        {auction?.buyNowPrice && isStarted && !isEnded && !isClosed && (
          <button 
            type="button"
            onClick={handleBuyNow}
            disabled={isBuyingNow}
            style={{ 
              width: '100%',
              padding: '10px',
              backgroundColor: isBuyingNow ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isBuyingNow ? 'not-allowed' : 'pointer'
            }}
          >
            {isBuyingNow ? '처리 중...' : `💎 즉시구매 (${auction.buyNowPrice.toLocaleString()}원)`}
          </button>
        )}
      </form>

      <div style={{ 
        marginBottom: '15px', 
        padding: '10px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px'
      }}>
        <strong>💰 현재 최고가: {currentPrice.toLocaleString()}원</strong>
        {auction?.buyNowPrice && (
          <div style={{ marginTop: '5px', color: '#666' }}>
            💎 즉시구매가: {auction.buyNowPrice.toLocaleString()}원
          </div>
        )}
      </div>

      <div>
        <h4>📋 입찰 내역 ({bids.length}건)</h4>
        {bids.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>아직 입찰이 없습니다.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {bids.slice(0, 10).map((bid, index) => (
              <li key={bid.bidTime || `${bid.bidder}-${bid.bidAmount}-${bid.auctionId}`}
                  style={{ 
                    padding: '8px 0',
                    borderBottom: index < bids.length - 1 ? '1px solid #eee' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                <span>👤 {bid.bidder}</span>
                <span style={{ fontWeight: 'bold' }}>
                  {bid.bidAmount.toLocaleString()}원
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

BidSection.propTypes = {
  auctionId: PropTypes.number.isRequired,
  auction: PropTypes.object,
};

export default BidSection;
