package com.auction.repository;

import com.auction.dto.InquiryDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public class InquiryRepository {
    private final JdbcTemplate jdbcTemplate;

    public InquiryRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void save(InquiryDto dto) {
        String sql = "INSERT INTO inquiry (user_id, title, content, status, created_at) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, dto.getUserId(), dto.getTitle(), dto.getContent(), "대기", Timestamp.valueOf(dto.getCreatedAt()));
    }

    public List<InquiryDto> findAll() {
        String sql = "SELECT * FROM inquiry ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            InquiryDto dto = new InquiryDto();
            dto.setId(rs.getLong("id"));
            dto.setUserId(rs.getString("user_id"));
            dto.setTitle(rs.getString("title"));
            dto.setContent(rs.getString("content"));
            dto.setAnswer(rs.getString("answer"));
            dto.setStatus(rs.getString("status"));
            dto.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            dto.setUpdatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null);
            return dto;
        });
    }

    public List<InquiryDto> findByUserId(String userId) {
        String sql = "SELECT * FROM inquiry WHERE user_id = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            InquiryDto dto = new InquiryDto();
            dto.setId(rs.getLong("id"));
            dto.setUserId(rs.getString("user_id"));
            dto.setTitle(rs.getString("title"));
            dto.setContent(rs.getString("content"));
            dto.setAnswer(rs.getString("answer"));
            dto.setStatus(rs.getString("status"));
            dto.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            dto.setUpdatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null);
            return dto;
        }, userId);
    }

    public InquiryDto findById(Long id) {
        String sql = "SELECT * FROM inquiry WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
            InquiryDto dto = new InquiryDto();
            dto.setId(rs.getLong("id"));
            dto.setUserId(rs.getString("user_id"));
            dto.setTitle(rs.getString("title"));
            dto.setContent(rs.getString("content"));
            dto.setAnswer(rs.getString("answer"));
            dto.setStatus(rs.getString("status"));
            dto.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            dto.setUpdatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null);
            return dto;
        }, id);
    }

    public void updateAnswer(Long id, String answer) {
        String sql = "UPDATE inquiry SET answer = ?, status = '답변완료', updated_at = NOW() WHERE id = ?";
        jdbcTemplate.update(sql, answer, id);
    }

    public void updateAnswerAndStatus(Long id, String answer, String status) {
        String sql = "UPDATE inquiry SET answer = ?, status = ?, updated_at = NOW() WHERE id = ?";
        jdbcTemplate.update(sql, answer, status, id);
    }

    public void delete(Long id) {
        String sql = "DELETE FROM inquiry WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
} 