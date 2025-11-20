package com.example.solar_planer.dto;

public record LoadItemResponse(
        Long id,
        String name,
        int powerWatts,
        int quantity,
        double hoursPerDay,
        double dailyEnergyWh
) {
}
