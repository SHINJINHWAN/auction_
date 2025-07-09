package com.auction.service;

import com.auction.dto.NoticeDto;
import com.auction.repository.NoticeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NoticeService {
    private final NoticeRepository noticeRepository;

    public NoticeService(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    public void createNotice(NoticeDto dto) {
        dto.setCreatedAt(LocalDateTime.now());
        noticeRepository.save(dto);
    }

    public List<NoticeDto> getAllNotices() {
        return noticeRepository.findAll();
    }

    public NoticeDto getNotice(Long id) {
        return noticeRepository.findById(id);
    }

    public void updateNotice(NoticeDto dto) {
        dto.setUpdatedAt(LocalDateTime.now());
        noticeRepository.update(dto);
    }

    public void deleteNotice(Long id) {
        noticeRepository.delete(id);
    }
} 