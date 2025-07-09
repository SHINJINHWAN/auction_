package com.auction.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/uploads")
@CrossOrigin(origins = "http://localhost:5173")
public class UploadController {

    private final Path uploadDir = Paths.get("uploads"); // 상대 경로로 변경

    @PostMapping("/image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("파일이 반드시 필요합니다.");
        }

        try {
            // 폴더 없으면 생성
            if (Files.notExists(uploadDir)) {
                Files.createDirectories(uploadDir);
                System.out.println("📂 업로드 디렉토리 생성: " + uploadDir.toAbsolutePath());
            }

            // UUID 붙여서 파일명 생성
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filepath = uploadDir.resolve(filename);

            System.out.println("🔄 파일 저장 경로: " + filepath.toAbsolutePath());
            // 저장
            Files.write(filepath, file.getBytes());

            // 프론트에서 접근 가능한 URL 반환
            String fileUrl = "/uploads/" + filename;

            return ResponseEntity.ok(fileUrl);

        } catch (IOException e) {
            System.err.println("❌ 업로드 실패: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("업로드 실패: " + e.getMessage());
        }
    }
}
