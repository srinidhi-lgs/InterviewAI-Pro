package com.interviewai.service.dashboard;

import com.interviewai.dto.dashboard.DashboardStatsResponse;
import com.interviewai.entity.InterviewResult;
import com.interviewai.repository.InterviewRepository;
import com.interviewai.repository.InterviewResultRepository;
import com.interviewai.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final InterviewRepository interviewRepository;
    private final InterviewResultRepository interviewResultRepository;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        UUID userId = currentUserService.getCurrentUser().getId();

        long totalInterviews = interviewRepository.countByUserId(userId);
        long completedInterviews = interviewRepository.countByUserIdAndStatus(userId, "COMPLETED");

        List<InterviewResult> results = interviewResultRepository.findAllByUserId(userId);
        Integer averageScore = 0;
        
        if (!results.isEmpty()) {
            double avg = results.stream()
                    .mapToInt(InterviewResult::getOverallScore)
                    .average()
                    .orElse(0.0);
            averageScore = (int) Math.round(avg);
        }

        return DashboardStatsResponse.builder()
                .totalInterviews(totalInterviews)
                .completedInterviews(completedInterviews)
                .averageScore(averageScore)
                .build();
    }
}
