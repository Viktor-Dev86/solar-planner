package com.example.solar_planer.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "load_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoadProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Название профиля, например "Дом на даче"
    private String name;

    // Сколько часов нужно автономной работы (например, 4 часа)
    private double autonomyHours;

    // Напряжение системы: 12 / 24 / 48 В
    private double systemVoltage;

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LoadItem> items;
}
