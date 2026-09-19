package com.interviewai.service.builder;

import com.interviewai.converter.BuilderResumeMapper;
import com.interviewai.dto.builder.BuilderResumeDto;
import com.interviewai.entity.BuilderResume;
import com.interviewai.entity.User;
import com.interviewai.exception.ResourceNotFoundException;
import com.interviewai.repository.BuilderResumeRepository;
import com.interviewai.security.CurrentUserService;
import com.interviewai.service.notification.NotificationService;
import com.interviewai.entity.enums.NotificationType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BuilderResumeService {

    private final BuilderResumeRepository resumeRepository;
    private final BuilderResumeMapper resumeMapper;
    private final CurrentUserService currentUserService;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public List<BuilderResumeDto> getAllResumes() {
        User user = currentUserService.getCurrentUser();
        return resumeRepository.findByUserOrderByUpdatedAtDesc(user).stream()
                .map(resumeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BuilderResumeDto getResumeById(UUID id) {
        User user = currentUserService.getCurrentUser();
        BuilderResume resume = resumeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found or access denied"));
        return resumeMapper.toDto(resume);
    }

    @Transactional
    public BuilderResumeDto createResume(BuilderResumeDto dto) {
        User user = currentUserService.getCurrentUser();
        
        BuilderResume resume = resumeMapper.toEntity(dto);
        resume.setUser(user);
        
        linkNestedEntities(resume);

        BuilderResume savedResume = resumeRepository.save(resume);
        
        notificationService.createNotification(
                user,
                "Resume created",
                "Your AI-optimized resume is ready.",
                NotificationType.RESUME
        );
        
        return resumeMapper.toDto(savedResume);
    }

    @Transactional
    public BuilderResumeDto updateResume(UUID id, BuilderResumeDto dto) {
        User user = currentUserService.getCurrentUser();
        BuilderResume existingResume = resumeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found or access denied"));

        resumeMapper.updateEntityFromDto(dto, existingResume);
        
        // Manual merge to prevent Hibernate NonUniqueObjectException and preserve IDs
        mergeEducation(existingResume, dto);
        mergeExperience(existingResume, dto);
        mergeProjects(existingResume, dto);
        mergeSkills(existingResume, dto);
        mergeCertifications(existingResume, dto);
        
        linkNestedEntities(existingResume);

        BuilderResume updatedResume = resumeRepository.save(existingResume);
        return resumeMapper.toDto(updatedResume);
    }

    private void mergeEducation(BuilderResume entity, BuilderResumeDto dto) {
        if (dto.getEducation() == null) {
            entity.getEducation().clear();
            return;
        }
        java.util.Map<UUID, com.interviewai.entity.BuilderEducation> existingMap = entity.getEducation().stream()
                .collect(Collectors.toMap(com.interviewai.entity.BuilderEducation::getId, e -> e));
        
        List<com.interviewai.entity.BuilderEducation> updatedList = new java.util.ArrayList<>();
        for (com.interviewai.dto.builder.BuilderEducationDto itemDto : dto.getEducation()) {
            if (itemDto.getId() != null && existingMap.containsKey(itemDto.getId())) {
                com.interviewai.entity.BuilderEducation item = existingMap.get(itemDto.getId());
                resumeMapper.updateEducation(itemDto, item);
                updatedList.add(item);
            } else {
                com.interviewai.entity.BuilderEducation newItem = resumeMapper.toEducationEntity(itemDto);
                newItem.setId(null); // Prevent StaleObjectStateException
                updatedList.add(newItem);
            }
        }
        entity.getEducation().clear();
        entity.getEducation().addAll(updatedList);
    }

    private void mergeExperience(BuilderResume entity, BuilderResumeDto dto) {
        if (dto.getExperience() == null) {
            entity.getExperience().clear();
            return;
        }
        java.util.Map<UUID, com.interviewai.entity.BuilderExperience> existingMap = entity.getExperience().stream()
                .collect(Collectors.toMap(com.interviewai.entity.BuilderExperience::getId, e -> e));
        
        List<com.interviewai.entity.BuilderExperience> updatedList = new java.util.ArrayList<>();
        for (com.interviewai.dto.builder.BuilderExperienceDto itemDto : dto.getExperience()) {
            if (itemDto.getId() != null && existingMap.containsKey(itemDto.getId())) {
                com.interviewai.entity.BuilderExperience item = existingMap.get(itemDto.getId());
                resumeMapper.updateExperience(itemDto, item);
                updatedList.add(item);
            } else {
                com.interviewai.entity.BuilderExperience newItem = resumeMapper.toExperienceEntity(itemDto);
                newItem.setId(null); // Prevent StaleObjectStateException
                updatedList.add(newItem);
            }
        }
        entity.getExperience().clear();
        entity.getExperience().addAll(updatedList);
    }

    private void mergeProjects(BuilderResume entity, BuilderResumeDto dto) {
        if (dto.getProjects() == null) {
            entity.getProjects().clear();
            return;
        }
        java.util.Map<UUID, com.interviewai.entity.BuilderProject> existingMap = entity.getProjects().stream()
                .collect(Collectors.toMap(com.interviewai.entity.BuilderProject::getId, e -> e));
        
        List<com.interviewai.entity.BuilderProject> updatedList = new java.util.ArrayList<>();
        for (com.interviewai.dto.builder.BuilderProjectDto itemDto : dto.getProjects()) {
            if (itemDto.getId() != null && existingMap.containsKey(itemDto.getId())) {
                com.interviewai.entity.BuilderProject item = existingMap.get(itemDto.getId());
                resumeMapper.updateProject(itemDto, item);
                updatedList.add(item);
            } else {
                com.interviewai.entity.BuilderProject newItem = resumeMapper.toProjectEntity(itemDto);
                newItem.setId(null); // Prevent StaleObjectStateException
                updatedList.add(newItem);
            }
        }
        entity.getProjects().clear();
        entity.getProjects().addAll(updatedList);
    }

    private void mergeSkills(BuilderResume entity, BuilderResumeDto dto) {
        if (dto.getSkills() == null) {
            entity.getSkills().clear();
            return;
        }
        java.util.Map<UUID, com.interviewai.entity.BuilderSkill> existingMap = entity.getSkills().stream()
                .collect(Collectors.toMap(com.interviewai.entity.BuilderSkill::getId, e -> e));
        
        List<com.interviewai.entity.BuilderSkill> updatedList = new java.util.ArrayList<>();
        for (com.interviewai.dto.builder.BuilderSkillDto itemDto : dto.getSkills()) {
            if (itemDto.getId() != null && existingMap.containsKey(itemDto.getId())) {
                com.interviewai.entity.BuilderSkill item = existingMap.get(itemDto.getId());
                resumeMapper.updateSkill(itemDto, item);
                updatedList.add(item);
            } else {
                com.interviewai.entity.BuilderSkill newItem = resumeMapper.toSkillEntity(itemDto);
                newItem.setId(null); // Prevent StaleObjectStateException
                updatedList.add(newItem);
            }
        }
        entity.getSkills().clear();
        entity.getSkills().addAll(updatedList);
    }

    private void mergeCertifications(BuilderResume entity, BuilderResumeDto dto) {
        if (dto.getCertifications() == null) {
            entity.getCertifications().clear();
            return;
        }
        java.util.Map<UUID, com.interviewai.entity.BuilderCertification> existingMap = entity.getCertifications().stream()
                .collect(Collectors.toMap(com.interviewai.entity.BuilderCertification::getId, e -> e));
        
        List<com.interviewai.entity.BuilderCertification> updatedList = new java.util.ArrayList<>();
        for (com.interviewai.dto.builder.BuilderCertificationDto itemDto : dto.getCertifications()) {
            if (itemDto.getId() != null && existingMap.containsKey(itemDto.getId())) {
                com.interviewai.entity.BuilderCertification item = existingMap.get(itemDto.getId());
                resumeMapper.updateCertification(itemDto, item);
                updatedList.add(item);
            } else {
                com.interviewai.entity.BuilderCertification newItem = resumeMapper.toCertificationEntity(itemDto);
                newItem.setId(null); // Prevent StaleObjectStateException
                updatedList.add(newItem);
            }
        }
        entity.getCertifications().clear();
        entity.getCertifications().addAll(updatedList);
    }

    @Transactional
    public void deleteResume(UUID id) {
        User user = currentUserService.getCurrentUser();
        BuilderResume resume = resumeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found or access denied"));
        resumeRepository.delete(resume);
    }

    private void linkNestedEntities(BuilderResume resume) {
        if (resume.getEducation() != null) {
            resume.getEducation().forEach(e -> e.setResume(resume));
        }
        if (resume.getExperience() != null) {
            resume.getExperience().forEach(e -> e.setResume(resume));
        }
        if (resume.getProjects() != null) {
            resume.getProjects().forEach(p -> p.setResume(resume));
        }
        if (resume.getSkills() != null) {
            resume.getSkills().forEach(s -> s.setResume(resume));
        }
        if (resume.getCertifications() != null) {
            resume.getCertifications().forEach(c -> c.setResume(resume));
        }
    }
}
