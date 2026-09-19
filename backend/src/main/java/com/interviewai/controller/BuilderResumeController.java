package com.interviewai.controller;

import com.interviewai.dto.builder.BuilderResumeDto;
import com.interviewai.service.builder.BuilderResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/builder/resumes")
@RequiredArgsConstructor
public class BuilderResumeController {

    private final BuilderResumeService resumeService;

    @GetMapping
    public ResponseEntity<List<BuilderResumeDto>> getAllResumes() {
        return ResponseEntity.ok(resumeService.getAllResumes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BuilderResumeDto> getResumeById(@PathVariable UUID id) {
        return ResponseEntity.ok(resumeService.getResumeById(id));
    }

    @PostMapping
    public ResponseEntity<BuilderResumeDto> createResume(@RequestBody BuilderResumeDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(resumeService.createResume(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BuilderResumeDto> updateResume(@PathVariable UUID id, @RequestBody BuilderResumeDto dto) {
        return ResponseEntity.ok(resumeService.updateResume(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResume(@PathVariable UUID id) {
        resumeService.deleteResume(id);
        return ResponseEntity.noContent().build();
    }
}
