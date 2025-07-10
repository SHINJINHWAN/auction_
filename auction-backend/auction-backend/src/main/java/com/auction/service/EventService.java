package com.auction.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.auction.dto.EventDto;
import com.auction.repository.EventRepository;

@Service
public class EventService {
    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public void createEvent(EventDto dto) {
        dto.setCreatedAt(LocalDateTime.now());
        dto.setViews(0); // 초기 조회수 0으로 설정
        if (dto.getStatus() == null) {
            dto.setStatus("draft"); // 기본값은 임시저장
        }
        if (dto.getAuthor() == null) {
            dto.setAuthor("관리자"); // 기본 작성자
        }
        eventRepository.save(dto);
    }

    public List<EventDto> getAllEvents() {
        return eventRepository.findAll();
    }

    public List<EventDto> getPublishedEvents() {
        return eventRepository.findPublishedEvents();
    }

    public List<EventDto> getOngoingEvents() {
        return eventRepository.findOngoingEvents();
    }

    public List<EventDto> getUpcomingEvents() {
        return eventRepository.findUpcomingEvents();
    }

    public List<EventDto> getEndedEvents() {
        return eventRepository.findEndedEvents();
    }

    public List<EventDto> getEventsByCategory(String category) {
        return eventRepository.findByCategory(category);
    }

    public List<EventDto> getEventsByStatus(String status) {
        return eventRepository.findByStatus(status);
    }

    public List<EventDto> searchEventsByTitle(String searchTerm) {
        return eventRepository.findByTitleContaining(searchTerm);
    }

    public EventDto getEvent(Long id) {
        return eventRepository.findById(id);
    }

    public EventDto getEventAndIncrementViews(Long id) {
        EventDto event = eventRepository.findById(id);
        if (event != null) {
            eventRepository.incrementViews(id);
            event.setViews(event.getViews() + 1);
        }
        return event;
    }

    public void updateEvent(EventDto dto) {
        dto.setUpdatedAt(LocalDateTime.now());
        eventRepository.update(dto);
    }

    public void deleteEvent(Long id) {
        eventRepository.delete(id);
    }

    public void publishEvent(Long id) {
        EventDto event = eventRepository.findById(id);
        if (event != null) {
            event.setStatus("published");
            event.setUpdatedAt(LocalDateTime.now());
            eventRepository.update(event);
        }
    }

    public void unpublishEvent(Long id) {
        EventDto event = eventRepository.findById(id);
        if (event != null) {
            event.setStatus("draft");
            event.setUpdatedAt(LocalDateTime.now());
            eventRepository.update(event);
        }
    }

    public void toggleImportant(Long id) {
        EventDto event = eventRepository.findById(id);
        if (event != null) {
            event.setImportant(!event.isImportant());
            event.setUpdatedAt(LocalDateTime.now());
            eventRepository.update(event);
        }
    }

    // 이벤트 상태 자동 업데이트 (매일 실행되는 스케줄러용)
    public void updateEventStatuses() {
        LocalDate today = LocalDate.now();
        List<EventDto> allEvents = eventRepository.findAll();
        
        for (EventDto event : allEvents) {
            if ("published".equals(event.getStatus())) {
                if (event.getStartDate().isAfter(today)) {
                    // 아직 시작되지 않은 이벤트
                    continue;
                } else if (event.getEndDate().isBefore(today)) {
                    // 종료된 이벤트
                    event.setStatus("ended");
                    event.setUpdatedAt(LocalDateTime.now());
                    eventRepository.update(event);
                } else {
                    // 진행 중인 이벤트
                    if (!"ongoing".equals(event.getStatus())) {
                        event.setStatus("ongoing");
                        event.setUpdatedAt(LocalDateTime.now());
                        eventRepository.update(event);
                    }
                }
            }
        }
    }

    // 통계 정보 반환
    public Map<String, Object> getEventStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalEvents", eventRepository.findAll().size());
        stats.put("publishedEvents", eventRepository.countByStatus("published"));
        stats.put("draftEvents", eventRepository.countByStatus("draft"));
        stats.put("ongoingEvents", eventRepository.countOngoingEvents());
        stats.put("endedEvents", eventRepository.countByStatus("ended"));
        stats.put("importantEvents", eventRepository.countImportantEvents());
        stats.put("totalViews", eventRepository.getTotalViews());
        
        // 카테고리별 통계
        Map<String, Long> categoryStats = new HashMap<>();
        categoryStats.put("auction", eventRepository.countByCategory("auction"));
        categoryStats.put("promotion", eventRepository.countByCategory("promotion"));
        categoryStats.put("holiday", eventRepository.countByCategory("holiday"));
        categoryStats.put("maintenance", eventRepository.countByCategory("maintenance"));
        categoryStats.put("special", eventRepository.countByCategory("special"));
        stats.put("categoryStats", categoryStats);
        
        return stats;
    }
} 