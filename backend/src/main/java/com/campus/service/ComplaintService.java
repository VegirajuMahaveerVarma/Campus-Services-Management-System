package com.campus.service;
import com.campus.dto.ComplaintDtos.*; import com.campus.entity.*; import com.campus.repository.*; import org.springframework.stereotype.Service; import java.util.*;
@Service public class ComplaintService { private final ComplaintRepository complaints; private final StudentRepository students; public ComplaintService(ComplaintRepository c,StudentRepository s){complaints=c;students=s;}
 public Complaint create(String email,CreateRequest r){Student s=students.findByUserEmail(email).orElseThrow(()->new NoSuchElementException("Student profile not found"));return complaints.save(Complaint.builder().student(s).title(r.title()).description(r.description()).category(r.category()).status(ComplaintStatus.OPEN).build());}
 public List<Complaint> mine(String email){return complaints.findByStudentUserEmailOrderByCreatedAtDesc(email);}
 public List<Complaint> all(){return complaints.findAllByOrderByCreatedAtDesc();}
 public Complaint updateStatus(Long id,StatusRequest r){Complaint c=complaints.findById(id).orElseThrow(()->new NoSuchElementException("Complaint not found"));c.setStatus(ComplaintStatus.valueOf(r.status().toUpperCase()));return complaints.save(c);}
}
