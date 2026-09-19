package com.interviewai.dto.dashboard;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsResponse {
    private long totalInterviews;
    private long completedInterviews;
    private Integer averageScore;
}
