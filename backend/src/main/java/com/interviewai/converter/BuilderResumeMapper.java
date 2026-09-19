package com.interviewai.converter;

import com.interviewai.dto.builder.BuilderResumeDto;
import com.interviewai.entity.BuilderResume;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface BuilderResumeMapper {
    BuilderResumeMapper INSTANCE = Mappers.getMapper(BuilderResumeMapper.class);

    BuilderResumeDto toDto(BuilderResume entity);

    BuilderResume toEntity(BuilderResumeDto dto);

    @org.mapstruct.Mapping(target = "education", ignore = true)
    @org.mapstruct.Mapping(target = "experience", ignore = true)
    @org.mapstruct.Mapping(target = "projects", ignore = true)
    @org.mapstruct.Mapping(target = "skills", ignore = true)
    @org.mapstruct.Mapping(target = "certifications", ignore = true)
    void updateEntityFromDto(BuilderResumeDto dto, @MappingTarget BuilderResume entity);

    void updateEducation(com.interviewai.dto.builder.BuilderEducationDto dto, @MappingTarget com.interviewai.entity.BuilderEducation entity);
    void updateExperience(com.interviewai.dto.builder.BuilderExperienceDto dto, @MappingTarget com.interviewai.entity.BuilderExperience entity);
    void updateProject(com.interviewai.dto.builder.BuilderProjectDto dto, @MappingTarget com.interviewai.entity.BuilderProject entity);
    void updateSkill(com.interviewai.dto.builder.BuilderSkillDto dto, @MappingTarget com.interviewai.entity.BuilderSkill entity);
    void updateCertification(com.interviewai.dto.builder.BuilderCertificationDto dto, @MappingTarget com.interviewai.entity.BuilderCertification entity);

    com.interviewai.entity.BuilderEducation toEducationEntity(com.interviewai.dto.builder.BuilderEducationDto dto);
    com.interviewai.entity.BuilderExperience toExperienceEntity(com.interviewai.dto.builder.BuilderExperienceDto dto);
    com.interviewai.entity.BuilderProject toProjectEntity(com.interviewai.dto.builder.BuilderProjectDto dto);
    com.interviewai.entity.BuilderSkill toSkillEntity(com.interviewai.dto.builder.BuilderSkillDto dto);
    com.interviewai.entity.BuilderCertification toCertificationEntity(com.interviewai.dto.builder.BuilderCertificationDto dto);
}
