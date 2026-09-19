package com.interviewai.dto.aiinterview;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AIInterviewAnswerRequest {
    @NotBlank(message = "Answer is required")
    private String answer;
    
    private Integer timeTaken;
}
