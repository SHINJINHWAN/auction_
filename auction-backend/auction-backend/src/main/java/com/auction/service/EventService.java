package com.auction.service;

import com.auction.dto.EventDto;
import com.auction.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventService {
    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public void createEvent(EventDto dto) {
        dto.setCreatedAt(LocalDateTime.now());
        eventRepository.save(dto);
    }

    public List<EventDto> getAllEvents() {
        return eventRepository.findAll();
    }

    public EventDto getEvent(Long id) {
        return eventRepository.findById(id);
    }

    public void updateEvent(EventDto dto) {
        dto.setUpdatedAt(LocalDateTime.now());
        eventRepository.update(dto);
    }

    public void deleteEvent(Long id) {
        eventRepository.delete(id);
    }
} 