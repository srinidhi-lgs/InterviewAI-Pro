package com.interviewai.dto.builder;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuilderResumeDto {
    private UUID id;
    private String title;
    private String fullName;
    private String email;
    private String phone;
    private String location;
    private String website;
    private String linkedin;
    private String github;
    private String summary;
    private String themeColor;
    private String templateName;
    private Instant createdAt;
    private Instant updatedAt;
    
    @Builder.Default
    private List<BuilderEducationDto> education = new ArrayList<>();
    
    @Builder.Default
    private List<BuilderExperienceDto> experience = new ArrayList<>();
    
    @Builder.Default
    private List<BuilderProjectDto> projects = new ArrayList<>();
    
    @Builder.Default
    private List<BuilderSkillDto> skills = new ArrayList<>();
    
    @Builder.Default
    private List<BuilderCertificationDto> certifications = new ArrayList<>();
}
