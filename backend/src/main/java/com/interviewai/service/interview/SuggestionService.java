package com.interviewai.service.interview;

import com.interviewai.entity.InterviewResult;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SuggestionService {

    public void generateSuggestions(InterviewResult result) {
        List<String> strengths = new ArrayList<>();
        List<String> weaknesses = new ArrayList<>();
        List<String> suggestions = new ArrayList<>();

        if (result.getOverallScore() >= 80) {
            strengths.add("Excellent overall grasp of the required concepts.");
            suggestions.add("Keep up the great work! You are well-prepared for this role.");
        } else if (result.getOverallScore() >= 60) {
            strengths.add("Good foundational knowledge.");
            suggestions.add("Review some of the core concepts you missed to improve your confidence.");
        } else {
            weaknesses.add("Lacking overall understanding of the topics.");
            suggestions.add("Spend more time reviewing the basics before your real interview.");
        }

        if (result.getTechnicalScore() > 0 && result.getTechnicalScore() < 60) {
            weaknesses.add("Technical answers lacked depth and precision.");
            suggestions.add("Practice more hands-on coding and understand the 'why' behind the technical concepts.");
        }

        if (result.getCommunicationScore() > 0 && result.getCommunicationScore() < 60) {
            weaknesses.add("Behavioral answers were too brief.");
            suggestions.add("Use the STAR method (Situation, Task, Action, Result) for behavioral questions.");
        }

        result.setStrengths(strengths);
        result.setWeaknesses(weaknesses);
        result.setSuggestions(suggestions);
    }
}
