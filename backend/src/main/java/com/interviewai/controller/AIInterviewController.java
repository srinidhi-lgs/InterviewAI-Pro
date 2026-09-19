package com.interviewai.controller;

import com.interviewai.dto.aiinterview.*;
import com.interviewai.service.aiinterview.AIInterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/ai-interview")
@RequiredArgsConstructor
public class AIInterviewController {

    private final AIInterviewService aiInterviewService;

    @PostMapping("/session")
    public ResponseEntity<AIInterviewSessionResponse> createSession(
            @Valid @RequestBody AIInterviewSessionRequest request) {
        return ResponseEntity.ok(aiInterviewService.createSession(request));
    }

    @GetMapping("/session/{id}")
    public ResponseEntity<AIInterviewSessionResponse> getSession(
            @PathVariable UUID id) {
        return ResponseEntity.ok(aiInterviewService.getSession(id));
    }

    @GetMapping("/session/{id}/question")
    public ResponseEntity<AIInterviewQuestionResponse> getNextQuestion(
            @PathVariable UUID id) {
        AIInterviewQuestionResponse nextQuestion = aiInterviewService.getNextQuestion(id);
        if (nextQuestion == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(nextQuestion);
    }

    @PostMapping("/session/{id}/question/{questionId}/answer")
    public ResponseEntity<AIInterviewAnswerResponse> submitAnswer(
            @PathVariable UUID id,
            @PathVariable UUID questionId,
            @Valid @RequestBody AIInterviewAnswerRequest request) {
        return ResponseEntity.ok(aiInterviewService.submitAnswer(id, questionId, request));
    }

    @PostMapping("/session/{id}/complete")
    public ResponseEntity<AIInterviewSessionResponse> completeInterview(
            @PathVariable UUID id) {
        return ResponseEntity.ok(aiInterviewService.completeInterview(id));
    }

    @GetMapping("/session/{id}/report")
    public ResponseEntity<AIInterviewReportResponse> getReport(
            @PathVariable UUID id) {
        return ResponseEntity.ok(aiInterviewService.getReport(id));
    }
}
