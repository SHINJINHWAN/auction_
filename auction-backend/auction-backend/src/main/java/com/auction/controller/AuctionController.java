package com.auction.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.auction.dto.AuctionDto;
import com.auction.service.AuctionService;

@RestController
@RequestMapping("/api/auctions")
@CrossOrigin(origins = "http://localhost:5173")
public class AuctionController {

    private final AuctionService auctionService;
    private final String uploadDir = "uploads"; // 상대 경로로 변경

    public AuctionController(AuctionService auctionService) {
        this.auctionService = auctionService;
    }

    @PostMapping
    public ResponseEntity<?> createAuction(
        @RequestParam("title") String title,
        @RequestParam("category") String category,
        @RequestParam("status") String status,
        @RequestParam(value = "brand", required = false) String brand,
        @RequestParam("description") String description,
        @RequestParam("startPrice") String startPrice,
        @RequestParam(value = "buyNowPrice", required = false) String buyNowPrice,
        @RequestParam("bidUnit") String bidUnit,
        @RequestParam("startTime") String startTime,
        @RequestParam("endTime") String endTime,
        @RequestParam("minBidCount") String minBidCount,
        @RequestParam("autoExtend") String autoExtend,
        @RequestParam("shippingFee") String shippingFee,
        @RequestParam("shippingType") String shippingType,
        @RequestParam("location") String location,
        @RequestParam("image1") MultipartFile image1, // 필수
        @RequestParam(value = "image2", required = false) MultipartFile image2,
        @RequestParam(value = "image3", required = false) MultipartFile image3
    ) {
        System.out.println("🚀 POST /api/auctions 요청 도착!");
        System.out.println("📋 요청 파라미터:");
        System.out.println("  - title: " + title);
        System.out.println("  - category: " + category);
        System.out.println("  - status: " + status);
        System.out.println("  - brand: " + brand);
        System.out.println("  - startPrice: " + startPrice);
        System.out.println("  - startTime: " + startTime);
        System.out.println("  - endTime: " + endTime);

        try {
            System.out.println("�� 요청 도착 - title: " + title);
            ensureUploadDirExists();

            AuctionDto dto = new AuctionDto();
            dto.setTitle(title);
            dto.setCategory(category);
            dto.setStatus(status);
            dto.setBrand(brand);
            dto.setDescription(description);
            dto.setStartPrice(Integer.parseInt(startPrice));
            dto.setBuyNowPrice(buyNowPrice != null && !buyNowPrice.isEmpty() ? Integer.parseInt(buyNowPrice) : null);
            dto.setBidUnit(Integer.parseInt(bidUnit));
            dto.setStartTime(parseDateTime(startTime));
            dto.setEndTime(parseDateTime(endTime));
            dto.setMinBidCount(Integer.parseInt(minBidCount));
            dto.setAutoExtend("1".equals(autoExtend));
            dto.setShippingFee(shippingFee);
            dto.setShippingType(shippingType);
            dto.setLocation(location);
            dto.setCreatedAt(java.time.LocalDateTime.now());
            dto.setUpdatedAt(java.time.LocalDateTime.now());
            dto.setHighestBid(Integer.parseInt(startPrice));

            // 이미지 파일 처리
            try {
                if (image1 != null && !image1.isEmpty() && image1.getSize() > 0) {
                    String image1Path = saveFile(image1);
                    dto.setImage_url1(image1Path);
                }
                if (image2 != null && !image2.isEmpty() && image2.getSize() > 0) {
                    String image2Path = saveFile(image2);
                    dto.setImage_url2(image2Path);
                }
                if (image3 != null && !image3.isEmpty() && image3.getSize() > 0) {
                    String image3Path = saveFile(image3);
                    dto.setImage_url3(image3Path);
                }
            } catch (Exception e) {
                System.err.println("❌ 이미지 파일 처리 실패: " + e.getMessage());
            }

            auctionService.saveAuction(dto);
            System.out.println("✅ 등록 성공");
            return ResponseEntity.ok("등록 완료");
        } catch (Exception e) {
            System.err.println("❌ 등록 실패: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("등록 실패: " + e.getMessage());
        }
    }

    private void ensureUploadDirExists() throws IOException {
        Path path = Paths.get(uploadDir);
        if (Files.notExists(path)) {
            try {
                Files.createDirectories(path);
                System.out.println("📂 업로드 디렉토리 생성: " + path.toAbsolutePath());
            } catch (IOException e) {
                System.err.println("❌ 업로드 디렉토리 생성 실패: " + e.getMessage());
                throw new IOException("업로드 경로 생성 실패: " + e.getMessage(), e);
            }
        } else {
            System.out.println("📂 업로드 디렉토리 확인됨: " + path.toAbsolutePath());
        }
    }

    private String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            System.out.println("⚠️ 파일이 비어 있음 또는 null");
            return null;
        }

        try {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = Paths.get(uploadDir, filename);

            System.out.println("🔄 파일 저장 경로: " + path.toAbsolutePath());
            Files.write(path, file.getBytes());
            return "/uploads/" + filename;

        } catch (IOException e) {
            System.err.println("❌ 파일 저장 실패: " + e.getMessage());
            throw new IOException("파일 저장 실패: " + e.getMessage(), e);
        }
    }

    private LocalDateTime parseDateTime(String value) {
        try {
            if (value == null || value.isBlank()) return null;
            String replaced = value.trim().replace(" ", "T");
            if (replaced.length() == 16) replaced += ":00";
            return LocalDateTime.parse(replaced);
        } catch (Exception e) {
            System.err.println("❌ 날짜 변환 실패: " + value + " → " + e.getMessage());
            return null;
        }
    }

    private Integer parseIntSafe(String value, Integer defaultValue) {
        try {
            return (value != null && !value.isBlank()) ? Integer.parseInt(value) : defaultValue;
        } catch (NumberFormatException e) {
            System.err.println("❌ 숫자 변환 실패: " + value + " → " + e.getMessage());
            return defaultValue;
        }
    }

    @GetMapping
    public List<AuctionDto> getAll() {
        return auctionService.getAllAuctions();
    }

    @GetMapping("/{id}")
    public AuctionDto getOne(@PathVariable Long id) {
        return auctionService.getAuctionById(id);
    }
}
