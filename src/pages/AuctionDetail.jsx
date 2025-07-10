import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BidSection from '../components/BidSection';
import CommentSection from '../components/CommentSection';
import AuctionTimeLeft from '../components/AuctionTimeLeft';
import '../style/AuctionDetail.css';

const AuctionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentBid, setCurrentBid] = useState('');
  const [showBidModal, setShowBidModal] = useState(false);
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [auctionStatus, setAuctionStatus] = useState('진행중');

  useEffect(() => {
    fetch(`http://localhost:8080/api/auctions/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('서버 응답 오류');
        return res.json();
      })
      .then((data) => {
        setAuction(data);
        setLoading(false);
      })
      .catch((err) => {
        setAuction(null);
        setLoading(false);
      });
  }, [id]);

  const formatPrice = (price) => {
    if (price === null || price === undefined) return '-';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getImageUrl = (url) => {
    if (!url) return "https://placehold.co/400x400?text=경매";
    if (url.startsWith('/uploads/')) {
      return `http://localhost:8080${url}`;
    }
    return url;
  };

  // 입찰 단위 계산 함수
  const getBidStep = (price) => {
    if (price < 10000) return 1000;
    if (price < 100000) return 5000;
    return 10000;
  };

  // 실제 입찰하기 구현
  const handleBid = () => {
    const bidAmount = Number(currentBid);
    const step = getBidStep(bidAmount);
    if (!currentBid || bidAmount <= auction.highestBid) {
      alert('현재가보다 높은 금액을 입력해주세요.');
      return;
    }
    if (bidAmount % step !== 0) {
      alert(`입찰가는 ${step.toLocaleString()}원 단위로만 가능합니다.`);
      return;
    }
    setProcessing(true);
    fetch(`http://localhost:8080/api/bids`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auctionId: auction.id,
        bidAmount: bidAmount,
        bidder: 'guest' // 실제 로그인 사용자로 대체 가능
      }),
    })
      .then(async res => {
        const text = await res.text();
        if (!res.ok) throw new Error(text);
        return text;
      })
      .then(data => {
        alert('입찰 성공!');
        setShowBidModal(false);
        setCurrentBid('');
        setProcessing(false);
        window.location.reload();
      })
      .catch(err => {
        alert('입찰 실패: ' + err.message);
        setProcessing(false);
      });
  };

  // 실제 즉시구매 구현
  const handleBuyNow = () => {
    setProcessing(true);
    fetch(`http://localhost:8080/api/auctions/${auction.id}/buy-now`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        buyer: 'guest' // 실제 로그인 사용자로 대체 가능
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error('즉시구매 실패');
        return res.json();
      })
      .then(data => {
        alert('즉시구매 성공!');
        setShowBuyNowModal(false);
        setProcessing(false);
        window.location.reload();
      })
      .catch(err => {
        alert('즉시구매 실패: ' + err.message);
        setProcessing(false);
      });
  };

  if (loading) {
    return (
      <div className="auction-detail-loading">
        <div className="loading-spinner"></div>
        <p>경매 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="auction-detail-error">
        <h2>경매를 찾을 수 없습니다.</h2>
        <button onClick={() => navigate('/')}>홈으로 돌아가기</button>
      </div>
    );
  }

  // 이미지 배열 구성 (imageUrl1, imageUrl2, imageUrl3)
  const images = [auction.imageUrl1, auction.imageUrl2, auction.imageUrl3].filter(Boolean);

  return (
    <div className="auction-detail">
      {/* 상단 정보 */}
      <div className="auction-header">
        <div className="auction-title-section">
          <h1>{auction.title}</h1>
          <div className="auction-meta">
            <span className="category">{auction.category}</span>
            <span className="condition">{auction.status}</span>
            <span className="brand">{auction.brand}</span>
          </div>
        </div>
        <div className="auction-status">
          <div className="time-left">
            <span className="time-label">남은 시간</span>
            <AuctionTimeLeft startTime={auction.startTime} endTime={auction.endTime} onStatusChange={setAuctionStatus} />
          </div>
          <div className="bid-count">
            <span className="count-label">현재가</span>
            <span className="count-value">{formatPrice(auction.highestBid)}원</span>
          </div>
        </div>
      </div>

      {/* 예정 안내 */}
      {auctionStatus === '예정' && (
        <div style={{color:'#888',fontWeight:600,fontSize:'1.1em',marginBottom:16}}>경매 예정중입니다. 시작 시간 이후에 참여하실 수 있습니다.</div>
      )}

      <div className="auction-content">
        {/* 이미지 갤러리 */}
        <div className="image-gallery">
          <div className="main-image">
            <img src={getImageUrl(images[0])} alt={auction.title} />
          </div>
          <div className="thumbnail-list">
            {images.map((image, index) => (
              <div key={index} className="thumbnail">
                <img src={getImageUrl(image)} alt={`${auction.title} ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* 입찰 섹션 */}
        <div className="bidding-section">
          <div className="price-info">
            <div className="current-price">
              <span className="price-label">현재가</span>
              <span className="price-value">{formatPrice(auction.highestBid)}원</span>
            </div>
            {auction.buyNowPrice && (
              <div className="buy-now-price">
                <span className="price-label">즉시구매가</span>
                <span className="price-value">{formatPrice(auction.buyNowPrice)}원</span>
              </div>
            )}
          </div>

          <div className="bidding-actions">
            <button 
              className="btn-bid"
              onClick={() => setShowBidModal(true)}
              disabled={auctionStatus !== '진행중' || processing}
            >
              입찰하기
            </button>
            {auction.buyNowPrice && (
              <button 
                className="btn-buy-now"
                onClick={() => setShowBuyNowModal(true)}
                disabled={auctionStatus !== '진행중' || processing}
              >
                즉시구매
              </button>
            )}
          </div>

          <div className="auction-info-summary">
            <div className="info-item">
              <span className="info-label">시작가</span>
              <span className="info-value">{formatPrice(auction.startPrice)}원</span>
            </div>
            <div className="info-item">
              <span className="info-label">최소 입찰 단위</span>
              <span className="info-value">{formatPrice(auction.bidUnit)}원</span>
            </div>
            <div className="info-item">
              <span className="info-label">배송비</span>
              <span className="info-value">{auction.shippingFee || '무료'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">거래지역</span>
              <span className="info-value">{auction.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 상품 정보 */}
      <div className="product-info">
        <h2>상품 정보</h2>
        <div className="info-grid">
          <div className="description">
            <h3>상품 설명</h3>
            <p>{auction.description}</p>
          </div>
          <div className="specifications">
            <h3>제품 사양</h3>
            <div className="spec-list">
              <div className="spec-item">
                <span className="spec-label">브랜드</span>
                <span className="spec-value">{auction.brand}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">상태</span>
                <span className="spec-value">{auction.status}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">카테고리</span>
                <span className="spec-value">{auction.category}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">등록일</span>
                <span className="spec-value">{auction.createdAt?.split('T')[0]}</span>
              </div>
              {/* 필요시 추가 사양 */}
            </div>
          </div>
        </div>
      </div>

      {/* 판매자 정보 (간단히 brand로 대체) */}
      <div className="seller-info">
        <h2>판매자 정보</h2>
        <div className="seller-card">
          <div className="seller-header">
            <div className="seller-name">{auction.brand}</div>
          </div>
        </div>
      </div>

      {/* 배송 및 반품 정보 (간단히) */}
      <div className="shipping-info">
        <h2>배송 및 반품</h2>
        <div className="info-cards">
          <div className="info-card">
            <h3>배송 정보</h3>
            <p>배송비: {auction.shippingFee || '무료'}</p>
            <p>배송 방법: {auction.shippingType}</p>
            <p>배송 지역: {auction.location}</p>
          </div>
        </div>
      </div>

      {/* 입찰 내역 */}
      <BidSection auctionId={auction.id} />

      {/* 댓글 */}
      <CommentSection auctionId={auction.id} />

      {/* 모달 */}
      {showBidModal && (
        <div className="modal-overlay" onClick={() => setShowBidModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>입찰하기</h3>
            <div className="bid-form">
              <label>입찰 금액</label>
              <input
                type="number"
                value={currentBid}
                onChange={(e) => setCurrentBid(e.target.value)}
                placeholder="현재가보다 높은 금액을 입력하세요"
                min={auction.highestBid + getBidStep(auction.highestBid + 1)}
                step={getBidStep(currentBid || auction.highestBid + 1)}
                disabled={processing}
              />
              <div style={{color:'#888',fontSize:'0.95em',marginTop:4}}>
                입찰 단위: {getBidStep(currentBid || auction.highestBid + 1).toLocaleString()}원 단위
              </div>
              <div className="modal-actions">
                <button onClick={() => setShowBidModal(false)} className="btn-cancel" disabled={processing}>취소</button>
                <button onClick={handleBid} className="btn-confirm" disabled={processing}>입찰하기</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBuyNowModal && (
        <div className="modal-overlay" onClick={() => setShowBuyNowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>즉시구매</h3>
            <div className="buy-now-form">
              <p>즉시구매가: {formatPrice(auction.buyNowPrice)}원</p>
              <p>이 금액으로 즉시 구매하시겠습니까?</p>
              <div className="modal-actions">
                <button onClick={() => setShowBuyNowModal(false)} className="btn-cancel" disabled={processing}>취소</button>
                <button onClick={handleBuyNow} className="btn-confirm" disabled={processing}>구매하기</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionDetail;
