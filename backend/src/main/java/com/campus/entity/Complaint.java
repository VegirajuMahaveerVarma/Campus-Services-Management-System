package com.campus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name="complaints") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Complaint {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false) @JoinColumn(name="student_id") private Student student;
 @Column(nullable=false) private String title;
 @Column(nullable=false, columnDefinition="TEXT") private String description;
 private String category;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private ComplaintStatus status;
 @Column(nullable=false) private LocalDateTime createdAt;
 private LocalDateTime updatedAt;
 @PrePersist void prePersist(){ createdAt=LocalDateTime.now(); if(status==null) status=ComplaintStatus.OPEN; }
 @PreUpdate void preUpdate(){ updatedAt=LocalDateTime.now(); }
}
