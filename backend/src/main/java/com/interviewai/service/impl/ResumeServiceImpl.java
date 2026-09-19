package com.interviewai.service.impl;

import com.interviewai.dto.resume.ResumeAnalysisResponse;
import com.interviewai.dto.resume.ResumeUploadResponse;
import com.interviewai.entity.Resume;
import com.interviewai.entity.User;
import com.interviewai.exception.ResourceNotFoundException;
import com.interviewai.repository.ResumeRepository;
import com.interviewai.security.CurrentUserService;
import com.interviewai.service.ResumeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import com.interviewai.entity.ResumeAnalysisEntity;
import com.interviewai.repository.ResumeAnalysisRepository;
import com.interviewai.service.resume.ResumeAnalysisService;
import com.interviewai.service.notification.NotificationService;
import com.interviewai.entity.enums.NotificationType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeServiceImpl implements ResumeService {

    private final ResumeRepository resumeRepository;
    private final ResumeAnalysisRepository analysisRepository;
    private final CurrentUserService currentUserService;
    private final ResumeAnalysisService analysisService;
    private final NotificationService notificationService;

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Override
    @Transactional
    public ResumeUploadResponse uploadResume(MultipartFile file, String jobDescription) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty file");
        }
        
        if (!"application/pdf".equals(file.getContentType())) {
            throw new IllegalArgumentException("Only PDF files are allowed");
        }

        if (file.getSize() > 5 * 1024 * 1024) { // 5 MB
            throw new IllegalArgumentException("File size exceeds 5MB limit");
        }

        User user = currentUserService.getCurrentUser();
        UUID userId = user.getId();

        try {
            Path uploadPath = Paths.get(uploadDir, "resumes", userId.toString());
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : ".pdf";
                    
            String newFileName = UUID.randomUUID() + extension;
            Path filePath = uploadPath.resolve(newFileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Set existing active resumes to inactive
            List<Resume> activeResumes = resumeRepository.findByUserIdAndIsActiveTrue(user.getId());
            if (!activeResumes.isEmpty()) {
                activeResumes.forEach(r -> r.setIsActive(false));
                resumeRepository.saveAll(activeResumes);
            }

            Resume resume = Resume.builder()
                    .user(user)
                    .fileName(originalFilename)
                    .filePath(filePath.toString())
                    .fileSize(file.getSize())
                    .contentType(file.getContentType())
                    .isActive(true)
                    .build();

            Resume savedResume = resumeRepository.save(resume);

            // Trigger Analysis
            try (InputStream pdfStream = Files.newInputStream(filePath)) {
                analysisService.analyzeResume(savedResume, pdfStream, jobDescription);
            } catch (Exception e) {
                log.error("Failed to parse and analyze PDF: " + e.getMessage(), e);
                // Optionally throw or just let the resume upload succeed without analysis
                throw new RuntimeException("Failed to analyze resume", e);
            }

            notificationService.createNotification(
                    user,
                    "Resume analysis completed",
                    "Your resume analysis is ready to review.",
                    NotificationType.RESUME
            );

            return ResumeUploadResponse.builder()
                    .id(savedResume.getId())
                    .fileName(savedResume.getFileName())
                    .message("Resume uploaded successfully")
                    .build();

        } catch (IOException e) {
            log.error("Failed to store resume file", e);
            throw new RuntimeException("Failed to store resume file", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ResumeAnalysisResponse getLatestResumeAnalysis() {
        User user = currentUserService.getCurrentUser();
        Resume resume = resumeRepository.findFirstByUserIdAndIsActiveTrueOrderByCreatedAtDesc(user.getId())
                .orElse(null);

        if (resume == null) {
            return null; // Return 204 No Content in Controller
        }

        ResumeAnalysisEntity analysis = analysisRepository.findByResumeId(resume.getId()).orElse(null);
        if (analysis == null) return null;

        return ResumeAnalysisResponse.builder()
                .resumeId(resume.getId())
                .fileName(resume.getFileName())
                .candidateName(analysis.getCandidateName())
                .email(analysis.getEmail())
                .phone(analysis.getPhone())
                .education(analysis.getEducation())
                .createdAt(analysis.getCreatedAt())
                .fileSize(resume.getFileSize())
                .atsScore(analysis.getAtsScore())
                .grammarScore(analysis.getGrammarScore())
                .formattingScore(analysis.getFormattingScore())
                .keywordMatchScore(analysis.getKeywordMatchScore())
                .completenessScore(analysis.getCompletenessScore())
                .jobMatchPercentage(analysis.getJobMatchPercentage())
                .experienceYears(analysis.getExperienceYears())
                .projectsCount(analysis.getProjectsCount())
                .certificatesCount(analysis.getCertificatesCount())
                .technicalSkills(analysis.getTechnicalSkills())
                .softSkills(analysis.getSoftSkills())
                .tools(analysis.getTools())
                .frameworks(analysis.getFrameworks())
                .databases(analysis.getDatabases())
                .cloud(analysis.getCloud())
                .matchedKeywords(analysis.getMatchedKeywords())
                .missingKeywords(analysis.getMissingKeywords())
                .missingSkills(analysis.getMissingSkills())
                .matchedSkills(analysis.getMatchedSkills())
                .missingSections(analysis.getMissingSections())
                .suggestions(analysis.getSuggestions())
                .build();
    }

    @Override
    @Transactional
    public void deleteResume(UUID resumeId) {
        User user = currentUserService.getCurrentUser();
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));

        if (!resume.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized to delete this resume");
        }

        try {
            Path fileToDeletePath = Paths.get(resume.getFilePath());
            Files.deleteIfExists(fileToDeletePath);
        } catch (IOException e) {
            log.error("Failed to delete resume file: " + resume.getFilePath(), e);
        }

        resumeRepository.delete(resume);
    }

    @Override
    @Transactional(readOnly = true)
    public Resource previewResume() {
        return getActiveResumeResource();
    }

    @Override
    @Transactional(readOnly = true)
    public Resource downloadResume() {
        return getActiveResumeResource();
    }
    
    private Resource getActiveResumeResource() {
        User user = currentUserService.getCurrentUser();
        Resume resume = resumeRepository.findFirstByUserIdAndIsActiveTrueOrderByCreatedAtDesc(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Active resume not found"));

        try {
            Path filePath = Paths.get(resume.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("Resume file not found on disk");
            }
        } catch (MalformedURLException e) {
            throw new ResourceNotFoundException("Resume file not found");
        }
    }
}
