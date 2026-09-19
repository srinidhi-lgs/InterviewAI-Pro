package com.interviewai.dto.interview;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class InterviewQuestionResponse {
    private UUID id;
    private UUID interviewId;
    private Integer questionOrder;
    private String category;
    private String questionText;
    private Integer totalQuestions;
}
