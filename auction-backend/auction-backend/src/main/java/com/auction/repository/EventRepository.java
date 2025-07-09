package com.auction.repository;

import com.auction.dto.EventDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;

@Repository
public class EventRepository {
    private final JdbcTemplate jdbcTemplate;

    public EventRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void save(EventDto dto) {
        String sql = "INSERT INTO event (title, content, start_date, end_date, created_at) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, dto.getTitle(), dto.getContent(), Date.valueOf(dto.getStartDate()), Date.valueOf(dto.getEndDate()), Timestamp.valueOf(dto.getCreatedAt()));
    }

    public List<EventDto> findAll() {
        String sql = "SELECT * FROM event ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            EventDto dto = new EventDto();
            dto.setId(rs.getLong("id"));
            dto.setTitle(rs.getString("title"));
            dto.setContent(rs.getString("content"));
            dto.setStartDate(rs.getDate("start_date").toLocalDate());
            dto.setEndDate(rs.getDate("end_date").toLocalDate());
            dto.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            dto.setUpdatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null);
            return dto;
        });
    }

    public EventDto findById(Long id) {
        String sql = "SELECT * FROM event WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
            EventDto dto = new EventDto();
            dto.setId(rs.getLong("id"));
            dto.setTitle(rs.getString("title"));
            dto.setContent(rs.getString("content"));
            dto.setStartDate(rs.getDate("start_date").toLocalDate());
            dto.setEndDate(rs.getDate("end_date").toLocalDate());
            dto.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            dto.setUpdatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null);
            return dto;
        }, id);
    }

    public void update(EventDto dto) {
        String sql = "UPDATE event SET title = ?, content = ?, start_date = ?, end_date = ?, updated_at = ? WHERE id = ?";
        jdbcTemplate.update(sql, dto.getTitle(), dto.getContent(), Date.valueOf(dto.getStartDate()), Date.valueOf(dto.getEndDate()), Timestamp.valueOf(dto.getUpdatedAt()), dto.getId());
    }

    public void delete(Long id) {
        String sql = "DELETE FROM event WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
} 