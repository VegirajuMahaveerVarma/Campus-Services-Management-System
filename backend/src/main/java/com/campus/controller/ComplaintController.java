package com.campus.controller;
import com.campus.dto.ComplaintDtos.*; import com.campus.entity.Complaint; import com.campus.service.ComplaintService; import jakarta.validation.Valid; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/complaints") public class ComplaintController {private final ComplaintService service; public ComplaintController(ComplaintService s){service=s;}
@PostMapping @PreAuthorize("hasRole('STUDENT')") public Complaint create(Authentication a,@Valid @RequestBody CreateRequest r){return service.create(a.getName(),r);}
@GetMapping("/my") @PreAuthorize("hasRole('STUDENT')") public List<Complaint> mine(Authentication a){return service.mine(a.getName());}
@GetMapping @PreAuthorize("hasRole('ADMIN')") public List<Complaint> all(){return service.all();}
@PutMapping("/{id}/status") @PreAuthorize("hasRole('ADMIN')") public Complaint status(@PathVariable Long id,@Valid @RequestBody StatusRequest r){return service.updateStatus(id,r);}}
