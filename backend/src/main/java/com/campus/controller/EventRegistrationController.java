package com.campus.controller;

import com.campus.dto.EventRegistrationDtos.CreateRequest;
import com.campus.entity.EventRegistration;
import com.campus.service.EventRegistrationService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventRegistrationController {
    private final EventRegistrationService service;

    public EventRegistrationController(EventRegistrationService service) { this.service = service; }

    @PostMapping("/{eventId}/registrations")
    public EventRegistration register(@PathVariable Long eventId, @Valid @RequestBody CreateRequest request) {
        return service.register(eventId, request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{eventId}/registrations")
    public List<EventRegistration> registrations(@PathVariable Long eventId) {
        return service.list(eventId);
    }
}
