package com.interviewai.dto.profile;

import com.interviewai.entity.enums.ProficiencyLevel;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserSkillRequest {
    @NotNull
    @Valid
    private SkillRequest skill;
    
    @NotNull
    private ProficiencyLevel proficiencyLevel;
    
    @NotNull
    @Min(0)
    private Integer yearsOfExperience;
}
