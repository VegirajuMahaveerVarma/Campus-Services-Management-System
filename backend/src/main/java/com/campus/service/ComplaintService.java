package com.campus.service;
import com.campus.dto.ComplaintDtos.*; import com.campus.entity.*; import com.campus.repository.*; import org.springframework.stereotype.Service; import java.util.*;
@Service public class ComplaintService {
 private final ComplaintRepository complaints; private final StudentRepository students; private final NotificationService notifications;
 public ComplaintService(ComplaintRepository c,StudentRepository s,NotificationService n){complaints=c;students=s;notifications=n;}
 public Complaint create(String email,CreateRequest r){
  Student s=students.findByUserEmail(email).orElseThrow(()->new NoSuchElementException("Student profile not found"));
  Complaint saved=complaints.save(Complaint.builder().student(s).title(r.title()).description(r.description()).category(r.category()).status(ComplaintStatus.OPEN).build());
  notifications.notifyRole(Role.ADMIN,"New complaint received",saved.getTitle()+" submitted by "+s.getFullName(),"COMPLAINT");
  return saved;
 }
 public List<Complaint> mine(String email){return complaints.findByStudentUserEmailOrderByCreatedAtDesc(email);}
 public List<Complaint> all(){return complaints.findAllByOrderByCreatedAtDesc();}
 public Complaint updateStatus(Long id,StatusRequest r){
  Complaint c=complaints.findById(id).orElseThrow(()->new NoSuchElementException("Complaint not found"));
  ComplaintStatus old=c.getStatus(); ComplaintStatus next=ComplaintStatus.valueOf(r.status().toUpperCase()); c.setStatus(next);
  Complaint saved=complaints.save(c);
  if(old!=next) notifications.notifyUser(c.getStudent().getUser(),"Complaint status updated",c.getTitle()+" is now "+next.name().replace('_',' '),"STATUS_UPDATE");
  return saved;
 }
}
