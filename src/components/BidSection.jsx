import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

function BidSection({ auctionId }) {
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [bidder, setBidder] = useState('');

  useEffect(() => {
    fetchBids();
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
    try {
      await axios.post('http://localhost:8080/api/bids', {
        auctionId,
        bidAmount: parseInt(bidAmount, 10),
        bidder,
      });
      setBidAmount('');
      fetchBids();
    } catch (error) {
      console.error('입찰 저장 실패:', error);
    }
  };

  const highestBid = bids.length > 0
    ? Math.max(...bids.map((bid) => bid.bidAmount))
    : 0;

  return (
    <div className="bid-section">
      <h3>입찰</h3>
      <form onSubmit={handleBidSubmit}>
        <input
          type="text"
          placeholder="입찰자 이름"
          value={bidder}
          onChange={(e) => setBidder(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="입찰 금액"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          required
        />
        <button type="submit">입찰하기</button>
      </form>

      <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
        💰 최고 입찰가: {highestBid.toLocaleString()}원
      </div>

      <ul>
        {bids.map((bid) => (
          <li key={bid.bidTime || `${bid.bidder}-${bid.bidAmount}-${bid.auctionId}`}>
            👤 {bid.bidder} — {bid.bidAmount.toLocaleString()}원
          </li>
        ))}
      </ul>
    </div>
  );
}

BidSection.propTypes = {
  auctionId: PropTypes.number.isRequired,
};

export default BidSection;
