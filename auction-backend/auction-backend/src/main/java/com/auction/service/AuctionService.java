package com.auction.service;

import com.auction.dto.AuctionDto;
import com.auction.repository.AuctionRepository;
import com.auction.repository.BidRepository;
import org.springframework.stereotype.Service;

import java.util.List;

public interface AuctionService {
    AuctionDto createAuction(AuctionDto auctionDto);
    List<AuctionDto> getAllAuctions();
    AuctionDto getAuctionById(Long id);
    AuctionDto updateAuction(Long id, AuctionDto auctionDto);
    void deleteAuction(Long id);
    AuctionDto checkAndCloseAuction(AuctionDto auctionDto);
    List<AuctionDto> getRandomAuctions(int count);
}
