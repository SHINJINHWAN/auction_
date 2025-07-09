// com.auction.service.BidService.java
package com.auction.service;

import com.auction.dto.BidDto;

import java.util.List;

public interface BidService {
    void saveBid(BidDto bid);

    List<BidDto> getBidsByAuctionId(Long auctionId);
}
