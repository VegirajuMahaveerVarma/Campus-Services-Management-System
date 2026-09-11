package com.campus.service;
import com.campus.entity.*; import com.campus.repository.*; import org.springframework.stereotype.Service; import java.util.*;
@Service public class CampusService {
 private final EventRepository events; private final NoticeRepository notices; private final UserRepository users; private final NotificationService notifications;
 public CampusService(EventRepository e,NoticeRepository n,UserRepository u,NotificationService ns){events=e;notices=n;users=u;notifications=ns;}
 public List<Event> events(){return events.findAllByOrderByEventDateAsc();}
 public Event saveEvent(Event e){Event saved=events.save(e); if(e.getId()==null) notifications.notifyAllStudents("New campus event",saved.getTitle(),"EVENT"); return saved;}
 public Event event(Long id){return events.findById(id).orElseThrow(()->new NoSuchElementException("Event not found"));}
 public void deleteEvent(Long id){events.deleteById(id);}
 public List<Notice> notices(){return notices.findByActiveTrueOrderByPublishedAtDesc();}
 public Notice saveNotice(Notice n){Notice saved=notices.save(n); if(n.getId()==null) notifications.notifyAllStudents("New campus notice",saved.getTitle(),"NOTICE"); return saved;}
 public Notice notice(Long id){return notices.findById(id).orElseThrow(()->new NoSuchElementException("Notice not found"));}
 public void deleteNotice(Long id){notices.deleteById(id);}
}
