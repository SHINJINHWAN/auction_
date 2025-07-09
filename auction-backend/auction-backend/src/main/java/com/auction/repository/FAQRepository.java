package com.auction.repository;

import com.auction.dto.FAQDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public class FAQRepository {
    private final JdbcTemplate jdbcTemplate;

    public FAQRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void save(FAQDto dto) {
        String sql = "INSERT INTO faq (question, answer, created_at) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, dto.getQuestion(), dto.getAnswer(), Timestamp.valueOf(dto.getCreatedAt()));
    }

    public List<FAQDto> findAll() {
        String sql = "SELECT * FROM faq ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            FAQDto dto = new FAQDto();
            dto.setId(rs.getLong("id"));
            dto.setQuestion(rs.getString("question"));
            dto.setAnswer(rs.getString("answer"));
            dto.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            dto.setUpdatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null);
            return dto;
        });
    }

    public FAQDto findById(Long id) {
        String sql = "SELECT * FROM faq WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
            FAQDto dto = new FAQDto();
            dto.setId(rs.getLong("id"));
            dto.setQuestion(rs.getString("question"));
            dto.setAnswer(rs.getString("answer"));
            dto.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            dto.setUpdatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null);
            return dto;
        }, id);
    }

    public void update(FAQDto dto) {
        String sql = "UPDATE faq SET question = ?, answer = ?, updated_at = ? WHERE id = ?";
        jdbcTemplate.update(sql, dto.getQuestion(), dto.getAnswer(), Timestamp.valueOf(dto.getUpdatedAt()), dto.getId());
    }

    public void delete(Long id) {
        String sql = "DELETE FROM faq WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
} 