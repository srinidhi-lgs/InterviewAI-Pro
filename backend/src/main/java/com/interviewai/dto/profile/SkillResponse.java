package com.interviewai.dto.profile;

import com.interviewai.entity.enums.SkillCategory;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class SkillResponse {
    private UUID id;
    private String name;
    private SkillCategory category;
}
