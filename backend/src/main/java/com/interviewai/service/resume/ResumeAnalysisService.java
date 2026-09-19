package com.interviewai.service.resume;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewai.chat.AiProvider;
import com.interviewai.entity.Resume;
import com.interviewai.entity.ResumeAnalysisEntity;
import com.interviewai.repository.ResumeAnalysisRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeAnalysisService {

    private final ResumeParserService parserService;
    private final SkillExtractionService skillService;
    private final KeywordMatchingService keywordService;
    private final ResumeScoringService scoringService;
    private final FormattingAnalysisService formattingService;
    private final SuggestionGenerationService suggestionService;
    private final ResumeAnalysisRepository analysisRepository;
    private final AiProvider aiProvider;
    private final ObjectMapper objectMapper;

    @Transactional
    public ResumeAnalysisEntity analyzeResume(Resume resume, InputStream pdfStream, String jobDescription) {
        log.info("Starting analysis for resume ID: {}", resume.getId());
        
        // 1. Parse PDF and Detect Sections
        ParsedResume parsed = parserService.parseResume(pdfStream);
        
        // Raw text for global analysis
        String fullResumeText = parsed.getRawText() != null ? parsed.getRawText() : "";
        
        // 2. Extract & Categorize Skills GLOBALLY (baseline)
        SkillCategories skills = skillService.extractSkillsGlobally(fullResumeText);
        
        // 3. Keyword Match against JD (baseline)
        boolean hasJd = jobDescription != null && !jobDescription.trim().isEmpty();
        KeywordMatchResult keywordMatch = hasJd 
                ? keywordService.matchKeywords(fullResumeText, jobDescription.trim())
                : new KeywordMatchResult();
        if (!hasJd) {
            keywordMatch.setMatchedKeywords(new ArrayList<>());
            keywordMatch.setMissingKeywords(new ArrayList<>());
            keywordMatch.setMatchPercentage(0);
        }

        // 4. Gemini AI Enhanced Analysis
        List<String> aiProjects = new ArrayList<>();
        List<String> aiCertifications = new ArrayList<>();

        String systemInstruction = "You are an expert resume parsing and ATS analysis system.\n" +
                "Analyze the provided RESUME TEXT and optional JOB DESCRIPTION.\n" +
                "Respond ONLY with a valid JSON object in this exact structure without markdown fences or code blocks:\n" +
                "{\n" +
                "  \"projects\": [\"Project Name 1\", \"Project Name 2\"],\n" +
                "  \"certifications\": [\"Certification Name 1\", \"Certification Name 2\"],\n" +
                "  \"skills\": {\n" +
                "    \"technicalSkills\": [\"Java\", \"Python\"],\n" +
                "    \"frameworks\": [\"React\", \"Spring Boot\"],\n" +
                "    \"databases\": [\"MySQL\", \"PostgreSQL\"],\n" +
                "    \"cloud\": [\"Docker\", \"AWS\"],\n" +
                "    \"tools\": [\"Git\", \"VS Code\"],\n" +
                "    \"softSkills\": [\"Leadership\"]\n" +
                "  },\n" +
                "  \"matchedKeywords\": [],\n" +
                "  \"missingKeywords\": [],\n" +
                "  \"jobMatchPercentage\": 0\n" +
                "}\n" +
                "CRITICAL RULES:\n" +
                "1. 'projects': Identify each distinct project mentioned in the resume. Return a list of project names.\n" +
                "2. 'certifications': Identify each distinct certification or course (exclude competition wins/awards). Return a list of certification names.\n" +
                "3. 'skills': Extract all skills found in the resume and categorize them into technicalSkills, frameworks, databases, cloud, tools, and softSkills.\n" +
                "4. For JD matching:\n" +
                "   - IF NO JOB DESCRIPTION is provided (or if it is empty/none/NONE):\n" +
                "     'matchedKeywords' MUST be [] (empty array).\n" +
                "     'missingKeywords' MUST be [] (empty array).\n" +
                "     'jobMatchPercentage' MUST be 0.\n" +
                "   - IF A JOB DESCRIPTION IS provided:\n" +
                "     Extract target technical skills and requirements from the JD.\n" +
                "     'matchedKeywords': target skills required by the JD that ARE found in the resume.\n" +
                "     'missingKeywords': target skills required by the JD that are NOT found in the resume.\n" +
                "     'jobMatchPercentage': percentage (0-100) of target skills matched.\n" +
                "5. Output MUST be valid JSON only with NO markdown fences (no ```json).";

        String userPrompt = "RESUME TEXT:\n" + fullResumeText + "\n\nJOB DESCRIPTION:\n" + (hasJd ? jobDescription.trim() : "NONE");

        try {
            String aiRaw = aiProvider.generateDirect(systemInstruction, userPrompt);
            if (aiRaw != null && !aiRaw.isBlank()) {
                String cleanJson = aiRaw.replaceAll("(?s)^```(?:json)?\\s*", "").replaceAll("(?s)```$", "").trim();
                JsonNode root = objectMapper.readTree(cleanJson);

                // Projects
                JsonNode pNode = root.path("projects");
                if (pNode.isArray()) {
                    for (JsonNode item : pNode) {
                        if (item.isTextual() && !item.asText().isBlank()) aiProjects.add(item.asText().trim());
                    }
                }

                // Certifications
                JsonNode cNode = root.path("certifications");
                if (cNode.isArray()) {
                    for (JsonNode item : cNode) {
                        if (item.isTextual() && !item.asText().isBlank()) aiCertifications.add(item.asText().trim());
                    }
                }

                // Skills merge
                JsonNode sNode = root.path("skills");
                if (sNode.isObject()) {
                    mergeList(skills.getTechnicalSkills(), sNode.path("technicalSkills"));
                    mergeList(skills.getFrameworks(), sNode.path("frameworks"));
                    mergeList(skills.getDatabases(), sNode.path("databases"));
                    mergeList(skills.getCloud(), sNode.path("cloud"));
                    mergeList(skills.getTools(), sNode.path("tools"));
                    mergeList(skills.getSoftSkills(), sNode.path("softSkills"));
                }

                // Keywords
                if (hasJd) {
                    List<String> matched = new ArrayList<>();
                    List<String> missing = new ArrayList<>();
                    JsonNode mNode = root.path("matchedKeywords");
                    if (mNode.isArray()) {
                        for (JsonNode item : mNode) if (item.isTextual()) matched.add(item.asText().trim());
                    }
                    JsonNode missNode = root.path("missingKeywords");
                    if (missNode.isArray()) {
                        for (JsonNode item : missNode) if (item.isTextual()) missing.add(item.asText().trim());
                    }
                    int pct = root.path("jobMatchPercentage").asInt(keywordMatch.getMatchPercentage());

                    if (!matched.isEmpty() || !missing.isEmpty()) {
                        keywordMatch.setMatchedKeywords(matched);
                        keywordMatch.setMissingKeywords(missing);
                        keywordMatch.setMatchPercentage(pct);
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Gemini resume analysis error (using fallback extraction): {}", e.getMessage());
        }

        // Determine counts: use AI counts if available, otherwise deterministic count
        int finalProjectCount = !aiProjects.isEmpty() ? aiProjects.size() : scoringService.countProjects(parsed.getProjectsText());
        int finalCertCount = !aiCertifications.isEmpty() ? aiCertifications.size() : scoringService.countCertifications(parsed.getCertificationsText());

        // 5. Analyze Formatting
        int formattingScore = formattingService.calculateFormattingScore(fullResumeText, new HashMap<>() {{
            if (parsed.getExperienceText() != null && !parsed.getExperienceText().isEmpty()) put("EXPERIENCE", parsed.getExperienceText());
            if (parsed.getEducation() != null && !parsed.getEducation().isEmpty()) put("EDUCATION", parsed.getEducation());
            if (parsed.getProjectsText() != null && !parsed.getProjectsText().isEmpty()) put("PROJECTS", parsed.getProjectsText());
            if (parsed.getExtractedSkillsText() != null && !parsed.getExtractedSkillsText().isEmpty()) put("SKILLS", parsed.getExtractedSkillsText());
        }});

        // 6. Create Entity & Populate preliminary data
        ResumeAnalysisEntity analysis = ResumeAnalysisEntity.builder()
                .resume(resume)
                .jobDescription(hasJd ? jobDescription.trim() : null)
                .candidateName(parsed.getCandidateName())
                .email(parsed.getEmail())
                .phone(parsed.getPhone())
                .education(parsed.getEducation())
                .experienceText(parsed.getExperienceText())
                .projectsText(parsed.getProjectsText())
                .certificationsText(parsed.getCertificationsText())
                .missingSections(parsed.getMissingSections())
                .technicalSkills(skills.getTechnicalSkills())
                .softSkills(skills.getSoftSkills())
                .tools(skills.getTools())
                .frameworks(skills.getFrameworks())
                .databases(skills.getDatabases())
                .cloud(skills.getCloud())
                .matchedKeywords(hasJd ? keywordMatch.getMatchedKeywords() : new ArrayList<>())
                .missingKeywords(hasJd ? keywordMatch.getMissingKeywords() : new ArrayList<>())
                .jobMatchPercentage(hasJd ? keywordMatch.getMatchPercentage() : 0)
                .projectsCount(finalProjectCount)
                .certificatesCount(finalCertCount)
                .build();
                
        // 7. Score 
        scoringService.scoreResume(parsed, skills, keywordMatch, analysis, formattingScore);
        
        // 8. Suggestions
        List<String> suggestions = suggestionService.generateSuggestions(parsed, skills, analysis);
        analysis.setSuggestions(suggestions);
        
        // 9. Persist
        return analysisRepository.save(analysis);
    }

    private void mergeList(List<String> target, JsonNode node) {
        if (node != null && node.isArray()) {
            Set<String> set = new LinkedHashSet<>(target);
            for (JsonNode item : node) {
                if (item.isTextual() && !item.asText().isBlank()) {
                    set.add(item.asText().trim());
                }
            }
            target.clear();
            target.addAll(set);
        }
    }
}
