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
public class BuilderSkillDto {
    private UUID id;
    private String name;
    private String category;
    private String proficiency;
    private Integer orderIndex;
}
