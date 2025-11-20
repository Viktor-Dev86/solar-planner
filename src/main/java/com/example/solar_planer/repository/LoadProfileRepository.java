package com.example.solar_planer.repository;

import com.example.solar_planer.model.LoadProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoadProfileRepository extends JpaRepository<LoadProfile, Long> {
}
