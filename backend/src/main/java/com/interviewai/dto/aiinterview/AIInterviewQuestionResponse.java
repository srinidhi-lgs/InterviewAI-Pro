package com.interviewai.dto.aiinterview;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AIInterviewQuestionResponse {
    private UUID id;
    private Integer questionOrder;
    private String category;
    private String difficulty;
    private String question;
}
