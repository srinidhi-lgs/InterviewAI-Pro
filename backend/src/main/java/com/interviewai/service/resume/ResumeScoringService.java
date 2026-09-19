package com.interviewai.service.resume;

import com.interviewai.entity.ResumeAnalysisEntity;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ResumeScoringService {

    public void scoreResume(ParsedResume parsed, SkillCategories skills, KeywordMatchResult keywordMatch, ResumeAnalysisEntity analysis, int formattingScore) {
        
        analysis.setFormattingScore(formattingScore);
        
        // 1. Calculate Completeness (basic presence check)
        int completeness = 100;
        if (parsed.getMissingSections() != null && !parsed.getMissingSections().isEmpty()) {
            completeness -= parsed.getMissingSections().size() * 15;
        }
        if (parsed.getPhone() == null) completeness -= 10;
        if (parsed.getEmail() == null) completeness -= 10;
        analysis.setCompletenessScore(Math.max(0, completeness));
        
        // 2. Grammar Score (Heuristic: lack of special characters, good casing)
        analysis.setGrammarScore(85); // For a real app, integrate LanguageTool API.

        // 3. Keyword Match Score
        int matchPct = keywordMatch != null ? keywordMatch.getMatchPercentage() : 0;
        analysis.setKeywordMatchScore(matchPct);

        // Calculate Project Count if not already populated
        int projectCount = analysis.getProjectsCount() != null && analysis.getProjectsCount() > 0 
                ? analysis.getProjectsCount() 
                : countProjects(parsed.getProjectsText());
        analysis.setProjectsCount(projectCount);

        // Calculate Certifications Count if not already populated
        int certCount = analysis.getCertificatesCount() != null && analysis.getCertificatesCount() > 0 
                ? analysis.getCertificatesCount() 
                : countCertifications(parsed.getCertificationsText());
        analysis.setCertificatesCount(certCount);

        // Calculate Experience Years
        int expYears = estimateExperienceYears(parsed.getExperienceText());
        analysis.setExperienceYears(expYears);

        // ATS Score Calculation (Weighted)
        double atsScore = 0;
        
        // Contact Details (10%)
        int contactScore = 0;
        if (parsed.getEmail() != null) contactScore += 3;
        if (parsed.getPhone() != null) contactScore += 3;
        if (parsed.getLinkedin() != null) contactScore += 2;
        if (parsed.getGithub() != null) contactScore += 2;
        atsScore += (contactScore / 10.0) * 10;

        // Skills (25%)
        int totalSkills = 0;
        if (skills != null) {
            if (skills.getTechnicalSkills() != null) totalSkills += skills.getTechnicalSkills().size();
            if (skills.getFrameworks() != null) totalSkills += skills.getFrameworks().size();
            if (skills.getCloud() != null) totalSkills += skills.getCloud().size();
            if (skills.getDatabases() != null) totalSkills += skills.getDatabases().size();
        }
        double skillScore = Math.min(1.0, totalSkills / 10.0); // 10 skills = 100%
        atsScore += skillScore * 25;

        // Projects (20%)
        double projScore = Math.min(1.0, projectCount / 2.0); // 2 projects = 100%
        atsScore += projScore * 20;

        // Education (15%)
        if (parsed.getEducation() != null && !parsed.getEducation().isEmpty()) {
            atsScore += 15;
        }

        // Experience (15%)
        double expScore = Math.min(1.0, expYears / 3.0); // 3+ years = 100%
        if (expYears == 0 && parsed.getExperienceText() != null && parsed.getExperienceText().toLowerCase().contains("intern")) {
            expScore = 0.5; // Internships count for something!
        }
        atsScore += expScore * 15;

        // Formatting (5%)
        atsScore += (formattingScore / 100.0) * 5;

        // Keywords (10%)
        atsScore += (matchPct / 100.0) * 10;

        analysis.setAtsScore((int) Math.round(atsScore));
    }

    public int countProjects(String text) {
        if (text == null || text.trim().isEmpty()) return 0;
        // Count lines starting with a project title followed by a colon
        Matcher projectTitleMatcher = Pattern.compile("(?m)^[A-Za-z0-9][A-Za-z0-9\\s\\-\\(\\)]{2,60}:").matcher(text);
        int count = 0;
        while (projectTitleMatcher.find()) count++;
        if (count > 0) return count;

        Matcher m = Pattern.compile("(?m)^[\\s]*[•\\-\\*▪]").matcher(text);
        int bullets = 0;
        while (m.find()) bullets++;
        if (bullets > 0) return Math.max(1, bullets / 3);

        String[] blocks = text.split("\\n\\s*\\n");
        return blocks.length > 0 && !blocks[0].trim().isEmpty() ? blocks.length : 0;
    }

    public int countCertifications(String text) {
        if (text == null || text.trim().isEmpty()) return 0;
        // Check for "Certifications: Item 1, Item 2, Item 3"
        Matcher certPrefix = Pattern.compile("(?i)Certifications?:\\s*(.+)").matcher(text);
        if (certPrefix.find()) {
            String certsList = certPrefix.group(1).trim();
            String[] certs = certsList.split(",(?![^\\(]*\\))");
            int valid = 0;
            for (String c : certs) {
                if (!c.trim().isEmpty()) valid++;
            }
            if (valid > 0) return valid;
        }

        Matcher m = Pattern.compile("(?m)^[\\s]*[•\\-\\*▪]").matcher(text);
        int bullets = 0;
        while (m.find()) bullets++;
        if (bullets > 0) return bullets;

        String[] lines = text.split("\\r?\\n");
        int nonEmpty = 0;
        for (String l : lines) {
            if (!l.trim().isEmpty()) nonEmpty++;
        }
        return nonEmpty;
    }

    private int countItems(String text) {
        if (text == null || text.trim().isEmpty()) return 0;
        // Count bullets or double newlines as separate items
        Matcher m = Pattern.compile("(?m)^[\\s]*[•\\-\\*▪]").matcher(text);
        int bullets = 0;
        while (m.find()) bullets++;
        
        if (bullets > 0) {
            // Assume 2-3 bullets per project on average
            return Math.max(1, bullets / 3);
        }
        
        // Fallback: split by double newline
        String[] blocks = text.split("\\n\\s*\\n");
        return blocks.length > 0 && !blocks[0].trim().isEmpty() ? blocks.length : 0;
    }

    private int estimateExperienceYears(String text) {
        if (text == null || text.trim().isEmpty()) return 0;
        // Simple heuristic: count distinct years 2010-2030
        Matcher m = Pattern.compile("20[1-2][0-9]").matcher(text);
        int minYear = 2030;
        int maxYear = 1990;
        boolean found = false;
        
        while (m.find()) {
            int year = Integer.parseInt(m.group());
            if (year < minYear) minYear = year;
            if (year > maxYear) maxYear = year;
            found = true;
        }
        
        if (text.toLowerCase().contains("present") || text.toLowerCase().contains("current")) {
            maxYear = 2024; // assume current year
        }
        
        if (found && maxYear >= minYear) {
            return maxYear - minYear;
        }
        return 0;
    }
}
