package com.example.solar_planer.dto;

import java.util.List;

public record LoadProfileResponse(
        Long id,
        String name,
        double autonomyHours,
        double systemVoltage,
        List<LoadItemResponse> items,
        double totalPowerWatts,
        double inverterPowerWatts,
        double requiredBatteryAh
) {
}
