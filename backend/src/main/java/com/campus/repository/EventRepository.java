package com.campus.repository;
import com.campus.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
public interface EventRepository extends JpaRepository<Event,Long>{
 List<Event> findAllByOrderByEventDateAsc();
 List<Event> findByEventDateAfter(LocalDateTime date);
}
