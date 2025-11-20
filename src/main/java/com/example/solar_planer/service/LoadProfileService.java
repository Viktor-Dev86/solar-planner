package com.example.solar_planer.service;

import com.example.solar_planer.dto.LoadItemRequest;
import com.example.solar_planer.dto.LoadItemResponse;
import com.example.solar_planer.dto.LoadProfileCreateRequest;
import com.example.solar_planer.dto.LoadProfileResponse;
import com.example.solar_planer.model.LoadItem;
import com.example.solar_planer.model.LoadProfile;
import com.example.solar_planer.repository.LoadProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LoadProfileService {

    private final LoadProfileRepository loadProfileRepository;

    // Коэффициенты
    private static final double INVERTER_RESERVE = 1.25;      // запас мощности для инвертора
    private static final double BATTERY_EFFICIENCY = 0.85;    // КПД системы
    private static final double DEPTH_OF_DISCHARGE = 0.6;     // глубина разряда АКБ (60%)

    @Transactional
    public LoadProfileResponse createProfile(LoadProfileCreateRequest request) {
        LoadProfile profile = new LoadProfile();
        profile.setName(request.name());
        profile.setAutonomyHours(request.autonomyHours());
        profile.setSystemVoltage(request.systemVoltage());

        List<LoadItem> items = request.items().stream()
                .map(r -> buildLoadItem(r, profile))
                .toList();

        profile.setItems(items);

        LoadProfile saved = loadProfileRepository.save(profile);

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public LoadProfileResponse getProfile(Long id) {
        LoadProfile profile = loadProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        return mapToResponse(profile);
    }

    @Transactional(readOnly = true)
    public List<LoadProfileResponse> getAll() {
        return loadProfileRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public void delete(Long id) {
        loadProfileRepository.deleteById(id);
    }

    private LoadItem buildLoadItem(LoadItemRequest r, LoadProfile profile) {
        LoadItem item = new LoadItem();
        item.setName(r.name());
        item.setPowerWatts(r.powerWatts());
        item.setQuantity(r.quantity());
        item.setHoursPerDay(r.hoursPerDay());
        item.setProfile(profile);
        return item;
    }

    private LoadProfileResponse mapToResponse(LoadProfile profile) {
        List<LoadItemResponse> itemResponses = profile.getItems().stream()
                .map(i -> {
                    double dailyEnergyWh = i.getPowerWatts() * i.getQuantity() * i.getHoursPerDay();
                    return new LoadItemResponse(
                            i.getId(),
                            i.getName(),
                            i.getPowerWatts(),
                            i.getQuantity(),
                            i.getHoursPerDay(),
                            dailyEnergyWh
                    );
                })
                .toList();

        double totalPower = profile.getItems().stream()
                .mapToDouble(i -> i.getPowerWatts() * i.getQuantity())
                .sum();

        double inverterPower = totalPower * INVERTER_RESERVE;

        // Энергия на время автономии (Вт*ч)
        double energyForAutonomyWh = totalPower * profile.getAutonomyHours();

        // Учёт потерь и глубины разряда
        double adjustedWh = energyForAutonomyWh / (BATTERY_EFFICIENCY * DEPTH_OF_DISCHARGE);

        // Перевод в А*ч
        double batteryAh = adjustedWh / profile.getSystemVoltage();

        return new LoadProfileResponse(
                profile.getId(),
                profile.getName(),
                profile.getAutonomyHours(),
                profile.getSystemVoltage(),
                itemResponses,
                totalPower,
                inverterPower,
                batteryAh
        );
    }
}
