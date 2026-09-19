package com.interviewai.dto.profile;

import com.interviewai.entity.enums.ProficiencyLevel;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserSkillResponse {
    private SkillResponse skill;
    private ProficiencyLevel proficiencyLevel;
    private Integer yearsOfExperience;
}
