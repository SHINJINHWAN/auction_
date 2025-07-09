package com.auction.service;

import com.auction.dto.BidDto;
import com.auction.repository.BidRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BidServiceImpl implements BidService {

    private final BidRepository bidRepository;

    public BidServiceImpl(BidRepository bidRepository) {
        this.bidRepository = bidRepository;
    }

    @Override
    public void saveBid(BidDto bidDto) {
        bidRepository.save(bidDto);
    }

    @Override
    public List<BidDto> getBidsByAuctionId(Long auctionId) {
        return bidRepository.findByAuctionId(auctionId);
    }

}
