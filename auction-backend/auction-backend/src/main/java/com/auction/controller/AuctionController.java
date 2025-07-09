package com.auction.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auction.dto.AuctionDto;
import com.auction.service.AuctionService;

@RestController
@RequestMapping("/api/auctions")
@CrossOrigin(origins = "http://localhost:5173")
public class AuctionController {

    private final AuctionService auctionService;
    private final com.auction.repository.AuctionRepository auctionRepository;
    private final com.auction.service.NotificationService notificationService;

    public AuctionController(AuctionService auctionService, com.auction.repository.AuctionRepository auctionRepository, 
                           com.auction.service.NotificationService notificationService) {
        this.auctionService = auctionService;
        this.auctionRepository = auctionRepository;
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<?> createAuction(@RequestBody AuctionDto dto) {
        System.out.println("🚀 POST /api/auctions 요청 도착!");
        try {
            dto.setCreatedAt(java.time.LocalDateTime.now());
            dto.setUpdatedAt(java.time.LocalDateTime.now());
            dto.setHighestBid(dto.getStartPrice());
            auctionService.saveAuction(dto);
            System.out.println("✅ 등록 성공");
            return ResponseEntity.ok("등록 완료");
        } catch (Exception e) {
            System.err.println("❌ 등록 실패: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("등록 실패: " + e.getMessage());
        }
    }



    @GetMapping
    public List<AuctionDto> getAll() {
        return auctionService.getAllAuctions();
    }

    @GetMapping("/{id}")
    public AuctionDto getOne(@PathVariable Long id) {
        AuctionDto auction = auctionService.getAuctionById(id);
        auctionService.checkAndCloseAuction(auction);
        return auction;
    }

    @PostMapping("/{id}/buy-now")
    public ResponseEntity<?> buyNow(@PathVariable Long id, @RequestBody BuyNowRequest request) {
        try {
            AuctionDto auction = auctionService.getAuctionById(id);
            if (auction == null) {
                return ResponseEntity.badRequest().body("경매를 찾을 수 없습니다.");
            }

            if (auction.isClosed()) {
                return ResponseEntity.badRequest().body("이미 종료된 경매입니다.");
            }

            if (auction.getBuyNowPrice() == null) {
                return ResponseEntity.badRequest().body("즉시구매가가 설정되지 않은 경매입니다.");
            }

            // 즉시구매 처리
            auction.setClosed(true);
            auction.setWinner(request.getBuyer());
            auctionRepository.updateClosedAndWinner(auction.getId(), true, request.getBuyer());
            
            // 즉시구매 알림 전송
            notificationService.sendBuyNowNotification(
                auction.getId(), 
                auction.getTitle(), 
                request.getBuyer()
            );
            
            return ResponseEntity.ok("즉시구매가 완료되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("즉시구매 처리 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 즉시구매 요청 DTO
    public static class BuyNowRequest {
        private String buyer;
        
        public String getBuyer() { return buyer; }
        public void setBuyer(String buyer) { this.buyer = buyer; }
    }
}
