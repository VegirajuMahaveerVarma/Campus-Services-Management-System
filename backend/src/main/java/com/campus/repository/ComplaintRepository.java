package com.campus.repository;
import com.campus.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface ComplaintRepository extends JpaRepository<Complaint,Long>{
 List<Complaint> findByStudentUserEmailOrderByCreatedAtDesc(String email);
 List<Complaint> findAllByOrderByCreatedAtDesc();
 List<Complaint> findByStatusOrderByCreatedAtDesc(ComplaintStatus status);
 long countByStatus(ComplaintStatus status);
 List<Complaint> findTop5ByOrderByCreatedAtDesc();
}
