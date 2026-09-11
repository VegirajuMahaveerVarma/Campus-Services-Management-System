package com.campus.service;

import com.campus.dto.AdminAnalyticsDtos.*;
import com.campus.entity.*;
import com.campus.repository.*;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class AdminAnalyticsService {
    private final UserRepository users;
    private final ComplaintRepository complaints;
    private final EventRepository events;
    private final NoticeRepository notices;

    public AdminAnalyticsService(UserRepository u, ComplaintRepository c, EventRepository e, NoticeRepository n){
        users=u; complaints=c; events=e; notices=n;
    }

    public Summary summary(){
        long total=complaints.count();
        long resolved=complaints.countByStatus(ComplaintStatus.RESOLVED);
        long closed=complaints.countByStatus(ComplaintStatus.CLOSED);
        double rate=total==0 ? 0.0 : ((resolved+closed)*100.0)/total;
        List<RecentComplaint> recent=complaints.findTop5ByOrderByCreatedAtDesc().stream()
            .map(c -> new RecentComplaint(c.getId(),c.getTitle(),c.getCategory(),c.getStatus().name(),
                c.getStudent().getFullName(),c.getCreatedAt())).toList();
        return new Summary(
            users.countByRole(Role.STUDENT), total,
            complaints.countByStatus(ComplaintStatus.OPEN),
            complaints.countByStatus(ComplaintStatus.IN_PROGRESS),
            resolved, closed,
            events.count(), events.findByEventDateAfter(LocalDateTime.now()).size(),
            notices.count(), rate, recent
        );
    }
}
