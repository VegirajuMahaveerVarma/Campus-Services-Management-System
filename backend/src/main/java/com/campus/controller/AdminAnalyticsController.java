package com.campus.controller;

import com.campus.dto.AdminAnalyticsDtos.Summary;
import com.campus.service.AdminAnalyticsService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/analytics")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAnalyticsController {
    private final AdminAnalyticsService service;
    public AdminAnalyticsController(AdminAnalyticsService s){service=s;}

    @GetMapping
    public Summary summary(){ return service.summary(); }
}
