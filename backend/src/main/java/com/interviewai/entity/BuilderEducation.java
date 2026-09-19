package com.interviewai.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "builder_education")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuilderEducation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private BuilderResume resume;

    @Column(nullable = false)
    private String institution;

    private String degree;
    private String fieldOfStudy;
    private String startDate;
    private String endDate;

    @Builder.Default
    private Boolean isCurrent = false;

    private String gpa;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    private Integer orderIndex = 0;
}
