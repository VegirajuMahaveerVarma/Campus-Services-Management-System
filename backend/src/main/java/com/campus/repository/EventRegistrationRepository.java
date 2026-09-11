package com.campus.repository;

import com.campus.entity.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    boolean existsByEventIdAndEmail(Long eventId, String email);
    boolean existsByEventIdAndRollNumber(Long eventId, String rollNumber);
    List<EventRegistration> findByEventIdOrderByRegisteredAtDesc(Long eventId);
}
