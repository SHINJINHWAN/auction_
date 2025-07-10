package com.auction.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.auction.dto.NoticeDto;
import com.auction.service.NoticeService;

@RestController
@RequestMapping("/api/notice")
@CrossOrigin(origins = "*")
public class NoticeController {
    private final NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    // ===== 일반 사용자 API =====
    
    @GetMapping("/published")
    public List<NoticeDto> getPublishedNotices() {
        return noticeService.getPublishedNotices();
    }

    @GetMapping("/published/{id}")
    public NoticeDto getPublishedNotice(@PathVariable Long id) {
        return noticeService.getNoticeAndIncrementViews(id);
    }

    @GetMapping("/category/{category}")
    public List<NoticeDto> getNoticesByCategory(@PathVariable String category) {
        return noticeService.getNoticesByCategory(category);
    }

    // ===== 관리자 API =====
    
    @PostMapping("/admin")
    public ResponseEntity<String> createNotice(@RequestBody NoticeDto dto) {
        try {
            noticeService.createNotice(dto);
            return ResponseEntity.ok("공지사항이 성공적으로 생성되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("공지사항 생성에 실패했습니다: " + e.getMessage());
        }
    }

    @GetMapping("/admin")
    public List<NoticeDto> getAllNotices() {
        return noticeService.getAllNotices();
    }

    @GetMapping("/admin/{id}")
    public NoticeDto getNotice(@PathVariable Long id) {
        return noticeService.getNotice(id);
    }

    @PutMapping("/admin")
    public ResponseEntity<String> updateNotice(@RequestBody NoticeDto dto) {
        try {
            noticeService.updateNotice(dto);
            return ResponseEntity.ok("공지사항이 성공적으로 수정되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("공지사항 수정에 실패했습니다: " + e.getMessage());
        }
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<String> deleteNotice(@PathVariable Long id) {
        try {
            noticeService.deleteNotice(id);
            return ResponseEntity.ok("공지사항이 성공적으로 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("공지사항 삭제에 실패했습니다: " + e.getMessage());
        }
    }

    // ===== 관리자 검색 및 필터링 API =====
    
    @GetMapping("/admin/search")
    public List<NoticeDto> searchNotices(@RequestParam String title) {
        return noticeService.searchNoticesByTitle(title);
    }

    @GetMapping("/admin/status/{status}")
    public List<NoticeDto> getNoticesByStatus(@PathVariable String status) {
        return noticeService.getNoticesByStatus(status);
    }

    // ===== 관리자 상태 변경 API =====
    
    @PutMapping("/admin/{id}/publish")
    public ResponseEntity<String> publishNotice(@PathVariable Long id) {
        try {
            noticeService.publishNotice(id);
            return ResponseEntity.ok("공지사항이 발행되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("공지사항 발행에 실패했습니다: " + e.getMessage());
        }
    }

    @PutMapping("/admin/{id}/unpublish")
    public ResponseEntity<String> unpublishNotice(@PathVariable Long id) {
        try {
            noticeService.unpublishNotice(id);
            return ResponseEntity.ok("공지사항이 임시저장 상태로 변경되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("공지사항 상태 변경에 실패했습니다: " + e.getMessage());
        }
    }

    @PutMapping("/admin/{id}/toggle-important")
    public ResponseEntity<String> toggleImportant(@PathVariable Long id) {
        try {
            noticeService.toggleImportant(id);
            return ResponseEntity.ok("중요도가 변경되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("중요도 변경에 실패했습니다: " + e.getMessage());
        }
    }

    // ===== 관리자 통계 API =====
    
    @GetMapping("/admin/stats")
    public Map<String, Object> getNoticeStats() {
        return noticeService.getNoticeStats();
    }
} 