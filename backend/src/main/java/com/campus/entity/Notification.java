package com.campus.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name="notifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(optional=false, fetch=FetchType.LAZY)
    @JoinColumn(name="user_id", nullable=false)
    private User user;

    @Column(nullable=false, length=120)
    private String title;

    @Column(nullable=false, columnDefinition="TEXT")
    private String message;

    @Column(nullable=false, length=30)
    private String type;

    @Builder.Default
    @Column(nullable=false)
    private boolean read=false;

    @Column(nullable=false)
    private LocalDateTime createdAt;

    @PrePersist
    void prePersist(){
        if(createdAt==null) createdAt=LocalDateTime.now();
    }
}
