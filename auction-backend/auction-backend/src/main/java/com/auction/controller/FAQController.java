package com.auction.controller;

import com.auction.dto.FAQDto;
import com.auction.service.FAQService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faq")
public class FAQController {
    private final FAQService faqService;

    public FAQController(FAQService faqService) {
        this.faqService = faqService;
    }

    @PostMapping
    public void createFAQ(@RequestBody FAQDto dto) {
        faqService.createFAQ(dto);
    }

    @GetMapping
    public List<FAQDto> getAllFAQs() {
        return faqService.getAllFAQs();
    }

    @GetMapping("/{id}")
    public FAQDto getFAQ(@PathVariable Long id) {
        return faqService.getFAQ(id);
    }

    @PutMapping
    public void updateFAQ(@RequestBody FAQDto dto) {
        faqService.updateFAQ(dto);
    }

    @DeleteMapping("/{id}")
    public void deleteFAQ(@PathVariable Long id) {
        faqService.deleteFAQ(id);
    }
} 