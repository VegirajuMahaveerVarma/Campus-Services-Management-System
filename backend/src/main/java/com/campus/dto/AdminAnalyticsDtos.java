package com.campus.dto;

import java.time.LocalDateTime;
import java.util.List;

public final class AdminAnalyticsDtos {
    private AdminAnalyticsDtos() {}

    public record RecentComplaint(
        Long id, String title, String category, String status,
        String studentName, LocalDateTime createdAt
    ) {}

    public record Summary(
        long totalStudents,
        long totalComplaints,
        long openComplaints,
        long inProgressComplaints,
        long resolvedComplaints,
        long closedComplaints,
        long totalEvents,
        long upcomingEvents,
        long totalNotices,
        double resolutionRate,
        List<RecentComplaint> recentComplaints
    ) {}
}
