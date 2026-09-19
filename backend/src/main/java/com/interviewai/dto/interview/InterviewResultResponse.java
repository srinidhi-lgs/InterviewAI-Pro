package com.interviewai.dto.interview;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class InterviewResultResponse {
    private UUID interviewId;
    private Integer overallScore;
    private Integer technicalScore;
    private Integer communicationScore;
    private List<String> strengths;
    private List<String> weaknesses;
    private List<String> suggestions;
}
