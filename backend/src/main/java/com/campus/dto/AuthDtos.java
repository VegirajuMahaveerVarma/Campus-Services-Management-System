package com.campus.dto;
import jakarta.validation.constraints.*;
public final class AuthDtos {
 private AuthDtos(){}
 public record LoginRequest(@Email @NotBlank String email,@NotBlank String password){}
 public record RegisterRequest(@Email @NotBlank String email,@NotBlank @Size(min=6) String password,@NotBlank String fullName,@NotBlank String rollNumber,String department,String year,String phone){}
 public record AuthResponse(String token,String email,String role){}
}
