package com.interviewai.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "builder_experiences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuilderExperience {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private BuilderResume resume;

    @Column(nullable = false)
    private String company;

    @Column(nullable = false)
    private String position;

    private String location;
    private String startDate;
    private String endDate;

    @Builder.Default
    private Boolean isCurrent = false;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    private Integer orderIndex = 0;
}
