package com.auction.controller;

import com.auction.dto.AuctionDto;
import com.auction.dto.BidDto;
import com.auction.service.AuctionService;
import com.auction.service.BidService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bids")
@CrossOrigin(origins = "http://localhost:5173")
public class BidController {
    private final BidService bidService;
    private final AuctionService auctionService;

    public BidController(BidService bidService, AuctionService auctionService) {
        this.bidService = bidService;
        this.auctionService = auctionService;
    }

    @PostMapping
    public ResponseEntity<?> placeBid(@RequestBody BidDto bid) {
        try {
            // 경매 정보 조회
            AuctionDto auction = auctionService.getAuctionById(bid.getAuctionId());
            if (auction == null) {
                return ResponseEntity.badRequest().body("경매를 찾을 수 없습니다.");
            }

            // 경매 종료 체크
            auctionService.checkAndCloseAuction(auction);
            if (auction.isClosed()) {
                return ResponseEntity.badRequest().body("이미 종료된 경매입니다.");
            }

            // 입찰가 유효성 검사
            int currentHighest = Math.max(auction.getStartPrice(), auction.getHighestBid());
            if (bid.getBidAmount() <= currentHighest) {
                return ResponseEntity.badRequest().body("입찰가는 현재 최고가보다 높아야 합니다.");
            }

            // 입찰 단위 검사
            if (bid.getBidAmount() % auction.getBidUnit() != 0) {
                return ResponseEntity.badRequest().body("입찰가는 입찰단위의 배수여야 합니다.");
            }

            bid.setBidTime(LocalDateTime.now());
            bidService.saveBid(bid);
            
            return ResponseEntity.ok("입찰이 성공적으로 등록되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("입찰 처리 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @GetMapping("/{auctionId}")
    public ResponseEntity<List<BidDto>> getBids(@PathVariable Long auctionId) {
        try {
            List<BidDto> bids = bidService.getBidsByAuctionId(auctionId);
            return ResponseEntity.ok(bids);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
