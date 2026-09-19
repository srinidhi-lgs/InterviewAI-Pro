package com.interviewai.service.interview;

import com.interviewai.entity.InterviewAnswer;
import com.interviewai.entity.InterviewQuestion;
import com.interviewai.entity.InterviewResult;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScoringService {

    public InterviewResult aggregateScores(List<InterviewAnswer> answers) {
        if (answers == null || answers.isEmpty()) {
            return InterviewResult.builder()
                    .overallScore(0)
                    .technicalScore(0)
                    .communicationScore(0)
                    .build();
        }

        int totalScore = 0;
        int techScore = 0;
        int commScore = 0;
        int techCount = 0;
        int commCount = 0;

        for (InterviewAnswer answer : answers) {
            totalScore += answer.getScore();
            InterviewQuestion q = answer.getQuestion();
            if ("HR".equalsIgnoreCase(q.getCategory()) || "Behavioral".equalsIgnoreCase(q.getCategory())) {
                commScore += answer.getScore();
                commCount++;
            } else {
                techScore += answer.getScore();
                techCount++;
            }
        }

        return InterviewResult.builder()
                .overallScore(totalScore / answers.size())
                .technicalScore(techCount > 0 ? techScore / techCount : 0)
                .communicationScore(commCount > 0 ? commScore / commCount : 0)
                .build();
    }
}
