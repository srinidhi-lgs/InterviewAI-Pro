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
public class BuilderProjectDto {
    private UUID id;
    private String name;
    private String description;
    private String url;
    private String technologies;
    private Integer orderIndex;
}
