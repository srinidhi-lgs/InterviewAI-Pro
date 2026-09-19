package com.interviewai.service.resume;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class KeywordMatchingService {

    private final SkillExtractionService skillExtractionService;



    private String normalizeText(String text) {
        if (text == null) return "";
        return text
            .replaceAll("(?i)\\breact\\.js\\b", "React")
            .replaceAll("(?i)\\breactjs\\b", "React")
            .replaceAll("(?i)\\brest apis\\b", "REST API")
            .replaceAll("(?i)\\brestful apis\\b", "REST API")
            .replaceAll("(?i)\\bnode\\.js\\b", "Node")
            .replaceAll("(?i)\\bnodejs\\b", "Node");
    }

    public KeywordMatchResult matchKeywords(String resumeText, String jobDescription) {
        String normalizedResume = normalizeText(resumeText);
        String lowerResume = normalizedResume.toLowerCase();
        
        Set<String> keywordsToMatch = new HashSet<>();
        
        if (jobDescription != null && !jobDescription.trim().isEmpty()) {
            String normalizedJD = normalizeText(jobDescription);
            // Extract skills from JD using the global dictionary
            SkillCategories jdSkills = skillExtractionService.extractSkillsGlobally(normalizedJD);
            keywordsToMatch.addAll(jdSkills.getTechnicalSkills());
            keywordsToMatch.addAll(jdSkills.getFrameworks());
            keywordsToMatch.addAll(jdSkills.getDatabases());
            keywordsToMatch.addAll(jdSkills.getCloud());
            keywordsToMatch.addAll(jdSkills.getTools());
        }
        
        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();
        
        for (String keyword : keywordsToMatch) {
            if (Pattern.compile("\\b" + Pattern.quote(keyword.toLowerCase()) + "\\b").matcher(lowerResume).find()) {
                matched.add(keyword);
            } else {
                missing.add(keyword);
            }
        }
        
        int matchPercentage = 0;
        if (!keywordsToMatch.isEmpty()) {
            matchPercentage = (int) Math.round((double) matched.size() / keywordsToMatch.size() * 100);
        }
        
        KeywordMatchResult result = new KeywordMatchResult();
        result.setMatchedKeywords(matched);
        result.setMissingKeywords(missing);
        result.setMatchPercentage(matchPercentage);
        
        return result;
    }
}
