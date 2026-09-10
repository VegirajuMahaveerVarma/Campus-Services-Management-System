package com.campus.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name="students") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Student {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @OneToOne(optional=false) @JoinColumn(name="user_id", unique=true) private User user;
 @Column(nullable=false) private String fullName;
 @Column(nullable=false, unique=true) private String rollNumber;
 private String department;
 private String year;
 private String phone;
}
