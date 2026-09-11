package com.campus.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public final class EventRegistrationDtos {
    private EventRegistrationDtos() {}

    public record CreateRequest(
        @NotBlank String fullName,
        @NotBlank @Email String email,
        @NotBlank @Pattern(regexp="[0-9+() -]{7,20}") String phone,
        @NotBlank String rollNumber
    ) {}
}
