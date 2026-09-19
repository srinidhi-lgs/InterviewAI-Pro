package com.interviewai.dto.interview;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class InterviewAnswerRequest {
    @NotBlank(message = "Answer cannot be empty")
    private String answer;
    
    @NotNull(message = "Time taken is required")
    private Integer timeTakenSeconds;
}
