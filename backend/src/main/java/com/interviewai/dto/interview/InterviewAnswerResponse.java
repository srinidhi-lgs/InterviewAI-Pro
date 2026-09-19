package com.interviewai.dto.interview;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InterviewAnswerResponse {
    private Integer score;
    private String feedback;
    private String expectedKeywords;
    private String sampleAnswer;
}
