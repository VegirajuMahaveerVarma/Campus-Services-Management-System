package com.campus.service;
import com.campus.entity.*; import com.campus.repository.*; import org.springframework.stereotype.Service; import java.util.*;
@Service public class CampusService { private final EventRepository events; private final NoticeRepository notices; public CampusService(EventRepository e,NoticeRepository n){events=e;notices=n;}
 public List<Event> events(){return events.findAllByOrderByEventDateAsc();} public Event saveEvent(Event e){return events.save(e);} public Event event(Long id){return events.findById(id).orElseThrow(()->new NoSuchElementException("Event not found"));} public void deleteEvent(Long id){events.deleteById(id);}
 public List<Notice> notices(){return notices.findByActiveTrueOrderByPublishedAtDesc();} public Notice saveNotice(Notice n){return notices.save(n);} public Notice notice(Long id){return notices.findById(id).orElseThrow(()->new NoSuchElementException("Notice not found"));} public void deleteNotice(Long id){notices.deleteById(id);}
}
