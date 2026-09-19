package com.interviewai.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "builder_resumes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuilderResume {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    private String fullName;
    private String email;
    private String phone;
    private String location;
    private String website;
    private String linkedin;
    private String github;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Builder.Default
    private String themeColor = "emerald";

    @Builder.Default
    private String templateName = "modern";

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    @Builder.Default
    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BuilderEducation> education = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BuilderExperience> experience = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BuilderProject> projects = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BuilderSkill> skills = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BuilderCertification> certifications = new ArrayList<>();
}
