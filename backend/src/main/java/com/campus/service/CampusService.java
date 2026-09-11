package com.campus.service;
import com.campus.entity.*; import com.campus.repository.*; import org.springframework.stereotype.Service; import java.util.*;
@Service public class CampusService {
 private final EventRepository events; private final NoticeRepository notices; private final NotificationService notifications;
 public CampusService(EventRepository e,NoticeRepository n,NotificationService ns){events=e;notices=n;notifications=ns;}
 public List<Event> events(){return events.findAllByOrderByEventDateAsc();}
 public Event saveEvent(Event e){boolean created=e.getId()==null; Event saved=events.save(e); if(created) notifications.notifyAllStudents("New campus event",saved.getTitle(),"EVENT"); return saved;}
 public Event event(Long id){return events.findById(id).orElseThrow(()->new NoSuchElementException("Event not found"));}
 public void deleteEvent(Long id){events.deleteById(id);}
 public List<Notice> notices(){return notices.findByActiveTrueOrderByPublishedAtDesc();}
 public Notice saveNotice(Notice n){boolean created=n.getId()==null; Notice saved=notices.save(n); if(created) notifications.notifyAllStudents("New campus notice",saved.getTitle(),"NOTICE"); return saved;}
 public Notice notice(Long id){return notices.findById(id).orElseThrow(()->new NoSuchElementException("Notice not found"));}
 public void deleteNotice(Long id){notices.deleteById(id);}
}
