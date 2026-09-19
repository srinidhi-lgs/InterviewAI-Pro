package com.interviewai.dto.interview;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

@Data
public class InterviewSetupRequest {
    @NotBlank(message = "Job role is required")
    private String jobRole;

    @NotBlank(message = "Experience level is required")
    private String experienceLevel;

    @NotBlank(message = "Interview type is required")
    private String interviewType;

    @NotBlank(message = "Difficulty is required")
    private String difficulty;

    @Min(value = 1, message = "Minimum 1 question")
    @Max(value = 20, message = "Maximum 20 questions")
    private Integer numQuestions;
}
