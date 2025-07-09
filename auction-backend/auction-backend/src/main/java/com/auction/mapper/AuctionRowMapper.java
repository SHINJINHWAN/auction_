package com.auction.mapper;

import com.auction.dto.AuctionDto;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.lang.NonNull;

import java.sql.ResultSet;
import java.sql.SQLException;

public class AuctionRowMapper implements RowMapper<AuctionDto> {

    @Override
    public AuctionDto mapRow(@NonNull ResultSet rs, int rowNum) throws SQLException {
        AuctionDto dto = new AuctionDto();
        dto.setId(rs.getLong("id"));
        dto.setTitle(rs.getString("title"));
        dto.setStartPrice(rs.getInt("start_price"));
        return dto;
    }
}
