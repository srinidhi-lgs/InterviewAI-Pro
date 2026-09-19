package com.interviewai.dto.settings;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiPreferencesUpdateRequest {
    @NotBlank(message = "AI Model cannot be blank")
    private String aiModel;
    
    @NotBlank(message = "AI Tone cannot be blank")
    private String aiTone;
    
    @NotBlank(message = "Response Length cannot be blank")
    private String responseLength;
    
    @NotBlank(message = "Default Interview Difficulty cannot be blank")
    private String defaultInterviewDifficulty;
    
    @NotBlank(message = "Preferred Language cannot be blank")
    private String preferredLanguage;
}
