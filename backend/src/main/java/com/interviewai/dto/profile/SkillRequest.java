package com.interviewai.dto.profile;

import com.interviewai.entity.enums.SkillCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SkillRequest {
    @NotBlank
    private String name;
    
    @NotNull
    private SkillCategory category;
}
