package com.interviewai.dto.aiinterview;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AIInterviewAnswerResponse {
    private Integer score;
    private String feedback;
    private String expectedAnswer;
}
