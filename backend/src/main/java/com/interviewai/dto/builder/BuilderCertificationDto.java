package com.interviewai.dto.builder;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuilderCertificationDto {
    private UUID id;
    private String name;
    private String issuer;
    private String issueDate;
    private String url;
    private Integer orderIndex;
}
