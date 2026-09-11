package com.campus.controller;

import com.campus.entity.Notification;
import com.campus.service.NotificationService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService service;
    public NotificationController(NotificationService s){service=s;}

    @GetMapping
    public List<Notification> list(Authentication a){ return service.list(a.getName()); }

    @GetMapping("/unread-count")
    public long unreadCount(Authentication a){ return service.unreadCount(a.getName()); }

    @PutMapping("/{id}/read")
    public Notification markRead(Authentication a,@PathVariable Long id){ return service.markRead(a.getName(),id); }

    @PutMapping("/read-all")
    public void markAllRead(Authentication a){ service.markAllRead(a.getName()); }
}
