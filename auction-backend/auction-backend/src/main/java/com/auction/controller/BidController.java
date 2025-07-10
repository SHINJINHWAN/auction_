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
import com.auction.dto.BidDto;
import com.auction.service.AuctionService;
import com.auction.service.BidService;

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

            // 입찰 단위 검사 (프론트와 동일하게 구간별 적용)
            int step;
            if (bid.getBidAmount() < 10000) step = 1000;
            else if (bid.getBidAmount() < 100000) step = 5000;
            else step = 10000;
            if (bid.getBidAmount() % step != 0) {
                return ResponseEntity.badRequest().body("입찰가는 " + String.format("%,d", step) + "원 단위로만 가능합니다.");
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
