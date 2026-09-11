package com.campus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name="event_registrations", uniqueConstraints={
    @UniqueConstraint(name="uk_event_registration_email", columnNames={"event_id","email"}),
    @UniqueConstraint(name="uk_event_registration_roll", columnNames={"event_id","roll_number"})
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EventRegistration {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional=false, fetch=FetchType.LAZY)
    @JoinColumn(name="event_id", nullable=false)
    private Event event;

    @Column(nullable=false, length=120)
    private String fullName;

    @Column(nullable=false, length=120)
    private String email;

    @Column(nullable=false, length=20)
    private String phone;

    @Column(nullable=false, length=40)
    private String rollNumber;

    @Column(nullable=false)
    private LocalDateTime registeredAt;

    @PrePersist
    void prePersist(){ if(registeredAt==null) registeredAt=LocalDateTime.now(); }
}
