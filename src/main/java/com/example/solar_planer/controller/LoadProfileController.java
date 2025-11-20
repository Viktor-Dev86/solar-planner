package com.example.solar_planer.controller;

import com.example.solar_planer.dto.LoadProfileCreateRequest;
import com.example.solar_planer.dto.LoadProfileResponse;
import com.example.solar_planer.service.LoadProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/profiles")
@RequiredArgsConstructor
public class LoadProfileController {

    private final LoadProfileService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LoadProfileResponse create(@Valid @RequestBody LoadProfileCreateRequest request) {
        return service.createProfile(request);
    }

    @GetMapping
    public List<LoadProfileResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public LoadProfileResponse getById(@PathVariable Long id) {
        return service.getProfile(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
