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
public class BuilderExperienceDto {
    private UUID id;
    private String company;
    private String position;
    private String location;
    private String startDate;
    private String endDate;
    private Boolean isCurrent;
    private String description;
    private Integer orderIndex;
}
