package com.campus.repository;
import com.campus.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface StudentRepository extends JpaRepository<Student,Long>{ Optional<Student> findByUserEmail(String email); Optional<Student> findByRollNumber(String rollNumber); }
