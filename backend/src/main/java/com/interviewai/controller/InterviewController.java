package com.interviewai.controller;

import com.interviewai.dto.interview.*;
import com.interviewai.service.interview.InterviewHistoryService;
import com.interviewai.service.interview.InterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;
    private final InterviewHistoryService historyService;

    @PostMapping("/setup")
    public ResponseEntity<InterviewResponse> setupInterview(
            @Valid @RequestBody InterviewSetupRequest request) {
        return ResponseEntity.ok(interviewService.setupInterview(request));
    }

    @GetMapping("/{id}/status")
    public ResponseEntity<InterviewResponse> getInterviewStatus(
            @PathVariable UUID id) {
        return ResponseEntity.ok(interviewService.getInterviewStatus(id));
    }

    @PostMapping("/{id}/pause")
    public ResponseEntity<Void> pauseInterview(
            @PathVariable UUID id) {
        interviewService.pauseInterview(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/resume")
    public ResponseEntity<Void> resumeInterview(
            @PathVariable UUID id) {
        interviewService.resumeInterview(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/question")
    public ResponseEntity<InterviewQuestionResponse> getNextQuestion(
            @PathVariable UUID id) {
        InterviewQuestionResponse nextQuestion = interviewService.getNextQuestion(id);
        if (nextQuestion == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(nextQuestion);
    }

    @PostMapping("/{id}/questions/{questionId}/answer")
    public ResponseEntity<InterviewAnswerResponse> submitAnswer(
            @PathVariable UUID id,
            @PathVariable UUID questionId,
            @Valid @RequestBody InterviewAnswerRequest request) {
        return ResponseEntity.ok(interviewService.submitAnswer(id, questionId, request));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<InterviewResultResponse> completeInterview(
            @PathVariable UUID id) {
        return ResponseEntity.ok(interviewService.completeInterview(id));
    }

    @GetMapping("/{id}/report")
    public ResponseEntity<InterviewResultResponse> getInterviewReport(
            @PathVariable UUID id) {
        return ResponseEntity.ok(interviewService.getInterviewResult(id));
    }

    @GetMapping("/history")
    public ResponseEntity<Page<InterviewResponse>> getInterviewHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(historyService.getInterviewHistory(page, size));
    }
}
