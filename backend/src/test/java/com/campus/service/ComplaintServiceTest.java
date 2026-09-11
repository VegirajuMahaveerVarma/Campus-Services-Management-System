package com.campus.service;

import com.campus.dto.ComplaintDtos.*;
import com.campus.entity.*;
import com.campus.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class ComplaintServiceTest {
 @Mock ComplaintRepository complaints;
 @Mock StudentRepository students;
 @Mock NotificationService notifications;
 @InjectMocks ComplaintService service;

 @Test void createStartsOpen(){
  User admin=User.builder().id(9L).email("admin@test.com").role(Role.ADMIN).build();
  Student s=Student.builder().id(1L).user(admin).build();
  when(students.findByUserEmail("s@test.com")).thenReturn(Optional.of(s));
  when(complaints.save(any())).thenAnswer(i->i.getArgument(0));
  Complaint c=service.create("s@test.com",new CreateRequest("WiFi","No internet","IT"));
  assertEquals(ComplaintStatus.OPEN,c.getStatus());
  assertEquals("WiFi",c.getTitle());
  verify(notifications).notifyRole(eq(Role.ADMIN),contains("New complaint"),contains("WiFi"),eq("COMPLAINT"));
 }

 @Test void missingStudentRejected(){
  when(students.findByUserEmail("x@test.com")).thenReturn(Optional.empty());
  assertThrows(NoSuchElementException.class,()->service.create("x@test.com",new CreateRequest("A","B","C")));
 }

 @Test void statusCanBeUpdated(){
  User studentUser=User.builder().id(3L).email("student@test.com").role(Role.STUDENT).build();
  Student student=Student.builder().id(1L).user(studentUser).build();
  Complaint c=Complaint.builder().id(2L).student(student).status(ComplaintStatus.OPEN).title("WiFi").build();
  when(complaints.findById(2L)).thenReturn(Optional.of(c));
  when(complaints.save(c)).thenReturn(c);
  assertEquals(ComplaintStatus.RESOLVED,service.updateStatus(2L,new StatusRequest("RESOLVED")).getStatus());
  verify(notifications).notifyUser(eq(studentUser),contains("Complaint status updated"),contains("RESOLVED"),eq("STATUS_UPDATE"));
 }
}
