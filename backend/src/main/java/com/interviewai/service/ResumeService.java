package com.interviewai.service;

import com.interviewai.dto.resume.ResumeAnalysisResponse;
import com.interviewai.dto.resume.ResumeUploadResponse;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface ResumeService {
    ResumeUploadResponse uploadResume(MultipartFile file, String jobDescription);
    ResumeAnalysisResponse getLatestResumeAnalysis();
    void deleteResume(UUID resumeId);
    Resource previewResume();
    Resource downloadResume();
}
