package com.auction.repository;

import com.auction.dto.NoticeDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public class NoticeRepository {
    private final JdbcTemplate jdbcTemplate;

    public NoticeRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void save(NoticeDto dto) {
        String sql = "INSERT INTO notice (title, content, created_at) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, dto.getTitle(), dto.getContent(), Timestamp.valueOf(dto.getCreatedAt()));
    }

    public List<NoticeDto> findAll() {
        String sql = "SELECT * FROM notice ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            NoticeDto dto = new NoticeDto();
            dto.setId(rs.getLong("id"));
            dto.setTitle(rs.getString("title"));
            dto.setContent(rs.getString("content"));
            dto.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            dto.setUpdatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null);
            return dto;
        });
    }

    public NoticeDto findById(Long id) {
        String sql = "SELECT * FROM notice WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
            NoticeDto dto = new NoticeDto();
            dto.setId(rs.getLong("id"));
            dto.setTitle(rs.getString("title"));
            dto.setContent(rs.getString("content"));
            dto.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            dto.setUpdatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null);
            return dto;
        }, id);
    }

    public void update(NoticeDto dto) {
        String sql = "UPDATE notice SET title = ?, content = ?, updated_at = ? WHERE id = ?";
        jdbcTemplate.update(sql, dto.getTitle(), dto.getContent(), Timestamp.valueOf(dto.getUpdatedAt()), dto.getId());
    }

    public void delete(Long id) {
        String sql = "DELETE FROM notice WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
} 