package com.interviewai.service.resume;

import com.interviewai.entity.ResumeAnalysisEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SuggestionGenerationService {

    public List<String> generateSuggestions(ParsedResume parsed, SkillCategories skills, ResumeAnalysisEntity analysis) {
        List<String> suggestions = new ArrayList<>();

        // Contact info checks
        if (parsed.getPhone() == null || parsed.getPhone().isEmpty()) {
            suggestions.add("Add a professional phone number to your contact details.");
        }
        if (parsed.getLinkedin() == null || parsed.getLinkedin().isEmpty()) {
            suggestions.add("Include a link to your LinkedIn profile to increase recruiter visibility.");
        }
        if (parsed.getGithub() == null || parsed.getGithub().isEmpty()) {
            suggestions.add("For technical roles, adding a GitHub or Portfolio link is highly recommended.");
        }

        // Section checks
        List<String> missingSections = parsed.getMissingSections() != null ? parsed.getMissingSections() : java.util.Collections.emptyList();
        if (missingSections.contains("Experience") && missingSections.contains("Projects")) {
            suggestions.add("Your resume lacks both Experience and Projects. Add academic or personal projects to demonstrate your skills.");
        } else if (missingSections.contains("Experience")) {
            suggestions.add("If you have internships or relevant coursework, consider listing them under an Experience section.");
        }
        if (missingSections.contains("Education")) {
            suggestions.add("Make sure your Education section is clearly labeled and contains your degree and graduation year.");
        }

        // Skills checks
        if (skills != null) {
            boolean noTech = skills.getTechnicalSkills() == null || skills.getTechnicalSkills().isEmpty();
            boolean noFrameworks = skills.getFrameworks() == null || skills.getFrameworks().isEmpty();
            if (noTech && noFrameworks) {
                suggestions.add("We couldn't detect any hard technical skills. Make sure to list specific languages and frameworks.");
            }
            if (skills.getCloud() == null || skills.getCloud().isEmpty()) {
                suggestions.add("Cloud skills (AWS, Docker, Azure) are highly sought after. Consider adding any exposure you have.");
            }
            if (skills.getDatabases() == null || skills.getDatabases().isEmpty()) {
                suggestions.add("Mention databases (SQL, PostgreSQL, MongoDB) you have worked with.");
            }
            if (skills.getSoftSkills() == null || skills.getSoftSkills().isEmpty()) {
                suggestions.add("Add soft skills (Leadership, Teamwork, Communication) to show you are a well-rounded candidate.");
            }
        }

        // Stats checks
        if (analysis.getProjectsCount() != null && analysis.getProjectsCount() == 0) {
            suggestions.add("We didn't detect any well-defined projects. Clearly separate projects with bullet points.");
        }

        // JD Match checks
        if (analysis.getJobMatchPercentage() != null && analysis.getJobMatchPercentage() > 0 && analysis.getJobMatchPercentage() < 50) {
            suggestions.add("Your resume matches less than 50% of the job description keywords. Tailor your resume to include missing keywords.");
        }
        
        // Grammar/Formatting hints
        if (analysis.getFormattingScore() != null && analysis.getFormattingScore() < 70) {
            suggestions.add("Your resume formatting score is low. Ensure you use bullet points and standard section headers.");
        }

        return suggestions;
    }
}
