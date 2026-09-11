package com.campus.config;

import com.campus.entity.Event;
import com.campus.repository.EventRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class InitialDataConfig {

    @Bean
    CommandLineRunner seedInitialEvent(EventRepository events) {
        return args -> {
            boolean exists = events.findAll().stream()
                    .anyMatch(event -> "AI & Emerging Technologies Workshop".equalsIgnoreCase(event.getTitle()));

            if (!exists) {
                events.save(Event.builder()
                        .title("AI & Emerging Technologies Workshop")
                        .description("A hands-on technical session covering practical AI tools, emerging technologies and project ideas for students.")
                        .eventDate(LocalDateTime.of(2026, 9, 20, 10, 0))
                        .venue("Seminar Hall")
                        .organizer("Technical Club")
                        .build());
            }
        };
    }
}
