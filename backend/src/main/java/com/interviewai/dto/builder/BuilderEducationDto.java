package com.interviewai.dto.builder;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuilderEducationDto {
    private UUID id;
    private String institution;
    private String degree;
    private String fieldOfStudy;
    private String startDate;
    private String endDate;
    private Boolean isCurrent;
    private String gpa;
    private String description;
    private Integer orderIndex;
}
