package com.interviewai.service.interview;

import com.interviewai.entity.InterviewAnswer;
import com.interviewai.entity.InterviewQuestion;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class EvaluationService {

    public void evaluateAnswer(InterviewAnswer answer) {
        InterviewQuestion question = answer.getQuestion();
        String text = answer.getUserAnswer();
        
        int score = 0;
        List<String> feedback = new ArrayList<>();
        
        // 1. Length Check
        String[] words = text.split("\\s+");
        if (words.length < 10) {
            feedback.add("Answer is too short. Try to elaborate more.");
            score += 20;
        } else if (words.length > 200) {
            feedback.add("Answer is quite long. Try to be more concise.");
            score += 80;
        } else {
            score += 50; // Base score for decent length
        }

        // 2. Keyword Matching
        String expected = question.getExpectedKeywords();
        int keywordsFound = 0;
        int totalKeywords = 0;
        if (expected != null && !expected.isEmpty()) {
            List<String> keywords = Arrays.asList(expected.split(","));
            totalKeywords = keywords.size();
            for (String kw : keywords) {
                if (text.toLowerCase().contains(kw.toLowerCase().trim())) {
                    keywordsFound++;
                }
            }
            if (totalKeywords > 0) {
                double kwScore = (double) keywordsFound / totalKeywords;
                score += (int)(kwScore * 50); // Up to 50 points for keywords
                
                if (kwScore == 1.0) {
                    feedback.add("Excellent! You hit all the key concepts.");
                } else if (kwScore >= 0.5) {
                    feedback.add("Good. You mentioned some key concepts, but missed others.");
                } else {
                    feedback.add("You missed several important concepts related to this topic.");
                }
            } else {
                score += 30; // Fallback
            }
        } else {
            score += 50; // Fallback if no keywords expected
        }

        // Cap at 100
        score = Math.min(100, Math.max(0, score));
        
        answer.setScore(score);
        answer.setFeedback(String.join(" ", feedback));
    }
}
