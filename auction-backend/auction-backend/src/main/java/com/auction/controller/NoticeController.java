package com.auction.controller;

import com.auction.dto.NoticeDto;
import com.auction.service.NoticeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notice")
public class NoticeController {
    private final NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @PostMapping
    public void createNotice(@RequestBody NoticeDto dto) {
        noticeService.createNotice(dto);
    }

    @GetMapping
    public List<NoticeDto> getAllNotices() {
        return noticeService.getAllNotices();
    }

    @GetMapping("/{id}")
    public NoticeDto getNotice(@PathVariable Long id) {
        return noticeService.getNotice(id);
    }

    @PutMapping
    public void updateNotice(@RequestBody NoticeDto dto) {
        noticeService.updateNotice(dto);
    }

    @DeleteMapping("/{id}")
    public void deleteNotice(@PathVariable Long id) {
        noticeService.deleteNotice(id);
    }
} 