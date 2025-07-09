package com.auction.controller;

import com.auction.dto.InquiryDto;
import com.auction.service.InquiryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inquiry")
public class InquiryController {
    private final InquiryService inquiryService;

    public InquiryController(InquiryService inquiryService) {
        this.inquiryService = inquiryService;
    }

    @PostMapping
    public void createInquiry(@RequestBody InquiryDto dto) {
        inquiryService.createInquiry(dto);
    }

    @GetMapping
    public List<InquiryDto> getAllInquiries() {
        return inquiryService.getAllInquiries();
    }

    @GetMapping("/user/{userId}")
    public List<InquiryDto> getUserInquiries(@PathVariable String userId) {
        return inquiryService.getUserInquiries(userId);
    }

    @GetMapping("/{id}")
    public InquiryDto getInquiry(@PathVariable Long id) {
        return inquiryService.getInquiry(id);
    }

    @PutMapping("/answer/{id}")
    public void answerInquiry(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String answer = body.get("answer");
        String status = body.get("status");
        inquiryService.answerInquiry(id, answer, status);
    }

    @DeleteMapping("/{id}")
    public void deleteInquiry(@PathVariable Long id) {
        inquiryService.deleteInquiry(id);
    }
} 