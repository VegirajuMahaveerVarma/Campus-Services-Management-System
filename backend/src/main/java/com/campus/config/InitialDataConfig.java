package com.campus.config;

import com.campus.entity.Event;
import com.campus.entity.Notification;
import com.campus.entity.Role;
import com.campus.entity.User;
import com.campus.repository.EventRepository;
import com.campus.repository.NotificationRepository;
import com.campus.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.List;

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

    @Bean
    CommandLineRunner seedResultNotifications(UserRepository users, NotificationRepository notifications) {
        return args -> {
            List<String[]> resultUpdates = List.of(
                    new String[]{"Results Released — 1st Year", "The 1st Year academic results have been released. Students can check their results through the college portal."},
                    new String[]{"Results Released — 2nd Year", "The 2nd Year academic results have been released. Students can check their results through the college portal."},
                    new String[]{"Results Released — 3rd & 4th Year", "The 3rd and 4th Year academic results have been released. Students can check their results through the college portal."}
            );

            users.findAll().stream()
                    .filter(user -> user.getRole() == Role.STUDENT && user.isEnabled())
                    .forEach(user -> {
                        List<Notification> existing = notifications.findByUserIdOrderByCreatedAtDesc(user.getId());
                        for (String[] update : resultUpdates) {
                            boolean alreadyExists = existing.stream()
                                    .anyMatch(n -> update[0].equalsIgnoreCase(n.getTitle()));
                            if (!alreadyExists) {
                                notifications.save(Notification.builder()
                                        .user(user)
                                        .title(update[0])
                                        .message(update[1])
                                        .type("RESULT")
                                        .read(false)
                                        .build());
                            }
                        }
                    });
        };
    }
}
