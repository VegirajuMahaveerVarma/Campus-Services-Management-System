package com.campus.repository;
import com.campus.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface NoticeRepository extends JpaRepository<Notice,Long>{ List<Notice> findByActiveTrueOrderByPublishedAtDesc(); }
