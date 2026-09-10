package com.campus.controller;
import com.campus.entity.Student; import com.campus.repository.StudentRepository; import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/students") public class StudentController { private final StudentRepository repo; public StudentController(StudentRepository r){repo=r;}
@GetMapping("/profile") public Student profile(Authentication a){return repo.findByUserEmail(a.getName()).orElseThrow();}
@PutMapping("/profile") public Student update(Authentication a,@RequestBody Student input){Student s=profile(a);s.setFullName(input.getFullName());s.setDepartment(input.getDepartment());s.setYear(input.getYear());s.setPhone(input.getPhone());return repo.save(s);}
@GetMapping @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')") public java.util.List<Student> all(){return repo.findAll();}}
