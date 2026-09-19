package com.interviewai.service.resume;

import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
@RequiredArgsConstructor
public class ResumeParserService {

    private final SectionDetectionService sectionDetectionService;

    public ParsedResume parseResume(InputStream pdfInputStream) {
        String rawText = extractTextFromPDF(pdfInputStream);
        if (rawText == null || rawText.isEmpty()) {
            throw new IllegalArgumentException("Could not extract text from the provided PDF.");
        }

        ParsedResume parsed = new ParsedResume();
        parsed.setRawText(rawText);
        parsed.setCandidateName(extractName(rawText));
        parsed.setEmail(extractEmail(rawText));
        parsed.setPhone(extractPhone(rawText));
        parsed.setLinkedin(extractLinkedIn(rawText));
        parsed.setGithub(extractGithub(rawText));

        Map<String, String> sections = sectionDetectionService.detectSections(rawText);
        parsed.setEducation(sections.getOrDefault("EDUCATION", ""));
        parsed.setExperienceText(sections.getOrDefault("EXPERIENCE", ""));
        parsed.setProjectsText(sections.getOrDefault("PROJECTS", ""));
        parsed.setCertificationsText(sections.getOrDefault("CERTIFICATIONS", ""));
        
        String skillsText = sections.getOrDefault("SKILLS", "");
        parsed.setExtractedSkillsText(skillsText);
        
        // Find missing sections
        List<String> missing = new ArrayList<>();
        if (parsed.getEducation().isEmpty()) missing.add("Education");
        if (parsed.getExperienceText().isEmpty()) missing.add("Experience");
        if (parsed.getProjectsText().isEmpty()) missing.add("Projects");
        if (parsed.getCertificationsText().isEmpty()) missing.add("Certifications");
        if (skillsText.isEmpty()) missing.add("Skills");
        
        parsed.setMissingSections(missing);
        
        return parsed;
    }

    public String extractTextFromPDF(InputStream inputStream) {
        try (PDDocument document = org.apache.pdfbox.Loader.loadPDF(inputStream.readAllBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            return stripper.getText(document);
        } catch (Exception e) {
            log.error("Failed to parse PDF document", e);
            return null;
        }
    }

    private String extractEmail(String text) {
        Matcher matcher = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}").matcher(text);
        if (matcher.find()) {
            return matcher.group();
        }
        return null;
    }

    private String extractPhone(String text) {
        Matcher matcher = Pattern.compile("(?i)(?:\\+?\\d{1,3}[-.\\s]?)?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}").matcher(text);
        if (matcher.find()) {
            return matcher.group();
        }
        return null;
    }

    private String extractName(String text) {
        // Simple heuristic: Name is usually on the first non-empty line
        String[] lines = text.split("\\r?\\n");
        for (String line : lines) {
            line = line.trim();
            if (!line.isEmpty() && line.length() > 2 && line.length() < 50 && !line.toLowerCase().contains("resume") && !line.toLowerCase().contains("cv")) {
                return line;
            }
        }
        return "Unknown Candidate";
    }

    private String extractLinkedIn(String text) {
        Matcher matcher = Pattern.compile("(?i)(?:https?://)?(?:www\\.)?linkedin\\.com/in/[\\w-]+/?").matcher(text);
        if (matcher.find()) return matcher.group();
        return null;
    }

    private String extractGithub(String text) {
        Matcher matcher = Pattern.compile("(?i)(?:https?://)?(?:www\\.)?github\\.com/[\\w-]+/?").matcher(text);
        if (matcher.find()) return matcher.group();
        return null;
    }
}
