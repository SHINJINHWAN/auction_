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

import com.auction.dto.FAQDto;
import com.auction.service.FAQService;

@RestController
@RequestMapping("/api/faq")
@CrossOrigin(origins = "*")
public class FAQController {
    private final FAQService faqService;

    public FAQController(FAQService faqService) {
        this.faqService = faqService;
    }

    // ===== 일반 사용자 API =====
    
    @GetMapping("/published")
    public List<FAQDto> getPublishedFAQs() {
        return faqService.getPublishedFAQs();
    }

    @GetMapping("/published/{id}")
    public FAQDto getPublishedFAQ(@PathVariable Long id) {
        return faqService.getFAQAndIncrementViews(id);
    }

    @GetMapping("/category/{category}")
    public List<FAQDto> getFAQsByCategory(@PathVariable String category) {
        return faqService.getFAQsByCategory(category);
    }

    @GetMapping("/search")
    public List<FAQDto> searchFAQs(@RequestParam String term) {
        return faqService.searchFAQs(term);
    }

    // ===== 관리자 API =====
    
    @PostMapping("/admin")
    public ResponseEntity<String> createFAQ(@RequestBody FAQDto dto) {
        try {
            faqService.createFAQ(dto);
            return ResponseEntity.ok("FAQ가 성공적으로 생성되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("FAQ 생성에 실패했습니다: " + e.getMessage());
        }
    }

    @GetMapping("/admin")
    public List<FAQDto> getAllFAQs() {
        return faqService.getAllFAQs();
    }

    @GetMapping("/admin/{id}")
    public FAQDto getFAQ(@PathVariable Long id) {
        return faqService.getFAQ(id);
    }

    @PutMapping("/admin")
    public ResponseEntity<String> updateFAQ(@RequestBody FAQDto dto) {
        try {
            faqService.updateFAQ(dto);
            return ResponseEntity.ok("FAQ가 성공적으로 수정되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("FAQ 수정에 실패했습니다: " + e.getMessage());
        }
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<String> deleteFAQ(@PathVariable Long id) {
        try {
            faqService.deleteFAQ(id);
            return ResponseEntity.ok("FAQ가 성공적으로 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("FAQ 삭제에 실패했습니다: " + e.getMessage());
        }
    }

    // ===== 관리자 검색 및 필터링 API =====
    
    @GetMapping("/admin/search")
    public List<FAQDto> searchFAQsAdmin(@RequestParam String term) {
        return faqService.searchFAQs(term);
    }

    @GetMapping("/admin/search/question")
    public List<FAQDto> searchFAQsByQuestion(@RequestParam String question) {
        return faqService.searchFAQsByQuestion(question);
    }

    @GetMapping("/admin/search/answer")
    public List<FAQDto> searchFAQsByAnswer(@RequestParam String answer) {
        return faqService.searchFAQsByAnswer(answer);
    }

    @GetMapping("/admin/status/{status}")
    public List<FAQDto> getFAQsByStatus(@PathVariable String status) {
        return faqService.getFAQsByStatus(status);
    }

    // ===== 관리자 상태 변경 API =====
    
    @PutMapping("/admin/{id}/publish")
    public ResponseEntity<String> publishFAQ(@PathVariable Long id) {
        try {
            faqService.publishFAQ(id);
            return ResponseEntity.ok("FAQ가 발행되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("FAQ 발행에 실패했습니다: " + e.getMessage());
        }
    }

    @PutMapping("/admin/{id}/unpublish")
    public ResponseEntity<String> unpublishFAQ(@PathVariable Long id) {
        try {
            faqService.unpublishFAQ(id);
            return ResponseEntity.ok("FAQ가 임시저장 상태로 변경되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("FAQ 상태 변경에 실패했습니다: " + e.getMessage());
        }
    }

    @PutMapping("/admin/{id}/toggle-important")
    public ResponseEntity<String> toggleImportant(@PathVariable Long id) {
        try {
            faqService.toggleImportant(id);
            return ResponseEntity.ok("중요도가 변경되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("중요도 변경에 실패했습니다: " + e.getMessage());
        }
    }

    // ===== 관리자 통계 API =====
    
    @GetMapping("/admin/stats")
    public Map<String, Object> getFAQStats() {
        return faqService.getFAQStats();
    }
} 