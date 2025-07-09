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
    private final NotificationService notificationService;

    public AuctionService(AuctionRepository auctionRepository, BidRepository bidRepository, NotificationService notificationService) {
        this.auctionRepository = auctionRepository;
        this.bidRepository = bidRepository;
        this.notificationService = notificationService;
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

    /**
     * 경매 종료 체크 및 자동 종료 처리
     */
    public void checkAndCloseAuction(AuctionDto auction) {
        if (auction != null && !auction.isClosed() && java.time.LocalDateTime.now().isAfter(auction.getEndTime())) {
            // 최고가 입찰자 조회
            java.util.List<com.auction.dto.BidDto> bids = bidRepository.findByAuctionId(auction.getId());
            if (!bids.isEmpty()) {
                com.auction.dto.BidDto highest = bids.get(0); // 이미 최고가순 정렬
                auction.setWinner(highest.getBidder());
            }
            auction.setClosed(true);
            auctionRepository.updateClosedAndWinner(auction.getId(), true, auction.getWinner());
            
            // 경매 마감 알림 전송 (모든 입찰자에게)
            notificationService.sendAuctionEndNotification(
                auction.getId(), 
                auction.getTitle(), 
                auction.getWinner()
            );
        }
    }

    // ✅ 향후 필요 시: updateAuction, deleteAuction 등 확장 가능
}
