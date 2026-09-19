package com.interviewai.dto.aiinterview;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AIInterviewSessionRequest {

    @NotBlank(message = "Job role is required")
    private String jobRole;

    @NotBlank(message = "Experience level is required")
    private String experienceLevel;

    @NotBlank(message = "Interview type is required")
    private String interviewType;

    @NotBlank(message = "Difficulty is required")
    private String difficulty;

    @NotNull(message = "Number of questions is required")
    @Min(value = 3, message = "Minimum 3 questions required")
    @Max(value = 15, message = "Maximum 15 questions allowed")
    private Integer numQuestions;
}
