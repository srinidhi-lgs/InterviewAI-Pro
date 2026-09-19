package com.interviewai.dto.settings;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppearanceUpdateRequest {
    @NotBlank(message = "Theme cannot be blank")
    private String theme;
}
