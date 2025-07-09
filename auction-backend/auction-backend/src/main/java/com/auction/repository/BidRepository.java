package com.auction.repository;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.auction.dto.BidDto;

@Repository
public class BidRepository {

    private final JdbcTemplate jdbcTemplate;

    public BidRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // 입찰 저장
    public void save(BidDto bid) {
        String sql = "INSERT INTO bids (auction_id, bidder, bid_amount, bid_time) VALUES (?, ?, ?, ?)";
        try {
            jdbcTemplate.update(sql,
                    bid.getAuctionId(),
                    bid.getBidder(),
                    bid.getBidAmount(),
                    Timestamp.valueOf(bid.getBidTime()));
            System.out.println("✅ 입찰 저장 성공: 경매ID " + bid.getAuctionId() + ", 금액 " + bid.getBidAmount());
        } catch (Exception e) {
            System.err.println("❌ 입찰 저장 실패: " + e.getMessage());
            throw new RuntimeException("입찰 저장 실패: " + e.getMessage(), e);
        }
    }

    // 특정 경매 입찰 내역 조회 (최신순)
    public List<BidDto> findByAuctionId(Long auctionId) {
        String sql = "SELECT * FROM bids WHERE auction_id = ? ORDER BY bid_time DESC";
        try {
            return jdbcTemplate.query(sql, (rs, rowNum) -> {
                BidDto bid = new BidDto();
                bid.setId(rs.getLong("id"));
                bid.setAuctionId(rs.getLong("auction_id"));
                bid.setBidder(rs.getString("bidder"));
                bid.setBidAmount(rs.getInt("bid_amount"));
                bid.setBidTime(rs.getTimestamp("bid_time").toLocalDateTime());
                bid.setCreatedAt(
                        rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null);
                return bid;
            }, auctionId);
        } catch (Exception e) {
            System.err.println("❌ 입찰 내역 조회 실패 (경매ID: " + auctionId + "): " + e.getMessage());
            return List.of(); // 빈 리스트 반환
        }
    }

    // 특정 경매 최고 입찰가 조회
    public int findHighestBidByAuctionId(Long auctionId) {
        String sql = "SELECT COALESCE(MAX(bid_amount), 0) FROM bids WHERE auction_id = ?";
        try {
            Integer highestBid = jdbcTemplate.queryForObject(sql, Integer.class, auctionId);
            return highestBid != null ? highestBid : 0;
        } catch (Exception e) {
            System.err.println("❌ 최고 입찰가 조회 실패 (경매ID: " + auctionId + "): " + e.getMessage());
            return 0; // 기본값 반환
        }
    }
}
