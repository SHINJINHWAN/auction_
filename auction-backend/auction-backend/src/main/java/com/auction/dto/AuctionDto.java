package com.auction.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

public class AuctionDto {
    private Long id;
    private String title;
    private String category;
    private String status;
    private String brand;
    @JsonProperty("imageUrl1")
    private String image_url1;
    @JsonProperty("imageUrl2")
    private String image_url2;
    @JsonProperty("imageUrl3")
    private String image_url3;
    private String description;
    private int startPrice;
    private Integer buyNowPrice;   // 즉시구매가 (nullable)
    private int bidUnit;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startTime;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endTime;
    private int minBidCount;
    private boolean autoExtend;
    private String shippingFee;
    private String shippingType;
    private String location;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int highestBid; // ⭐️ 실시간 최고 입찰가
    private boolean isClosed;
    private String winner;

    // === 기본 생성자 ===
    public AuctionDto() {}

    // === 전체 필드 생성자 ===
    public AuctionDto(Long id, String title, String category, String status, String brand,
                      String image_url1, String image_url2, String image_url3, String description,
                      int startPrice, Integer buyNowPrice, int bidUnit,
                      LocalDateTime startTime, LocalDateTime endTime, int minBidCount,
                      boolean autoExtend, String shippingFee, String shippingType,
                      String location, LocalDateTime createdAt, LocalDateTime updatedAt,
                      int highestBid) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.status = status;
        this.brand = brand;
        this.image_url1 = image_url1;
        this.image_url2 = image_url2;
        this.image_url3 = image_url3;
        this.description = description;
        this.startPrice = startPrice;
        this.buyNowPrice = buyNowPrice;
        this.bidUnit = bidUnit;
        this.startTime = startTime;
        this.endTime = endTime;
        this.minBidCount = minBidCount;
        this.autoExtend = autoExtend;
        this.shippingFee = shippingFee;
        this.shippingType = shippingType;
        this.location = location;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.highestBid = highestBid;
    }

    // === Getter / Setter ===
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getImage_url1() { return image_url1; }
    public void setImage_url1(String image_url1) { this.image_url1 = image_url1; }

    public String getImage_url2() { return image_url2; }
    public void setImage_url2(String image_url2) { this.image_url2 = image_url2; }

    public String getImage_url3() { return image_url3; }
    public void setImage_url3(String image_url3) { this.image_url3 = image_url3; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getStartPrice() { return startPrice; }
    public void setStartPrice(int startPrice) { this.startPrice = startPrice; }

    public Integer getBuyNowPrice() { return buyNowPrice; }
    public void setBuyNowPrice(Integer buyNowPrice) { this.buyNowPrice = buyNowPrice; }

    public int getBidUnit() { return bidUnit; }
    public void setBidUnit(int bidUnit) { this.bidUnit = bidUnit; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public int getMinBidCount() { return minBidCount; }
    public void setMinBidCount(int minBidCount) { this.minBidCount = minBidCount; }

    public boolean isAutoExtend() { return autoExtend; }
    public void setAutoExtend(boolean autoExtend) { this.autoExtend = autoExtend; }

    public String getShippingFee() { return shippingFee; }
    public void setShippingFee(String shippingFee) { this.shippingFee = shippingFee; }

    public String getShippingType() { return shippingType; }
    public void setShippingType(String shippingType) { this.shippingType = shippingType; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public int getHighestBid() { return highestBid; }
    public void setHighestBid(int highestBid) { this.highestBid = highestBid; }

    public boolean isClosed() { return isClosed; }
    public void setClosed(boolean isClosed) { this.isClosed = isClosed; }
    public String getWinner() { return winner; }
    public void setWinner(String winner) { this.winner = winner; }

    // 경매 상태 계산 메서드
    public String getAuctionStatus() {
        if (isClosed) {
            return winner != null ? "낙찰완료" : "종료";
        }
        
        if (startTime == null || endTime == null) {
            return "상태미정";
        }
        
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        
        if (now.isBefore(startTime)) {
            return "진행예정";
        } else if (now.isAfter(endTime)) {
            return "마감";
        } else {
            return "진행중";
        }
    }
}
