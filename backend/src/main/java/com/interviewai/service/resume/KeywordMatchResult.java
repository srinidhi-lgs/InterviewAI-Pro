package com.interviewai.service.resume;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class KeywordMatchResult {
    private List<String> matchedKeywords = new ArrayList<>();
    private List<String> missingKeywords = new ArrayList<>();
    private int matchPercentage;
}
