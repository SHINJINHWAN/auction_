package com.auction.repository;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.auction.dto.AuctionDto;

@Repository
public class AuctionRepository {

    private final JdbcTemplate jdbcTemplate;

    public AuctionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // 경매 등록
    public void save(AuctionDto dto) {
        String sql = "INSERT INTO auction " +
                "(title, category, status, brand, image_url1, image_url2, image_url3, description, " +
                "start_price, buy_now_price, bid_unit, start_time, end_time, min_bid_count, auto_extend, " +
                "shipping_fee, shipping_type, location, created_at, updated_at, highest_bid) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try {
            jdbcTemplate.update(sql,
                    dto.getTitle(),
                    dto.getCategory(),
                    dto.getStatus(),
                    dto.getBrand(),
                    dto.getImage_url1(),
                    dto.getImage_url2(),
                    dto.getImage_url3(),
                    dto.getDescription(),
                    dto.getStartPrice(),
                    dto.getBuyNowPrice(),
                    dto.getBidUnit(),
                    Timestamp.valueOf(dto.getStartTime()),
                    Timestamp.valueOf(dto.getEndTime()),
                    dto.getMinBidCount(),
                    dto.isAutoExtend() ? 1 : 0,
                    dto.getShippingFee(),
                    dto.getShippingType(),
                    dto.getLocation(),
                    Timestamp.valueOf(dto.getCreatedAt()),
                    Timestamp.valueOf(dto.getUpdatedAt()),
                    dto.getHighestBid()
            );
            System.out.println("✅ 경매 저장 성공: " + dto.getTitle());
        } catch (Exception e) {
            System.err.println("❌ 경매 저장 실패: " + e.getMessage());
            throw new RuntimeException("경매 저장 실패: " + e.getMessage(), e);
        }
    }

    // 단일 경매 조회
    public AuctionDto findById(Long id) {
        String sql = "SELECT * FROM auction WHERE id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
                AuctionDto dto = new AuctionDto();
                dto.setId(rs.getLong("id"));
                dto.setTitle(rs.getString("title"));
                dto.setCategory(rs.getString("category"));
                dto.setStatus(rs.getString("status"));
                dto.setBrand(rs.getString("brand"));
                dto.setImage_url1(rs.getString("image_url1"));
                dto.setImage_url2(rs.getString("image_url2"));
                dto.setImage_url3(rs.getString("image_url3"));
                dto.setDescription(rs.getString("description"));
                dto.setStartPrice(rs.getInt("start_price"));
                dto.setBuyNowPrice(rs.getObject("buy_now_price") == null ? null : rs.getInt("buy_now_price"));
                dto.setBidUnit(rs.getInt("bid_unit"));
                dto.setStartTime(rs.getTimestamp("start_time").toLocalDateTime());
                dto.setEndTime(rs.getTimestamp("end_time").toLocalDateTime());
                dto.setMinBidCount(rs.getInt("min_bid_count"));
                dto.setAutoExtend(rs.getBoolean("auto_extend"));
                dto.setShippingFee(rs.getString("shipping_fee"));
                dto.setShippingType(rs.getString("shipping_type"));
                dto.setLocation(rs.getString("location"));
                dto.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
                dto.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
                dto.setHighestBid(rs.getInt("highest_bid"));
                return dto;
            }, id);
        } catch (Exception e) {
            System.err.println("❌ 경매 조회 실패 (ID: " + id + "): " + e.getMessage());
            return null;
        }
    }

    // 전체 경매 목록 (최신순)
    public List<AuctionDto> findAll() {
        String sql = "SELECT * FROM auction ORDER BY id DESC";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            AuctionDto dto = new AuctionDto();
            dto.setId(rs.getLong("id"));
            dto.setTitle(rs.getString("title"));
            dto.setCategory(rs.getString("category"));
            dto.setStatus(rs.getString("status"));
            dto.setBrand(rs.getString("brand"));
            dto.setImage_url1(rs.getString("image_url1"));
            dto.setImage_url2(rs.getString("image_url2"));
            dto.setImage_url3(rs.getString("image_url3"));
            dto.setDescription(rs.getString("description"));
            dto.setStartPrice(rs.getInt("start_price"));
            dto.setBuyNowPrice(rs.getObject("buy_now_price") == null ? null : rs.getInt("buy_now_price"));
            dto.setBidUnit(rs.getInt("bid_unit"));
            dto.setStartTime(rs.getTimestamp("start_time").toLocalDateTime());
            dto.setEndTime(rs.getTimestamp("end_time").toLocalDateTime());
            dto.setMinBidCount(rs.getInt("min_bid_count"));
            dto.setAutoExtend(rs.getBoolean("auto_extend"));
            dto.setShippingFee(rs.getString("shipping_fee"));
            dto.setShippingType(rs.getString("shipping_type"));
            dto.setLocation(rs.getString("location"));
            dto.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            dto.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
            dto.setHighestBid(rs.getInt("highest_bid"));
            return dto;
        });
    }

    // 수정
    public void update(Long id, AuctionDto dto) {
        String sql = "UPDATE auction SET " +
                "title=?, category=?, status=?, brand=?, image_url1=?, image_url2=?, image_url3=?, " +
                "description=?, start_price=?, buy_now_price=?, bid_unit=?, start_time=?, end_time=?, min_bid_count=?, " +
                "auto_extend=?, shipping_fee=?, shipping_type=?, location=?, updated_at=?, highest_bid=? " +
                "WHERE id=?";

        jdbcTemplate.update(sql,
                dto.getTitle(),
                dto.getCategory(),
                dto.getStatus(),
                dto.getBrand(),
                dto.getImage_url1(),
                dto.getImage_url2(),
                dto.getImage_url3(),
                dto.getDescription(),
                dto.getStartPrice(),
                dto.getBuyNowPrice(),
                dto.getBidUnit(),
                Timestamp.valueOf(dto.getStartTime()),
                Timestamp.valueOf(dto.getEndTime()),
                dto.getMinBidCount(),
                dto.isAutoExtend() ? 1 : 0,
                dto.getShippingFee(),
                dto.getShippingType(),
                dto.getLocation(),
                Timestamp.valueOf(dto.getUpdatedAt()),
                dto.getHighestBid(),
                id);
    }

    // 삭제
    public void delete(Long id) {
        String sql = "DELETE FROM auction WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
}
