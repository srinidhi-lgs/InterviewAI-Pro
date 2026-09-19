package com.interviewai.service.resume;

import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class FormattingAnalysisService {

    public int calculateFormattingScore(String rawText, Map<String, String> sections) {
        if (rawText == null || rawText.isEmpty()) {
            return 0;
        }

        int score = 100;

        // Penalty for missing standard sections
        int expectedSections = 4; // Contact/Header (default), Experience, Education, Skills
        int foundImportant = 0;
        if (sections.containsKey("EXPERIENCE")) foundImportant++;
        if (sections.containsKey("EDUCATION")) foundImportant++;
        if (sections.containsKey("SKILLS")) foundImportant++;
        
        // At least some content outside of these means header/contact was found
        if (rawText.length() > 100) foundImportant++;

        if (foundImportant < expectedSections) {
            score -= (expectedSections - foundImportant) * 10;
        }

        // Penalty for bad length
        int wordCount = rawText.split("\\s+").length;
        if (wordCount < 100) {
            score -= 30; // Too short
        } else if (wordCount > 1500) {
            score -= 15; // Too long (over 3-4 pages)
        }

        // Bullet point usage in Experience/Projects indicates good formatting
        String exp = sections.getOrDefault("EXPERIENCE", "");
        String proj = sections.getOrDefault("PROJECTS", "");
        
        if (!exp.isEmpty() || !proj.isEmpty()) {
            String combined = exp + "\n" + proj;
            long bulletPoints = combined.chars().filter(c -> c == '•' || c == '-' || c == '*' || c == '▪').count();
            if (bulletPoints < 3) {
                score -= 15; // Lack of bullet points makes it hard to read
            }
        }

        return Math.max(0, Math.min(100, score));
    }
}
