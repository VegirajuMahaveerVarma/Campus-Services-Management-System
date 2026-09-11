package com.campus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name="notices") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Notice {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false) private String title;
 @Column(nullable=false, columnDefinition="TEXT") private String content;
 private String category;
 @Column(nullable=false) private LocalDateTime publishedAt;
 @Builder.Default
 private boolean active=true;
 @PrePersist void prePersist(){ if(publishedAt==null) publishedAt=LocalDateTime.now(); }
}
