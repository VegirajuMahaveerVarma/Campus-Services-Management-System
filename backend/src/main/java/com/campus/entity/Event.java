package com.campus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name="events") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Event {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false) private String title;
 @Column(columnDefinition="TEXT") private String description;
 @Column(nullable=false) private LocalDateTime eventDate;
 private String venue;
 private String organizer;
}
