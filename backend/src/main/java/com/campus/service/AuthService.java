package com.campus.service;

import com.campus.dto.AuthDtos.*; import com.campus.entity.*; import com.campus.repository.*; import com.campus.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;

@Service public class AuthService {
 private final UserRepository users; private final StudentRepository students; private final PasswordEncoder encoder; private final JwtService jwt;
 public AuthService(UserRepository u,StudentRepository s,PasswordEncoder e,JwtService j){users=u;students=s;encoder=e;jwt=j;}
 @Transactional public AuthResponse register(RegisterRequest r){if(users.findByEmail(r.email()).isPresent())throw new IllegalArgumentException("Email already registered");if(students.findByRollNumber(r.rollNumber()).isPresent())throw new IllegalArgumentException("Roll number already registered");User u=users.save(User.builder().email(r.email()).password(encoder.encode(r.password())).role(Role.STUDENT).enabled(true).build());students.save(Student.builder().user(u).fullName(r.fullName()).rollNumber(r.rollNumber()).department(r.department()).year(r.year()).phone(r.phone()).build());return new AuthResponse(jwt.generate(u.getEmail(),u.getRole().name()),u.getEmail(),u.getRole().name());}
 public AuthResponse login(LoginRequest r){User u=users.findByEmail(r.email()).orElseThrow(()->new IllegalArgumentException("Invalid email or password"));if(!encoder.matches(r.password(),u.getPassword()))throw new IllegalArgumentException("Invalid email or password");return new AuthResponse(jwt.generate(u.getEmail(),u.getRole().name()),u.getEmail(),u.getRole().name());}
}
