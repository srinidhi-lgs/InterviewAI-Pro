package com.interviewai.service.resume;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class SectionDetectionService {

    // Define common header variations mapping to canonical section names
    private static final Map<Pattern, String> SECTION_HEADERS = new LinkedHashMap<>();

    static {
        // We use Pattern.CASE_INSENSITIVE
        SECTION_HEADERS.put(Pattern.compile("^(?:WORK\\s+|PROFESSIONAL\\s+)?(?:EXPERIENCE|EMPLOYMENT|HISTORY|INTERNSHIPS?)", Pattern.CASE_INSENSITIVE), "EXPERIENCE");
        SECTION_HEADERS.put(Pattern.compile("^(?:ACADEMIC\\s+|PERSONAL\\s+|KEY\\s+)?PROJECTS", Pattern.CASE_INSENSITIVE), "PROJECTS");
        SECTION_HEADERS.put(Pattern.compile("^(?:EDUCATION|ACADEMIC QUALIFICATIONS?|QUALIFICATIONS?)", Pattern.CASE_INSENSITIVE), "EDUCATION");
        SECTION_HEADERS.put(Pattern.compile("^(?:TECHNICAL\\s+|CORE\\s+|PROFESSIONAL\\s+)?SKILLS?(?:\\s+AND\\s+ABILITIES)?|TECHNOLOGY\\s+STACK", Pattern.CASE_INSENSITIVE), "SKILLS");
        SECTION_HEADERS.put(Pattern.compile("^(?:CERTIFICATIONS?|ACHIEVEMENTS?|COURSES?)(?:\\s*(?:&|and|\\/)\\s*(?:CERTIFICATIONS?|ACHIEVEMENTS?|COURSES?))*", Pattern.CASE_INSENSITIVE), "CERTIFICATIONS");
        SECTION_HEADERS.put(Pattern.compile("^(?:PROFESSIONAL\\s+|EXECUTIVE\\s+)?(?:SUMMARY|OBJECTIVE|PROFILE)", Pattern.CASE_INSENSITIVE), "SUMMARY");
    }

    public Map<String, String> detectSections(String text) {
        Map<String, String> sections = new HashMap<>();
        if (text == null || text.trim().isEmpty()) {
            return sections;
        }

        String[] lines = text.split("\\r?\\n");
        String currentSection = "HEADER";
        StringBuilder currentContent = new StringBuilder();

        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.isEmpty()) {
                currentContent.append("\n");
                continue;
            }

            // Check if this line is a header
            // A heuristic: headers are usually short (under 50 chars) and standalone.
            boolean isHeader = false;
            if (trimmed.length() < 60) {
                for (Map.Entry<Pattern, String> entry : SECTION_HEADERS.entrySet()) {
                    Matcher m = entry.getKey().matcher(trimmed);
                    if (m.find() && m.start() == 0) { // must start with the pattern
                        // Additional safety: the match should cover most of the line to prevent matching inline text
                        if (m.end() >= trimmed.length() - 10) { 
                            // Save previous section
                            if (currentContent.length() > 0) {
                                String existing = sections.getOrDefault(currentSection, "");
                                sections.put(currentSection, (existing + "\n" + currentContent.toString()).trim());
                            }
                            currentSection = entry.getValue();
                            currentContent = new StringBuilder();
                            isHeader = true;
                            break;
                        }
                    }
                }
            }

            if (!isHeader) {
                currentContent.append(line).append("\n");
            }
        }

        if (currentContent.length() > 0) {
            String existing = sections.getOrDefault(currentSection, "");
            sections.put(currentSection, (existing + "\n" + currentContent.toString()).trim());
        }

        return sections;
    }
}
