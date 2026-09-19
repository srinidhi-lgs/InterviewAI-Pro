package com.interviewai.service.resume;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.InputStream;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Slf4j
public class SkillExtractionService {

    private Map<String, List<String>> skillDictionaries;

    @PostConstruct
    public void init() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            InputStream is = new ClassPathResource("skills.json").getInputStream();
            skillDictionaries = mapper.readValue(is, new TypeReference<Map<String, List<String>>>() {});
            log.info("Successfully loaded skills dictionary. Categories found: {}", skillDictionaries.keySet().size());
        } catch (Exception e) {
            log.error("Failed to load skills.json", e);
            skillDictionaries = new HashMap<>(); // fallback
        }
    }

    public SkillCategories extractSkillsGlobally(String fullResumeText) {
        String lowerText = fullResumeText != null ? fullResumeText.toLowerCase() : "";
        
        SkillCategories cats = new SkillCategories();
        cats.setTechnicalSkills(findMatches(lowerText, "technical_skills"));
        cats.setFrameworks(findMatches(lowerText, "frameworks"));
        cats.setDatabases(findMatches(lowerText, "databases"));
        cats.setCloud(findMatches(lowerText, "cloud"));
        cats.setTools(findMatches(lowerText, "tools"));
        cats.setSoftSkills(findMatches(lowerText, "soft_skills"));
        
        return cats;
    }

    private List<String> findMatches(String text, String categoryKey) {
        List<String> found = new ArrayList<>();
        List<String> dictionary = skillDictionaries.getOrDefault(categoryKey, Collections.emptyList());
        
        for (String item : dictionary) {
            String regex = "\\b" + Pattern.quote(item.toLowerCase()) + "\\b";
            if (Pattern.compile(regex).matcher(text).find()) {
                found.add(capitalize(item));
            }
        }
        return found;
    }

    private String capitalize(String str) {
        if (str == null || str.isEmpty()) return str;
        // The dictionary already contains nicely capitalized versions, so we can just return the item as it was in the JSON.
        // Wait, the findMatches takes the item from the dictionary directly, so it's already properly cased!
        return str; 
    }
}
