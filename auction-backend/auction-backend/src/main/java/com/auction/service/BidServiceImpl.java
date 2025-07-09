package com.auction.service;

import com.auction.dto.AuctionDto;
import com.auction.dto.BidDto;
import com.auction.repository.AuctionRepository;
import com.auction.repository.BidRepository;
import com.auction.service.AutoBidService;
import com.auction.dto.AutoBidDto;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BidServiceImpl implements BidService {
    private final BidRepository bidRepository;
    private final AuctionRepository auctionRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationService;
    private final AutoBidService autoBidService;

    public BidServiceImpl(BidRepository bidRepository, AuctionRepository auctionRepository, 
                         SimpMessagingTemplate messagingTemplate, NotificationService notificationService,
                         AutoBidService autoBidService) {
        this.bidRepository = bidRepository;
        this.auctionRepository = auctionRepository;
        this.messagingTemplate = messagingTemplate;
        this.notificationService = notificationService;
        this.autoBidService = autoBidService;
    }

    @Override
    public void saveBid(BidDto bid) {
        // 입찰 저장
        bidRepository.save(bid);
        
        // 경매 정보 업데이트 (최고가 갱신)
        AuctionDto auction = auctionRepository.findById(bid.getAuctionId());
        if (auction != null) {
            int highestBid = bidRepository.findHighestBidByAuctionId(bid.getAuctionId());
            auction.setHighestBid(Math.max(highestBid, auction.getStartPrice()));
            auctionRepository.updateHighestBid(bid.getAuctionId(), auction.getHighestBid());
            
            // WebSocket으로 실시간 업데이트 전송
            messagingTemplate.convertAndSend("/topic/auction-updates", auction);
            
            // 입찰 알림 전송 (경매 등록자에게)
            notificationService.sendBidNotification(
                bid.getAuctionId(), 
                auction.getTitle(), 
                bid.getBidder(), 
                bid.getBidAmount()
            );
            // 자동입찰 실행
            List<AutoBidDto> autoBidders = autoBidService.getAutoBidders(bid.getAuctionId());
            boolean autoBidOccurred = true;
            int currentPrice = auction.getHighestBid();
            int bidUnit = auction.getBidUnit();
            int maxLoop = 10; // 무한루프 방지
            while (autoBidOccurred && maxLoop-- > 0) {
                autoBidOccurred = false;
                for (AutoBidDto autoBidder : autoBidders) {
                    if (autoBidder.getUserId().equals(bid.getBidder())) continue; // 방금 입찰자는 제외
                    if (autoBidder.getMaxAmount() >= currentPrice + bidUnit) {
                        // 자동입찰 실행
                        BidDto autoBid = new BidDto();
                        autoBid.setAuctionId(bid.getAuctionId());
                        autoBid.setBidder(autoBidder.getUserId());
                        autoBid.setBidAmount(currentPrice + bidUnit);
                        bidRepository.save(autoBid);
                        currentPrice += bidUnit;
                        auction.setHighestBid(currentPrice);
                        auctionRepository.updateHighestBid(bid.getAuctionId(), currentPrice);
                        messagingTemplate.convertAndSend("/topic/auction-updates", auction);
                        notificationService.sendBidNotification(
                            bid.getAuctionId(),
                            auction.getTitle(),
                            autoBidder.getUserId(),
                            autoBid.getBidAmount()
                        );
                        autoBidOccurred = true;
                        break; // 한 번에 한 명만 자동입찰, 다시 루프
                    }
                }
            }
        }
    }

    @Override
    public List<BidDto> getBidsByAuctionId(Long auctionId) {
        return bidRepository.findByAuctionId(auctionId);
    }
}
