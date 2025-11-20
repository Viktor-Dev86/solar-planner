package com.example.solar_planer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.util.List;

public record LoadProfileCreateRequest(
        @NotBlank String name,
        @Positive double autonomyHours,
        @Positive double systemVoltage,
        @Size(min = 1) List<LoadItemRequest> items
) {
}
