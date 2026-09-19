package com.interviewai.service.interview;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewai.dto.interview.InterviewSetupRequest;
import com.interviewai.entity.InterviewQuestion;
import jakarta.annotation.PostConstruct;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class QuestionGenerationService {

    private List<QuestionTemplate> questionBank;

    @PostConstruct
    public void init() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            InputStream is = new ClassPathResource("question_bank.json").getInputStream();
            questionBank = mapper.readValue(is, new TypeReference<List<QuestionTemplate>>() {});
            log.info("Loaded {} questions from question_bank.json", questionBank.size());
        } catch (Exception e) {
            log.error("Failed to load question_bank.json", e);
            questionBank = new ArrayList<>();
        }
    }

    public List<InterviewQuestion> generateQuestions(InterviewSetupRequest request) {
        List<QuestionTemplate> filtered = questionBank.stream()
                .filter(q -> matchCategory(q.getCategory(), request.getJobRole(), request.getInterviewType()))
                .filter(q -> matchDifficulty(q.getDifficulty(), request.getDifficulty()))
                .collect(Collectors.toList());

        // Fallback if not enough exact matches
        if (filtered.size() < request.getNumQuestions()) {
            filtered.addAll(questionBank.stream()
                    .filter(q -> !filtered.contains(q))
                    .collect(Collectors.toList()));
        }

        Collections.shuffle(filtered);
        
        List<InterviewQuestion> generated = new ArrayList<>();
        int count = Math.min(request.getNumQuestions(), filtered.size());
        
        for (int i = 0; i < count; i++) {
            QuestionTemplate qt = filtered.get(i);
            InterviewQuestion iq = InterviewQuestion.builder()
                    .questionOrder(i + 1)
                    .category(qt.getCategory())
                    .questionText(qt.getQuestionText())
                    .expectedKeywords(String.join(",", qt.getExpectedKeywords()))
                    .sampleAnswer(qt.getSampleAnswer())
                    .build();
            generated.add(iq);
        }
        return generated;
    }

    private boolean matchCategory(String category, String role, String type) {
        if ("HR".equalsIgnoreCase(type) || "Behavioral".equalsIgnoreCase(type)) {
            return "HR".equalsIgnoreCase(category);
        }
        // Very basic matching for demonstration
        String lowerRole = role.toLowerCase();
        String lowerCat = category.toLowerCase();
        if (lowerRole.contains(lowerCat) || lowerCat.contains(lowerRole)) return true;
        
        if (lowerRole.contains("full stack") || lowerRole.contains("backend") || lowerRole.contains("frontend")) {
            return !category.equalsIgnoreCase("HR");
        }
        return true;
    }

    private boolean matchDifficulty(String qDiff, String reqDiff) {
        return qDiff.equalsIgnoreCase(reqDiff);
    }

    @Data
    public static class QuestionTemplate {
        private String category;
        private String difficulty;
        private String questionText;
        private List<String> expectedKeywords;
        private String sampleAnswer;
    }
}
