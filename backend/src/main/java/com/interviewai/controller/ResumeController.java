package com.interviewai.controller;

import com.interviewai.dto.ApiResponse;
import com.interviewai.dto.resume.ResumeAnalysisResponse;
import com.interviewai.dto.resume.ResumeUploadResponse;
import com.interviewai.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ResumeUploadResponse>> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "jobDescription", required = false) String jobDescription) {
        
        ResumeUploadResponse response = resumeService.uploadResume(file, jobDescription);
        return ResponseEntity.ok(
                ApiResponse.<ResumeUploadResponse>builder()
                        .success(true)
                        .message("Resume uploaded successfully")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<ResumeAnalysisResponse>> getLatestResume() {
        
        ResumeAnalysisResponse response = resumeService.getLatestResumeAnalysis();
        if (response == null) {
            return ResponseEntity.ok(
                    ApiResponse.<ResumeAnalysisResponse>builder()
                            .success(true)
                            .message("No resume found")
                            .data(null)
                            .build()
            );
        }
        return ResponseEntity.ok(
                ApiResponse.<ResumeAnalysisResponse>builder()
                        .success(true)
                        .message("Latest resume retrieved successfully")
                        .data(response)
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteResume(
            @PathVariable UUID id) {
        
        resumeService.deleteResume(id);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Resume deleted successfully")
                        .data(null)
                        .build()
        );
    }

    @GetMapping("/preview")
    public ResponseEntity<Resource> previewResume() {
        
        Resource file = resumeService.previewResume();
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFilename() + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(file);
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> downloadResume() {
        
        Resource file = resumeService.downloadResume();
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(file);
    }
}
