package com.campus.dto;
import jakarta.validation.constraints.NotBlank;
public final class ComplaintDtos { private ComplaintDtos(){}
 public record CreateRequest(@NotBlank String title,@NotBlank String description,String category){}
 public record StatusRequest(@NotBlank String status){}
}
