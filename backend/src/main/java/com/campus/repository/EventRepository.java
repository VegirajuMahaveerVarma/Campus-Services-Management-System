package com.campus.repository;
import com.campus.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
public interface EventRepository extends JpaRepository<Event,Long>{
 List<Event> findAllByOrderByEventDateAsc();
 List<Event> findByEventDateAfter(LocalDateTime date);
 Optional<Event> findByTitle(String title);
}
