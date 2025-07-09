package com.auction.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auction.dto.AuctionDto;
import com.auction.dto.BidDto;
import com.auction.repository.AuctionRepository;
import com.auction.service.BidService;

@RestController
@RequestMapping("/api/bids")
@CrossOrigin(origins = "http://localhost:5173")
public class BidController {

    private final BidService bidService;
    private final AuctionRepository auctionRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public BidController(BidService bidService,
            AuctionRepository auctionRepository,
            SimpMessagingTemplate messagingTemplate) {
        this.bidService = bidService;
        this.auctionRepository = auctionRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @PostMapping
    public ResponseEntity<String> placeBid(@RequestBody BidDto bid) {
        try {
            if (bid.getBidTime() == null) {
                bid.setBidTime(LocalDateTime.now());
            }

            bidService.saveBid(bid);

            int highestBid = bidService.getBidsByAuctionId(bid.getAuctionId())
                    .stream()
                    .mapToInt(BidDto::getBidAmount)
                    .max()
                    .orElse(bid.getBidAmount());

            AuctionDto updated = auctionRepository.findById(bid.getAuctionId());
            updated.setHighestBid(highestBid);

            messagingTemplate.convertAndSend("/topic/auction-updates", updated);

            return ResponseEntity.ok("입찰 성공");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("입찰 저장 실패: " + e.getMessage());
        }
    }

    @GetMapping("/{auctionId}")
    public List<BidDto> getBids(@PathVariable Long auctionId) {
        return bidService.getBidsByAuctionId(auctionId);
    }
}
