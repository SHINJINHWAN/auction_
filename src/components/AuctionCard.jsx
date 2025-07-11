import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

function AuctionCard({ auction }) {
  if (!auction) return null;

  const {
    id = 0,
    title = '제목 없음',
    startPrice = 0,
    highestBid = 0,
    endAt,
    imageBase64,
  } = auction;

  // 카드 내 썸네일: Base64 이미지 또는 placeholder
  const imgSrc = imageBase64 || 'https://placehold.co/200x120?text=No+Image';

  // 남은 시간(초) 상태
  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    if (!endAt) return 0;
    const diff = new Date(endAt).getTime() - Date.now();
    return diff > 0 ? Math.floor(diff / 1000) : 0;
  });

  useEffect(() => {
    if (remainingSeconds <= 0) return;

    const timerId = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [remainingSeconds]);

  // 남은 시간을 시:분:초로 표시
  const formatRemainingTime = (seconds) => {
    if (seconds <= 0) return '종료됨';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}시간 ${mins}분 ${secs}초`;
  };

  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        margin: '12px',
        width: '220px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <img
        src={imgSrc}
        alt="썸네일"
        style={{
          width: '200px',
          height: '120px',
          objectFit: 'cover',
          borderRadius: '6px',
          marginBottom: '12px',
          background: '#eee',
        }}
        onError={e => {
          e.target.onerror = null;
          e.target.src = 'https://placehold.co/200x120?text=No+Image';
        }}
      />
      <h3 style={{ marginBottom: '10px', fontSize: '1.1rem' }}>{title}</h3>
      <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
        현재가: {Math.max(startPrice, highestBid).toLocaleString()}원
      </p>
      <p
        style={{
          marginBottom: '8px',
          color: remainingSeconds > 0 ? '#555' : 'red',
        }}
      >
        남은 시간: {formatRemainingTime(remainingSeconds)}
      </p>
      <Link
        to={`/auction/${id}`}
        style={{ color: '#007bff', textDecoration: 'none' }}
      >
        입찰하러 가기 →
      </Link>
    </div>
  );
}

AuctionCard.propTypes = {
  auction: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    startPrice: PropTypes.number.isRequired,
    highestBid: PropTypes.number,
    endAt: PropTypes.string,
    imageBase64: PropTypes.string,
  }).isRequired,
};

export default AuctionCard;
