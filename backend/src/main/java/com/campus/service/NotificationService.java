package com.campus.service;

import com.campus.entity.*;
import com.campus.repository.*;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class NotificationService {
    private final NotificationRepository notifications;
    private final UserRepository users;

    public NotificationService(NotificationRepository n, UserRepository u){
        notifications=n; users=u;
    }

    public List<Notification> list(String email){
        return notifications.findByUserIdOrderByCreatedAtDesc(user(email).getId());
    }

    public long unreadCount(String email){
        return notifications.countByUserIdAndReadFalse(user(email).getId());
    }

    public Notification markRead(String email, Long id){
        Notification n=notifications.findById(id).orElseThrow(()->new NoSuchElementException("Notification not found"));
        if(!n.getUser().getEmail().equalsIgnoreCase(email)) throw new NoSuchElementException("Notification not found");
        n.setRead(true); return notifications.save(n);
    }

    public void markAllRead(String email){
        list(email).forEach(n -> n.setRead(true));
        notifications.saveAll(list(email));
    }

    public void notifyUser(User user,String title,String message,String type){
        notifications.save(Notification.builder().user(user).title(title).message(message).type(type).read(false).build());
    }

    public void notifyRole(Role role,String title,String message,String type){
        users.findAll().stream().filter(u->u.getRole()==role && u.isEnabled())
            .forEach(u->notifyUser(u,title,message,type));
    }

    public void notifyAllStudents(String title,String message,String type){
        notifyRole(Role.STUDENT,title,message,type);
    }

    private User user(String email){
        return users.findByEmail(email).orElseThrow(()->new NoSuchElementException("User not found"));
    }
}
