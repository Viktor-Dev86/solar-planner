package com.example.solar_planer.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record LoadItemRequest(
        @NotBlank String name,
        @Min(1) int powerWatts,
        @Min(1) int quantity,
        @Positive double hoursPerDay
) {
}
