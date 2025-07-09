package com.auction.service;

import com.auction.dto.FAQDto;
import com.auction.repository.FAQRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FAQService {
    private final FAQRepository faqRepository;

    public FAQService(FAQRepository faqRepository) {
        this.faqRepository = faqRepository;
    }

    public void createFAQ(FAQDto dto) {
        dto.setCreatedAt(LocalDateTime.now());
        faqRepository.save(dto);
    }

    public List<FAQDto> getAllFAQs() {
        return faqRepository.findAll();
    }

    public FAQDto getFAQ(Long id) {
        return faqRepository.findById(id);
    }

    public void updateFAQ(FAQDto dto) {
        dto.setUpdatedAt(LocalDateTime.now());
        faqRepository.update(dto);
    }

    public void deleteFAQ(Long id) {
        faqRepository.delete(id);
    }
} 