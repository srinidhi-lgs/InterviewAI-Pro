package com.interviewai.service.resume;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class SkillCategories {
    private List<String> technicalSkills = new ArrayList<>();
    private List<String> softSkills = new ArrayList<>();
    private List<String> tools = new ArrayList<>();
    private List<String> frameworks = new ArrayList<>();
    private List<String> databases = new ArrayList<>();
    private List<String> cloud = new ArrayList<>();
    
    public int getTotalSkillsCount() {
        return technicalSkills.size() + softSkills.size() + tools.size() + frameworks.size() + databases.size() + cloud.size();
    }
}
