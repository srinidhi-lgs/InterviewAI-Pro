package com.interviewai.service.interview;

import com.interviewai.dto.interview.*;
import com.interviewai.entity.*;
import com.interviewai.exception.ResourceNotFoundException;
import com.interviewai.repository.*;
import com.interviewai.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final InterviewQuestionRepository questionRepository;
    private final InterviewAnswerRepository answerRepository;
    private final InterviewResultRepository resultRepository;
    private final CurrentUserService currentUserService;

    private final QuestionGenerationService questionGenService;
    private final EvaluationService evaluationService;
    private final ScoringService scoringService;
    private final SuggestionService suggestionService;

    @Transactional
    public InterviewResponse setupInterview(InterviewSetupRequest request) {
        User user = currentUserService.getCurrentUser();

        Interview interview = Interview.builder()
                .user(user)
                .jobRole(request.getJobRole())
                .experienceLevel(request.getExperienceLevel())
                .interviewType(request.getInterviewType())
                .difficulty(request.getDifficulty())
                .numQuestions(request.getNumQuestions())
                .status("IN_PROGRESS") // Start immediately upon setup
                .build();
        
        interview = interviewRepository.save(interview);

        List<InterviewQuestion> questions = questionGenService.generateQuestions(request);
        for (InterviewQuestion q : questions) {
            q.setInterview(interview);
        }
        questionRepository.saveAll(questions);

        return mapToResponse(interview);
    }

    @Transactional(readOnly = true)
    public InterviewResponse getInterviewStatus(UUID interviewId) {
        Interview interview = getInterviewOrThrow(interviewId);
        return mapToResponse(interview);
    }

    @Transactional
    public void pauseInterview(UUID interviewId) {
        Interview interview = getInterviewOrThrow(interviewId);
        if ("IN_PROGRESS".equals(interview.getStatus())) {
            interview.setStatus("PAUSED");
            interviewRepository.save(interview);
        }
    }

    @Transactional
    public void resumeInterview(UUID interviewId) {
        Interview interview = getInterviewOrThrow(interviewId);
        if ("PAUSED".equals(interview.getStatus())) {
            interview.setStatus("IN_PROGRESS");
            interviewRepository.save(interview);
        }
    }

    @Transactional(readOnly = true)
    public InterviewQuestionResponse getNextQuestion(UUID interviewId) {
        Interview interview = getInterviewOrThrow(interviewId);
        
        List<InterviewQuestion> questions = questionRepository.findByInterviewIdOrderByQuestionOrderAsc(interviewId);
        
        for (InterviewQuestion q : questions) {
            if (q.getAnswer() == null) {
                return InterviewQuestionResponse.builder()
                        .id(q.getId())
                        .interviewId(interviewId)
                        .questionOrder(q.getQuestionOrder())
                        .category(q.getCategory())
                        .questionText(q.getQuestionText())
                        .totalQuestions(interview.getNumQuestions())
                        .build();
            }
        }
        return null; // All questions answered
    }

    @Transactional
    public InterviewAnswerResponse submitAnswer(UUID interviewId, UUID questionId, InterviewAnswerRequest request) {
        Interview interview = getInterviewOrThrow(interviewId);
        InterviewQuestion question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        if (!question.getInterview().getId().equals(interview.getId())) {
            throw new IllegalArgumentException("Question does not belong to this interview");
        }

        if (question.getAnswer() != null) {
            throw new IllegalStateException("Question already answered");
        }

        InterviewAnswer answer = InterviewAnswer.builder()
                .question(question)
                .userAnswer(request.getAnswer())
                .timeTakenSeconds(request.getTimeTakenSeconds())
                .build();

        // Heuristic Evaluation
        evaluationService.evaluateAnswer(answer);
        answer = answerRepository.save(answer);

        return InterviewAnswerResponse.builder()
                .score(answer.getScore())
                .feedback(answer.getFeedback())
                .expectedKeywords(question.getExpectedKeywords())
                .sampleAnswer(question.getSampleAnswer())
                .build();
    }

    @Transactional
    public InterviewResultResponse completeInterview(UUID interviewId) {
        Interview interview = getInterviewOrThrow(interviewId);
        
        if (interview.getResult() != null) {
            return mapToResultResponse(interview.getResult()); // Already completed
        }

        List<InterviewQuestion> questions = questionRepository.findByInterviewIdOrderByQuestionOrderAsc(interviewId);
        List<InterviewAnswer> answers = questions.stream()
                .filter(q -> q.getAnswer() != null)
                .map(InterviewQuestion::getAnswer)
                .collect(Collectors.toList());

        InterviewResult result = scoringService.aggregateScores(answers);
        result.setInterview(interview);
        
        suggestionService.generateSuggestions(result);
        
        result = resultRepository.save(result);
        
        interview.setStatus("COMPLETED");
        interviewRepository.save(interview);

        return mapToResultResponse(result);
    }

    @Transactional(readOnly = true)
    public InterviewResultResponse getInterviewResult(UUID interviewId) {
        Interview interview = getInterviewOrThrow(interviewId);
        InterviewResult result = resultRepository.findByInterviewId(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview result not found"));
        return mapToResultResponse(result);
    }

    private Interview getInterviewOrThrow(UUID interviewId) {
        User user = currentUserService.getCurrentUser();
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));
        if (!interview.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized access to interview");
        }
        return interview;
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

    private InterviewResultResponse mapToResultResponse(InterviewResult result) {
        return InterviewResultResponse.builder()
                .interviewId(result.getInterview().getId())
                .overallScore(result.getOverallScore())
                .technicalScore(result.getTechnicalScore())
                .communicationScore(result.getCommunicationScore())
                .strengths(result.getStrengths())
                .weaknesses(result.getWeaknesses())
                .suggestions(result.getSuggestions())
                .build();
    }
}
