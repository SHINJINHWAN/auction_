-- 경매 데이터베이스 스키마
-- MariaDB용 테이블 생성 스크립트

-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS auctiondb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE auctiondb;

-- 경매 테이블
CREATE TABLE IF NOT EXISTS auction (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    brand VARCHAR(100),
    image_url1 VARCHAR(500),
    image_url2 VARCHAR(500),
    image_url3 VARCHAR(500),
    description TEXT,
    start_price INT NOT NULL,
    buy_now_price INT,
    bid_unit INT NOT NULL DEFAULT 1000,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    min_bid_count INT NOT NULL DEFAULT 1,
    auto_extend BOOLEAN NOT NULL DEFAULT FALSE,
    shipping_fee VARCHAR(100),
    shipping_type VARCHAR(50),
    location VARCHAR(200),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    highest_bid INT NOT NULL DEFAULT 0,
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_end_time (end_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 입찰 테이블
CREATE TABLE IF NOT EXISTS bids (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    auction_id BIGINT NOT NULL,
    bidder VARCHAR(100) NOT NULL,
    bid_amount INT NOT NULL,
    bid_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (auction_id) REFERENCES auction(id) ON DELETE CASCADE,
    INDEX idx_auction_id (auction_id),
    INDEX idx_bid_time (bid_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 테이블 생성 확인
SHOW TABLES;
DESCRIBE auction;
DESCRIBE bids; 