package com.campus.service;
import com.campus.dto.ComplaintDtos.*; import com.campus.entity.*; import com.campus.repository.*; import org.junit.jupiter.api.Test; import org.junit.jupiter.api.extension.ExtendWith; import org.mockito.*; import static org.junit.jupiter.api.Assertions.*; import static org.mockito.Mockito.*; import java.util.*;
@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class) class ComplaintServiceTest {
 @Mock ComplaintRepository complaints; @Mock StudentRepository students; @InjectMocks ComplaintService service;
 @Test void createStartsOpen(){Student s=Student.builder().id(1L).build();when(students.findByUserEmail("s@test.com")).thenReturn(Optional.of(s));when(complaints.save(any())).thenAnswer(i->i.getArgument(0));Complaint c=service.create("s@test.com",new CreateRequest("WiFi","No internet","IT"));assertEquals(ComplaintStatus.OPEN,c.getStatus());assertEquals("WiFi",c.getTitle());}
 @Test void missingStudentRejected(){when(students.findByUserEmail("x@test.com")).thenReturn(Optional.empty());assertThrows(NoSuchElementException.class,()->service.create("x@test.com",new CreateRequest("A","B","C")));}
 @Test void statusCanBeUpdated(){Complaint c=Complaint.builder().id(2L).status(ComplaintStatus.OPEN).build();when(complaints.findById(2L)).thenReturn(Optional.of(c));when(complaints.save(c)).thenReturn(c);assertEquals(ComplaintStatus.RESOLVED,service.updateStatus(2L,new StatusRequest("RESOLVED")).getStatus());}
}
