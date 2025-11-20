package com.example.solar_planer.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "load_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoadItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Название устройства: "Холодильник", "Роутер" и т.п.
    private String name;

    // Мощность одного устройства в ваттах
    private int powerWatts;

    // Сколько таких устройств
    private int quantity;

    // Сколько часов в сутки работает одно устройство
    private double hoursPerDay;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id")
    private LoadProfile profile;
}
