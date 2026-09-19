package com.interviewai.service.interview;

import com.interviewai.dto.interview.InterviewResponse;
import com.interviewai.entity.Interview;
import com.interviewai.entity.User;
import com.interviewai.repository.InterviewRepository;
import com.interviewai.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InterviewHistoryService {

    private final InterviewRepository interviewRepository;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public Page<InterviewResponse> getInterviewHistory(int page, int size) {
        User user = currentUserService.getCurrentUser();
        Page<Interview> interviews = interviewRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), PageRequest.of(page, size));
        return interviews.map(this::mapToResponse);
    }

    private InterviewResponse mapToResponse(Interview interview) {
        return InterviewResponse.builder()
                .id(interview.getId())
                .jobRole(interview.getJobRole())
                .experienceLevel(interview.getExperienceLevel())
                .interviewType(interview.getInterviewType())
                .difficulty(interview.getDifficulty())
                .numQuestions(interview.getNumQuestions())
                .status(interview.getStatus())
                .createdAt(interview.getCreatedAt())
                .build();
    }
}
