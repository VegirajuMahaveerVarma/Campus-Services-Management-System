package com.campus.service;

import com.campus.dto.EventRegistrationDtos.CreateRequest;
import com.campus.entity.Event;
import com.campus.entity.EventRegistration;
import com.campus.repository.EventRegistrationRepository;
import com.campus.repository.EventRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class EventRegistrationService {
    private final EventRegistrationRepository registrations;
    private final EventRepository events;

    public EventRegistrationService(EventRegistrationRepository registrations, EventRepository events) {
        this.registrations = registrations;
        this.events = events;
    }

    public EventRegistration register(Long eventId, CreateRequest request) {
        Event event = events.findById(eventId)
            .orElseThrow(() -> new NoSuchElementException("Event not found"));
        String email = request.email().trim().toLowerCase();
        String roll = request.rollNumber().trim().toUpperCase();
        if (registrations.existsByEventIdAndEmail(eventId, email) || registrations.existsByEventIdAndRollNumber(eventId, roll)) {
            throw new IllegalArgumentException("You are already registered for this event");
        }
        return registrations.save(EventRegistration.builder()
            .event(event)
            .fullName(request.fullName().trim())
            .email(email)
            .phone(request.phone().trim())
            .rollNumber(roll)
            .build());
    }

    public List<EventRegistration> list(Long eventId) {
        if (!events.existsById(eventId)) throw new NoSuchElementException("Event not found");
        return registrations.findByEventIdOrderByRegisteredAtDesc(eventId);
    }
}
