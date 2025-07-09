package com.auction.service;

import com.auction.dto.AuctionDto;
import com.auction.repository.AuctionRepository;
import com.auction.repository.BidRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuctionService {

    private final AuctionRepository auctionRepository;
    private final BidRepository bidRepository;

    public AuctionService(AuctionRepository auctionRepository, BidRepository bidRepository) {
        this.auctionRepository = auctionRepository;
        this.bidRepository = bidRepository;
    }

    /**
     * 경매 등록
     */
    public void saveAuction(AuctionDto dto) {
        auctionRepository.save(dto);
    }

    /**
     * 경매 상세 조회 (입찰 최고가 포함)
     */
    public AuctionDto getAuctionById(Long id) {
        AuctionDto dto = auctionRepository.findById(id);
        if (dto == null) return null;

        int highestBid = bidRepository.findHighestBidByAuctionId(id);
        dto.setHighestBid(Math.max(highestBid, dto.getStartPrice()));
        return dto;
    }

    /**
     * 전체 경매 목록 조회 (각 최고가 포함)
     */
    public List<AuctionDto> getAllAuctions() {
        List<AuctionDto> list = auctionRepository.findAll();
        for (AuctionDto dto : list) {
            int highestBid = bidRepository.findHighestBidByAuctionId(dto.getId());
            dto.setHighestBid(Math.max(highestBid, dto.getStartPrice()));
        }
        return list;
    }

    // ✅ 향후 필요 시: updateAuction, deleteAuction 등 확장 가능
}
