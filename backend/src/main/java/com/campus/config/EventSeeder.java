package com.campus.config;

import com.campus.entity.Event;
import com.campus.repository.EventRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.time.LocalDateTime;

@Configuration
public class EventSeeder {
    @Bean
    CommandLineRunner seedTechnicalEvent(EventRepository events) {
        return args -> {
            if (events.findByTitle("CodeSprint Mini Challenge").isEmpty()) {
                events.save(Event.builder()
                    .title("CodeSprint Mini Challenge")
                    .description("A short technical coding challenge for students. Test your problem-solving skills and compete with your peers.")
                    .eventDate(LocalDateTime.of(2026, 9, 25, 10, 0))
                    .venue("Computer Lab 1")
                    .organizer("Technical Club")
                    .build());
            }
        };
    }
}
