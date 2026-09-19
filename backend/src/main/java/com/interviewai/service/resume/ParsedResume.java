package com.interviewai.service.resume;

import lombok.Data;
import java.util.List;

@Data
public class ParsedResume {
    private String rawText;
    
    private String candidateName;
    private String email;
    private String phone;
    private String linkedin;
    private String github;
    
    private String education;
    private String experienceText;
    private String projectsText;
    private String certificationsText;
    private String extractedSkillsText;
    
    private List<String> missingSections;
}
