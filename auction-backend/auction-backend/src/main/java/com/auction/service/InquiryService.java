package com.auction.service;

import com.auction.dto.InquiryDto;
import com.auction.repository.InquiryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import com.auction.service.NotificationService;
import com.auction.service.PrivateMessageService;
import com.auction.dto.NotificationDto;

@Service
public class InquiryService {
    private final InquiryRepository inquiryRepository;
    private final NotificationService notificationService;
    private final PrivateMessageService privateMessageService;

    public InquiryService(InquiryRepository inquiryRepository, NotificationService notificationService, PrivateMessageService privateMessageService) {
        this.inquiryRepository = inquiryRepository;
        this.notificationService = notificationService;
        this.privateMessageService = privateMessageService;
    }

    public void createInquiry(InquiryDto dto) {
        dto.setCreatedAt(LocalDateTime.now());
        inquiryRepository.save(dto);
    }

    public List<InquiryDto> getAllInquiries() {
        return inquiryRepository.findAll();
    }

    public List<InquiryDto> getUserInquiries(String userId) {
        return inquiryRepository.findByUserId(userId);
    }

    public InquiryDto getInquiry(Long id) {
        return inquiryRepository.findById(id);
    }

    public void answerInquiry(Long id, String answer, String status) {
        inquiryRepository.updateAnswerAndStatus(id, answer, status);
        // 답변 등록 후 알림/쪽지 발송
        InquiryDto inquiry = inquiryRepository.findById(id);
        if (inquiry != null && inquiry.getUserId() != null) {
            // 1. 실시간 알림
            NotificationDto notification = new NotificationDto(
                null, // auctionId 없음
                "1:1문의 답변",
                inquiry.getUserId(),
                "INQUIRY_ANSWER",
                String.format("'%s' 문의에 답변이 등록되었습니다.", inquiry.getTitle())
            );
            notificationService.saveAndNotify(notification);
            // 2. 쪽지
            privateMessageService.sendMessage(
                null, // auctionId 없음
                "admin", // 관리자 ID(고정)
                "관리자",
                inquiry.getUserId(),
                "문의자",
                "1:1문의 답변",
                String.format("문의 제목: %s\n\n답변: %s", inquiry.getTitle(), answer)
            );
        }
    }

    public void deleteInquiry(Long id) {
        inquiryRepository.delete(id);
    }
} 