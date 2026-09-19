package com.interviewai.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "builder_skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuilderSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private BuilderResume resume;

    @Column(nullable = false)
    private String name;

    private String category;
    private String proficiency;

    @Builder.Default
    private Integer orderIndex = 0;
}
